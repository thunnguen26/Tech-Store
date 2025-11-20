<?php
// htdocs/techstore-api/get_user_orders.php

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
    echo json_encode(["message" => "Lỗi kết nối CSDL."]);
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
    // 2. Lấy danh sách đơn hàng của người dùng
    $sql = "
        SELECT 
            o.id, 
            o.order_code, 
            o.total_amount, 
            o.status, 
            o.created_at,
            COUNT(oi.id) AS item_count
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['total_amount'] = (float)$row['total_amount'];
            $row['item_count'] = (int)$row['item_count'];
            $orders[] = $row;
        }
    }

    http_response_code(200);
    echo json_encode($orders);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$stmt->close();
$conn->close();
?>