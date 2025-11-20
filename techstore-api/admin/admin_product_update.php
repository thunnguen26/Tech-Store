<?php
// htdocs/techstore-api/admin/admin_product_update.php

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
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method không được hỗ trợ."]);
    exit();
}

try {
    // === BƯỚC 1: NHẬN DỮ LIỆU ===
    $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID sản phẩm không hợp lệ."]);
        exit();
    }

    // Kiểm tra sản phẩm có tồn tại không
    $check_sql = "SELECT id FROM Products WHERE id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $product_id);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows == 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm."]);
        exit();
    }
    $check_stmt->close();

    // Lấy dữ liệu từ POST
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $brand = $_POST['brand'] ?? '';
    $model = $_POST['model'] ?? null;
    $category_slug = $_POST['category'] ?? '';
    $status = $_POST['status'] ?? 'draft';

    // Thông số kỹ thuật
    $processor = $_POST['processor'] ?? null;
    $ram = $_POST['ram'] ?? null;
    $storage = $_POST['storage'] ?? null;
    $screen = $_POST['screen'] ?? null;

    // Variants (JSON string)
    $variants_json = $_POST['variants'] ?? '[]';
    $variants = json_decode($variants_json, true);

    // Existing images (JSON string)
    $existing_images_json = $_POST['existing_images'] ?? '[]';
    $existing_images = json_decode($existing_images_json, true);

    // Validation cơ bản
    if (empty($name) || empty($description) || empty($brand) || empty($category_slug)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu thông tin bắt buộc."]);
        exit();
    }

    if (!is_array($variants) || count($variants) == 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Phải có ít nhất 1 biến thể."]);
        exit();
    }

    // === BƯỚC 2: TÌM CATEGORY_ID ===
    $category_map = [
        'phone' => 1,
        'laptop' => 2,
        'tablet' => 3,
        'accessory' => 4
    ];
    $category_id = $category_map[$category_slug] ?? 1;

    // === BƯỚC 3: TẠO JSON FEATURES ===
    $features = [];
    if ($processor) $features['processor'] = $processor;
    if ($ram) $features['ram'] = $ram;
    if ($storage) $features['storage'] = $storage;
    if ($screen) $features['screen'] = $screen;
    $features_json = json_encode($features, JSON_UNESCAPED_UNICODE);

    // === BƯỚC 4: XỬ LÝ ẢNH ===
    $upload_dir = __DIR__ . '/../uploads/';
    $base_url = 'http://localhost/techstore-api/uploads/';

    $new_image_urls = [];
    if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
        $file_count = count($_FILES['images']['name']);
        for ($i = 0; $i < $file_count; $i++) {
            if ($_FILES['images']['error'][$i] == UPLOAD_ERR_OK) {
                $tmp_name = $_FILES['images']['tmp_name'][$i];
                $original_name = $_FILES['images']['name'][$i];
                $file_ext = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
                
                // Validate extension
                if (!in_array($file_ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                    continue;
                }

                $unique_name = uniqid('product_', true) . '.' . $file_ext;
                $dest_path = $upload_dir . $unique_name;

                if (move_uploaded_file($tmp_name, $dest_path)) {
                    $new_image_urls[] = $base_url . $unique_name;
                }
            }
        }
    }

    // Kết hợp ảnh cũ + ảnh mới
    $all_images = array_merge($existing_images, $new_image_urls);
    if (count($all_images) == 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Phải có ít nhất 1 hình ảnh."]);
        exit();
    }

    $base_image = $all_images[0];

    // === BƯỚC 5: BẮT ĐẦU TRANSACTION ===
    $conn->begin_transaction();

    // === 5.1: CẬP NHẬT BẢNG PRODUCTS ===
    $update_product_sql = "
        UPDATE Products 
        SET 
            name = ?, 
            description = ?, 
            brand = ?, 
            model = ?, 
            category_id = ?, 
            features = ?, 
            base_image = ?,
            status = ?
        WHERE id = ?
    ";
    $stmt_product = $conn->prepare($update_product_sql);
    $stmt_product->bind_param(
        "ssssisssi",
        $name,
        $description,
        $brand,
        $model,
        $category_id,
        $features_json,
        $base_image,
        $status,
        $product_id
    );
    $stmt_product->execute();
    $stmt_product->close();

    // === 5.2: XÓA TẤT CẢ VARIANTS CŨ ===
    // (Cách đơn giản nhất để cập nhật biến thể là xóa hết cái cũ đi và thêm lại cái mới)
    $delete_variants_sql = "DELETE FROM ProductVariants WHERE product_id = ?";
    $stmt_del_variants = $conn->prepare($delete_variants_sql);
    $stmt_del_variants->bind_param("i", $product_id);
    $stmt_del_variants->execute();
    $stmt_del_variants->close();

    // === 5.3: THÊM LẠI VARIANTS MỚI ===
    $insert_variant_sql = "
        INSERT INTO ProductVariants 
        (product_id, size, color_name, color_hex, price, original_price, sku, stock_quantity) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";
    $stmt_variant = $conn->prepare($insert_variant_sql);

    foreach ($variants as $v) {
        $size = $v['size'] ?? '';
        $color_name = $v['color_name'] ?? '';
        $color_hex = $v['color_hex'] ?? '#000000';
        $price = floatval($v['price'] ?? 0);
        $original_price = isset($v['original_price']) ? floatval($v['original_price']) : null;
        $sku = $v['sku'] ?? null;
        $stock_quantity = intval($v['stock_quantity'] ?? 0);

        $stmt_variant->bind_param(
            "isssddsi",
            $product_id,
            $size,
            $color_name,
            $color_hex,
            $price,
            $original_price,
            $sku,
            $stock_quantity
        );
        $stmt_variant->execute();
    }
    $stmt_variant->close();

    // === 5.4: XÓA TẤT CẢ ẢNH CŨ ===
    $delete_images_sql = "DELETE FROM ProductImages WHERE product_id = ?";
    $stmt_del_images = $conn->prepare($delete_images_sql);
    $stmt_del_images->bind_param("i", $product_id);
    $stmt_del_images->execute();
    $stmt_del_images->close();

    // === 5.5: THÊM LẠI TẤT CẢ ẢNH (CŨ + MỚI) ===
    $insert_image_sql = "INSERT INTO ProductImages (product_id, image_url) VALUES (?, ?)";
    $stmt_image = $conn->prepare($insert_image_sql);
    
    foreach ($all_images as $img_url) {
        $stmt_image->bind_param("is", $product_id, $img_url);
        $stmt_image->execute();
    }
    $stmt_image->close();

    // === COMMIT ===
    $conn->commit();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Cập nhật sản phẩm thành công!",
        "product_id" => $product_id
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi server: " . $e->getMessage()
    ]);
}

$conn->close();
?>