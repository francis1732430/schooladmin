-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 25, 2018 at 05:56 PM
-- Server version: 5.7.23-0ubuntu0.16.04.1
-- PHP Version: 7.0.32-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_user`
--

CREATE TABLE `admin_user` (
  `rid` varchar(256) NOT NULL,
  `user_id` int(11) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `rp_token` text,
  `tmp_password` varchar(256) DEFAULT NULL,
  `is_active` int(1) NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin_user`
--

INSERT INTO `admin_user` (`rid`, `user_id`, `firstname`, `lastname`, `email`, `password`, `mobile_number`, `rp_token`, `tmp_password`, `is_active`, `created_by`, `created_date`, `updated_date`, `is_deleted`) VALUES
('375cbd67-d70c-429c-9a01-a3f0102ee2d0', 1, 'francis', 'francis', 'fr@gmail.com', '$2a$10$nWpM6zkPaf6pSWeUELwDQOS.06shOYzjGAVX0ccjHFuwv8qLJKDhW', NULL, NULL, NULL, 1, 1, '2018-10-25 11:26:27', '2018-10-25 11:26:27', 0),
('3cd26346-df88-46b2-a201-6b2c3c74940b', 2, 'francis', 'francis', 'fra@gmail.com', '$2a$10$JZ062HaU6j8UM.EmYuzUIeO97wjOQGPb2LvOcCde5jc5Nrma2dXCO', NULL, NULL, NULL, 1, 1, '2018-10-25 11:41:26', '2018-10-25 11:41:26', 0),
('e0e1d21c-5d1a-4249-8ce2-91d85413fc24', 3, 'francis', 'francis', 'fran@gmail.com', '$2a$10$VR.jMTs92HWtNC3C4pjUf.625U5EM5wk.3UdekD0QUC6VClXCkuVy', NULL, NULL, NULL, 1, 1, '2018-10-25 11:42:00', '2018-10-25 11:42:00', 0),
('a50046bd-3627-43c2-b06a-1d4f8866c949', 4, 'francis', 'francis', 'franc@gmail.com', '$2a$10$ZH0r0snLrAAjGMYlgK4wTeTI3ZSt8KQFFpSfUoI0cICVY2y1.WsCm', NULL, NULL, NULL, 1, 1, '2018-10-25 11:43:29', '2018-10-25 11:43:29', 0),
('dccb6a84-0224-41ae-8b4b-f85495712cdf', 5, 'francis', 'francis', 'franci@gmail.com', '$2a$10$XpGkl.jt99ds7DKUFLa8Leg.qPMIieDjce3Ap.0YbnhcWbSVMfh1u', NULL, NULL, NULL, 1, 1, '2018-10-25 11:52:48', '2018-10-25 11:52:48', 0),
('6b235b04-c58d-4627-b06e-b3e28a9c1ef1', 6, 'francis', 'francis', 'francis@gmail.com', '$2a$10$btLVqNnIYqngM6USRHFML.peAzdZX2p1xXyNR/3lpzw47hE2oUQSK', NULL, NULL, NULL, 1, 1, '2018-10-25 11:54:04', '2018-10-25 11:54:04', 0),
('fca7ffba-5f80-4b1d-b4d8-f69103f207c0', 7, 'francis', 'francis', 'franciss@gmail.com', '$2a$10$iOu9ZeG29Axj7/kYKQWZVegYuaugR89Ac7oxJ/SBKW02oguT4YCS.', NULL, NULL, NULL, 1, 1, '2018-10-25 11:55:11', '2018-10-25 11:55:11', 0),
('2699f5c6-b6d6-4e3c-903b-1b2c5aebca68', 8, 'francis', 'francis', 'franciss1@gmail.com', '$2a$10$mSbgGVb2Bvrq6BIhHbmdW.qXgxJ4ACRsjkDhGMC.8DT0LNNxbMsyu', NULL, NULL, NULL, 1, 1, '2018-10-25 11:56:00', '2018-10-25 11:56:00', 0),
('d2b9199a-4b67-493c-8350-1f13da09671e', 9, 'francis', 'francis', 'francissalin71@gmail.com', '$2a$10$XYHzBwoQewy/toAUhu9KQO2ecMFyLzJhJOvpIAtAX8lk.s9t.Lpqe', NULL, NULL, NULL, 1, 1, '2018-10-25 12:06:59', '2018-10-25 12:06:59', 0),
('35222828-d8b1-4b47-8a86-499ce98898bf', 10, 'francis', 'francis', 'francissalin72@gmail.com', '$2a$10$8UX9x7BL.lwV0MBNd73UJe/1GJxRmMAiAd800AECeQGiLpNQ2L.GK', NULL, NULL, NULL, 1, 1, '2018-10-25 12:13:33', '2018-10-25 12:13:33', 0),
('aea313db-5948-49ab-bd27-b651ec00ea12', 11, 'francis', 'francis', 'francissalin73@gmail.com', '$2a$10$b6b/yXwysoXNR2UmkRUsaORpRVM5trVZUXwjN2B3qQkYPfTpsBtOS', NULL, NULL, NULL, 1, 1, '2018-10-25 14:26:42', '2018-10-25 14:26:42', 0),
('1d18691f-7668-49a1-ac73-02e69d485616', 12, 'francis', 'francis', 'francissalin74@gmail.com', '$2a$10$wh2Gv6q2a.CUtgHYeDTikuj202g4ZSFGWj8lG4u.O8TR8MSdF2ti.', NULL, NULL, NULL, 1, 1, '2018-10-25 15:00:19', '2018-10-25 15:00:19', 0),
('26b092a3-6b1b-460a-b3ea-37e3d6aa0c22', 13, 'francis', 'francis', 'francissalin75@gmail.com', '$2a$10$mEpSmNh3GWwJO5aP1ZfRJOo3DLQ/5uv4768rV/7QKRD0vN8L8YQxO', NULL, NULL, NULL, 1, 1, '2018-10-25 15:05:31', '2018-10-25 15:05:31', 0),
('900b610e-19b5-4ecc-b934-4595ac91644f', 14, 'francis', 'francis', 'francissalin76@gmail.com', '$2a$10$cSDlSpY62xYaLL67x43zLeFBFOYwQHRv7ZLmYyEhuWhgpKjk9Bz82', NULL, NULL, NULL, 1, 1, '2018-10-25 15:08:43', '2018-10-25 15:08:43', 0),
('7d829811-4196-4c3f-827c-9e57a83749bd', 15, 'francis', 'francis', 'francissalin77@gmail.com', '$2a$10$Ovc4fsYTyoDanT.hkZsxGeE6n712S3LRax3jpB93KMhYzcGqVC0pq', NULL, NULL, NULL, 1, 1, '2018-10-25 15:13:57', '2018-10-25 15:13:57', 0),
('f212ab2d-67b8-4caa-b4c2-b3c82879862f', 16, 'francis', 'francis', 'francissalin7@gmail.com', '$2a$10$WAlnq.sbn9o3eCXCVJPQTeaVIu6oZsK6/ttMq933ol.8yvzCNo6eS', NULL, NULL, NULL, 1, 1, '2018-10-25 15:16:47', '2018-10-25 15:16:47', 0),
('dfc6723b-6b54-4e9d-9ad2-6372150a7391', 17, 'francis', 'francis', 'francissalin711@gmail.com', '$2a$10$6CNMOIkH2ILLFXkb0F7KHeBu56dvgAeuYOvQsL49OlFLMrB2e/5nS', NULL, NULL, NULL, 1, 1, '2018-10-25 15:18:10', '2018-10-25 15:18:10', 0),
('f3ceb56d-d6aa-4024-aafa-81343c4abdba', 18, 'francis', 'francis', 'francissalin7111@gmail.com', '$2a$10$AIUZvGrWPuN2yas0SIlC5exf0PtKQLE7fAbLoIZin6RFqeaAKg24O', NULL, NULL, NULL, 1, 1, '2018-10-25 15:26:02', '2018-10-25 15:26:02', 0),
('6ca0e823-31b7-4b53-95d8-a27db7eb71a1', 19, 'francis', 'francis', 'francissalin71111@gmail.com', '$2a$10$2aj2LrLOuhtgmlT2pdhq1.e9UwZpo.mHYpO3WOWYz7duik1FFvXqO', NULL, NULL, NULL, 1, 1, '2018-10-25 15:29:19', '2018-10-25 15:29:19', 0),
('7baab0e1-4c22-4d3f-8b99-4e4d874447b9', 20, 'francis', 'francis', 'francissalin711111@gmail.com', '$2a$10$7HYGL/XgK4cEcHiqfGmR8uPCf7yxVNmFsnybYJsJ2lwz.7F6MPYAO', NULL, NULL, NULL, 1, 1, '2018-10-25 15:35:00', '2018-10-25 15:35:00', 0),
('156e38db-77c1-4185-95ba-688aeec6e56e', 21, 'francis', 'francis', 'francissalin7111111@gmail.com', '$2a$08$o71rfSxgqCHWVINGL.1XiejC/J1MMOsh7NRhVG2XxpKN1mx9YqZ9y', NULL, NULL, NULL, 1, 1, '2018-10-25 15:40:26', '2018-10-25 15:40:26', 0),
('a2079931-fd9f-491b-9094-addffa31a76c', 22, 'francis', 'francis', 'francissalin71111111@gmail.com', '$2a$08$uu7kRGR9pGBhNJchx0L4X.fH1E5EPElgdyGSFND3H/sH1cVHk9IyS', NULL, NULL, NULL, 1, 1, '2018-10-25 15:46:22', '2018-10-25 15:46:22', 0),
('28efaffc-841e-4597-9c87-8416d66c694c', 23, 'francis', 'francis', 'francissalin711111111@gmail.com', '$2a$08$sAOODV9jPXH7YiGiX07peeSL9z1/7bTESjmWqCMGMLbNluCZmFqTm', NULL, NULL, NULL, 1, 1, '2018-10-25 15:47:42', '2018-10-25 15:47:42', 0),
('f08228e2-1824-4af2-ab95-5ae9e94cb0e6', 24, 'francis', 'francis', 'francissalin7111111111@gmail.com', '$2a$08$ytUX7muJkTj.49pttmp31e1psahYoinxkdZeRIr./gqDTNIvItzJS', NULL, NULL, NULL, 1, 1, '2018-10-25 15:48:53', '2018-10-25 15:48:53', 0),
('c83bde09-e81b-4cbd-86fd-c961b80ccb72', 25, 'francis', 'francis', 'francissalin71111211111@gmail.com', '$2a$08$Zx7gi9gJE0ukjiTH9HLGEOTRIAmXFo5Ahyr3CnSTUwKrBIPwhUs/K', NULL, NULL, NULL, 1, 1, '2018-10-25 15:50:24', '2018-10-25 15:50:24', 0),
('2a2307dd-2b53-4474-afc0-97e45def1eb1', 26, 'francis', 'francis', 'francissalin711112111111@gmail.com', '$2a$08$MEf0sp/7I/cALpCW8.VJyumVd9d0z3EnN5DcHXKsOq5r8r.xxJh6q', NULL, NULL, NULL, 1, 1, '2018-10-25 15:51:22', '2018-10-25 15:51:22', 0),
('a58c6d20-2b5e-4725-9626-27f324562451', 27, 'francis', 'francis', 'francissalin7111121111111@gmail.com', '$2a$08$/aNnvbK8e.BEFFyy.02MJuFQVRbCoid/4isGzT./UAotYrOUl.A3S', NULL, NULL, NULL, 1, 1, '2018-10-25 16:39:07', '2018-10-25 16:39:07', 0),
('d26fad51-4d2f-4e42-8728-08da635a3c21', 28, 'francis', 'francis', 'francissalin71111121111111@gmail.com', '$2a$08$L6hHEablf9NRx8T/3JrMFukxVAkgdEscuj7OYGxln237x83UMNwEO', NULL, NULL, NULL, 1, 1, '2018-10-25 16:40:18', '2018-10-25 16:40:18', 0),
('c6de933b-ddd9-45ef-a45d-3c4b3233b11b', 29, 'francis', 'francis', 'francissalin711111121111111@gmail.com', '$2a$08$aqDgy3JFKDaou4oKw2ryO.liQHWsU1XRl01M1MPgsH8EgFwO45npG', NULL, NULL, NULL, 1, 1, '2018-10-25 16:41:20', '2018-10-25 16:41:20', 0),
('3ac9edee-c4fc-48b2-aa9a-63ba754bf4dd', 30, 'francis', 'francis', 'francissalin7111111121111111@gmail.com', '$2a$08$X1ZGvK68sPnNTjzb0wAoaeTUCVpHdkHfH4ybCWD13c4ZNP99bBaZa', NULL, NULL, NULL, 1, 1, '2018-10-25 16:44:44', '2018-10-25 16:44:44', 0),
('f7932cff-f990-4f9f-a383-f0bbad797343', 31, 'francis', 'francis', 'francissalin71111111121111111@gmail.com', '$2a$08$WqXo0HfvQQL7o926UWq4oe6bbXAFC2oat5FaqvNiY7aaGe7R9OcDm', NULL, NULL, NULL, 1, 1, '2018-10-25 16:45:18', '2018-10-25 16:45:18', 0);

