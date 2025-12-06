<?php
// htdocs/techstore-api/user_cancel_order.php
// HỦY ĐƠN HÀNG VÀ HOÀN TỒN KHO

error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode(["success" => false, "message" => $message]);
    exit();
}

$conn = null;

try {
    // Kết nối DB
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "techstore";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        sendError("Lỗi kết nối database", 500);
    }

    $conn->set_charset("utf8mb4");

    // Lấy input
    $input = file_get_contents("php://input");
    $data = json_decode($input);

    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError("Dữ liệu không hợp lệ");
    }

    if (!isset($data->order_id)) {
        sendError("Thiếu thông tin order_id");
    }

    $order_id = intval($data->order_id);

    if ($order_id <= 0) {
        sendError("order_id không hợp lệ");
    }

    // Bắt đầu Transaction
    $conn->begin_transaction();

    // Kiểm tra đơn hàng
    $stmt = $conn->prepare("SELECT status FROM Orders WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Lỗi hệ thống");
    }

    $stmt->bind_param("i", $order_id);

    if (!$stmt->execute()) {
        throw new Exception("Lỗi hệ thống");
    }

    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        throw new Exception("Không tìm thấy đơn hàng");
    }

    // Kiểm tra trạng thái
    $current_status = $order['status'];
    if (!in_array($current_status, ['pending', 'processing'])) {
        throw new Exception("Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    // Cập nhật trạng thái
    $stmt_update = $conn->prepare("UPDATE Orders SET status = 'cancelled' WHERE id = ?");
    if (!$stmt_update) {
        throw new Exception("Lỗi hệ thống");
    }

    $stmt_update->bind_param("i", $order_id);

    if (!$stmt_update->execute()) {
        throw new Exception("Lỗi cập nhật đơn hàng");
    }
    $stmt_update->close();

    // Lấy danh sách sản phẩm
    $stmt_items = $conn->prepare("SELECT variant_id, quantity FROM OrderItems WHERE order_id = ?");
    if (!$stmt_items) {
        throw new Exception("Lỗi hệ thống");
    }

    $stmt_items->bind_param("i", $order_id);

    if (!$stmt_items->execute()) {
        throw new Exception("Lỗi hệ thống");
    }

    $result_items = $stmt_items->get_result();

    // Hoàn tồn kho
    $stmt_restock = $conn->prepare("UPDATE ProductVariants SET stock_quantity = stock_quantity + ? WHERE id = ?");
    if (!$stmt_restock) {
        throw new Exception("Lỗi hệ thống");
    }

    $total_restored = 0;
    while ($item = $result_items->fetch_assoc()) {
        $qty = intval($item['quantity']);
        $vid = intval($item['variant_id']);

        if ($vid > 0 && $qty > 0) {
            $stmt_restock->bind_param("ii", $qty, $vid);
            if ($stmt_restock->execute()) {
                $total_restored += $qty;
            }
        }
    }

    $stmt_items->close();
    $stmt_restock->close();

    // Commit
    $conn->commit();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Đã hủy đơn hàng và hoàn tồn kho thành công",
        "items_restored" => $total_restored
    ]);
} catch (Exception $e) {
    if ($conn && $conn->ping()) {
        $conn->rollback();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

if ($conn) {
    $conn->close();
}
