<?php
// htdocs/techstore-api/login.php

// === PHẦN SỬA LỖI CORS ===
// 1. Cho phép frontend của bạn gọi
header("Access-Control-Allow-Origin: http://localhost:3000");
// 2. Cho phép các phương thức (POST cho form, OPTIONS cho kiểm tra CORS)
header("Access-Control-Allow-Methods: POST, OPTIONS");
// 3. Cho phép header 'Content-Type' (vì bạn gửi JSON)
header("Access-Control-Allow-Headers: Content-Type");
// 4. Báo cho trình duyệt biết đây là JSON
header("Content-Type: application/json; charset=UTF-8");

// 5. XỬ LÝ YÊU CẦU 'OPTIONS' (RẤT QUAN TRỌNG)
// Trình duyệt gửi request OPTIONS trước khi gửi POST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Trả về 200 OK
    exit(); // Dừng chạy script ngay lập tức
}
// === KẾT THÚC PHẦN SỬA LỖI CORS ===


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

// === XỬ LÝ LOGIC (Giữ nguyên như cũ) ===

// 1. Lấy dữ liệu JSON từ frontend
$data = json_decode(file_get_contents("php://input"));

// 2. Kiểm tra dữ liệu
if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Vui lòng nhập email và mật khẩu."));
    exit();
}

// 3. Gán biến
$email = $data->email;
$password_input = $data->password;

// 4. KIỂM TRA NGƯỜI DÙNG TỒN TẠI
$stmt = $conn->prepare("SELECT id, first_name, last_name, password_hash FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    // Không tìm thấy email
    http_response_code(401); // Dùng 401 (Unauthorized) sẽ tốt hơn 404
    echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
    $stmt->close();
    $conn->close();
    exit();
}

// 5. Lấy thông tin người dùng và KIỂM TRA MẬT KHẨU
$user = $result->fetch_assoc();
$password_hash_from_db = $user['password_hash'];

if (password_verify($password_input, $password_hash_from_db)) {
    // Mật khẩu chính xác!
    http_response_code(200); // OK
    echo json_encode(array(
        "message" => "Đăng nhập thành công!",
        "user" => array( 
            "id" => $user['id'],
            "firstName" => $user['first_name'],
            "lastName" => $user['last_name']
        )
    ));
} else {
    // Mật khẩu sai
    http_response_code(401); // Unauthorized
    echo json_encode(array("message" => "Email hoặc mật khẩu không chính xác."));
}

$stmt->close();
$conn->close();
?>