-- --------------------------------------------------------

--
-- Table structure for table `admin_user_session`
--

CREATE TABLE `admin_user_session` (
  `rid` varchar(256) NOT NULL,
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_status` int(1) NOT NULL,
  `device_token` varchar(256) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin_user_session`
--

INSERT INTO `admin_user_session` (`rid`, `session_id`, `user_id`, `login_status`, `device_token`, `created_date`, `updated_date`, `is_deleted`) VALUES
('66be7e2f-b97a-4be3-9f8c-e88d8c125eeb', 1, 26, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJleHAiOjE1NTM0MjU1OTYxNzksImlhdCI6MTU0MDQ2NTU5NjE3OSwiaXNzIjoiQWxhZGRpbiBTdHJlZXQiLCJhdWQiOiJjbGllbnQifQ.YFqpDhsqfD90dkPi6BBfBYA0MjuF0MLCY_vUoFyJK5s', '2018-10-25 16:09:47', '2018-10-25 16:09:47', 0),
('2a12948b-0f73-40c5-a031-379abf8e643e', 2, 29, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI5LCJleHAiOjE1NTM0Mjc3NjQ4NjQsImlhdCI6MTU0MDQ2Nzc2NDg2NCwiaXNzIjoiQWxhZGRpbiBTdHJlZXQiLCJhdWQiOiJjbGllbnQifQ.UobRtwHy64dr8jzqOP5-rjqZIZBYMcC6g-rskuX4VXk', '2018-10-25 16:41:47', '2018-10-25 16:41:47', 0);

-- --------------------------------------------------------

--
-- Table structure for table `authorization_role`
--

CREATE TABLE `authorization_role` (
  `rid` varchar(256) NOT NULL,
  `role_id` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `parent_id` int(11) NOT NULL,
  `role_type` varchar(45) DEFAULT NULL,
  `role_name` varchar(256) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `school_tmp_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_role`
--

INSERT INTO `authorization_role` (`rid`, `role_id`, `level`, `parent_id`, `role_type`, `role_name`, `user_id`, `school_id`, `school_tmp_id`, `created_by`, `created_date`, `updated_date`, `is_deleted`) VALUES
('07e378ab-7ec4-4f55-b7ce-8ef99bd2d3b2', 1, 0, 0, 'G', 'administrator', NULL, NULL, NULL, NULL, '2018-10-25 10:14:51', '2018-10-25 10:14:51', 0),
('a80a69a7-4b95-4f5f-86ee-3e1bbed798f6', 6, 0, 0, 'G', 'administrator1111', NULL, NULL, NULL, NULL, '2018-10-25 10:15:31', '2018-10-25 10:15:31', 0),
('b5ef2fed-d7f8-4745-9a3b-6c9012b64169', 7, 0, 0, 'G', 'administrator11111', NULL, NULL, NULL, NULL, '2018-10-25 10:15:36', '2018-10-25 10:15:36', 0),
('20545f5a-5f62-4d10-b1b6-6dcdc8f47799', 8, NULL, 1, NULL, 'administrator', 8, NULL, NULL, 1, '2018-10-25 11:56:00', '2018-10-25 11:56:00', 0),
('232186dc-5f14-4185-8e18-32fe5e4b8c1e', 9, 1, 1, 'U', 'administrator', 9, NULL, NULL, 1, '2018-10-25 12:06:59', '2018-10-25 12:06:59', 0),
('3a6ebd8d-0e05-4d5b-8508-de8c182af3c2', 10, 1, 1, 'U', 'administrator', 10, NULL, NULL, 1, '2018-10-25 12:13:33', '2018-10-25 12:13:33', 0),
('6c724552-2f1b-471e-9ec4-d832a4cb1c0c', 11, 1, 1, 'U', 'administrator', 11, NULL, NULL, 1, '2018-10-25 14:26:43', '2018-10-25 14:26:43', 0),
('8ae3f5c8-23c3-4106-82e7-359f596673b7', 12, 1, 1, 'U', 'administrator', 12, NULL, NULL, 1, '2018-10-25 15:00:20', '2018-10-25 15:00:20', 0),
('98c33dce-6a23-421d-9040-f0f1b1ac6a56', 13, 1, 1, 'U', 'administrator', 13, NULL, NULL, 1, '2018-10-25 15:05:31', '2018-10-25 15:05:31', 0),
('2ef184d7-83ac-4abd-a2ba-5b11b082a94d', 14, 1, 1, 'U', 'administrator', 14, NULL, NULL, 1, '2018-10-25 15:08:43', '2018-10-25 15:08:43', 0),
('2c0587bb-9855-4006-8a22-bb8ccd5c8ee1', 15, 1, 1, 'U', 'administrator', 15, NULL, NULL, 1, '2018-10-25 15:13:57', '2018-10-25 15:13:57', 0),
('4a6f61fa-9745-40e2-a84c-2cedecade481', 16, 1, 1, 'U', 'administrator', 16, NULL, NULL, 1, '2018-10-25 15:16:48', '2018-10-25 15:16:48', 0),
('8046f5e8-641b-4de6-a49b-2b6dc79947ef', 17, 1, 1, 'U', 'administrator', 17, NULL, NULL, 1, '2018-10-25 15:18:10', '2018-10-25 15:18:10', 0),
('4639e94f-f613-465d-8342-5bc07bd78d63', 18, 0, 0, 'G', 'schooladmin', NULL, NULL, NULL, NULL, '2018-10-25 10:15:21', '2018-10-25 10:15:21', 0),
('a2e1607b-42b8-43d2-91f1-2ebde53382e4', 19, 1, 1, 'U', 'administrator', 19, NULL, NULL, 1, '2018-10-25 15:29:19', '2018-10-25 15:29:19', 0),
('46c67949-ad21-4d36-9fd6-ca217aec3e33', 20, 1, 1, 'U', 'administrator', 20, NULL, NULL, 1, '2018-10-25 15:35:01', '2018-10-25 15:35:01', 0),
('ee019c11-4291-481e-bfdd-da652f5c648f', 21, 1, 1, 'U', 'administrator', 21, NULL, NULL, 1, '2018-10-25 15:40:26', '2018-10-25 15:40:26', 0),
('6d4d8314-b6f7-4934-a88d-a2bfe0e58880', 22, 1, 1, 'U', 'administrator', 22, NULL, NULL, 1, '2018-10-25 15:46:22', '2018-10-25 15:46:22', 0),
('6bbc7d5e-462c-4e1f-98ec-0ddeca5a42dd', 23, 1, 1, 'U', 'administrator', 23, NULL, NULL, 1, '2018-10-25 15:47:43', '2018-10-25 15:47:43', 0),
('a730dc7a-1dc2-432f-9928-7c2768537264', 24, 1, 1, 'U', 'administrator', 24, NULL, NULL, 1, '2018-10-25 15:48:53', '2018-10-25 15:48:53', 0),
('ddaf3fee-cd64-4d2b-b99e-66556e74b554', 25, 1, 1, 'U', 'administrator', 25, NULL, NULL, 1, '2018-10-25 15:50:24', '2018-10-25 15:50:24', 0),
('8e6bc360-6cb0-4a55-b7cd-b5fe1789f773', 26, 1, 1, 'U', 'administrator', 26, NULL, NULL, 1, '2018-10-25 15:51:22', '2018-10-25 15:51:22', 0),
('4476725b-1ac7-455f-9ebf-66bc7086b2ad', 27, 1, 18, 'U', 'schooladmin', 27, NULL, NULL, 1, '2018-10-25 16:39:07', '2018-10-25 16:39:07', 0),
('aca7197f-7236-4383-95a9-729e0dc5cdbb', 28, 1, 18, 'U', 'schooladmin', 28, NULL, NULL, 1, '2018-10-25 16:40:18', '2018-10-25 16:40:18', 0),
('e582fa83-5111-473c-a440-294372d25c40', 29, 1, 18, 'U', 'schooladmin', 29, NULL, NULL, 1, '2018-10-25 16:41:20', '2018-10-25 16:41:20', 0),
('46ce7206-c3d8-418e-9095-8a5016f61047', 30, 1, 18, 'U', 'schooladmin', 30, NULL, NULL, 1, '2018-10-25 16:44:44', '2018-10-25 16:44:44', 0),
('71b75dbd-7161-4220-8cda-a117ad8cc342', 31, 1, 18, 'U', 'schooladmin', 31, NULL, NULL, 1, '2018-10-25 16:45:18', '2018-10-25 16:45:18', 0),
('b1cb77fe-f754-4f0a-a907-86ca1d733ef8', 32, 0, 0, 'G', 'districtadmin', NULL, NULL, NULL, NULL, '2018-10-25 10:15:25', '2018-10-25 10:15:25', 0),
('0a64c8dd-7b4b-483c-ad71-8c579b68d727', 99, 0, 0, 'G', 'tmpadmin', NULL, NULL, NULL, NULL, '2018-10-25 10:15:28', '2018-10-25 10:15:28', 0);

-- --------------------------------------------------------

--
-- Table structure for table `authorization_rule`
--

CREATE TABLE `authorization_rule` (
  `rid` varchar(256) NOT NULL,
  `rule_id` int(11) NOT NULL,
  `privileges` varchar(45) DEFAULT NULL,
  `permission` varchar(45) NOT NULL,
  `role_id` int(11) NOT NULL,
  `module_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `status` int(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_rule`
--

INSERT INTO `authorization_rule` (`rid`, `rule_id`, `privileges`, `permission`, `role_id`, `module_id`, `school_id`, `status`, `created_date`, `updated_date`, `is_deleted`) VALUES
('1', 1, NULL, 'allow', 29, 1, NULL, 1, '2018-10-31 00:00:00', '2018-10-30 00:00:00', 0),
('2', 2, NULL, 'deny', 29, NULL, 1, 1, '2018-10-30 00:00:00', '2018-10-24 00:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `authorization_rule_set`
--

CREATE TABLE `authorization_rule_set` (
  `rid` varchar(256) NOT NULL,
  `module_id` int(11) NOT NULL,
  `module_name` varchar(255) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `action` varchar(45) NOT NULL,
  `routes` varchar(45) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_rule_set`
--

INSERT INTO `authorization_rule_set` (`rid`, `module_id`, `module_name`, `parent_id`, `action`, `routes`, `level`, `status`, `created_date`, `updated_date`, `is_deleted`) VALUES
('1', 1, 'ROLES VIEW', 0, 'ROLE_VIEW', NULL, 1, 1, '2018-10-31 00:00:00', '2018-10-31 00:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `directory_city`
--

CREATE TABLE `directory_city` (
  `rid` varchar(256) NOT NULL,
  `city_id` int(11) NOT NULL,
  `city_name` varchar(45) NOT NULL,
  `district_id` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `directory_city`
--

INSERT INTO `directory_city` (`rid`, `city_id`, `city_name`, `district_id`, `status`, `created_date`, `updated_date`, `is_deleted`) VALUES
('2dfbf5c9-1d3e-4dea-9244-79385208ae07', 1, 'ariyalur', 1, 1, '2018-10-24 15:31:16', '2018-10-24 15:31:16', 0),
('b774803a-a741-45af-9d98-9deda3e80a09', 2, 'sendurai', 1, 1, '2018-10-24 15:31:16', '2018-10-24 15:31:16', 0),
('65a31455-adc5-4848-bec7-c0eb64afa25d', 3, 'udayarpalayam', 1, 1, '2018-10-24 15:31:16', '2018-10-24 15:31:16', 0),
('39b0f521-3501-4a5b-8d9c-20ce8a4a0084', 4, 'egmore_nungambakkam', 2, 1, '2018-10-24 15:38:56', '2018-10-24 15:38:56', 0),
('e3e9a39a-c495-4360-abbe-14d8dc5efa96', 5, 'fort_tondiarpet', 2, 1, '2018-10-24 15:38:56', '2018-10-24 15:38:56', 0),
('38f6c2c6-6f6e-4baa-bd76-5edad6186999', 6, 'mambalam_guindy', 2, 1, '2018-10-24 15:38:56', '2018-10-24 15:38:56', 0),
('a6c47f05-ad07-4d2e-a81c-406a32e38fcf', 7, 'mylapore_triplicane', 2, 1, '2018-10-24 15:38:56', '2018-10-24 15:38:56', 0),
('f9060dc3-0cc7-4b6b-b3f6-6d75361a1572', 8, ' perambur_purasawalkam', 2, 1, '2018-10-24 15:38:56', '2018-10-24 15:38:56', 0),
('ecb2d2ad-026e-4c4c-8dfa-1962e7decdc6', 9, 'coimbatore(North)', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('e67d4fb0-3033-4e8c-8cc2-4f4fa8f7f3a6', 10, 'Coimbatore(South)', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('e5a9d524-f284-4ba1-8997-93e7e81d3825', 11, 'Mettupalayam', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('07a83d45-5160-4c1e-9221-f47b90406730', 12, 'polllachi', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('1c9f87a3-9cc1-4187-8947-7a1240a38045', 13, 'sulur', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('90dbca50-9661-4848-b1a1-2053c3947a39', 14, 'Valparai', 3, 1, '2018-10-24 15:43:02', '2018-10-24 15:43:02', 0),
('03adb0c9-a4ad-435d-8c7f-5914e6471d5d', 15, 'chidambaram', 4, 1, '2018-10-24 15:46:23', '2018-10-24 15:46:23', 0),
('16f3db75-cc10-405e-8a57-59e18e0a1c45', 16, 'cuddalore', 4, 1, '2018-10-24 15:46:23', '2018-10-24 15:46:23', 0),
('19366477-9693-454b-9dc8-b85a6af195a1', 17, 'kattumannarkoil', 4, 1, '2018-10-24 15:46:23', '2018-10-24 15:46:23', 0),
('701197ab-85c1-4e40-87f9-3f82f1502246', 18, 'kurinjipadi', 4, 1, '2018-10-24 15:46:24', '2018-10-24 15:46:24', 0),
('087e1f62-dcdd-4456-81b4-cd6a59fc550e', 19, 'panruti', 4, 1, '2018-10-24 15:46:24', '2018-10-24 15:46:24', 0),
('945c3d70-f9fc-481a-9219-e263a9fe794b', 20, 'Titakudi', 4, 1, '2018-10-24 15:46:24', '2018-10-24 15:46:24', 0),
('13b51897-e451-464a-b371-25b65fd6ea1f', 21, 'vridachalam', 4, 1, '2018-10-24 15:47:36', '2018-10-24 15:47:36', 0),
('0f56ccad-0c0f-48f8-a062-6e064090479f', 22, 'dharmapuri', 5, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('aaa14036-083a-421c-998e-a6417605d8d5', 23, 'harur', 5, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('0195f80c-8ea6-4ee8-9e2d-be930e1f6e65', 24, 'palakcode', 5, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('9add439e-3b51-4648-8203-71d93cad507e', 25, 'pappireddipatti', 5, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('5d6ea25d-ce6a-4528-8ae5-d0a98dc94c87', 26, 'pennagaram', 5, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('e89f4a43-1d62-4741-b750-7ebb29d56fc5', 27, 'attur', 6, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('c2c3818b-ed8f-4548-a6ae-5a319155860a', 28, 'dindigul', 6, 1, '2018-10-24 15:57:43', '2018-10-24 15:57:43', 0),
('dcb989dc-c7df-4712-a0ea-9455e4e40a62', 29, 'kodaikanal', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('03a919e1-68fa-4d54-9868-7553eec6218c', 30, 'natham', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('c9f58594-9eee-4fb4-9f42-c1520e9638d8', 31, 'nilakottai', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('01c2c4bf-8d39-4a7d-a552-4f4d0b7f8739', 32, 'oddanchatram', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('8ded1667-3588-4660-a517-bfc3d4fdfca0', 33, 'palani', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('8c230346-dce9-4216-9f3c-53ec9da3109a', 34, 'vedasandur', 6, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('efbb838f-67d2-45a3-8805-eefc761d409d', 35, 'bhavani', 7, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('51c56409-6457-43e7-816d-decee51843e1', 36, 'erode', 7, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('cc36e12f-b130-4a66-83f0-088d55879c4d', 37, 'gobichetipalayam', 7, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('8386dd95-6393-4404-8338-f3f8e29568c6', 38, 'perundurai', 7, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('1e8289d1-c89e-4b9a-a5e6-afd2c217fe64', 39, 'sathyamangalam', 7, 1, '2018-10-24 15:57:44', '2018-10-24 15:57:44', 0),
('02746adb-f52b-4676-a890-719af908980a', 40, 'alanthur', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('74a596e8-6b2c-47bd-8e91-8b89d1163444', 41, 'chengalpattu', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('2eb7bb74-20f5-433d-9cc1-547c952f302d', 42, 'cheyyur', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('59ee5388-c229-4072-820a-da8398ae496b', 43, 'cholinganallur', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('d5c65762-efd8-4e5e-94d8-c34d0ada0d0b', 44, 'kancheepuram', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('cb76b4d0-d9cf-4bb0-bfcd-92549bfed817', 45, 'madhuranthangam', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('d87f1f95-db49-4bc1-9c91-fe9e9eb53168', 46, 'sriperumbudur', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('c6e20076-f3e3-459f-9017-293a267297b9', 47, 'thambaram', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('e380d6a2-82ec-428d-b37d-665abb80f817', 48, 'tirukalukundram', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('b5251e17-a49a-4341-91ce-ea90bdd133c5', 49, 'uthiramerur', 8, 1, '2018-10-24 16:40:17', '2018-10-24 16:40:17', 0),
('7112b2ef-6389-45fb-90d2-60b2f0ae62e7', 50, 'agasteeswaram', 9, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('12dbedac-b636-491a-9d55-112198426050', 51, 'Kalkulam', 9, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('e367bb0d-91fd-4a36-a5e6-62050daf0321', 52, 'Thovalai', 9, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('55b65f6a-7c20-4123-bcaf-08d2e50af06c', 53, 'vilavancode', 9, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('08290240-2c69-42b8-8df1-309631044b07', 54, 'aravakurichi', 10, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('dfb0779f-8a19-4b36-87c4-a7060175c586', 55, 'kadavur', 10, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('5f9a416d-c071-4b0a-9ef4-3cd18728b661', 56, 'karur', 10, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('45c1f217-a110-4a3b-b219-5c7d5ca91055', 57, 'Krishnarayapuram', 10, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('2d705079-9fb3-432e-a630-48cec2d51227', 58, 'kulithalai', 10, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('b543b3dd-c772-4987-8788-1ad83ba50d71', 59, 'denkanikottai', 11, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('cbe6fd34-e205-499d-b4ba-bc5ad2da0a71', 60, 'hosur', 11, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('9d2d6fb6-d481-40fe-aea7-d700dbae42ab', 61, 'krishnagiri', 11, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('c740b8b5-275e-4813-87d8-77d296524cb8', 62, 'pochampalli', 11, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('2cdec490-c97f-4c6d-9743-201a4315a55c', 63, 'uthangarai', 11, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('58a3bd85-1ed5-43fd-b249-2b64aafd3a07', 64, 'madurai(North)', 12, 1, '2018-10-24 16:40:18', '2018-10-24 16:40:18', 0),
('9d9307eb-6e4a-4430-9a94-e3b8c5484a7c', 65, 'madurai(South)', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('eff4b624-e1de-48d4-abeb-ae2844e6d76e', 66, 'melur', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('8634a8a0-3544-4e03-8b26-6395d77afdeb', 67, 'peraiyur', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('168d3de2-685d-471d-b4ae-bd1f24f9bbb0', 68, 'thirumangalam', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('863673f8-5d8d-4531-aa75-259e28a47cd2', 69, 'usilampatti', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('cc7bb7f7-fc73-4b7f-b4f8-df1ea2ee61ac', 70, 'vadipatti', 12, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('e095b2ee-9a06-4cd4-8124-4452b0c24b5c', 71, 'kilvelur', 13, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('f8e4cb00-3703-471a-8fb7-667f5aaf0253', 72, 'kutthalam', 13, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('d4097a8d-cceb-4e2d-903b-734ec30324d6', 73, 'mayiladuthurai', 13, 1, '2018-10-24 16:40:19', '2018-10-24 16:40:19', 0),
('52338d58-3bc5-4f41-8510-32289a221015', 75, 'sirkali', 13, 1, '2018-10-24 16:44:10', '2018-10-24 16:44:10', 0),
('0662cb5a-55f6-49f5-a1ee-144739a9161a', 76, 'tharangambadi', 13, 1, '2018-10-24 16:44:10', '2018-10-24 16:44:10', 0),
('82fc551b-add8-4bbe-9fc3-8adc7a6108f3', 77, 'thirukkuvalai', 13, 1, '2018-10-24 16:44:11', '2018-10-24 16:44:11', 0),
('3b18bb57-6d9b-4399-b12f-2c7061bb51d9', 78, 'vedaranyam', 13, 1, '2018-10-24 16:44:11', '2018-10-24 16:44:11', 0),
('cf535adf-38ae-4ece-89b5-26e45a8a8dbb', 79, 'namakkal', 14, 1, '2018-10-24 16:44:11', '2018-10-24 16:44:11', 0),
('2a1b707f-5592-4849-9c18-1d3db82310c5', 80, 'paramathi velur', 14, 1, '2018-10-24 16:44:11', '2018-10-24 16:44:11', 0),
('21997918-ef51-47a0-9456-a6551add7208', 81, 'rasipuram', 14, 1, '2018-10-24 16:44:11', '2018-10-24 16:44:11', 0),
('585e517b-5b0e-4ea1-90ea-56cd5cd08972', 83, 'sriperumbudur', 14, 1, '2018-10-24 16:46:26', '2018-10-24 16:46:26', 0),
('a5b2a9b7-fc7f-4572-8353-6aa2e98860ed', 84, 'thiruchengode', 14, 1, '2018-10-24 16:46:26', '2018-10-24 16:46:26', 0),
('cc9c8d7e-b8d1-4dfb-a32e-15b6d0f45c6c', 85, 'Kunnam', 15, 1, '2018-10-24 16:46:26', '2018-10-24 16:46:26', 0),
('6b1b2c77-7caa-444c-874a-6e3dc47c604e', 86, 'perambalur', 15, 1, '2018-10-24 16:46:26', '2018-10-24 16:46:26', 0),
('88ed5b32-9486-4f41-b1d5-51660cf694ce', 87, 'veppanthattai', 15, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('942c8e16-9b11-4047-bb58-95753d6f1dc7', 88, 'alangudi', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('5123738b-861c-4f73-a7b3-d9a492ff7a45', 89, 'aranthangi', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('ef7bda8b-3fed-497e-aa6a-38d59fb5776f', 90, 'avadaiyarkoil', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('7579a3d3-654d-4f4e-90f3-e4e62c7fd721', 91, 'gandarvakottai', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('7dcb33b8-0438-447a-80b1-f729dac49de6', 92, 'illuppur', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('248b39e2-7940-4c1e-8f52-014c7d7483f0', 93, 'kulathur', 16, 1, '2018-10-24 16:46:27', '2018-10-24 16:46:27', 0),
('80be7242-dce8-4d24-87bc-259d0ffcceb5', 95, 'manamelkudi', 16, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('dc368576-738f-412e-8b8c-ad690a79595b', 96, 'pudukkottai', 16, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('95a9f675-c130-4b7b-8ce6-4b5346db6c97', 97, 'thirumayam', 16, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('f1ab54b2-cefe-4577-8fce-9967b79e0f70', 98, 'kadaladi', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('27aac608-0e7d-4207-b1ae-12d2176f11d5', 99, 'Kamuthi', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('08905acf-f87e-405b-87c1-f7f118426b02', 100, 'mudukulathur', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('bd286f77-804f-44fa-95cd-3ba6cad003cf', 101, 'paramakudi', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('2665c628-74a4-477d-a8bb-9c9e1ed10e43', 102, 'ramanathapuram', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('6336c1bf-f4c4-42a6-b479-b0cdeb15a3a1', 103, 'rameswaram', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('8d6bdfc4-9252-43fe-a1e9-a2fc654e762d', 104, 'tiruvadanai', 17, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('f8c048d3-51cd-44c5-bcd1-99d8174d2cc9', 105, 'attur', 18, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('3271dd49-6e73-43d3-891b-a9b2355ee750', 106, 'edapady', 18, 1, '2018-10-24 16:47:38', '2018-10-24 16:47:38', 0),
('424c7d93-c6aa-47f2-a9fa-7f624dcdca89', 107, 'gangavalli', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('a60f8178-e616-4d9b-8b3c-d08ee63c9cdb', 108, 'mettur', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('574a188d-87b2-45f9-886b-69d02e0a4312', 109, 'omalur', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('7a136078-0791-49d3-a710-f646a357a919', 110, 'salem', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('e51a3abf-23ca-4dbd-898a-7c13de559db2', 111, 'sangagiri', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('9ca86ae7-f480-407e-9f92-511a4dd7c79e', 112, 'valapady', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('98226f71-4f39-45b2-bad2-cc405acdd376', 113, 'yercaud', 18, 1, '2018-10-24 16:47:39', '2018-10-24 16:47:39', 0),
('b576185f-f084-4641-be30-622b4f8bcb7a', 114, 'devakottai', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('dd711735-2032-4950-8ecf-ed6a82f07837', 115, 'ilayankudi', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('d4b94350-b6fd-4139-aeb3-c81ece3ed954', 116, 'Karaikudi', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('36089c48-72a2-49ef-acf0-84cd0e291f24', 117, 'manamadurai', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('88504ad3-e5ef-4eb1-bcfe-610ed04f6583', 118, 'sivaganga', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('c5d04cf4-fe34-45b6-a137-07dbfe6cebb0', 119, 'tirupathur', 19, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('ece74400-d73a-47e9-ae98-a506d4e52e0f', 120, 'kumbakonam', 20, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('82f0d84a-4bb8-4c39-83ac-8aab8e727831', 121, 'orathanadu', 20, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('1247a0f3-79df-4a46-881a-d66627b79f60', 122, 'papanasam', 20, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('cedab439-ab79-4b14-8319-3d8c34c634f9', 123, 'pattukkottai', 20, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('d8a8f7ad-6223-4cfb-8ce3-0a85408094d5', 124, 'peravurani', 20, 1, '2018-10-24 17:00:32', '2018-10-24 17:00:32', 0),
('0e3949a4-3d4b-462a-ab56-d14775b612e1', 125, 'thanjavur', 20, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('c94da0b3-2cbd-471f-896c-c931a9e03400', 126, 'thiruvaiyaru', 20, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('5b3d45ee-d59d-4f97-97cb-ebbe1c574e02', 127, 'thiruvidaimarudur', 20, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('0b84597e-324b-4192-86d7-bcbab2d8b9fe', 128, 'andipatti', 21, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('35f4dfbc-73b1-4c87-b520-0343a166955e', 129, 'bodinayakanur', 21, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('6e0c30df-b70a-47e7-b592-933c4322a2d7', 130, 'periyakulam', 21, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('2f38221e-2ef0-4a2e-ad21-785332d3a39d', 131, 'theni', 21, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('c26a4601-d1cf-4349-a070-8b6f264c009c', 132, 'uthamapalayam', 21, 1, '2018-10-24 17:00:33', '2018-10-24 17:00:33', 0),
('6413d436-c438-4a3e-a6ea-9847ca11e7ae', 133, 'coonoor', 22, 1, '2018-10-24 17:21:06', '2018-10-24 17:21:06', 0),
('d2b412f5-7f4f-4591-96f5-013f6f24e887', 134, 'gudalur', 22, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('9a0cacad-0785-4f5a-acc9-b0651b513c71', 135, 'kotagiri', 22, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('e003e0ae-bd37-4015-8746-b703afe3499d', 136, 'kundah', 22, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('7265a440-6e9c-4bfb-98ad-e1900cd07929', 137, 'panthalur', 22, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('1122bfed-1c25-4d85-8009-0fa5ff0703ea', 138, 'udhagamandalam', 22, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('04fd5bfc-9d1d-4900-9ddb-71d37466cde1', 139, 'alangulam', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('b0fb9718-3cc7-4f62-ba16-121b9207439a', 140, 'ambasamuthiram', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('2b10d45e-4b4b-4748-8da7-07a6aba207ab', 141, 'nanguneri', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('419167ae-6490-4598-bf97-2824d98c77f3', 142, 'Palayamkottai', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('4a35a27c-5498-405f-b192-cfaefa8f2622', 143, 'radhapuram', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('b1bd2919-a55f-4789-a000-39e8bfad585d', 144, 'sankarankovil', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('98c1eacd-d665-4a9e-bfd5-faa393016579', 145, 'shenkottai', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('0b366ce2-7210-47c3-92ef-2c2187d11d60', 146, 'sivagiri', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('ad31cda9-2497-4b4f-b765-407fcd54c371', 147, 'thenkasi', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('75d8c333-9b7a-4e1a-907c-5960ce195fd1', 148, 'tirunelveli', 23, 1, '2018-10-24 17:21:07', '2018-10-24 17:21:07', 0),
('619143c6-acda-43ae-a7f9-4185243b5acc', 149, 'veerakeralamputhur', 23, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('f02aaa4b-199d-495c-b596-12f02b6e2777', 150, 'ambathur', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('185188e7-5cee-459b-a421-7ca11a92e163', 151, 'gummidipoondi', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('464e380c-f05f-4321-981a-c4a2cf1a35d8', 152, 'madhavaram', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('9ebb0753-2147-4df9-8a78-3605ef058c5a', 153, 'pallipattu', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('90dd8fe2-e96f-4912-abbc-1352c55070f8', 154, 'ponneri', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('1374a2ce-b375-41f2-a8c9-7e58f618062d', 155, 'poonamallee', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('fcb5fe01-4700-44e6-aaa4-2e6a3de66645', 156, 'tiruttani', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('960313f2-33ab-4f0a-afe3-cad32df978ac', 157, 'tiruvallur', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('9ced27e2-0fdf-48ae-a0ac-98c28b5ffce3', 158, 'uthukkotai', 24, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('3cc0b291-5c06-4119-abe1-d2094467ee7f', 159, 'arani', 25, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('af5b6b0c-055c-4b8b-9533-84056e22994f', 160, 'chengam', 25, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('138f1f70-dd6f-40e0-a8dc-5117dd7ff8e1', 161, 'cheyyar', 25, 1, '2018-10-24 17:21:08', '2018-10-24 17:21:08', 0),
('ae02d519-3ad0-4332-b56a-2ddf186d8cb4', 162, 'polur', 25, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('c5e95286-3731-4a72-b009-e2157778917a', 163, 'thandarampattu', 25, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('0ed79fc1-6f04-4dc2-8bef-58046b4d7394', 164, 'tiruvannamalai', 25, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('07dc07e4-9a81-4f5c-9908-198977dcee86', 165, 'vandavasi', 25, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('5daa7233-53e4-4e97-8d35-cc6992eaef66', 166, 'kudavasal', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('dc964f43-03d4-46f8-9484-288e8f2e7f18', 167, 'mannargudi', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('2435a028-2aa3-4fd8-b259-717125b53c58', 168, 'nannilam', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('c0d525f8-bdbf-46bc-8a7a-20f5a666b833', 169, 'needamanglam', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('f1f3725f-6902-417f-b775-96e05c0d729c', 170, 'thiruthuraipoondi', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('976949d9-12a8-4527-ae10-e4b30597f0cb', 171, 'thiruvarur', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('c850b1f6-633d-437d-a291-98a6797f27e8', 172, 'valangaiman', 26, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('d3efa0a9-ccd9-4018-805b-2b3e157d73bb', 173, 'avinashi', 27, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('0f3d5517-9e5b-4c27-b1a8-a2206b4acb4f', 174, 'dharapuram', 27, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('2298bd80-7082-4bd0-bade-49fb3bb6cbb5', 175, 'kangayam', 27, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('f95096f8-5310-4d5a-9d26-36f948645154', 176, 'madathukulam', 27, 1, '2018-10-24 17:47:17', '2018-10-24 17:47:17', 0),
('da4bd50f-c728-4b3e-a33f-05d88ff6477a', 177, 'palladam', 27, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('8da3a730-a2b8-4fcd-a77a-e47b93885bfa', 178, 'tiruppur', 27, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('4e9cf58e-231d-429f-a73c-e2c4569cadd7', 179, 'udumalpet', 27, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('6395da65-bfea-4386-96ff-65c5e5e0edb5', 180, 'lalgudi', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('84c11ec7-b004-40dc-b41e-0a1a2b264747', 181, 'manachanallur', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('077a7a74-aecc-41b8-b98e-c5356ae66872', 182, 'manapparai', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('99ecb127-d04b-4e67-9a77-77ec7614fac6', 183, 'musiri', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('99d66517-43f5-4d0e-ade8-c806e25388f0', 184, 'srirangam', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('9f9fab50-f7ff-4ebe-83b9-a20121a51d0d', 185, 'thiruverumpur', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('7280164c-cb87-400d-9785-f5948443af8c', 186, 'thottiyam', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('20343a12-17df-4a29-9b51-a5ff8d83deba', 187, 'thuraiyur', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('79b3dcf4-d680-45ac-9cf5-0ec1c7a7feaf', 188, 'tiruchirapalli', 28, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('c4c31b2c-4ad3-462b-bdaf-3f7b1d109f6a', 189, 'ettayapuram', 29, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('effa5302-fe74-4f8f-8f41-ebb9958f8bc1', 190, 'kovilpattai', 29, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('02392dce-b9ef-4ebf-8279-2438acb653ef', 191, 'ottapidaram', 29, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('9b31ac2f-8d82-44e1-8e32-27a8e3e23fa8', 192, 'sathankulam', 29, 1, '2018-10-24 17:47:18', '2018-10-24 17:47:18', 0),
('524ed099-490f-41ad-87c6-50dc3ea4320a', 193, 'srivaikundam', 29, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('351bc3c2-c91e-445c-9ba9-ba4410afb1e6', 194, 'thoothukkudi', 29, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('478c328f-21ae-4198-9cfd-8f0fd508cbda', 195, 'tiruchendur', 29, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('afa7afb7-181d-4852-a9b9-c6db2344da55', 196, 'vilathikulam', 29, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('3ed62861-e7f3-4044-943f-61ed4bcac559', 197, 'ambur', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('93ed5a43-d366-4976-b668-dd275251cb34', 198, 'arakonam', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('d9c5d4d0-da53-40c4-a811-0f620fc95655', 199, 'arcot', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('1ad3ab3e-e828-4573-9317-0031c7d29a10', 200, 'gudiyatham', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('78f93cf3-9cba-4fe3-898d-69ec49833755', 201, 'katpadi', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('9aa52b88-58f2-4cb4-9411-e0d19ebdf523', 202, 'tirupattur', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('3c8be2f5-01f0-4518-b5bd-1859eba40f82', 203, 'vaniyampadi', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('ff6d803b-84ed-4807-97cc-3612d32d5625', 204, 'vellore', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('7bb1e3c0-327a-41d0-a9bb-8821d81a60a9', 205, 'wallajah', 30, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('c32fe695-af08-4a89-9384-3488a209a5b6', 206, 'gingee', 31, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('b22460bc-9ac2-4c9b-b994-764fdcecc339', 207, 'kallakurichi', 31, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('7421a32e-22e1-4d8d-94c2-a41cee9c5075', 208, 'sankarapuram', 31, 1, '2018-10-24 17:47:19', '2018-10-24 17:47:19', 0),
('90a99331-c2f2-4f6d-94c9-0c8bad913c3f', 209, 'thindivanam', 31, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('3877bea8-05e9-4e9f-85ff-caee8c01b57e', 210, 'thirukoilur', 31, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('0f6cde43-7135-49c1-b74c-52aef9f606ee', 211, 'ulundurpet', 31, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('ebd1b56e-e113-4b82-aa5f-d65797f72ebd', 212, 'vanur', 31, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('379591c6-3058-4e1e-bf90-52a6008a267a', 213, 'villupuram', 31, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('b9ceb458-e716-4185-9ffc-17d44b7b7eb8', 214, 'arupukottai', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('817ee658-7773-4901-8f90-33fb8397650e', 215, 'kariapattai', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('dcfcf725-73a8-4ca1-8d80-6e4059fd91e8', 216, 'rajapalayam', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('8cfbfa6a-9a48-492d-a685-3d3401e7d467', 217, 'sathur', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('ed785995-4a4e-4baa-8642-c6af1c0dc129', 218, 'sivakasi', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('90906b15-f454-40c8-ba9f-00c9f5cb3f01', 219, 'srivilliputhur', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('1d9d9001-1b5a-4e2c-a0fb-fbaf05b66e40', 220, 'tiruchuli', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0),
('3ecdb3d9-1e55-415f-81d1-9621d5f2d7cf', 221, 'virudhunagar', 32, 1, '2018-10-24 17:47:20', '2018-10-24 17:47:20', 0);

-- --------------------------------------------------------

--
-- Table structure for table `directory_district`
--

CREATE TABLE `directory_district` (
  `rid` varchar(256) NOT NULL,
  `district_id` int(11) NOT NULL,
  `district_name` varchar(50) NOT NULL,
  `state_name` varchar(50) DEFAULT NULL,
  `status` int(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `directory_district`
--

INSERT INTO `directory_district` (`rid`, `district_id`, `district_name`, `state_name`, `status`, `created_date`, `updated_date`, `is_deleted`) VALUES
('e5f5e628-a1ba-4157-baf2-b7c02895727e', 1, 'Ariyalur', 'tamilnadu', 1, '2018-10-24 14:52:08', '2018-10-24 14:52:08', 0),
('432c3069-b7f8-455c-81a8-6acef0e9e06b', 2, 'chennai', 'tamilnadu', 1, '2018-10-24 14:52:08', '2018-10-24 14:52:08', 0),
('fb596cf6-facb-461b-b463-cd7c7a25c645', 3, 'coimbatore', 'tamilnadu', 1, '2018-10-24 15:00:32', '2018-10-24 15:00:32', 0),
('b2243b08-8e53-4a67-88a4-cc0011692410', 4, 'cuddalore', 'tamilnadu', 1, '2018-10-24 15:00:32', '2018-10-24 15:00:32', 0),
('5485f2d6-2b3d-4fb2-88d0-fa0c55b61072', 5, 'dharmapuri', 'tamilnadu', 1, '2018-10-24 15:00:32', '2018-10-24 15:00:32', 0),
('a9db8436-e51d-42db-b3c9-007240aa4685', 6, 'dinduigal', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('6ef6a8c3-0801-401d-a4d3-9c6bf1ea5eaa', 7, 'erode', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('264bb331-4952-4e5b-a89b-fb3eeb7e59a8', 8, 'kancheepuram', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('d6856b44-7a48-4f36-8156-01f611346c22', 9, 'kanyakumari', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('924ea585-6c71-4818-b078-54a041040a8c', 10, 'karur', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('9f9bca9a-5482-42fb-b646-e91c3b83d526', 11, 'krishnagiri', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('5b3c357f-63c5-47fc-b44d-44a1ceb68c83', 12, 'madurai', 'tamilnadu', 1, '2018-10-24 15:00:33', '2018-10-24 15:00:33', 0),
('4649a84b-9e3a-4b88-96dd-829977b2f418', 13, 'nagapattinam', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('301cd5bc-07fe-4d28-ac69-c652c343b95e', 14, 'namakkal', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('15b101a6-7709-46fb-a923-122b39442351', 15, 'perambalur', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('9a8c4db7-6a55-41a6-92ef-7ea80dceb1fc', 16, 'pudukottai', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('2d4d869e-4dcc-4df2-9a89-cfc271519219', 17, 'ramanathapuram', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('59fa90f2-2877-46a9-a4ed-2ba287a73e51', 18, 'salem', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('0d6d36dc-9244-4367-9f3d-682726bbfbef', 19, 'sivagangai', 'tamilnadu', 1, '2018-10-24 15:12:09', '2018-10-24 15:12:09', 0),
('76fa2cbc-fb3c-42f9-a17f-9036f86c0eae', 20, 'thanjavur', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('9f235a06-9d42-4a75-89a6-ebafb366fda6', 21, 'theni', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('c9afe865-af8c-4baf-8047-77648333afa3', 22, 'nilgiris', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('d985170e-d2ac-4f33-b593-59aa9c948939', 23, 'thirunelveli', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('c885ba20-af29-45ed-a75e-22c8edbf95e7', 24, 'thiruvallur', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('af5e4801-53b4-4e35-8a28-d5132cac9fca', 25, 'thiruvannamalai', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('ebaf2ee8-32e2-4700-a73d-18303e360666', 26, 'tiruvarur', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('daa28ca6-f9c6-463b-aa33-956998e7a3a3', 27, 'tiruppur', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('53a7aba6-95ae-4f9c-bb16-d70f3bf73fa8', 28, 'trichirapalli', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('2b279ded-2cef-4a32-83f3-b6c125b6b1ef', 29, 'tuticorin', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('60c804da-2efb-4f96-8d51-57fc79b501e7', 30, 'velore', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('fc05bd67-0a79-4787-8415-0fc61fd2aa33', 31, 'vilupuram', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0),
('3b5944a3-ee8e-49c7-8a6a-dfc721f16836', 32, 'viruthunagar', 'tamilnadu', 1, '2018-10-24 15:12:10', '2018-10-24 15:12:10', 0);

-- --------------------------------------------------------

--
-- Table structure for table `school_entity`
--

CREATE TABLE `school_entity` (
  `rid` varchar(256) NOT NULL,
  `school_id` int(11) NOT NULL,
  `school_name` varchar(45) NOT NULL,
  `state_name` varchar(45) DEFAULT NULL,
  `started_date` varchar(45) DEFAULT NULL,
  `principle_name` varchar(45) DEFAULT NULL,
  `representative_name` varchar(256) NOT NULL,
  `representative_email` varchar(45) NOT NULL,
  `representative_number` varchar(20) NOT NULL,
  `school_number` varchar(20) NOT NULL,
  `school_email` varchar(45) NOT NULL,
  `approval_status` varchar(3) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `address` text,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `is_deleted` int(1) DEFAULT '0',
  `image_url` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `school_entity`
--

INSERT INTO `school_entity` (`rid`, `school_id`, `school_name`, `state_name`, `started_date`, `principle_name`, `representative_name`, `representative_email`, `representative_number`, `school_number`, `school_email`, `approval_status`, `postal_code`, `address`, `district_id`, `city_id`, `status`, `created_date`, `updated_date`, `created_by`, `is_deleted`, `image_url`) VALUES
('7e3c6456-b373-45b4-8e2a-d88d8ec217dc', 1, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:57:57', '2018-10-25 10:57:57', 18, 0, NULL),
('538e2d1e-4395-4738-a440-c30f461ab683', 2, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:23', '2018-10-25 10:58:23', 18, 0, NULL),
('d6b9b943-6b21-44cb-92f6-72d2fc151b17', 3, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:25', '2018-10-25 10:58:25', 18, 0, NULL),
('87a63dda-bf89-488c-be17-133f50a54373', 4, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:26', '2018-10-25 10:58:26', 18, 0, NULL),
('2f77045f-1a59-416f-9a3e-44ed24ffbf31', 5, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:26', '2018-10-25 10:58:26', 18, 0, NULL),
('47e9f5e8-392b-4a15-8369-352192cc9e31', 6, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:27', '2018-10-25 10:58:27', 18, 0, NULL),
('c048afb4-02ac-4d7c-9fd3-fb7b7909de29', 7, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:27', '2018-10-25 10:58:27', 18, 0, NULL),
('1e3d8298-b6ff-4e13-8fca-491ec61ae875', 8, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:28', '2018-10-25 10:58:28', 18, 0, NULL),
('95954e69-6f80-4996-a5eb-8b6fde0eaf72', 9, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:28', '2018-10-25 10:58:28', 18, 0, NULL),
('58502706-39d0-4202-9474-c0bb64d7fa1d', 10, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'fra@gmail.com', '1234567890', '1234567890', 'fran@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 10:58:28', '2018-10-25 10:58:28', 18, 0, NULL),
('f9d04091-c102-4ada-8393-b3e251bc1e22', 11, 'amala annai hr sec school', NULL, NULL, NULL, 'francis', 'frac@gmail.com', '1234567890', '1234567890', 'franc@gmail.com', '0', '2345', NULL, 1, 1, 1, '2018-10-25 11:04:53', '2018-10-25 11:04:53', 18, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `rid` varchar(256) NOT NULL,
  `user_deteails_id` int(11) NOT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `salary` varchar(45) DEFAULT NULL,
  `employee_type` varchar(45) DEFAULT NULL,
  `image_url` varchar(45) DEFAULT NULL,
  `date_of_birth` varchar(45) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_user`
--
ALTER TABLE `admin_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `admin_user_session`
--
ALTER TABLE `admin_user_session`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `authorization_role`
--
ALTER TABLE `authorization_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `authorization_rule`
--
ALTER TABLE `authorization_rule`
  ADD PRIMARY KEY (`rule_id`);

--
-- Indexes for table `authorization_rule_set`
--
ALTER TABLE `authorization_rule_set`
  ADD PRIMARY KEY (`module_id`);

--
-- Indexes for table `directory_city`
--
ALTER TABLE `directory_city`
  ADD PRIMARY KEY (`city_id`);

--
-- Indexes for table `directory_district`
--
ALTER TABLE `directory_district`
  ADD PRIMARY KEY (`district_id`),
  ADD UNIQUE KEY `district_name_UNIQUE` (`district_name`);

--
-- Indexes for table `school_entity`
--
ALTER TABLE `school_entity`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_deteails_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_user`
--
ALTER TABLE `admin_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `admin_user_session`
--
ALTER TABLE `admin_user_session`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `authorization_role`
--
ALTER TABLE `authorization_role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `authorization_rule`
--
ALTER TABLE `authorization_rule`
  MODIFY `rule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `authorization_rule_set`
--
ALTER TABLE `authorization_rule_set`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `directory_city`
--
ALTER TABLE `directory_city`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;
--
-- AUTO_INCREMENT for table `directory_district`
--
ALTER TABLE `directory_district`
  MODIFY `district_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `school_entity`
--
ALTER TABLE `school_entity`
  MODIFY `school_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `user_deteails_id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
