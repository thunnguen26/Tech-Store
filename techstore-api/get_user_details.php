<?php
// htdocs/techstore-api/get_user_details.php

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
if ($conn->connect_error) { die("Connection failed"); }

// === XỬ LÝ LOGIC ===

// 1. Lấy user_id từ URL (ví dụ: ?user_id=1)
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    http_response_code(400); 
    echo json_encode(array("message" => "Thiếu user_id."));
    exit();
}

$user_id = intval($_GET['user_id']);

try {
    // 2. Lấy thông tin chi tiết của người dùng
    // Chúng ta KHÔNG BAO GIỜ lấy 'password_hash'
    $stmt = $conn->prepare("SELECT id, first_name, last_name, email, phone, created_at FROM Users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Không tìm thấy người dùng."));
    } else {
        $user_details = $result->fetch_assoc();
        http_response_code(200);
        echo json_encode($user_details);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
?>