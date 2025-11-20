<?php
// htdocs/techstore-api/admin/admin_order_update_status.php

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
    echo json_encode(["message" => "Lỗi kết nối CSDL."]);
    exit(); 
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// === XỬ LÝ LOGIC ===
$data = json_decode(file_get_contents("php://input"));

// 1. Kiểm tra dữ liệu
if (!isset($data->order_id) || !isset($data->status)) {
    http_response_code(400); 
    echo json_encode(array("message" => "Thiếu order_id hoặc status."));
    exit();
}

$order_id = intval($data->order_id);
$status = $data->status;

// 2. Kiểm tra xem status có hợp lệ không
$allowed_statuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400); 
    echo json_encode(array("message" => "Trạng thái không hợp lệ."));
    exit();
}

try {
    // 3. CẬP NHẬT TRẠNG THÁI
    $stmt = $conn->prepare("UPDATE Orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $order_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Cập nhật trạng thái đơn hàng thành công."));
        } else {
            http_response_code(200); // Vẫn OK
            echo json_encode(array("message" => "Không có thay đổi nào (có thể trạng thái đã là $status)."));
        }
    } else {
        throw new Exception("Lỗi khi cập nhật CSDL.");
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
?>