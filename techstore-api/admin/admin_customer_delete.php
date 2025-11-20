<?php
// htdocs/techstore-api/admin/admin_customer_delete.php

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

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi kết nối CSDL."));
    exit();
}

// === XỬ LÝ LOGIC ===
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || empty($data->user_id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu user_id."));
    exit();
}

$user_id = intval($data->user_id);

try {
    
    $stmt = $conn->prepare("DELETE FROM Users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Đã xóa khách hàng thành công."));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy khách hàng để xóa."));
        }
    } else {
        throw new Exception("Lỗi khi xóa người dùng.");
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    // Bắt lỗi nếu không thể xóa (ví dụ: do khóa ngoại)
    echo json_encode(array("message" => "Lỗi máy chủ: Không thể xóa người dùng này. " . $e->getMessage()));
}
?>