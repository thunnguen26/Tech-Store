<?php
// htdocs/techstore-api/create_order.php
// TẠO ĐƠN HÀNG VÀ TRỪ TỒN KHO

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === KẾT NỐI CSDL ===
error_reporting(0);
ini_set('display_errors', 0);

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "techstore";
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Lỗi kết nối database"));
    exit();
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// === ĐỌC DỮ LIỆU INPUT ===
$data = json_decode(file_get_contents("php://input"));

// === VALIDATE DỮ LIỆU ===
if (
    !isset($data->user_id) ||
    !isset($data->itemIds) || empty($data->itemIds) ||
    !isset($data->firstName) || !isset($data->lastName) ||
    !isset($data->email) || !isset($data->phone) ||
    !isset($data->address) || !isset($data->city) ||
    !isset($data->district) || !isset($data->paymentMethod)
) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Thiếu thông tin bắt buộc: user_id, itemIds, thông tin giao hàng hoặc phương thức thanh toán."
    ));
    exit();
}

// === LẤY THÔNG TIN TỪ REQUEST ===
$user_id = intval($data->user_id);
$item_ids = $data->itemIds;
$firstName = $data->firstName;
$lastName = $data->lastName;
$email = $data->email;
$phone = $data->phone;
$address = $data->address;
$city = $data->city;
$district = $data->district;
$paymentMethod = $data->paymentMethod;
$notes = $data->notes ?? "";

// === BẮT ĐẦU TRANSACTION ===
$conn->begin_transaction();

