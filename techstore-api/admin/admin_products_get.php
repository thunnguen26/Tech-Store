<?php
// htdocs/techstore-api/admin/admin_products_get.php

// ✅ TẮT ERROR HIỂN THỊ RA NGOÀI (PRODUCTION MODE)
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "techstore";
$conn = @new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Lỗi kết nối CSDL"]);
    exit();
}
$conn->set_charset("utf8mb4");

try {
    // 1. Lấy danh sách sản phẩm
    $sql_products = "
        SELECT p.*, c.name AS category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    ";
    $result = $conn->query($sql_products);
    $products = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $product_id = (int)$row['id'];

            // Parse features
            $row['features'] = !empty($row['features']) ? json_decode($row['features'], true) : [];

            // Lấy Variants
            $variants = [];
            $res_var = $conn->query("SELECT * FROM ProductVariants WHERE product_id = $product_id");
            while ($v = $res_var->fetch_assoc()) {
                $v['price'] = (float)$v['price'];
                $v['stock_quantity'] = (int)$v['stock_quantity'];
                $variants[] = $v;
            }
            $row['variants'] = $variants;

            // Lấy Images
            $images = [];
            $res_img = $conn->query("SELECT image_url FROM ProductImages WHERE product_id = $product_id");
            while ($img = $res_img->fetch_assoc()) $images[] = $img['image_url'];
            $row['images'] = $images;

            // === ✅ SỬA LẠI: TÍNH ĐÃ BÁN (SOLD) - LOẠI TRỪ ĐỚN HỦY ===
            $sql_sold = "
                SELECT COALESCE(SUM(oi.quantity), 0) as total_sold 
                FROM OrderItems oi
                JOIN Orders o ON oi.order_id = o.id
                JOIN ProductVariants pv ON oi.variant_id = pv.id
                WHERE pv.product_id = $product_id 
                AND o.status NOT IN ('cancelled', 'refunded')
            ";

            $res_sold = $conn->query($sql_sold);
            if ($res_sold) {
                $sold_data = $res_sold->fetch_assoc();
                $row['sold'] = (int)$sold_data['total_sold'];
            } else {
                $row['sold'] = 0;
            }

            // Ép kiểu ID
            $row['id'] = (int)$row['id'];

            $products[] = $row;
        }
    }

    echo json_encode($products);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
}
$conn->close();
