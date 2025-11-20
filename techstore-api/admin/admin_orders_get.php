<?php
// htdocs/techstore-api/admin/admin_orders_get.php

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

try {
    // Lấy TẤT CẢ các đơn hàng (JOIN với Users và OrderItems)
    $sql_orders = "
        SELECT 
            o.*, 
            CONCAT(u.first_name, ' ', u.last_name) AS user_full_name,
            COUNT(oi.id) AS item_count
        FROM Orders o
        LEFT JOIN Users u ON o.user_id = u.id
        LEFT JOIN OrderItems oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ";

    $result_orders = $conn->query($sql_orders);
    $orders = array();

    if ($result_orders->num_rows > 0) {
        while($order_row = $result_orders->fetch_assoc()) {
            // Chuyển các giá trị tiền tệ/số sang kiểu số
            $order_row['subtotal'] = (float)$order_row['subtotal'];
            $order_row['total_amount'] = (float)$order_row['total_amount'];
            $order_row['shipping_fee'] = (float)$order_row['shipping_fee'];
            $order_row['discount_amount'] = (float)$order_row['discount_amount'];
            $order_row['item_count'] = (int)$order_row['item_count'];

            // Nếu khách hàng đã đăng nhập, dùng tên đầy đủ, nếu không, dùng tên từ form
            if ($order_row['user_full_name'] === null) {
                $order_row['user_full_name'] = $order_row['customer_first_name'] . ' ' . $order_row['customer_last_name'];
            }
            
            $orders[] = $order_row;
        }
    }

    http_response_code(200);
    echo json_encode($orders);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>