try {
     
    // 1. LẤY CART_ID CỦA USER
     
    $stmt_cart = $conn->prepare("SELECT id FROM Carts WHERE user_id = ?");
    $stmt_cart->bind_param("i", $user_id);
    $stmt_cart->execute();
    $result_cart = $stmt_cart->get_result();

    if ($result_cart->num_rows == 0) {
        throw new Exception("Không tìm thấy giỏ hàng của người dùng.");
    }

    $cart_id = $result_cart->fetch_assoc()['id'];
    $stmt_cart->close();

     
    // 2. CHUẨN BỊ QUERY LẤY CART ITEMS
     
    $placeholders = implode(',', array_fill(0, count($item_ids), '?'));
    $types = str_repeat('i', count($item_ids));
    $sql_types = "i" . $types;
    $sql_params = array_merge([$cart_id], $item_ids);

     
    // 3. LẤY CÁC SẢN PHẨM ĐÃ CHỌN TỪ GIỎ HÀNG
     
    $sql_items = "
        SELECT 
            ci.id AS cart_item_id, 
            ci.variant_id, 
            ci.quantity, 
            pv.price, 
            pv.stock_quantity 
        FROM CartItems ci
        JOIN ProductVariants pv ON ci.variant_id = pv.id
        WHERE ci.cart_id = ? AND ci.id IN ($placeholders)
    ";

    $stmt_items = $conn->prepare($sql_items);
    $stmt_items->bind_param($sql_types, ...$sql_params);
    $stmt_items->execute();
    $cart_items = $stmt_items->get_result();

    if ($cart_items->num_rows == 0) {
        throw new Exception("Không tìm thấy sản phẩm trong giỏ hàng hoặc sản phẩm không hợp lệ.");
    }

     
    // 4. KIỂM TRA TỒN KHO VÀ TÍNH TỔNG TIỀN
     
    $subtotal = 0;
    $items_to_insert = [];

    while ($item = $cart_items->fetch_assoc()) {
        // Kiểm tra tồn kho
        if ($item['quantity'] > $item['stock_quantity']) {
            throw new Exception(
                "Sản phẩm variant ID #{$item['variant_id']} không đủ tồn kho. " .
                    "Yêu cầu: {$item['quantity']}, Còn lại: {$item['stock_quantity']}"
            );
        }

        $subtotal += $item['price'] * $item['quantity'];
        $items_to_insert[] = $item;
    }
    $stmt_items->close();

     
    // 5. TÍNH PHÍ SHIP VÀ TỔNG TIỀN
     
    $shipping_fee = ($subtotal >= 500000) ? 0 : 30000;
    $total_amount = $subtotal + $shipping_fee;
    $order_code = "ORD-" . strtoupper(bin2hex(random_bytes(6)));

     
    // 6. TẠO ĐƠN HÀNG MỚI
     
    $sql_create_order = "
        INSERT INTO Orders (
            user_id, 
            order_code, 
            customer_first_name, 
            customer_last_name, 
            customer_email, 
            customer_phone, 
            shipping_address, 
            shipping_city, 
            shipping_district, 
            subtotal, 
            shipping_fee, 
            total_amount, 
            payment_method, 
            order_notes, 
            status,
            created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW()
        )
    ";

    $stmt_order = $conn->prepare($sql_create_order);
    $stmt_order->bind_param(
        "issssssssdddss",
        $user_id,
        $order_code,
        $firstName,
        $lastName,
        $email,
        $phone,
        $address,
        $city,
        $district,
        $subtotal,
        $shipping_fee,
        $total_amount,
        $paymentMethod,
        $notes
    );

    if (!$stmt_order->execute()) {
        throw new Exception("Lỗi khi tạo đơn hàng: " . $stmt_order->error);
    }

    $new_order_id = $conn->insert_id;
    $stmt_order->close();

     
    // 7. THÊM ITEMS VÀO ĐƠN HÀNG + TRỪ TỒN KHO
     
    $sql_insert_item = "
        INSERT INTO OrderItems (order_id, variant_id, quantity, price_at_purchase) 
        VALUES (?, ?, ?, ?)
    ";
    $stmt_insert_item = $conn->prepare($sql_insert_item);

    // Prepare câu lệnh trừ kho
    $sql_update_stock = "
        UPDATE ProductVariants 
        SET stock_quantity = stock_quantity - ? 
        WHERE id = ? 
        AND stock_quantity >= ?
    ";
    $stmt_update_stock = $conn->prepare($sql_update_stock);

    foreach ($items_to_insert as $item) {
        // 7.1 Lưu chi tiết đơn hàng
        $stmt_insert_item->bind_param(
            "iiid",
            $new_order_id,
            $item['variant_id'],
            $item['quantity'],
            $item['price']
        );

        if (!$stmt_insert_item->execute()) {
            throw new Exception("Lỗi khi lưu chi tiết đơn hàng: " . $stmt_insert_item->error);
        }

        // 7.2 Trừ tồn kho (với điều kiện đủ hàng)
        $stmt_update_stock->bind_param(
            "iii",
            $item['quantity'],
            $item['variant_id'],
            $item['quantity'] // Điều kiện: stock_quantity >= quantity
        );

        if (!$stmt_update_stock->execute()) {
            throw new Exception("Lỗi khi cập nhật tồn kho: " . $stmt_update_stock->error);
        }

        // Kiểm tra xem có update được không
        if ($stmt_update_stock->affected_rows === 0) {
            throw new Exception(
                "Không thể trừ tồn kho cho variant ID #{$item['variant_id']}. " .
                    "Có thể sản phẩm đã hết hàng trong lúc xử lý."
            );
        }
    }

    $stmt_insert_item->close();
    $stmt_update_stock->close();

     
    // 8. XÓA CÁC SẢN PHẨM ĐÃ MUA KHỎI GIỎ HÀNG
     
    $sql_clear_cart = "DELETE FROM CartItems WHERE cart_id = ? AND id IN ($placeholders)";
    $stmt_clear_cart = $conn->prepare($sql_clear_cart);
    $stmt_clear_cart->bind_param($sql_types, ...$sql_params);

    if (!$stmt_clear_cart->execute()) {
        throw new Exception("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " . $stmt_clear_cart->error);
    }

    $stmt_clear_cart->close();

    // 9. COMMIT TRANSACTION
    $conn->commit();

    // 10. TRẢ VỀ KẾT QUẢ THÀNH CÔNG
     
    http_response_code(201);
    echo json_encode(array(
        "success" => true,
        "message" => "Đặt hàng thành công!",
        "order_code" => $order_code,
        "order_id" => $new_order_id,
        "total_amount" => $total_amount
    ));
} catch (Exception $e) {
    // ROLLBACK NẾU CÓ LỖI
    $conn->rollback();

    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Lỗi xử lý đơn hàng: " . $e->getMessage()
    ));
}

$conn->close();
