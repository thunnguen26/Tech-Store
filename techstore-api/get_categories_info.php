<?php
// htdocs/techstore-api/get_categories_info.php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "techstore";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");
if ($conn->connect_error) { http_response_code(500); exit(); }

try {
    // Lấy tên danh mục và đếm số sản phẩm 'active'
    $sql = "    
        SELECT 
            c.id,
            c.name, 
            COUNT(p.id) as count
        FROM Categories c
        LEFT JOIN Products p ON c.id = p.category_id AND p.status = 'active'
        GROUP BY c.id
    ";

    $result = $conn->query($sql);
    $categories = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $categories[] = [
                'id' => $row['id'],
                'name' => $row['name'], // Ví dụ: "Điện thoại"
                'count' => (int)$row['count']
            ];
        }
    }

    echo json_encode($categories);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([]);
}

$conn->close();
?>