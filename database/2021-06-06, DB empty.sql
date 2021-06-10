CREATE DATABASE  IF NOT EXISTS `playlist_generator` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `playlist_generator`;
-- MariaDB dump 10.19  Distrib 10.5.9-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: playlist_generator
-- ------------------------------------------------------
-- Server version	10.5.9-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `album_track_map`
--

DROP TABLE IF EXISTS `album_track_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `album_track_map` (
  `album_track_map_id` int(11) NOT NULL AUTO_INCREMENT,
  `album` int(11) NOT NULL,
  `track` int(11) NOT NULL,
  PRIMARY KEY (`album_track_map_id`),
  KEY `fk_album_track_map_albums_deez_albums_id_idx` (`album`),
  KEY `fk_album_track_map_tracks_deez_tracks_id_idx` (`track`),
  CONSTRAINT `fk_album_track_map_albums_deez_albums_id` FOREIGN KEY (`album`) REFERENCES `albums` (`deez_albums_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_album_track_map_tracks_deez_tracks_id` FOREIGN KEY (`track`) REFERENCES `tracks` (`deez_tracks_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album_track_map`
--

LOCK TABLES `album_track_map` WRITE;
/*!40000 ALTER TABLE `album_track_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `album_track_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `albums` (
  `albums_id` int(11) NOT NULL AUTO_INCREMENT,
  `deez_albums_id` int(11) NOT NULL,
  `album_title` varchar(255) NOT NULL,
  `artist` int(11) NOT NULL,
  `genre` int(11) NOT NULL,
  `album_cover` longtext DEFAULT NULL,
  PRIMARY KEY (`albums_id`),
  KEY `fk_albums_artists_deez_artists_id_idx` (`artist`),
  KEY `fk_albums_genres_deez_genres_id_idx` (`genre`),
  KEY `deez_albums_id` (`deez_albums_id`),
  CONSTRAINT `fk_albums_artists_deez_artists_id` FOREIGN KEY (`artist`) REFERENCES `artists` (`deez_artists_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_albums_genres_deez_genres_id` FOREIGN KEY (`genre`) REFERENCES `genres` (`deez_genres_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `artists` (
  `artists_id` int(11) NOT NULL AUTO_INCREMENT,
  `deez_artists_id` int(11) NOT NULL,
  `artist_name` varchar(255) NOT NULL,
  PRIMARY KEY (`artists_id`),
  KEY `deez_artists_id` (`deez_artists_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre_artist_map`
--

DROP TABLE IF EXISTS `genre_artist_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genre_artist_map` (
  `genre_artist_map_id` int(11) NOT NULL AUTO_INCREMENT,
  `genre` int(11) NOT NULL,
  `artist` int(11) NOT NULL,
  PRIMARY KEY (`genre_artist_map_id`),
  KEY `fk_genre_artist_map_genres_deez_genres_id_idx` (`genre`),
  KEY `fk_genre_artist_map_artists_deez_artists_id_idx` (`artist`),
  CONSTRAINT `fk_genre_artist_map_artists_deez_artists_id` FOREIGN KEY (`artist`) REFERENCES `artists` (`deez_artists_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_genre_artist_map_genres_deez_genres_id` FOREIGN KEY (`genre`) REFERENCES `genres` (`deez_genres_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre_artist_map`
--

LOCK TABLES `genre_artist_map` WRITE;
/*!40000 ALTER TABLE `genre_artist_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `genre_artist_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genres` (
  `genres_id` int(11) NOT NULL AUTO_INCREMENT,
  `deez_genres_id` int(11) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `is_main` int(11) DEFAULT NULL,
  PRIMARY KEY (`genres_id`),
  KEY `deez_genres_id` (`deez_genres_id`),
  KEY `genre` (`genre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_genre_map`
--

DROP TABLE IF EXISTS `playlist_genre_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlist_genre_map` (
  `playlist_genre_map_id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist` int(11) NOT NULL,
  `genre` int(11) NOT NULL,
  PRIMARY KEY (`playlist_genre_map_id`),
  KEY `fk_playlist_genre_map_playlists_playlists_id_idx` (`playlist`),
  KEY `fk_playlist_genre_map_genres_deez_genres_id_idx` (`genre`),
  CONSTRAINT `fk_playlist_genre_map_genres_deez_genres_id` FOREIGN KEY (`genre`) REFERENCES `genres` (`deez_genres_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_playlist_genre_map_playlists_playlists_id` FOREIGN KEY (`playlist`) REFERENCES `playlists` (`playlists_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_genre_map`
--

LOCK TABLES `playlist_genre_map` WRITE;
/*!40000 ALTER TABLE `playlist_genre_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist_genre_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_track_map`
--

DROP TABLE IF EXISTS `playlist_track_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlist_track_map` (
  `playlist_track_map_id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist` int(11) NOT NULL,
  `track` int(11) NOT NULL,
  PRIMARY KEY (`playlist_track_map_id`),
  KEY `fk_playlist_track_map_playlists_playlists_id_idx` (`playlist`),
  KEY `fk_playlist_track_map_tracks_dees_trac_id_idx` (`track`),
  CONSTRAINT `fk_playlist_track_map_playlists_playlists_id` FOREIGN KEY (`playlist`) REFERENCES `playlists` (`playlists_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_playlist_track_map_tracks_dees_trac_id` FOREIGN KEY (`track`) REFERENCES `tracks` (`deez_tracks_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_track_map`
--

LOCK TABLES `playlist_track_map` WRITE;
/*!40000 ALTER TABLE `playlist_track_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlist_track_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlists` (
  `playlists_id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist_name` varchar(255) NOT NULL,
  `created_on` date NOT NULL,
  `duration` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `hash` longtext NOT NULL,
  `is_deleted` tinyint(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`playlists_id`),
  KEY `fk_playlists_users_users_id_idx` (`created_by`),
  CONSTRAINT `fk_playlists_users_users_id` FOREIGN KEY (`created_by`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `roles_id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`roles_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'user'),(3,'supperuser');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routes` (
  `routes_id` int(11) NOT NULL AUTO_INCREMENT,
  `start_point` varchar(255) NOT NULL,
  `end_point` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `created_on` date NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`routes_id`),
  KEY `fk_routes_users_users_id_idx` (`user`),
  CONSTRAINT `fk_routes_users_users_id` FOREIGN KEY (`user`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracks`
--

DROP TABLE IF EXISTS `tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tracks` (
  `tracks_id` int(11) NOT NULL AUTO_INCREMENT,
  `deez_tracks_id` int(11) NOT NULL,
  `track_title` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `artist` int(11) NOT NULL,
  `genre` int(11) NOT NULL,
  PRIMARY KEY (`tracks_id`),
  KEY `fk_tracks_artists_deez_artists_id_idx` (`artist`),
  KEY `fk-tracks_genres_deez_genres_id_idx` (`genre`),
  KEY `deez_tracks_id` (`deez_tracks_id`),
  CONSTRAINT `fk-tracks_genres_deez_genres_id` FOREIGN KEY (`genre`) REFERENCES `genres` (`deez_genres_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tracks_artists_deez_artists_id` FOREIGN KEY (`artist`) REFERENCES `artists` (`deez_artists_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `users_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` longtext NOT NULL,
  `email` varchar(100) NOT NULL,
  `user_role` int(11) NOT NULL,
  `is_deleted` int(11) DEFAULT 0,
  PRIMARY KEY (`users_id`),
  KEY `fl_users_roles_roles_id_idx` (`user_role`),
  CONSTRAINT `fl_users_roles_roles_id` FOREIGN KEY (`user_role`) REFERENCES `roles` (`roles_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','$2b$10$mg1sIkYhBUlOZ6E9tvHFeushKphIlQlhoaHTQ9gXz6Tu78mSysu8e','admin@admin.com',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'playlist_generator'
--

--
-- Dumping routines for database 'playlist_generator'
--
/*!50003 DROP PROCEDURE IF EXISTS `RESET AUTO INCREMENT` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RESET AUTO INCREMENT`()
BEGIN
	ALTER TABLE tracks AUTO_INCREMENT = 1;
	ALTER TABLE routes AUTO_INCREMENT = 1;
	ALTER TABLE playlists AUTO_INCREMENT = 1;
	ALTER TABLE playlist_track_map AUTO_INCREMENT = 1;
	ALTER TABLE playlist_genre_map AUTO_INCREMENT = 1;
    ALTER TABLE genres AUTO_INCREMENT = 1;
    ALTER TABLE genre_artist_map AUTO_INCREMENT = 1;
    ALTER TABLE artists AUTO_INCREMENT = 1;
	ALTER TABLE albums AUTO_INCREMENT = 1;
	ALTER TABLE album_track_map AUTO_INCREMENT = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-06 21:51:41
