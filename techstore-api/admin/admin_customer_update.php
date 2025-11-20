<?php
// htdocs/techstore-api/admin/admin_customer_update.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Dùng POST (hoặc PUT/PATCH)
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
if (
    !isset($data->id) || empty($data->id) ||
    !isset($data->first_name) || empty($data->first_name) ||
    !isset($data->last_name) || empty($data->last_name) ||
    !isset($data->email) || empty($data->email) ||
    !isset($data->phone) || empty($data->phone)
) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu thông tin bắt buộc (ID, Họ, Tên, Email, SĐT)."));
    exit();
}

$user_id = intval($data->id);
$firstName = $data->first_name;
$lastName = $data->last_name;
$email = $data->email;
$phone = $data->phone;
$password = $data->password ?? null; // Mật khẩu là tùy chọn

try {
    // 2. KIỂM TRA EMAIL TRÙNG LẶP (cho người dùng khác)
    $stmt_check = $conn->prepare("SELECT id FROM Users WHERE email = ? AND id != ?");
    $stmt_check->bind_param("si", $email, $user_id);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Email này đã được sử dụng bởi một tài khoản khác."));
        $stmt_check->close();
        $conn->close();
        exit();
    }
    $stmt_check->close();

    // 3. XÂY DỰNG CÂU LỆNH UPDATE
    if ($password !== null && !empty($password)) {
        // CẬP NHẬT CÓ MẬT KHẨU
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt_update = $conn->prepare("UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ?, password_hash = ? WHERE id = ?");
        $stmt_update->bind_param("sssssi", $firstName, $lastName, $email, $phone, $password_hash, $user_id);
    } else {
        // CẬP NHẬT KHÔNG CÓ MẬT KHẨU
        $stmt_update = $conn->prepare("UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?");
        $stmt_update->bind_param("ssssi", $firstName, $lastName, $email, $phone, $user_id);
    }

    // 4. THỰC THI CẬP NHẬT
    if ($stmt_update->execute()) {
        if ($stmt_update->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Cập nhật thông tin khách hàng thành công."));
        } else {
            http_response_code(200); // Vẫn OK, nhưng không có gì thay đổi
            echo json_encode(array("message" => "Không có thay đổi nào được ghi nhận."));
        }
    } else {
        throw new Exception("Lỗi khi cập nhật CSDL.");
    }
    
    $stmt_update->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
?>