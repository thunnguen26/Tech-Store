-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 08, 2026 lúc 02:28 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `techstore`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cartitems`
--

CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cartitems`
--

INSERT INTO `cartitems` (`id`, `cart_id`, `variant_id`, `quantity`, `added_at`) VALUES
(70, 4, 39, 6, '2025-12-06 05:18:04'),
(71, 8, 44, 45, '2025-12-06 10:54:41'),
(73, 8, 54, 1, '2025-12-25 00:59:40'),
(74, 8, 39, 2, '2025-12-25 01:00:39'),
(75, 4, 56, 16, '2026-01-07 23:52:17'),
(76, 4, 66, 19, '2026-01-07 23:54:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(4, 2, '2025-11-19 05:04:10'),
(5, 8, '2025-11-20 13:54:04'),
(6, 9, '2025-11-20 14:03:06'),
(8, 1, '2025-11-27 05:29:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(2, 'Laptop'),
(3, 'Máy tính bảng'),
(4, 'Phụ kiện'),
(1, 'Điện thoại');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderitems`
--

INSERT INTO `orderitems` (`id`, `order_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(17, 15, 39, 1, 27000000.00),
(18, 16, 61, 1, 30000000.00),
(19, 17, 56, 1, 26500000.00),
(20, 18, 54, 1, 36000000.00),
(21, 19, 44, 1, 30000000.00),
(22, 20, 57, 1, 11000000.00),
(23, 21, 58, 1, 27500000.00),
(24, 22, 62, 1, 25450000.00),
(25, 23, 63, 1, 7000000.00),
(26, 24, 44, 1, 30000000.00),
(27, 25, 58, 1, 27500000.00),
(28, 26, 66, 1, 28000000.00),
(29, 27, 63, 2, 7000000.00),
(30, 28, 65, 1, 23000000.00),
(31, 29, 66, 1, 28000000.00),
(32, 30, 65, 1, 23000000.00),
(33, 31, 57, 1, 11000000.00),
(34, 32, 54, 1, 36000000.00),
(35, 33, 54, 1, 36000000.00),
(36, 34, 57, 3, 11000000.00),
(37, 35, 58, 1, 27500000.00),
(38, 36, 44, 1, 30000000.00),
(39, 37, 57, 1, 11000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_code` varchar(50) DEFAULT NULL,
  `customer_first_name` varchar(100) NOT NULL,
  `customer_last_name` varchar(100) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_district` varchar(100) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `order_notes` text DEFAULT NULL,
  `status` enum('pending','processing','shipped','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_code`, `customer_first_name`, `customer_last_name`, `customer_email`, `customer_phone`, `shipping_address`, `shipping_city`, `shipping_district`, `subtotal`, `shipping_fee`, `discount_amount`, `total_amount`, `payment_method`, `order_notes`, `status`, `created_at`) VALUES
(15, 2, 'ORD-7BD47E8ADB3D', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 27000000.00, 0.00, 0.00, 27000000.00, 'cod', 'Đóng gói kĩ càng', 'completed', '2025-11-20 13:43:41'),
(16, 2, 'ORD-9C31F11E00F8', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 30000000.00, 0.00, 0.00, 30000000.00, 'cod', 'Chú ý vận chuyển', 'completed', '2025-11-20 13:44:55'),
(17, 2, 'ORD-9F4161AA976A', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 26500000.00, 0.00, 0.00, 26500000.00, 'cod', 'Chú ý vận chuyển', 'completed', '2025-11-20 13:45:58'),
(18, 8, 'ORD-1FD0FDA68ACB', 'Nguyễn Văn', 'An', 'an@gmail.com', '0905766893', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 36000000.00, 0.00, 0.00, 36000000.00, 'cod', 'Chú ý vận chuyển', 'completed', '2025-11-20 13:56:35'),
(19, 8, 'ORD-97CBEE71DDD6', 'Nguyễn Văn', 'An', 'an@gmail.com', '0905766893', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 30000000.00, 0.00, 0.00, 30000000.00, 'cod', 'Giao hàng cẩn thận', 'completed', '2025-11-20 13:57:09'),
(20, 8, 'ORD-9F4E33ED8F5B', 'Nguyễn Văn', 'An', 'an@gmail.com', '0905766893', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 11000000.00, 0.00, 0.00, 11000000.00, 'cod', 'Đóng gói cẩn thận', 'completed', '2025-11-20 13:57:39'),
(21, 9, 'ORD-DC43EE0E3521', 'Trần Văn', 'Tri', 'tri@gmail.com', '0908124760', '33 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 27500000.00, 0.00, 0.00, 27500000.00, 'cod', 'Vận chuyển cẩn thận', 'completed', '2025-11-20 14:04:31'),
(22, 9, 'ORD-3ECCBEAB04DE', 'Trần Văn', 'Tri', 'tri@gmail.com', '0908124760', '33 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 25450000.00, 0.00, 0.00, 25450000.00, 'cod', 'Chú ý vận chuyển', 'completed', '2025-11-20 14:05:12'),
(23, 9, 'ORD-F44F7015AF97', 'Trần Văn', 'Tri', 'tri@gmail.com', '0908124760', '33 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 7000000.00, 0.00, 0.00, 7000000.00, 'cod', 'Chú ý giao hàng cẩn thận', 'completed', '2025-11-20 14:06:04'),
(24, 2, 'ORD-FFA35038070A', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0985563320', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 30000000.00, 0.00, 0.00, 30000000.00, 'cod', 'Chú ý cẩn thận', 'completed', '2025-11-25 13:21:06'),
(25, 2, 'ORD-D5F866E79752', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 27500000.00, 0.00, 0.00, 27500000.00, 'cod', 'Cẩn thận', 'completed', '2025-11-28 20:42:27'),
(26, 2, 'ORD-4E99FE7DA01D', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 28000000.00, 0.00, 0.00, 28000000.00, 'cod', 'Giao hàng cẩn thận', 'completed', '2025-12-02 11:56:55'),
(27, 2, 'ORD-F876FA242FD9', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 14000000.00, 0.00, 0.00, 14000000.00, 'cod', '', 'cancelled', '2025-12-02 12:10:26'),
(28, 2, 'ORD-63BCD46FAFCB', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 23000000.00, 0.00, 0.00, 23000000.00, 'cod', 'Chý ý giao hàng', 'completed', '2025-12-03 03:09:35'),
(29, 9, 'ORD-C43FD110B998', 'Trần Văn', 'Tri', 'tri@gmail.com', '0985563320', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 28000000.00, 0.00, 0.00, 28000000.00, 'cod', 'Cẩn thận', 'completed', '2025-12-03 03:29:29'),
(30, 9, 'ORD-E978F7D56815', 'Trần Văn', 'Tri', 'tri@gmail.com', '0985563320', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 23000000.00, 0.00, 0.00, 23000000.00, 'cod', 'Chú ý giao hàng cẩn thận', 'completed', '2025-12-03 03:33:22'),
(31, 9, 'ORD-14113347738C', 'Trần Văn', 'Tri', 'thuan@gmail.com', '0985563320', '224 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 11000000.00, 0.00, 0.00, 11000000.00, 'cod', 'Cẩn thận', 'cancelled', '2025-12-03 03:42:01'),
(32, 8, 'ORD-3F759F12532B', 'Nguyễn Văn', 'An', 'an@gmail.com', '0908124760', '33 Trần Đại Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 36000000.00, 0.00, 0.00, 36000000.00, 'cod', 'Chú ý', 'completed', '2025-12-03 08:37:20'),
(33, 2, 'ORD-2A4E52C9584F', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 36000000.00, 0.00, 0.00, 36000000.00, 'cod', 'Cẩn thận', 'completed', '2025-12-04 02:48:56'),
(34, 1, 'ORD-08A6FC014B8C', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '12 Nam Kì Khởi Nghĩa', 'Đà Nẵng', 'Ngũ Hành Sơn', 33000000.00, 0.00, 0.00, 33000000.00, 'cod', '', 'completed', '2025-12-06 10:55:06'),
(35, 1, 'ORD-33A9872B60FD', 'Nguyễn Phước', 'Thuần', 'thunnguen26@gmail.com', '0905766893', '22 Phan Đình Thông', 'Đà Nẵng', 'Ngũ Hành Sơn', 27500000.00, 0.00, 0.00, 27500000.00, 'cod', '', 'completed', '2025-12-25 01:00:06'),
(36, 2, 'ORD-C0B2E550C7EA', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '22 Phan Đình Thông', 'Đà Nẵng', 'Ngũ Hành Sơn', 30000000.00, 0.00, 0.00, 30000000.00, 'cod', '', 'completed', '2026-01-08 01:11:52'),
(37, 2, 'ORD-77AFD5EFF2F8', 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '22 Phan Đình Thông', 'Đà Nẵng', 'Ngũ Hành Sơn', 11000000.00, 0.00, 0.00, 11000000.00, 'cod', '', 'completed', '2026-01-08 01:13:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `passwordresets`
--

CREATE TABLE `passwordresets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productimages`
--

CREATE TABLE `productimages` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `productimages`
--

INSERT INTO `productimages` (`id`, `product_id`, `image_url`) VALUES
(19, 25, 'http://localhost/techstore-api/uploads/prod_691944cd7e3ad4.45149484.jpg'),
(20, 25, 'http://localhost/techstore-api/uploads/prod_691944cd7ed485.35667362.jpg'),
(21, 25, 'http://localhost/techstore-api/uploads/prod_691944cd7f6752.75842849.jpg'),
(22, 25, 'http://localhost/techstore-api/uploads/prod_691944cd806488.77033506.jpg'),
(23, 25, 'http://localhost/techstore-api/uploads/prod_691944cd817a44.68209534.jpg'),
(24, 25, 'http://localhost/techstore-api/uploads/prod_691944cd8216a8.21385697.jpg'),
(30, 26, 'http://localhost/techstore-api/uploads/prod_6919471c24e9d5.37423850.jpg'),
(31, 26, 'http://localhost/techstore-api/uploads/prod_6919471c257f31.63608002.webp'),
(32, 26, 'http://localhost/techstore-api/uploads/prod_6919471c2663f7.11676272.jpg'),
(33, 26, 'http://localhost/techstore-api/uploads/prod_6919471c26f542.93062317.jpg'),
(34, 26, 'http://localhost/techstore-api/uploads/prod_6919471c284bc1.28759646.jpg'),
(63, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d56561.03724544.jpg'),
(64, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d603d3.85463921.jpg'),
(65, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d685c1.97801596.jpg'),
(66, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d6fe97.32174924.jpg'),
(67, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d78151.18798899.jpg'),
(68, 24, 'http://localhost/techstore-api/uploads/prod_691941b8d809c6.97919539.jpg'),
(69, 27, 'http://localhost/techstore-api/uploads/prod_691d5612bf8f80.73860531.webp'),
(70, 27, 'http://localhost/techstore-api/uploads/prod_691d5612c0fb62.35046216.webp'),
(71, 27, 'http://localhost/techstore-api/uploads/prod_691d5612c1cea9.98795926.webp'),
(72, 27, 'http://localhost/techstore-api/uploads/prod_691d5612c28131.67693239.png'),
(73, 27, 'http://localhost/techstore-api/uploads/prod_691d5612c357a7.54467756.webp'),
(74, 27, 'http://localhost/techstore-api/uploads/prod_691d5612c41786.20010709.webp'),
(75, 28, 'http://localhost/techstore-api/uploads/prod_691da2d8aa24e8.29737909.jpg'),
(76, 28, 'http://localhost/techstore-api/uploads/prod_691da2d8ab39c2.32313724.jpg'),
(77, 28, 'http://localhost/techstore-api/uploads/prod_691da2d8ac1965.34674440.jpg'),
(78, 28, 'http://localhost/techstore-api/uploads/prod_691da2d8ad06b8.67971481.webp'),
(79, 29, 'http://localhost/techstore-api/uploads/prod_691da5a0ed2808.41678709.webp'),
(80, 29, 'http://localhost/techstore-api/uploads/prod_691da5a0edbe60.47534481.webp'),
(81, 29, 'http://localhost/techstore-api/uploads/prod_691da5a0ee8201.59013743.webp'),
(82, 29, 'http://localhost/techstore-api/uploads/prod_691da5a0ef22d8.42994364.webp'),
(83, 29, 'http://localhost/techstore-api/uploads/prod_691da5a1018191.41253410.webp'),
(84, 29, 'http://localhost/techstore-api/uploads/prod_691da5a10243e3.68513855.webp'),
(85, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2aee761.72513591.jpg'),
(86, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2afcd31.84402346.jpg'),
(87, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2b23140.25020235.jpg'),
(88, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2b2d291.77653168.jpg'),
(89, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2b37659.26558424.jpg'),
(90, 30, 'http://localhost/techstore-api/uploads/prod_691f15b2b41b32.53871362.jpg'),
(91, 31, 'http://localhost/techstore-api/uploads/prod_691f18a09cbe45.71284520.jpg'),
(92, 31, 'http://localhost/techstore-api/uploads/prod_691f18a09d78e8.48408847.jpg'),
(93, 31, 'http://localhost/techstore-api/uploads/prod_691f18a09e80d5.52098611.jpg'),
(94, 31, 'http://localhost/techstore-api/uploads/prod_691f18a09fedb7.20904507.webp'),
(95, 31, 'http://localhost/techstore-api/uploads/prod_691f18a0a0bb14.84877510.webp'),
(96, 32, 'http://localhost/techstore-api/uploads/prod_691f1a20dba338.84085765.jpg'),
(97, 32, 'http://localhost/techstore-api/uploads/prod_691f1a20dc45e7.68809799.webp'),
(98, 32, 'http://localhost/techstore-api/uploads/prod_691f1a20dd7cd9.13581842.webp'),
(99, 32, 'http://localhost/techstore-api/uploads/prod_691f1a20df37d9.28634930.webp'),
(100, 32, 'http://localhost/techstore-api/uploads/prod_691f1a20e022e9.83364621.jpg'),
(106, 33, 'http://localhost/techstore-api/uploads/prod_691f2a2baa1815.94631682.jpg'),
(107, 33, 'http://localhost/techstore-api/uploads/prod_691f2a2bab2e61.77614299.webp'),
(108, 33, 'http://localhost/techstore-api/uploads/prod_691f2a2babbcc1.46453652.webp'),
(109, 33, 'http://localhost/techstore-api/uploads/prod_691f2a2bac7b38.21719120.webp'),
(110, 33, 'http://localhost/techstore-api/uploads/prod_691f2a2baceae0.15562879.webp'),
(111, 34, 'http://localhost/techstore-api/uploads/prod_692a12682613e7.02049578.jpg'),
(112, 34, 'http://localhost/techstore-api/uploads/prod_692a1268272f76.67469541.jpg'),
(113, 34, 'http://localhost/techstore-api/uploads/prod_692a1268284fd2.89876808.jpg'),
(114, 34, 'http://localhost/techstore-api/uploads/prod_692a1268290747.60751967.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `status` enum('active','draft','archived') NOT NULL DEFAULT 'active',
  `features` text DEFAULT NULL,
  `base_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `brand`, `model`, `status`, `features`, `base_image`) VALUES
(24, 1, 'iPhone 17 Pro Max', '- Màn hình & Thiết kế\r\nMàn hình 6,9 inch với công nghệ ProMotion 120Hz.\r\nMặt trước phủ Ceramic Shield 2, chống trầy xước tốt hơn gấp 3 lần.\r\nThiết kế nguyên khối nhôm rèn sang trọng và chắc chắn.\r\n\r\n- Camera & Chụp ảnh\r\nHệ thống camera Pro tối ưu:\r\nCamera sau 48MP hoàn toàn mới, hỗ trợ zoom quang học 8x, phạm vi zoom rộng nhất từ trước đến nay trên iPhone.\r\n\r\n- Hiệu năng & Chip\r\nChip A19 Pro với GPU 6 nhân.\r\nHệ thống làm mát bằng hơi nước.\r\nHiệu năng cực nhanh, mượt mà.\r\n\r\n- Pin & Hệ điều hành\r\nThời lượng pin tốt nhất trên iPhone, hỗ trợ phát video lên đến 39 giờ.\r\niOS 26 với Apple Intelligence, giao diện mới và các tính năng thông minh hơn.', 'Apple', 'IP17', 'active', '{\"processor\":\"Chíp A19 Prov\",\"ram\":\"12 GB\",\"storage\":\"256GB\",\"screen\":\"6,9 inch - Super Retina XDR, OLED toàn màn hình.\"}', 'http://localhost/techstore-api/uploads/prod_691941b8d56561.03724544.jpg'),
(25, 1, 'iPhone 16 Plus', '-Thiết kế: Vỏ nhôm cấp hàng không vũ trụ, màn hình 6,7 inch, mặt trước Ceramic Shield bền bỉ, nút Action, cổng USB‑C.\r\n\r\n-Hệ điều hành & Trí tuệ nhân tạo: iOS 26 với Apple Intelligence, giao diện mới, tính năng thông minh hơn.\r\n\r\n-Camera: Camera Control giúp truy cập nhanh các công cụ chụp ảnh và quay video dễ dàng.\r\n\r\n-Hiệu năng: Chip A18 hỗ trợ Apple Intelligence, hiệu suất cao, chơi game mượt mà với tiết kiệm năng lượng.\r\n\r\n-Pin: Thời lượng sử dụng cả ngày, phát video lên đến 27 giờ.\r\n\r\n-Tương tác với Apple Vision Pro: Chụp ảnh và quay video không gian kỳ diệu, sau đó xem lại trên Apple Vision Pro.', 'Apple', 'IP16PLUS', 'active', '[]', 'http://localhost/techstore-api/uploads/prod_691944cd7e3ad4.45149484.jpg'),
(26, 1, 'iPhone Air', '-Màn hình: 6,5 inch với công nghệ ProMotion lên đến 120Hz.\r\n\r\n-Mặt trước: Lớp phủ Ceramic Shield 2, chống trầy xước tốt hơn gấp 3 lần.\r\n\r\n-Thiết kế: Titan siêu mỏng, siêu nhẹ.\r\n\r\n-Camera trước: Center Stage 18MP, nhiều cách căn chỉnh khung hình, chụp selfie nhóm thông minh, quay video Dual Capture (trước và sau đồng thời), cùng nhiều tính năng khác.\r\n\r\n-Camera chính: Fusion 48MP, zoom quang học 2x, kết hợp sức mạnh của hai camera cao cấp trong một.\r\n\r\n-Hiệu năng: Chip A19 Pro với GPU 5 nhân, hiệu năng cao cho tác vụ chuyên nghiệp và chơi game nâng cao.\r\n\r\n-Pin: Thời lượng cả ngày, phát video lên đến 27 giờ.\r\n\r\n-Hệ điều hành & Trí tuệ nhân tạo: iOS 26 với Apple Intelligence, giao diện mới, tính năng thông minh hơn.', 'Apple', 'IPAIR', 'active', '{\"processor\":\"Chip A19 Pro\",\"ram\":\"8GB\",\"storage\":\"256GB\",\"screen\":\"6.5 inches-Super Retina XDR\"}', 'http://localhost/techstore-api/uploads/prod_6919471c24e9d5.37423850.jpg'),
(27, 2, 'MacBook Air 13', 'MacBook Air 13 là dòng máy tính xách tay mỏng nhẹ, nổi tiếng với thiết kế thanh lịch, hiệu năng tốt cho công việc văn phòng, học tập, làm việc hàng ngày, đồng thời có thời lượng pin cao, khả năng di động tốt. Có nhiều thế hệ với các chip Apple Silicon (M1, M2, M3, M4), mỗi thế hệ đều cải tiến hiệu năng, khả năng đồ họa, tiết kiệm điện,...', 'Apple', 'MB13', 'active', '{\"processor\":\"Apple M4 – CPU 10 lõi (4 hiệu năng + 6 tiết kiệm), GPU 8 hoặc 10 lõi, Neural Engine 16 lõi\",\"ram\":\"16GB\",\"storage\":\"256GB\",\"screen\":\"Màn hình Liquid Retina 13,6″, IPS, 2560×1664, 500 nit, True Tone\"}', 'http://localhost/techstore-api/uploads/prod_691d5612bf8f80.73860531.webp'),
(28, 4, ' AirPods Max', 'Giới thiệu AirPods Max — sự cân bằng hoàn hảo giữa âm thanh trung thực sống động và sự kỳ diệu dễ dàng của AirPods. Trải nghiệm nghe nhạc cá nhân đỉnh cao đã có mặt.\r\n\r\nChip Apple H1, Chống ồn chủ động với chế độ Transparency\r\nÂm thanh không gian cho âm thanh như trong rạp hát bao quanh bạn, Thiết kế tuyệt đẹp với sự vừa vặn đặc biệt\r\nDigital Crown cho phép bạn điều khiển âm lượng chính xác, chuyển bài hát, trả lời cuộc gọi và kích hoạt Siri.\r\nPin lên đến 20 giờ, hỗ trợ Sạc nhanh (5 phút = 1,5 giờ nghe)', 'Apple', 'AIRM', 'active', '{\"processor\":\"Chip tai nghe Apple H1 (mỗi chụp tai)\"}', 'http://localhost/techstore-api/uploads/prod_691da2d8aa24e8.29737909.jpg'),
(29, 3, 'iPad Pro M4 11 inch', 'iPad Pro M4 là mẫu máy tính bảng cao cấp và chuyên nghiệp với chip M4 cho hiệu năng mạnh mẽ vượt bậc. Thế hệ iPad Pro mới còn sở hữu thiết kế mới mảnh mai hơn cùng màn hình Ultra Retina XDR siêu đẹp mắt để nâng tầm trải nghiệm. Tuy mỏng nhẹ hơn nhưng chiếc iPad Pro M4 11 inch mới này vẫn đảm bảo có thể hoạt động liên tục cả ngày với viên pin 31.29Wh.', 'Apple', 'IPDM4', 'active', '{\"processor\":\"Chip M4 - \\t CPU 9 lõi với 3 lõi hiệu năng và 6 lõi tiết kiệm điện\",\"ram\":\"8GB\",\"storage\":\"256 GB\",\"screen\":\"11 inch - Ultra Retina XDR.\"}', 'http://localhost/techstore-api/uploads/prod_691da5a0ed2808.41678709.webp'),
(30, 1, 'Samsung Galaxy S25 Ultra', 'Samsung Galaxy S25 Ultra sở hữu thiết kế khung titanium cứng cáp, bền bỉ và sang trọng. Màn hình Dynamic AMOLED 2X 6,9 inch với độ sáng cao, màu sắc sống động và tần số quét 1–120Hz cho trải nghiệm mượt mà trong mọi tác vụ.\r\n\r\nMáy được trang bị camera chính 200MP, kết hợp cảm biến lớn và thuật toán AI mới, cho khả năng chụp đêm tốt hơn và zoom quang học chất lượng cao. Hệ thống camera phụ nâng cấp giúp quay video ổn định, rõ nét trong nhiều điều kiện.\r\n\r\nHiệu năng mạnh mẽ nhờ chip Snapdragon 8 Elite, tối ưu cho AI, chơi game và xử lý đa nhiệm. Pin dung lượng lớn mang lại thời gian sử dụng dài, hỗ trợ sạc nhanh và sạc không dây.\r\n\r\nGalaxy S25 Ultra tiếp tục hỗ trợ S Pen, giúp ghi chú, phác thảo và thao tác chính xác hơn. Tính năng AI thế hệ mới của Samsung giúp tăng trải nghiệm: dịch trực tiếp, chỉnh sửa ảnh thông minh, hỗ trợ công việc và sáng tạo.', 'Samsung', 'SSS25', 'active', '[\"Bộ xử lý: Snapdragon 8 Elite dành cho Galaxy (3nm)\",\"RAM: 12 GB\",\"Bộ nhớ: 256 GB\",\"Màn hình: 6.9 inches - Dynamic AMOLED 2X\"]', 'http://localhost/techstore-api/uploads/prod_691f15b2aee761.72513591.jpg'),
(31, 1, 'Xiaomi 15 Ultra', 'Xiaomi 15 Ultra 16GB 512GB trang bị chip Snapdragon® 8 Elite mạnh mẽ và RAM lên đến 16GB, người dùng sẽ có trải nghiệm mượt mà và dung lượng lưu trữ 512GB. Thiết bị này được nâng cấp nhờ trang bị ống kính tele có độ phân giải cao đến 200 megapixel. Viên pin lớn 5410 mAh, sẽ giúp nâng cao thời gian dùng điện thoại của người dùng. Đồng thời, Mi 15 Ultra trang bị tấm nền AMOLED, sẽ đem lại chất lượng hiển thị nổi bật và chi tiết về màu sắc.', 'Xiaomi', 'XM15UT', 'active', '[\"Bộ xử lý: Snapdragon 8 Elite (Tiến trình sản xuất 3nm)\",\"RAM: 16 GB\",\"Bộ nhớ: 512 GB\",\"Màn hình: 6,73 inch - Công nghệ LTPO AMOLED\"]', 'http://localhost/techstore-api/uploads/prod_691f18a09cbe45.71284520.jpg'),
(32, 4, 'Tai nghe Bluetooth Apple AirPods Pro 3 2025', 'AirPods Pro 3 ra mắt tháng 9/2025, mang đến bước tiến lớn với khả năng khử tiếng ồn chủ động gấp đôi thế hệ trước, thiết kế gọn nhẹ và pin bền bỉ vượt trội. Apple tích hợp cảm biến đo nhịp tim trực tiếp trên tai nghe, biến AirPods Pro thế hệ thứ 3 thành trợ lý sức khỏe thông minh cho người dùng.\r\n\r\nCùng với chất lượng âm thanh ấn tượng, Airpods Pro 3 hứa hẹn nâng tầm trải nghiệm nghe nhạc và giao tiếp hàng ngày.', 'Apple', 'APP3', 'active', '[\"Bộ xử lý: Chip Apple H2\"]', 'http://localhost/techstore-api/uploads/prod_691f1a20dba338.84085765.jpg'),
(33, 1, 'OPPO Find X9 12GB 256GB', 'OPPO Find X9 được trang bị chip Dimensity 9500 5G tối đa 4.21GHz cùng RAM 12GB mang đến hiệu năng mạnh mẽ, phục vụ nhu cầu đa nhiệm, chơi game và quay phim. Máy sở hữu màn hình AMOLED 6.59 inch, độ phân giải 1.5K (1256 x 2760), tần số quét 120Hz, hỗ trợ hiển thị hình ảnh sắc nét. Kèm theo đó là thiết kế viền siêu mỏng, tạo cho người dùng trải nghiệm thị giác đắm chìm.', 'OPPO', 'OPX9', 'active', '{\"processor\":\"Dimensity 9500 5G\",\"ram\":\"12GB\",\"storage\":\"256 GB\",\"screen\":\"6.59 inches\"}', 'http://localhost/techstore-api/uploads/prod_691f2a2baa1815.94631682.jpg'),
(34, 1, 'iPhone 14 Pro Max', 'iPhone 14 Pro Max có sự cải thiện lớn màn hình so với iPhone 13 Pro Max. Sự khác biệt giữ phiên bản iPhone 14 Pro Max 256GB và bản tiêu chuẩn 128GB chỉ là bộ nhớ trong. \r\n\r\nKích thước màn hình iPhone 14 Pro Max vẫn là 6.1 inch tuy nhiên phần “tai thỏ” đã được thay thế bằng một đường cắt hình viên thuốc. Apple gọi đây là Dynamic Island - nơi chứa camera Face ID và một đường cắt hình tròn thứ hai cho camera trước.\r\n\r\nNgoài ra, iPhone 14 Pro Max có tính năng màn hình luôn bật hoạt động (Always-on Display) với tiện ích màn hình khóa mới trên iOS 16. Người dùng có thể xem các thông tin như lời nhắc, sự kiện lịch và thời tiết mà không cần bật máy lên để xem. Thậm chí, có một trạng thái ngủ cho hình nền, trạng thái này sẽ làm tối hình nền để sử dụng ít pin hơn.\r\n\r\niPhone 14 Pro Max được trang bị bộ vi xử lý Apple A16 Bionic. Apple đã tập trung vào hiệu quả sử dụng năng lượng, màn hình và camera với con chip mới của mình. CPU sáu nhân bao gồm hai nhân hiệu suất cao sử dụng năng lượng thấp hơn 20% và bốn nhân tiết kiệm pin chỉ sử dụng một phần ba năng lượng so với chip của các đối thủ cạnh tranh.', 'Apple', 'IP14PRM', 'active', '[\"Bộ xử lý: Apple A16 Bionic 6 nhân\",\"RAM: 6 GB\",\"Bộ nhớ: 256 GB\",\"Màn hình: 6.7 inches -  Super Retina XDR OLED\"]', 'http://localhost/techstore-api/uploads/prod_692a12682613e7.02049578.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productvariants`
--

CREATE TABLE `productvariants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(100) DEFAULT NULL,
  `color_name` varchar(100) DEFAULT NULL,
  `color_hex` varchar(20) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `original_price` decimal(12,2) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `productvariants`
--

INSERT INTO `productvariants` (`id`, `product_id`, `size`, `color_name`, `color_hex`, `price`, `original_price`, `sku`, `stock_quantity`) VALUES
(39, 25, '256GB', 'Xanh Lưu Ly', '#6f90dc', 27000000.00, 28499000.00, 'IP16-256-XLLP', 25),
(40, 25, '256GB', 'Đen', '#000000', 27000000.00, 28499000.00, 'IP16-256-DP', 19),
(41, 25, '256GB', 'Xanh Mòng Két', '#96d4c1', 27000000.00, 28499000.00, 'IP16-256-XMKP', 18),
(44, 26, '256GB', 'Trắng mây', '#ebebeb', 30000000.00, 31799000.00, 'IP-256-TMAIR', 21),
(45, 26, '256GB', 'Đen Không Gian', '#3b3b3b', 30000000.00, 31798000.00, 'IP-256-DKGAIR', 18),
(54, 24, '256GB', 'Cam', '#fe8b20', 36000000.00, 38000000.00, 'IP17-256-CAM', 28),
(55, 24, '1T', 'Bạc', '#d1d1d1', 36000000.00, 38000000.00, 'IP17-256-BAC', 30),
(56, 27, '256GB', 'Xanh Da Trời', '#c2ebff', 26500000.00, 28000000.00, 'MB-256-AIR13', 14),
(57, 28, ' ', 'Xanh lá cây', '#dbffe4', 11000000.00, 12000000.00, 'AP-XLC', 29),
(58, 29, '256GB', 'Đen', '#000000', 27500000.00, 29000000.00, 'IPD-256-D', 22),
(59, 29, '1T', 'Đen', '#000000', 40000000.00, 41500000.00, 'IPD-1T-D', 12),
(60, 30, '256 GB', 'Đen', '#000000', 28000000.00, 30000000.00, 'SS-256-S25D', 22),
(61, 30, '512 GB', 'Đen', '#000000', 30000000.00, 32000000.00, 'SS-512-S25D', 20),
(62, 31, '512 GB', 'Bạc', '#c2c2c2', 25450000.00, 26000000.00, 'XM-512-15UT', 27),
(63, 32, ' ', 'Trắng', '#ffffff', 7000000.00, 7800000.00, 'AP-PRO3-T25', 32),
(65, 33, '256 GB', 'Đen', '#000000', 23000000.00, 25000000.00, 'OP-256-X9', 20),
(66, 34, '256 GB', 'Đen', '#000000', 28000000.00, 30000000.00, 'IP14-256-PRM', 16);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL COMMENT 'Từ 1 đến 5',
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `order_id`, `rating`, `comment`, `created_at`) VALUES
(7, 2, 27, 17, 5, 'Sản phẩm thật sự vượt mong đợi: chất lượng tốt, sử dụng mượt mà và mang lại trải nghiệm rất hài lòng.', '2025-11-20 13:49:05'),
(8, 2, 30, 16, 5, 'Sản phẩm cho cảm giác dùng rất đã: gọn, chắc, phản hồi nhanh và đúng như kỳ vọng. Không phô trương nhưng hiệu quả rõ ràng, tạo thiện cảm ngay từ lần đầu trải nghiệm.', '2025-11-20 13:50:46'),
(9, 2, 25, 15, 5, 'Sản phẩm thật sự ấn tượng: mọi chi tiết được chăm chút tỉ mỉ, vận hành mượt mà và mang lại trải nghiệm dễ chịu.', '2025-11-20 13:51:18'),
(10, 8, 28, 20, 5, 'Sản phẩm tốt, âm thanh hay và trong trẻo', '2025-11-20 13:58:52'),
(11, 8, 26, 19, 5, 'Sản phẩm mang lại trải nghiệm mượt mà, chắc chắn và đáng tin cậy. Rất hài lòng với chất lượng tổng thể.', '2025-11-20 13:59:18'),
(12, 8, 24, 18, 5, 'Thiết kế tinh tế, vận hành ổn định, tạo cảm giác chuyên nghiệp và chất lượng ngay từ lần đầu trải nghiệm.', '2025-11-20 13:59:37'),
(13, 9, 32, 23, 5, 'Thiết kế nhỏ gọn, pin lâu và kết nối ổn định. Dùng cực tiện lợi.”', '2025-11-20 14:07:45'),
(14, 9, 31, 22, 5, 'Gọn, nhẹ, thao tác nhanh chóng, cảm giác cầm rất vừa tay.', '2025-11-20 14:08:04'),
(15, 9, 29, 21, 5, 'Chất lượng vượt mong đợi, màn hình sáng, âm thanh rõ ràng, dùng thích ngay từ lần đầu.', '2025-11-20 14:08:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `created_at`, `role`) VALUES
(1, 'Admin', 'Admin', 'admin@gmail.com', '0985563341', '$2y$10$FcHMffjCnZrAgaFtGF55r.xwQudj7SqvwZNK1WbIOYsiRCNWjIlha', '2024-01-14 12:45:47', 'admin'),
(2, 'Nguyễn Phước', 'Thuần', 'thuan@gmail.com', '0981664778', '$2y$10$0fbQePPU3ORubrRKU/Nl7ufb7Tz/v0zHM8To5pJ3v/SmWCGOWyxUy', '2025-11-03 03:11:53', 'customer'),
(8, 'Nguyễn Văn', 'An', 'an@gmail.com', '0905766893', '$2y$10$hG4pp1J2JRvruVEk504/bOyfwdNKlnNN3YXVJgolj3ZHRaL4tFAFq', '2025-11-20 13:53:32', 'customer'),
(9, 'Trần Văn', 'Tri', 'tri@gmail.com', '0908124765', '$2y$10$1PF2.DprIl25NvEXft2Nxu2HAyZDGxxXJ6AHuGBgd2aTMjlwxGL96', '2025-11-20 14:02:46', 'customer');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `passwordresets`
--
ALTER TABLE `passwordresets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Chỉ mục cho bảng `productimages`
--
ALTER TABLE `productimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `passwordresets`
--
ALTER TABLE `passwordresets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `productimages`
--
ALTER TABLE `productimages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  ADD CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `productvariants` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `productvariants` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `productimages`
--
ALTER TABLE `productimages`
  ADD CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  ADD CONSTRAINT `productvariants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
