DROP DATABASE IF EXISTS `argenleague`;
CREATE DATABASE `argenleague`;
USE `argenleague`;

CREATE TABLE `categorias` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `numero` INT NOT NULL
);
INSERT INTO `categorias` (`numero`) VALUES (1),(2),(3);

CREATE TABLE `grupos` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `numero` INT NOT NULL
);
INSERT INTO `grupos` (`numero`) VALUES (1),(2),(3),(4);

CREATE TABLE `fechas` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `numero` INT NOT NULL
);
INSERT INTO `fechas` (`numero`) VALUES (1),(2),(3);

CREATE TABLE `jugadores` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `nick` VARCHAR(255) NOT NULL,
    `semilla` INT NOT NULL,
    `elo` INT NOT NULL,
    `categoriaId` INT NOT NULL,
    `grupoId` INT NOT NULL,
    FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`),
    FOREIGN KEY (`grupoId`) REFERENCES `grupos` (`id`)
);
INSERT INTO jugadores (nick, semilla, elo, categoriaId, grupoId) VALUES ("DS_Twigg",1,2395,1,4),("Lucky Rox",2,2367,1,2),("BL4CK",3,2325.5,1,3),("DS_Biry",4,2274.5,1,1),("Prisma",5,2271,1,3),("DS_Levi",6,2252,1,4),("Nahuel",7,2224.5,1,2),("KH_Monoz",8,2201.5,1,1),("DS_Carbo",9,2149.5,1,1),("DS_VarVarus",10,2109.5,1,4),("[sig] eskabe",11,2097,1,2),("Redlash",12,2044.5,1,3),("Lucho",13,2042,1,3),("11_Tintin_Arg",14,2040,1,2),("XEVER | Tatengue",15,2034,1,1),("Micav",16,2011,1,4),("Chopi",17,2003,2,1),("Dexter",18,1952.5,2,2),("LHDP | BUCHI",19,1920.5,2,4),("Franketohh",20,1898.5,2,3),("TM Knolte",21,1897.5,2,3),("satisfaction",22,1880.5,2,1),("DS_Prodan",23,1863.5,2,4),("Rodrixs",24,1863.5,2,2),("Ds3.sszafranko",25,1849.5,2,2),("CORP_Anakin",26,1842,2,3),("XEVER | Aguscuruzu",27,1831,2,1),("[MHT] Valeyellow99",28,1827,2,4),("AAOE | Lucsor",29,1822,2,2),("Martyyin",30,1810,2,4),("El_Que_Maneja_la_Combi",31,1803,2,1),("Pablog6",32,1791,2,3),("__97_Lechuga_Arg",33,1790,3,4),("Ds3.Reymon",34,1789,3,1),("XEVER | CaboBV",35,1785.5,3,3),("TM webber",36,1782.5,3,2),("Dabs",37,1781,3,4),("El Ti rex",38,1760,3,3),("DGHIR | Yësicó",39,1753,3,1),("[DaRs] PimiD10S",40,1752,3,2),("Tuxtron935",41,1741,3,3),("Zamaa",42,1700,3,1),("TGT-Custom",43,1699,3,4),("DS_Mascherano",44,1660.5,3,2),("Raofi",45,1646.5,3,3),("Vincent",46,1640,3,4),("Ds3.SoLid",47,1626,3,2),("TM Wosito",48,1619,3,1);

CREATE TABLE `fechas_grupos` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `grupoId` INT NOT NULL,
    `fechaId` INT NOT NULL,
    FOREIGN KEY (`grupoId`) REFERENCES `grupos` (`id`),
    FOREIGN KEY (`fechaId`) REFERENCES `fechas` (`id`)
);

CREATE TABLE `partidas` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `jugadorUnoId` INT DEFAULT NULL,
    `jugadorDosId` INT DEFAULT NULL,
    `fechaId` INT NOT NULL,
    `categoriaId` INT NOT NULL,
    `horario` DATETIME,
    `draft` VARCHAR(255),
    `ganador` TINYINT(3) DEFAULT NULL,
    `grupoId` INT NOT NULL,
    FOREIGN KEY (`jugadorUnoId`) REFERENCES `jugadores` (`id`),
    FOREIGN KEY (`jugadorDosId`) REFERENCES `jugadores` (`id`),
    FOREIGN KEY (`grupoId`) REFERENCES `grupos` (`id`),
    FOREIGN KEY (`fechaId`) REFERENCES `fechas` (`id`)
);
INSERT INTO partidas (jugadorUnoId, jugadorDosId, fechaId, horario, draft, categoriaId, grupoId) VALUES (4,9,1, null, null,1,1),(8,15,1, null, null,1,1),(null,8,2, null, null,1,1),(null,15,2, null, null,1,1),(null,null,3, null, null,1,1),(2,11,1, null, null,1,2),(7,14,1, null, null,1,2),(null,null,2, null, null,1,2),(null,null,2, null, null,1,2),(null,null,3, null, null,1,2),(3,12,1, null, null,1,3),(5,13,1, null, null,1,3),(null,null,2, null, null,1,3),(null,null,2, null, null,1,3),(null,null,3, null, null,1,3),(1,10,1, null, null,1,4),(6,16,1, null, null,1,4),(null,null,2, null, null,1,4),(null,null,2, null, null,1,4),(null,null,3, null, null,1,4);
INSERT INTO partidas (jugadorUnoId, jugadorDosId, fechaId, horario, draft, categoriaId, grupoId) VALUES (17,27,1, null, null,2,1),(22,31,1, null, null,2,1),(null,null,2, null, null,2,1),(null,null,2, null, null,2,1),(null,null,3, null, null,2,1),(18,25,1, null, null,2,2),(24,29,1, null, null,2,2),(null,29,2, null, null,2,2),(null,24,2, null, null,2,2),(null,null,3, null, null,2,2),(20,26,1, null, null,2,3),(21,32,1, null, null,2,3),(null,null,2, null, null,2,3),(null,null,2, null, null,2,3),(null,null,3, null, null,2,3),(19,28,1, null, null,2,4),(23,30,1, null, null,2,4),(null,null,2, null, null,2,4),(null,null,2, null, null,2,4),(null,null,3, null, null,2,4);
INSERT INTO partidas (jugadorUnoId, jugadorDosId, fechaId, horario, draft, categoriaId, grupoId) VALUES (34,42,1, null, null,3,1),(39,48,1, null, null,3,1),(null,null,2, null, null,3,1),(null,null,2, null, null,3,1),(null,null,3, null, null,3,1),(36,44,1, null, null,3,2),(40,47,1, null, null,3,2),(null,null,2, null, null,3,2),(null,null,2, null, null,3,2),(null,null,3, null, null,3,2),(35,41,1, null, null,3,3),(38,45,1, null, null,3,3),(null,null,2, null, null,3,3),(null,null,2, null, null,3,3),(null,null,3, null, null,3,3),(33,43,1, null, null,3,4),(37,46,1, null, null,3,4),(null,null,2, null, null,3,4),(null,null,2, null, null,3,4),(null,null,3, null, null,3,4);

DROP TABLE IF EXISTS `partidasFinales`;
CREATE TABLE `partidasFinales` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `jugadorUnoId` INT DEFAULT NULL,
    `jugadorDosId` INT DEFAULT NULL, 
    `etapaId` INT NOT NULL,
    `categoriaId` INT NOT NULL,
    `ganador` TINYINT(1) DEFAULT NULL,
    FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`),
    FOREIGN KEY (`jugadorUnoId`) REFERENCES `jugadores` (`id`),
    FOREIGN KEY (`jugadorDosId`) REFERENCES `jugadores` (`id`)
);
INSERT INTO partidasFinales (etapaId,categoriaId) VALUES (1,1),(1,1),(1,1),(1,1),(2,1),(2,1),(3,1),(4,1),(1,2),(1,2),(1,2),(1,2),(2,2),(2,2),(3,2),(4,2),(1,3),(1,3),(1,3),(1,3),(2,3),(2,3),(3,3),(4,3);