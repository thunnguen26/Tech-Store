<?php
// htdocs/techstore-api/login.php

// === HEADER CORS ===
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

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("message" => "Vui lòng nhập email và mật khẩu."));
    exit();
}

$email = $data->email;
$password_input = $data->password;

// Thêm 'role' vào câu lệnh SELECT
$stmt = $conn->prepare("SELECT id, first_name, last_name, password_hash, role FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    http_response_code(401);
    echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
    $stmt->close();
    $conn->close();
    exit();
}

$user = $result->fetch_assoc();
$password_hash_from_db = $user['password_hash'];

if (password_verify($password_input, $password_hash_from_db)) {
    http_response_code(200);
    echo json_encode(array(
        "message" => "Đăng nhập thành công!",
        "user" => array( 
            "id" => $user['id'],
            "firstName" => $user['first_name'],
            "lastName" => $user['last_name'],
            "role" => $user['role'] // Giờ dòng này mới có dữ liệu
        )
    ));
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
}

$stmt->close();
$conn->close();
?>