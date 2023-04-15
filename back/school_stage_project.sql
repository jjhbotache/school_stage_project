-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql10.freemysqlhosting.net
-- Tiempo de generación: 15-04-2023 a las 12:55:16
-- Versión del servidor: 5.5.62-0ubuntu0.14.04.1
-- Versión de PHP: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sql10612108`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `state` varchar(50) NOT NULL,
  `town` varchar(25) NOT NULL,
  `commune` int(3) NOT NULL,
  `neighbourhood` varchar(25) NOT NULL,
  `street` int(11) NOT NULL,
  `number` varchar(20) NOT NULL,
  `complement` varchar(200) NOT NULL,
  `postal_code` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrators`
--

CREATE TABLE `administrators` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `administrators`
--

INSERT INTO `administrators` (`id`, `name`, `last_name`, `email`, `password`) VALUES
(1, 'Juan Jose', 'Huertas Botache', 'jjhuertasbotache', 'J1234567890j');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adr_list`
--

CREATE TABLE `adr_list` (
  `id` int(11) NOT NULL,
  `id_adress` int(11) NOT NULL,
  `id_user` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `designs`
--

CREATE TABLE `designs` (
  `id` int(11) NOT NULL,
  `name` varchar(106) NOT NULL,
  `img` varchar(106) NOT NULL,
  `ai` varchar(106) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `designs`
--

INSERT INTO `designs` (`id`, `name`, `img`, `ai`) VALUES
(15, '! 20 pero a que costo ?', 'img/!_20_pero_a_que_costo_-.png', 'ai/!_20_pero_a_que_costo_-.ai');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `packing_colors`
--

CREATE TABLE `packing_colors` (
  `id` int(11) NOT NULL,
  `color` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `packing_colors`
--

INSERT INTO `packing_colors` (`id`, `color`) VALUES
(1, 'rojo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pucharse_orders`
--

CREATE TABLE `pucharse_orders` (
  `id` int(11) NOT NULL,
  `id_wine` int(11) NOT NULL,
  `id_real_design` int(11) NOT NULL,
  `msg` int(11) DEFAULT NULL,
  `id_packing_color` int(11) NOT NULL,
  `id_secondary_packing_color` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `id_delivery_place` int(11) NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_vaucher` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `paid` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `real_designs`
--

CREATE TABLE `real_designs` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `png` varchar(114) NOT NULL,
  `dxf` varchar(114) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secondary_packing_colors`
--

CREATE TABLE `secondary_packing_colors` (
  `id` int(11) NOT NULL,
  `color` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `secondary_packing_colors`
--

INSERT INTO `secondary_packing_colors` (`id`, `color`) VALUES
(1, 'plateado'),
(2, 'blanco'),
(3, 'negro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'cumpleaños'),
(2, 'aniversario'),
(3, 'amor'),
(4, 'casual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag_list`
--

CREATE TABLE `tag_list` (
  `id` int(11) NOT NULL,
  `id_design` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` bigint(20) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wine_kinds`
--

CREATE TABLE `wine_kinds` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `wine_kinds`
--

INSERT INTO `wine_kinds` (`id`, `name`) VALUES
(2, 'tempranillo'),
(3, 'airen'),
(4, 'malbec'),
(5, 'carmenere'),
(6, 'merlot'),
(8, 'cabernet sauvignon '),
(13, 'moscatel'),
(16, 'rose');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `adr_list`
--
ALTER TABLE `adr_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_adress` (`id_adress`),
  ADD KEY `id_user_dir_list` (`id_user`);

--
-- Indices de la tabla `designs`
--
ALTER TABLE `designs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `packing_colors`
--
ALTER TABLE `packing_colors`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_wine_kinds` (`id_wine`),
  ADD KEY `id_real_designs` (`id_real_design`),
  ADD KEY `id_packing_color` (`id_packing_color`),
  ADD KEY `id_secondary_packing_color` (`id_secondary_packing_color`),
  ADD KEY `id_delivery_place` (`id_delivery_place`),
  ADD KEY `id_vaucher` (`id_vaucher`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `real_designs`
--
ALTER TABLE `real_designs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `secondary_packing_colors`
--
ALTER TABLE `secondary_packing_colors`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tag_list`
--
ALTER TABLE `tag_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tags` (`id_design`),
  ADD KEY `id_designs` (`id_tag`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `wine_kinds`
--
ALTER TABLE `wine_kinds`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `administrators`
--
ALTER TABLE `administrators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `designs`
--
ALTER TABLE `designs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `packing_colors`
--
ALTER TABLE `packing_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `real_designs`
--
ALTER TABLE `real_designs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `secondary_packing_colors`
--
ALTER TABLE `secondary_packing_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `wine_kinds`
--
ALTER TABLE `wine_kinds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adr_list`
--
ALTER TABLE `adr_list`
  ADD CONSTRAINT `id_user_dir_list` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `id_adress` FOREIGN KEY (`id_adress`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pucharse_orders`
--
ALTER TABLE `pucharse_orders`
  ADD CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `id_delivery_place` FOREIGN KEY (`id_delivery_place`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_packing_color` FOREIGN KEY (`id_packing_color`) REFERENCES `packing_colors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_real_designs` FOREIGN KEY (`id_real_design`) REFERENCES `real_designs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_secondary_packing_color` FOREIGN KEY (`id_secondary_packing_color`) REFERENCES `secondary_packing_colors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_vaucher` FOREIGN KEY (`id_vaucher`) REFERENCES `vouchers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_wine_kinds` FOREIGN KEY (`id_wine`) REFERENCES `wine_kinds` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tag_list`
--
ALTER TABLE `tag_list`
  ADD CONSTRAINT `id_designs` FOREIGN KEY (`id_tag`) REFERENCES `designs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_tags` FOREIGN KEY (`id_design`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
