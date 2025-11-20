<?php
// htdocs/techstore-api/forgot-password.php

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

// 1. Lấy dữ liệu JSON
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty($data->email)) {
    http_response_code(400);
    echo json_encode(array("message" => "Vui lòng nhập email."));
    exit();
}

$email = $data->email;

// 2. KIỂM TRA EMAIL CÓ TỒN TẠI TRONG BẢNG 'Users' KHÔNG
$stmt_check = $conn->prepare("SELECT id FROM Users WHERE email = ?");
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows == 0) {
    // Email không tồn tại
    // Chú ý: Vì lý do bảo mật, chúng ta không nên nói "Email không tồn tại".
    // Chúng ta vẫn trả về 200 OK để hacker không biết email nào có trong hệ thống.
    http_response_code(200);
    echo json_encode(array("message" => "Nếu email này tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."));
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

// 3. TẠO TOKEN BẢO MẬT
$token = bin2hex(random_bytes(32)); // Tạo một chuỗi ngẫu nhiên 64 ký tự
$expires = time() + 3600; // Hết hạn sau 1 giờ (3600 giây)
$expires_at_datetime = date('Y-m-d H:i:s', $expires);

// 4. LƯU TOKEN VÀO BẢNG 'PasswordResets'
$stmt_insert = $conn->prepare("INSERT INTO PasswordResets (email, token, expires_at) VALUES (?, ?, ?)");
$stmt_insert->bind_param("sss", $email, $token, $expires_at_datetime);

if ($stmt_insert->execute()) {
    // 5. GỬI EMAIL (PHẦN NÀY CHÚNG TA SẼ GIẢ LẬP)
    // Trong dự án thật, bạn sẽ dùng thư viện (ví dụ: PHPMailer) để gửi email
    // Email sẽ chứa link: http://localhost:3000/reset-password/TOKEN_O_DAY
    
    // Giả lập thành công:
    http_response_code(200);
    echo json_encode(array(
        "message" => "Nếu email này tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
        "debug_token" => $token // Gửi token về để BẠN test. XÓA DÒNG NÀY KHI DEPLOY
    ));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi khi tạo yêu cầu đặt lại mật khẩu."));
}

$stmt_insert->close();
$conn->close();
?>