<?php
// htdocs/techstore-api/cart_update_quantity.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$conn = new mysqli("localhost", "root", "", "techstore");
$conn->set_charset("utf8mb4");
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->cart_item_id) || !isset($data->quantity)) {
    http_response_code(400);
    echo json_encode(array("message" => "Thiếu cart_item_id hoặc quantity."));
    exit();
}

$cart_item_id = intval($data->cart_item_id);
$quantity = intval($data->quantity);

if ($quantity <= 0) {
    http_response_code(400);
    echo json_encode(array("message" => "Số lượng phải lớn hơn 0."));
    exit();
}

try {
    $stmt = $conn->prepare("UPDATE CartItems SET quantity = ? WHERE id = ?");
    $stmt->bind_param("ii", $quantity, $cart_item_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Cập nhật số lượng thành công."));
    } else {
        throw new Exception("Lỗi khi cập nhật.");
    }
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}
$conn->close();
?>