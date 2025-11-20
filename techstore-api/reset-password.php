<?php
// htdocs/techstore-api/reset-password.php

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

if (!isset($data->token) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu token hoặc mật khẩu mới."));
    exit();
}

$token = $data->token;
$new_password = $data->password;

// 2. TÌM TOKEN (*** ĐÂY LÀ DÒNG ĐÃ SỬA ***)
// So sánh với giờ UTC, không phải giờ server
$stmt_check = $conn->prepare("SELECT * FROM PasswordResets WHERE token = ? AND expires_at > UTC_TIMESTAMP()");
$stmt_check->bind_param("s", $token);
$stmt_check->execute();
$result = $stmt_check->get_result();

if ($result->num_rows == 0) {
    // Không tìm thấy token, hoặc token đã hết hạn
    http_response_code(400); 
    echo json_encode(array("message" => "Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."));
    $stmt_check->close();
    $conn->close();
    exit();
}

$reset_request = $result->fetch_assoc();
$email = $reset_request['email'];
$stmt_check->close();

// 3. TOKEN HỢP LỆ -> CẬP NHẬT MẬT KHẨU MỚI
$new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);

$stmt_update = $conn->prepare("UPDATE Users SET password_hash = ? WHERE email = ?");
$stmt_update->bind_param("ss", $new_password_hash, $email);

if ($stmt_update->execute()) {
    // 4. XÓA TOKEN ĐÃ SỬ DỤNG
    $stmt_delete = $conn->prepare("DELETE FROM PasswordResets WHERE token = ?");
    $stmt_delete->bind_param("s", $token);
    $stmt_delete->execute();
    $stmt_delete->close();

    // Trả về thành công
    http_response_code(200);
    echo json_encode(array("message" => "Đã đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay."));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi khi cập nhật mật khẩu."));
}

$stmt_update->close();
$conn->close();
?>