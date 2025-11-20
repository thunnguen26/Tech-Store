<?php
// htdocs/techstore-api/submit_review.php

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
if (
    !isset($data->user_id) || !isset($data->product_id) || !isset($data->order_id) ||
    !isset($data->rating) || $data->rating < 1 || $data->rating > 5
) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu dữ liệu bắt buộc (user, product, order, rating)."));
    exit();
}

$user_id = intval($data->user_id);
$product_id = intval($data->product_id);
$order_id = intval($data->order_id);
$rating = intval($data->rating);
$comment = $data->comment ?? null;

try {
    // 2. XÁC THỰC QUYỀN (Rất quan trọng)
    // Kiểm tra xem người dùng này có thực sự mua sản phẩm này trong đơn hàng này không
    // VÀ đơn hàng phải ở trạng thái 'completed'
    $stmt_check = $conn->prepare("
        SELECT o.status 
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN ProductVariants pv ON oi.variant_id = pv.id
        WHERE o.id = ? AND o.user_id = ? AND pv.product_id = ? AND o.status = 'completed'
    ");
    $stmt_check->bind_param("iii", $order_id, $user_id, $product_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows == 0) {
        http_response_code(403); // Forbidden
        echo json_encode(array("message" => "Bạn không có quyền đánh giá sản phẩm này, hoặc đơn hàng chưa hoàn thành."));
        $stmt_check->close();
        $conn->close();
        exit();
    }
    $stmt_check->close();

    // 3. THÊM ĐÁNH GIÁ VÀO CSDL
    // (Lệnh INSERT ... ON DUPLICATE KEY UPDATE sẽ tự động xử lý nếu người dùng sửa lại đánh giá)
    $stmt_insert = $conn->prepare("
        INSERT INTO Reviews (user_id, product_id, order_id, rating, comment) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
    ");
    $stmt_insert->bind_param("iiiis", $user_id, $product_id, $order_id, $rating, $comment);

    if ($stmt_insert->execute()) {
        http_response_code(201); // Created
        echo json_encode(array("message" => "Gửi đánh giá thành công."));
    } else {
        throw new Exception("Lỗi khi lưu đánh giá.");
    }
    
    $stmt_insert->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
?>