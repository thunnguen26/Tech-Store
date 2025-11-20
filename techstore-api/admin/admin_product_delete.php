<?php
// htdocs/techstore-api/admin/admin_product_delete.php

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

if (!isset($data->product_id) || empty($data->product_id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu product_id."));
    exit();
}

$product_id = intval($data->product_id);

try {
    // === THAY ĐỔI LỚN: KHÔNG XÓA, CHỈ CẬP NHẬT STATUS ===
    // Chúng ta chuyển trạng thái sản phẩm thành 'archived' (Lưu trữ)
    
    $stmt = $conn->prepare("UPDATE Products SET status = 'archived' WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Đã lưu trữ sản phẩm thành công."));
        } else {
            throw new Exception("Không tìm thấy sản phẩm để lưu trữ (ID: $product_id).");
        }
    } else {
        throw new Exception("Lỗi khi thực thi lệnh cập nhật status.");
    }
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
?>