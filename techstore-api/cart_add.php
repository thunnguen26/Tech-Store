<?php
// htdocs/techstore-api/cart_add.php

// === HEADER (CORS + JSON) ===
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
    echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL."]);
    exit();
}

// === LẤY BODY JSON ===
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->variant_id) || !isset($data->quantity)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu user_id, variant_id hoặc quantity."]);
    exit();
}

$user_id = intval($data->user_id);
$variant_id = intval($data->variant_id);
$quantity = max(1, intval($data->quantity)); // không cho <= 0

try {
    // === 1. TÌM HOẶC TẠO GIỎ HÀNG ===
    $stmt_find_cart = $conn->prepare("SELECT id FROM Carts WHERE user_id = ?");
    $stmt_find_cart->bind_param("i", $user_id);
    $stmt_find_cart->execute();
    $result_cart = $stmt_find_cart->get_result();
    $cart_id = null;

    if ($result_cart->num_rows > 0) {
        $cart = $result_cart->fetch_assoc();
        $cart_id = $cart['id'];
    } else {
        $stmt_create_cart = $conn->prepare("INSERT INTO Carts (user_id) VALUES (?)");
        $stmt_create_cart->bind_param("i", $user_id);
        $stmt_create_cart->execute();
        $cart_id = $conn->insert_id;
        $stmt_create_cart->close();
    }
    $stmt_find_cart->close();

    if (!$cart_id) {
        throw new Exception("Không thể tìm hoặc tạo giỏ hàng.");
    }

    // === 2. KIỂM TRA ITEM TRONG GIỎ ===
    $stmt_check_item = $conn->prepare("SELECT id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?");
    $stmt_check_item->bind_param("ii", $cart_id, $variant_id);
    $stmt_check_item->execute();
    $result_item = $stmt_check_item->get_result();

    if ($result_item->num_rows > 0) {
        // update số lượng
        $item = $result_item->fetch_assoc();
        $new_qty = $item['quantity'] + $quantity;
        $stmt_update = $conn->prepare("UPDATE CartItems SET quantity = ? WHERE id = ?");
        $stmt_update->bind_param("ii", $new_qty, $item['id']);
        $stmt_update->execute();
        $stmt_update->close();
    } else {
        // thêm mới
        $stmt_insert = $conn->prepare("INSERT INTO CartItems (cart_id, variant_id, quantity) VALUES (?, ?, ?)");
        $stmt_insert->bind_param("iii", $cart_id, $variant_id, $quantity);
        $stmt_insert->execute();
        $stmt_insert->close();
    }

    $stmt_check_item->close();

    // === 3. RESPONSE JSON CHUẨN ===
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Đã thêm sản phẩm vào giỏ hàng.",
        "cart_id" => $cart_id
    ]);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
