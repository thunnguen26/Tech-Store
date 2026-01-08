<?php
// htdocs/techstore-api/cart_get.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi kết nối CSDL."));
    exit();
}

// === XỬ LÝ LOGIC ===

// 1. Lấy user_id từ URL (ví dụ: ?user_id=1)
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu user_id."));
    exit();
}

$user_id = intval($_GET['user_id']);

try {
    // 2. Lấy thông tin các món hàng trong giỏ
    $sql = "
        SELECT 
            ci.id AS cart_item_id,
            ci.quantity,
            pv.id AS variant_id,
            pv.size,
            pv.color_name,
            pv.price,
            pv.original_price,
            pv.stock_quantity,
            p.id AS product_id,
            p.name,
            p.base_image 
        FROM CartItems ci
        JOIN Carts c ON ci.cart_id = c.id
        JOIN ProductVariants pv ON ci.variant_id = pv.id
        JOIN Products p ON pv.product_id = p.id
        WHERE c.user_id = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $cart_items = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Chuyển sang kiểu số đúng
            $row['cart_item_id'] = (int)$row['cart_item_id'];
            $row['variant_id'] = (int)$row['variant_id'];
            $row['product_id'] = (int)$row['product_id'];
            $row['quantity'] = (int)$row['quantity'];
            $row['price'] = (float)$row['price'];
            $row['original_price'] = $row['original_price'] ? (float)$row['original_price'] : null;
            $row['stock_quantity'] = (int)$row['stock_quantity'];

            $cart_items[] = $row;
        }
    }

    // 3. Trả về mảng các sản phẩm trong giỏ
    http_response_code(200);
    echo json_encode($cart_items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$stmt->close();
$conn->close();
