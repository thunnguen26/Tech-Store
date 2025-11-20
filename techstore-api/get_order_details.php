<?php
// htdocs/techstore-api/get_order_details.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
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

// 1. Lấy ID từ URL
if (!isset($_GET['user_id']) || !isset($_GET['order_id'])) {
    http_response_code(400); 
    echo json_encode(array("message" => "Thiếu user_id hoặc order_id."));
    exit();
}

$user_id = intval($_GET['user_id']);
$order_id = intval($_GET['order_id']);

try {
    $response = array();

    // 2. LẤY THÔNG TIN ĐƠN HÀNG (BẢO MẬT)
    // Phải kiểm tra user_id để đảm bảo người dùng chỉ xem đơn hàng của chính họ
    $stmt_order = $conn->prepare("SELECT * FROM Orders WHERE id = ? AND user_id = ?");
    $stmt_order->bind_param("ii", $order_id, $user_id);
    $stmt_order->execute();
    $result_order = $stmt_order->get_result();

    if ($result_order->num_rows == 0) {
        http_response_code(404); // Không tìm thấy hoặc không có quyền
        echo json_encode(array("message" => "Không tìm thấy đơn hàng hoặc bạn không có quyền xem."));
        $stmt_order->close();
        $conn->close();
        exit();
    }
    
    $response['details'] = $result_order->fetch_assoc();
    $stmt_order->close();

    // 3. LẤY DANH SÁCH SẢN PHẨM TRONG ĐƠN HÀNG ĐÓ
    $sql_items = "
        SELECT 
            oi.quantity,
            oi.price_at_purchase,
            p.id AS product_id,
            p.name,
            p.base_image,
            pv.size,
            pv.color_name
        FROM OrderItems oi
        JOIN ProductVariants pv ON oi.variant_id = pv.id
        JOIN Products p ON pv.product_id = p.id
        WHERE oi.order_id = ?
    ";
    
    $stmt_items = $conn->prepare($sql_items);
    $stmt_items->bind_param("i", $order_id);
    $stmt_items->execute();
    $result_items = $stmt_items->get_result();
    
    $items = array();
    if ($result_items->num_rows > 0) {
        while($row = $result_items->fetch_assoc()) {
            $row['quantity'] = intval($row['quantity']);
            $row['price_at_purchase'] = floatval($row['price_at_purchase']);
            $items[] = $row;
        }
    }
    
    $response['items'] = $items;
    $stmt_items->close();

    // 4. TRẢ VỀ DỮ LIỆU
    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>