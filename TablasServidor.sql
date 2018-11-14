DROP DATABASE IF EXISTS `competencias`;
CREATE DATABASE `competencias`;
USE `competencias`;

 competencias | CREATE TABLE `competencias` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `genero` varchar(15) DEFAULT NULL,
  `director` varchar(40) DEFAULT NULL,
  `actor` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |

CREATE TABLE competencias_peliculas
(
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column
    competencia_id INT(11) UNSIGNED NOT NULL,
    peli_id INT(11) UNSIGNED NOT NULL,
    votos INT UNSIGNED NOT NULL,
    FOREIGN KEY  (competencia_id) REFERENCES competencias(id),
    FOREIGN KEY (peli_id) REFERENCES  pelicula(id)
);

