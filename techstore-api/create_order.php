<?php
// htdocs/techstore-api/create_order.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === KẾT NỐI CSDL ===
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "techstore";
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");
if ($conn->connect_error) { die("Connection failed"); }
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// === XỬ LÝ LOGIC ===

$data = json_decode(file_get_contents("php://input"));

// 1. Kiểm tra dữ liệu
if (
    !isset($data->user_id) ||
    !isset($data->itemIds) || empty($data->itemIds) || // PHẢI CÓ DANH SÁCH ID SẢN PHẨM
    !isset($data->firstName) || !isset($data->lastName)
    /* ... (các trường khác) ... */
) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu thông tin người dùng, địa chỉ, hoặc sản phẩm."));
    exit();
}

$user_id = intval($data->user_id);
$item_ids = $data->itemIds; // Đây là một mảng, ví dụ: [1, 3, 5]

// Lấy thông tin form
$firstName = $data->firstName;
$lastName = $data->lastName;
$email = $data->email;
$phone = $data->phone;
$address = $data->address;
$city = $data->city;
$district = $data->district;
$paymentMethod = $data->paymentMethod;
$notes = $data->notes ?? "";

// Bắt đầu GIAO DỊCH
$conn->begin_transaction();

try {
    // 3. LẤY GIỎ HÀNG CỦA NGƯỜI DÙNG (Chỉ để lấy cart_id)
    $stmt_cart = $conn->prepare("SELECT id FROM Carts WHERE user_id = ?");
    $stmt_cart->bind_param("i", $user_id);
    $stmt_cart->execute();
    $result_cart = $stmt_cart->get_result();
    if ($result_cart->num_rows == 0) {
        throw new Exception("Không tìm thấy giỏ hàng.");
    }
    $cart_id = $result_cart->fetch_assoc()['id'];
    $stmt_cart->close();

    // 4. CHUẨN BỊ DANH SÁCH ID (để dùng trong 'IN (...)')
    // Tạo chuỗi '?, ?, ?'
    $placeholders = implode(',', array_fill(0, count($item_ids), '?')); 
    // Tạo chuỗi kiểu dữ liệu 'iii'
    $types = str_repeat('i', count($item_ids)); 
    // Thêm cart_id vào đầu
    $sql_types = "i" . $types;
    $sql_params = array_merge([$cart_id], $item_ids);

    // 5. LẤY CÁC SẢN PHẨM ĐÃ CHỌN TRONG GIỎ
    $sql_items = "
        SELECT ci.id AS cart_item_id, ci.variant_id, ci.quantity, pv.price 
        FROM CartItems ci
        JOIN ProductVariants pv ON ci.variant_id = pv.id
        WHERE ci.cart_id = ? AND ci.id IN ($placeholders)
    ";
    
    $stmt_items = $conn->prepare($sql_items);
    // Dùng '...' (splat operator) để truyền mảng params
    $stmt_items->bind_param($sql_types, ...$sql_params); 
    $stmt_items->execute();
    $cart_items = $stmt_items->get_result();
    
    if ($cart_items->num_rows == 0) {
        throw new Exception("Sản phẩm đã chọn không hợp lệ hoặc giỏ hàng trống.");
    }

    // 6. TÍNH TOÁN TỔNG TIỀN (Chỉ tính các item đã chọn)
    $subtotal = 0;
    $items_to_insert = [];
    while ($item = $cart_items->fetch_assoc()) {
        $subtotal += $item['price'] * $item['quantity'];
        $items_to_insert[] = $item; 
    }
    $stmt_items->close();
    
    $shipping_fee = ($subtotal >= 500000) ? 0 : 30000;
    $total_amount = $subtotal + $shipping_fee;
    $order_code = "ORD-" . strtoupper(bin2hex(random_bytes(6)));

    // 7. TẠO ĐƠN HÀNG MỚI (INSERT vào 'Orders')
    $sql_create_order = "
        INSERT INTO Orders 
        (user_id, order_code, customer_first_name, customer_last_name, customer_email, customer_phone, 
        shipping_address, shipping_city, shipping_district, 
        subtotal, shipping_fee, total_amount, payment_method, order_notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ";
    $stmt_order = $conn->prepare($sql_create_order);
    $stmt_order->bind_param(
        "issssssssdddss", 
        $user_id, $order_code, $firstName, $lastName, $email, $phone,
        $address, $city, $district,
        $subtotal, $shipping_fee, $total_amount,
        $paymentMethod, $notes
    );
    $stmt_order->execute();
    $new_order_id = $conn->insert_id;
    $stmt_order->close();

    // 8. CHÉP SẢN PHẨM SANG 'OrderItems'
    $sql_insert_item = "INSERT INTO OrderItems (order_id, variant_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";
    $stmt_insert_item = $conn->prepare($sql_insert_item);
    foreach ($items_to_insert as $item) {
        $stmt_insert_item->bind_param("iiid", $new_order_id, $item['variant_id'], $item['quantity'], $item['price']);
        $stmt_insert_item->execute();
    }
    $stmt_insert_item->close();

    // 9. XÓA CÁC SẢN PHẨM ĐÃ MUA KHỎI GIỎ HÀNG (CartItems)
    $sql_clear_cart = "DELETE FROM CartItems WHERE cart_id = ? AND id IN ($placeholders)";
    $stmt_clear_cart = $conn->prepare($sql_clear_cart);
    $stmt_clear_cart->bind_param($sql_types, ...$sql_params);
    $stmt_clear_cart->execute();
    $stmt_clear_cart->close();

    // 10. HOÀN TẤT GIAO DỊCH
    $conn->commit();

    http_response_code(201);
    echo json_encode(array(
        "message" => "Đặt hàng thành công!",
        "order_code" => $order_code,
        "order_id" => $new_order_id
    ));

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>