<?php
// htdocs/techstore-api/register.php

// === HEADER ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Xử lý request OPTIONS (trình duyệt gửi trước khi POST)
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

// 1. Lấy dữ liệu JSON từ frontend (Next.js)
$data = json_decode(file_get_contents("php://input"));

// 2. Kiểm tra dữ liệu đầu vào
if (
    !isset($data->firstName) || empty($data->firstName) ||
    !isset($data->lastName) || empty($data->lastName) ||
    !isset($data->email) || empty($data->email) ||
    !isset($data->phone) || empty($data->phone) ||
    !isset($data->password) || empty($data->password)
) {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Vui lòng nhập đầy đủ thông tin."));
    exit();
}

// 3. Gán biến
$firstName = $data->firstName;
$lastName = $data->lastName;
$email = $data->email;
$phone = $data->phone;
$password = $data->password;

// 4. KIỂM TRA EMAIL TỒN TẠI
// Dùng prepared statement để chống SQL Injection
$stmt = $conn->prepare("SELECT id FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Email đã tồn tại
    http_response_code(409); // Conflict
    echo json_encode(array("message" => "Email này đã được đăng ký."));
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// 5. MÃ HÓA MẬT KHẨU (Rất quan trọng)
// KHÔNG BAO GIỜ lưu mật khẩu gốc vào CSDL
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// 6. THÊM NGƯỜI DÙNG MỚI VÀO CSDL
// Dùng prepared statement
$stmt_insert = $conn->prepare("INSERT INTO Users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)");
$stmt_insert->bind_param("sssss", $firstName, $lastName, $email, $phone, $password_hash);

if ($stmt_insert->execute()) {
    // Đăng ký thành công
    http_response_code(201); // Created
    echo json_encode(array("message" => "Đăng ký tài khoản thành công."));
} else {
    // Lỗi không xác định
    http_response_code(500);
    echo json_encode(array("message" => "Đã xảy ra lỗi khi đăng ký."));
}

$stmt_insert->close();
$conn->close();
?>