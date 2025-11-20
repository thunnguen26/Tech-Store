<?php
// htdocs/techstore-api/cart_remove_item.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$conn = new mysqli("localhost", "root", "", "techstore");
$conn->set_charset("utf8mb4");
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->cart_item_id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu cart_item_id."));
    exit();
}

$cart_item_id = intval($data->cart_item_id);

try {
    $stmt = $conn->prepare("DELETE FROM CartItems WHERE id = ?");
    $stmt->bind_param("i", $cart_item_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Đã xóa sản phẩm khỏi giỏ hàng."));
    } else {
        throw new Exception("Lỗi khi xóa.");
    }
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
$conn->close();
?>