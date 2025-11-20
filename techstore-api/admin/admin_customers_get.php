<?php
// htdocs/techstore-api/admin/admin_customers_get.php

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

// === XỬ LÝ LOGIC (ĐÃ SỬA LỖI) ===
try {
    // 1. SỬA LỖI: Xóa dòng "AND o.status IN (...)"
    $sql = "
        SELECT 
            u.id, 
            CONCAT(u.first_name, ' ', u.last_name) AS name, 
            u.email, 
            u.phone, 
            u.created_at AS joinDate,
            COUNT(o.id) AS totalOrders, -- Đếm tất cả đơn hàng
            COALESCE(SUM(o.total_amount), 0) AS totalSpent, -- Tính tổng tiền tất cả đơn hàng
            'active' AS status
        FROM Users u
        LEFT JOIN Orders o ON u.id = o.user_id 
                         -- (Đã xóa bộ lọc status ở đây)
        GROUP BY u.id -- Nhóm theo ID người dùng
        ORDER BY u.created_at DESC
    ";

    $result = $conn->query($sql);
    $customers = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['id'] = intval($row['id']);
            $row['totalOrders'] = intval($row['totalOrders']);
            $row['totalSpent'] = floatval($row['totalSpent']);
            $customers[] = $row;
        }
    }

    http_response_code(200);
    echo json_encode($customers);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>