-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-03-2023 a las 13:57:13
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `school_stage_project`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `addresses`
--

CREATE TABLE `addresses` (
  `id_addresses` int(11) NOT NULL,
  `state` varchar(50) NOT NULL,
  `town` varchar(25) NOT NULL,
  `commune` int(3) NOT NULL,
  `neighbourhood` varchar(25) NOT NULL,
  `street` int(11) NOT NULL,
  `number` varchar(20) NOT NULL,
  `complement` varchar(200) NOT NULL,
  `postal_code` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrators`
--

CREATE TABLE `administrators` (
  `id_administrator` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrators`
--

INSERT INTO `administrators` (`id_administrator`, `name`, `last_name`, `email`, `password`) VALUES
(1, 'Juan Jose', 'Huertas Botache', 'jjhuertasbotache', 'J1234567890j');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adr_list`
--

CREATE TABLE `adr_list` (
  `id_adr_list` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_adress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `designs`
--

CREATE TABLE `designs` (
  `id_designs` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `png` varchar(50) DEFAULT NULL,
  `ai` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `designs`
--

INSERT INTO `designs` (`id_designs`, `name`, `png`, `ai`) VALUES
(6, 'botella_cliente_camilo.png', 'imgs/botella_cliente_camilo.png', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `packing_colors`
--

CREATE TABLE `packing_colors` (
  `id_packing_colors` int(11) NOT NULL,
  `color` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `packing_colors`
--

INSERT INTO `packing_colors` (`id_packing_colors`, `color`) VALUES
(1, 'rojo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pucharse_orders`
--

CREATE TABLE `pucharse_orders` (
  `id_pucharse_orders` int(11) NOT NULL,
  `id_wine` int(11) NOT NULL,
  `id_real_design` int(11) NOT NULL,
  `msg` int(11) DEFAULT NULL,
  `id_packing_color` int(11) NOT NULL,
  `id_secondary_packing_color` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `id_delivery_place` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_vaucher` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `paid` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `real_designs`
--

CREATE TABLE `real_designs` (
  `id_real_designs` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `png` blob NOT NULL,
  `dxf` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secondary_packing_colors`
--

CREATE TABLE `secondary_packing_colors` (
  `id_secondary_packing_colors` int(11) NOT NULL,
  `color` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secondary_packing_colors`
--

INSERT INTO `secondary_packing_colors` (`id_secondary_packing_colors`, `color`) VALUES
(1, 'plateado'),
(2, 'blanco'),
(3, 'negro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id_tags` int(11) NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`id_tags`, `name`) VALUES
(1, 'cumpleaños'),
(2, 'aniversario'),
(3, 'amor'),
(4, 'casual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag_list`
--

CREATE TABLE `tag_list` (
  `id_tag_list` int(11) NOT NULL,
  `id_design` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `phone` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vouchers`
--

CREATE TABLE `vouchers` (
  `id_vouchers` int(11) NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wine_kinds`
--

CREATE TABLE `wine_kinds` (
  `id_wine_kinds` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `wine_kinds`
--

INSERT INTO `wine_kinds` (`id_wine_kinds`, `name`) VALUES
(1, 'moscatel'),
(2, 'tempranillo'),
(3, 'airen'),
(4, 'malbec'),
(5, 'carmenere'),
(6, 'merlot'),
(7, 'rose'),
(8, 'cabernet sauvignon ');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id_addresses`);

--
-- Indices de la tabla `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id_administrator`);

--
-- Indices de la tabla `adr_list`
--
ALTER TABLE `adr_list`
  ADD PRIMARY KEY (`id_adr_list`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_adress` (`id_adress`);

--
-- Indices de la tabla `designs`
--
ALTER TABLE `designs`
  ADD PRIMARY KEY (`id_designs`);

--
-- Indices de la tabla `packing_colors`
--
ALTER TABLE `packing_colors`
  ADD PRIMARY KEY (`id_packing_colors`);

--
-- Indices de la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  ADD PRIMARY KEY (`id_pucharse_orders`),
  ADD KEY `id_wine_kinds` (`id_wine`),
  ADD KEY `id_real_designs` (`id_real_design`),
  ADD KEY `id_packing_color` (`id_packing_color`),
  ADD KEY `id_secondary_packing_color` (`id_secondary_packing_color`),
  ADD KEY `id_delivery_place` (`id_delivery_place`),
  ADD KEY `id_vaucher` (`id_vaucher`);

--
-- Indices de la tabla `real_designs`
--
ALTER TABLE `real_designs`
  ADD PRIMARY KEY (`id_real_designs`);

--
-- Indices de la tabla `secondary_packing_colors`
--
ALTER TABLE `secondary_packing_colors`
  ADD PRIMARY KEY (`id_secondary_packing_colors`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id_tags`);

--
-- Indices de la tabla `tag_list`
--
ALTER TABLE `tag_list`
  ADD PRIMARY KEY (`id_tag_list`),
  ADD KEY `id_tags` (`id_design`),
  ADD KEY `id_designs` (`id_tag`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`);

--
-- Indices de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id_vouchers`);

--
-- Indices de la tabla `wine_kinds`
--
ALTER TABLE `wine_kinds`
  ADD PRIMARY KEY (`id_wine_kinds`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id_addresses` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `administrators`
--
ALTER TABLE `administrators`
  MODIFY `id_administrator` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `designs`
--
ALTER TABLE `designs`
  MODIFY `id_designs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `packing_colors`
--
ALTER TABLE `packing_colors`
  MODIFY `id_packing_colors` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  MODIFY `id_pucharse_orders` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `real_designs`
--
ALTER TABLE `real_designs`
  MODIFY `id_real_designs` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `secondary_packing_colors`
--
ALTER TABLE `secondary_packing_colors`
  MODIFY `id_secondary_packing_colors` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id_tags` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id_vouchers` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `wine_kinds`
--
ALTER TABLE `wine_kinds`
  MODIFY `id_wine_kinds` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adr_list`
--
ALTER TABLE `adr_list`
  ADD CONSTRAINT `id_adress` FOREIGN KEY (`id_adress`) REFERENCES `addresses` (`id_addresses`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_users`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  ADD CONSTRAINT `id_delivery_place` FOREIGN KEY (`id_delivery_place`) REFERENCES `addresses` (`id_addresses`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_packing_color` FOREIGN KEY (`id_packing_color`) REFERENCES `packing_colors` (`id_packing_colors`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_real_designs` FOREIGN KEY (`id_real_design`) REFERENCES `real_designs` (`id_real_designs`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_secondary_packing_color` FOREIGN KEY (`id_secondary_packing_color`) REFERENCES `secondary_packing_colors` (`id_secondary_packing_colors`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_vaucher` FOREIGN KEY (`id_vaucher`) REFERENCES `vouchers` (`id_vouchers`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_wine_kinds` FOREIGN KEY (`id_wine`) REFERENCES `wine_kinds` (`id_wine_kinds`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tag_list`
--
ALTER TABLE `tag_list`
  ADD CONSTRAINT `id_designs` FOREIGN KEY (`id_tag`) REFERENCES `designs` (`id_designs`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_tags` FOREIGN KEY (`id_design`) REFERENCES `tags` (`id_tags`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
