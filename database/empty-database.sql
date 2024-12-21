CREATE DATABASE  IF NOT EXISTS `ridepal` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ridepal`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ridepal
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deezer_id` bigint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `cover` varchar(255) NOT NULL,
  `tracklist` varchar(255) NOT NULL,
  `artist_id` int NOT NULL,
  `artist_deezer_id` bigint NOT NULL,
  `genre_id` int NOT NULL,
  `genre_deezer_id` bigint NOT NULL,
  PRIMARY KEY (`id`,`deezer_id`),
  UNIQUE KEY `name_UNIQUE` (`title`),
  KEY `fk_albums_artists1_idx` (`artist_id`,`artist_deezer_id`),
  KEY `fk_albums_genres1_idx` (`genre_id`,`genre_deezer_id`),
  CONSTRAINT `fk_albums_artists1` FOREIGN KEY (`artist_id`, `artist_deezer_id`) REFERENCES `artists` (`id`, `deezer_id`),
  CONSTRAINT `fk_albums_genres1` FOREIGN KEY (`genre_id`, `genre_deezer_id`) REFERENCES `genres` (`id`, `deezer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deezer_id` bigint NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tracklist` varchar(255) NOT NULL,
  `genre_id` int NOT NULL,
  `genre_deezer_id` bigint NOT NULL,
  PRIMARY KEY (`id`,`deezer_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_artists_genres_idx` (`genre_id`,`genre_deezer_id`),
  CONSTRAINT `fk_artists_genres` FOREIGN KEY (`genre_id`, `genre_deezer_id`) REFERENCES `genres` (`id`, `deezer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deezer_id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`,`deezer_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres_has_playlists`
--

DROP TABLE IF EXISTS `genres_has_playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres_has_playlists` (
  `genre_id` int NOT NULL,
  `genre_deezer_id` bigint NOT NULL,
  `playlist_id` int NOT NULL,
  PRIMARY KEY (`genre_id`,`genre_deezer_id`,`playlist_id`),
  KEY `fk_genres_has_playlists_playlists1_idx` (`playlist_id`),
  KEY `fk_genres_has_playlists_genres1_idx` (`genre_id`,`genre_deezer_id`),
  CONSTRAINT `fk_genres_has_playlists_genres1` FOREIGN KEY (`genre_id`, `genre_deezer_id`) REFERENCES `genres` (`id`, `deezer_id`),
  CONSTRAINT `fk_genres_has_playlists_playlists1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres_has_playlists`
--

LOCK TABLES `genres_has_playlists` WRITE;
/*!40000 ALTER TABLE `genres_has_playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `genres_has_playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `playtime` int DEFAULT NULL,
  `rank` float DEFAULT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `is_deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`user_id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_playlists_users1_idx` (`user_id`),
  CONSTRAINT `fk_playlists_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists_has_tracks`
--

DROP TABLE IF EXISTS `playlists_has_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists_has_tracks` (
  `playlist_id` int NOT NULL,
  `track_id` int NOT NULL,
  `track_deezer_id` bigint NOT NULL,
  PRIMARY KEY (`playlist_id`,`track_id`,`track_deezer_id`),
  KEY `fk_playlists_has_tracks_tracks1_idx` (`track_id`,`track_deezer_id`),
  KEY `fk_playlists_has_tracks_playlists1_idx` (`playlist_id`),
  CONSTRAINT `fk_playlists_has_tracks_playlists1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`),
  CONSTRAINT `fk_playlists_has_tracks_tracks1` FOREIGN KEY (`track_id`, `track_deezer_id`) REFERENCES `tracks` (`id`, `deezer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists_has_tracks`
--

LOCK TABLES `playlists_has_tracks` WRITE;
/*!40000 ALTER TABLE `playlists_has_tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists_has_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracks`
--

DROP TABLE IF EXISTS `tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deezer_id` bigint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `duration` int NOT NULL,
  `rank` int NOT NULL,
  `preview` varchar(1000) NOT NULL,
  `album_id` int NOT NULL,
  `album_deezer_id` bigint NOT NULL,
  `artist_id` int NOT NULL,
  `artist_deezer_id` bigint NOT NULL,
  `genre_id` int NOT NULL,
  `genre_deezer_id` bigint NOT NULL,
  PRIMARY KEY (`id`,`deezer_id`),
  UNIQUE KEY `name_UNIQUE` (`title`),
  KEY `fk_tracks_albums1_idx` (`album_id`,`album_deezer_id`),
  KEY `fk_tracks_artists1_idx` (`artist_id`,`artist_deezer_id`),
  KEY `fk_tracks_genres1_idx` (`genre_id`,`genre_deezer_id`),
  CONSTRAINT `fk_tracks_albums1` FOREIGN KEY (`album_id`, `album_deezer_id`) REFERENCES `albums` (`id`, `deezer_id`),
  CONSTRAINT `fk_tracks_artists1` FOREIGN KEY (`artist_id`, `artist_deezer_id`) REFERENCES `artists` (`id`, `deezer_id`),
  CONSTRAINT `fk_tracks_genres1` FOREIGN KEY (`genre_id`, `genre_deezer_id`) REFERENCES `genres` (`id`, `deezer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracks`
--

LOCK TABLES `tracks` WRITE;
/*!40000 ALTER TABLE `tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role_id` int DEFAULT '2',
  `is_deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_users_roles1_idx` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-21 18:32:09
