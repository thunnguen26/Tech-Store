<?php
// htdocs/techstore-api/admin/admin_customer_add.php

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

// === XỬ LÝ LOGIC ===
$data = json_decode(file_get_contents("php://input"));

// 1. Kiểm tra dữ liệu đầu vào
if (
    !isset($data->firstName) || empty($data->firstName) ||
    !isset($data->lastName) || empty($data->lastName) ||
    !isset($data->email) || empty($data->email) ||
    !isset($data->phone) || empty($data->phone) ||
    !isset($data->password) || empty($data->password)
) {
    http_response_code(400);
    echo json_encode(array("message" => "Vui lòng nhập đầy đủ thông tin (Họ, Tên, Email, SĐT, Mật khẩu)."));
    exit();
}

$firstName = $data->firstName;
$lastName = $data->lastName;
$email = $data->email;
$phone = $data->phone;
$password = $data->password;

// 2. KIỂM TRA EMAIL TỒN TẠI
$stmt = $conn->prepare("SELECT id FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(array("message" => "Email này đã được đăng ký."));
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// 3. MÃ HÓA MẬT KHẨU
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// 4. THÊM NGƯỜI DÙNG MỚI VÀO CSDL
$stmt_insert = $conn->prepare("INSERT INTO Users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)");
$stmt_insert->bind_param("sssss", $firstName, $lastName, $email, $phone, $password_hash);

if ($stmt_insert->execute()) {
    http_response_code(201); // Created
    echo json_encode(array("message" => "Thêm khách hàng mới thành công."));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Đã xảy ra lỗi khi thêm khách hàng."));
}

$stmt_insert->close();
$conn->close();
?>