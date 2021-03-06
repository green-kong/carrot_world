CREATE DATABASE carrot_world2;
USE carrot_world2;

alter database carrot_world default character set UTF8;

CREATE TABLE `user` (
  `u_id` INT AUTO_INCREMENT,
  `userEmail` VARCHAR(64),
  `sns_id` VARCHAR(255),
  `userPW` VARCHAR(255),
  `userAlias` VARCHAR(32),
  `userMobile` VARCHAR(13),
  `point` INT DEFAULT 0,
  `isAdmin` TINYINT(1) DEFAULT 0,
  `u_img` VARCHAR(255),
  PRIMARY KEY(u_id)
);

CREATE TABLE `u_img` (
  `u_id` INT NOT NULL,
  `img` VARCHAR(255) NOT NULL
);

ALTER TABLE `u_img` ADD CONSTRAINT FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;


CREATE TABLE `sell_board` (
  `s_id` INT PRIMARY KEY AUTO_INCREMENT,
  `c_code` VARCHAR(6) NOT NULL,
  `subject` VARCHAR(64) NOT NULL,
  `u_id` INT NOT NULL,
  `price` INT NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `how` TINYINT(1),
  `location` VARCHAR(32),
  `likes` INT DEFAULT 0,
  `isSold` TINYINT(1) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL
);

CREATE TABLE `s_tag` (
  `s_id` INT,
  `tag` VARCHAR(16)
);

CREATE TABLE `s_likes` (
  `u_id` INT,
  `s_id` INT
);

CREATE TABLE `s_img` (
  `s_id` INT,
  `img` VARCHAR(255)
);

CREATE TABLE `auction` (
  `au_id` INT PRIMARY KEY AUTO_INCREMENT,
  `c_code` VARCHAR(6) NOT NULL,
  `subject` VARCHAR(64) NOT NULL,
  `u_id` INT NOT NULL,
  `price` INT NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `how` TINYINT(1),
  `location` VARCHAR(32),
  `likes` INT DEFAULT 0,
  `date` timestamp NOT NULL,
  `startDate` timestamp NOT NULL,
  `isSold` TINYINT(1) NOT NULL DEFAULT 0,
  `bid_mem` INT
);

CREATE TABLE `au_likes` (
  `u_id` INT,
  `au_id` INT
);

CREATE TABLE `au_img` (
  `au_id` INT,
  `img` VARCHAR(255)
);

CREATE TABLE `au_tag` (
  `au_id` INT,
  `tag` VARCHAR(255)
);

CREATE TABLE `qa` (
  `q_id` INT PRIMARY KEY AUTO_INCREMENT,
  `u_id` INT NOT NULL,
  `subject` VARCHAR(64),
  `content` VARCHAR(255),
  `date` timestamp NOT NULL,
  `hit` INT DEFAULT 0
);

CREATE TABLE `q_reply` (
  `qr_id` INT PRIMARY KEY AUTO_INCREMENT,
  `q_id` INT NOT NULL,
  `content` VARCHAR(64),
  `date` timestamp NOT NULL,
  `u_id` INT
);

CREATE TABLE `category` (
  `c_code` VARCHAR(6) PRIMARY KEY NOT NULL,
  `c_name` VARCHAR(8) NOT NULL
);

CREATE TABLE `chat` (
  `c_id` INT PRIMARY KEY AUTO_INCREMENT,
  `mem1` INT NOT NULL,
  `mem2` INT NOT NULL,
  `lastDate` timestamp,
  `lastMsg` VARCHAR(255)
);

CREATE TABLE `chat_log` (
  `c_id` INT NOT NULL,
  `u_id` INT NOT NULL,
  `dialog` VARCHAR(255) NOT NULL,
  `date` timestamp NOT NULL
);

INSERT INTO user (userEmail,userPW,isAdmin) VALUES ('admin','admin','1');

INSERT INTO category (c_code,c_name) VALUES ('clo','??????');
INSERT INTO category (c_code,c_name) VALUES ('fur','?????? & ??????');
INSERT INTO category (c_code,c_name) VALUES ('pet','????????????');
INSERT INTO category (c_code,c_name) VALUES ('acc','??????');

ALTER TABLE `sell_board` ADD FOREIGN KEY (`c_code`) REFERENCES `category` (`c_code`) ON DELETE CASCADE;

ALTER TABLE `s_tag` ADD CONSTRAINT FOREIGN KEY (`s_id`) REFERENCES `sell_board` (`s_id`) ON DELETE CASCADE;

ALTER TABLE `s_likes` ADD CONSTRAINT FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `s_likes` ADD CONSTRAINT FOREIGN KEY (`s_id`) REFERENCES `sell_board` (`s_id`) ON DELETE CASCADE;

ALTER TABLE `s_img` ADD FOREIGN KEY (`s_id`) REFERENCES `sell_board` (`s_id`) ON DELETE CASCADE;

ALTER TABLE `auction` ADD FOREIGN KEY (`c_code`) REFERENCES `category` (`c_code`) ON DELETE CASCADE;

ALTER TABLE `auction` ADD FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `au_likes` ADD FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `au_likes` ADD FOREIGN KEY (`au_id`) REFERENCES `auction` (`au_id`) ON DELETE CASCADE;

ALTER TABLE `au_img` ADD FOREIGN KEY (`au_id`) REFERENCES `auction` (`au_id`) ON DELETE CASCADE;

ALTER TABLE `au_tag` ADD FOREIGN KEY (`au_id`) REFERENCES `auction` (`au_id`) ON DELETE CASCADE;

ALTER TABLE `qa` ADD FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`)ON DELETE CASCADE;

ALTER TABLE `q_reply` ADD CONSTRAINT FOREIGN KEY (`q_id`) REFERENCES `qa` (`q_id`) ON DELETE CASCADE;

ALTER TABLE `q_reply` ADD FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `auction` ADD FOREIGN KEY (`bid_mem`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `chat` ADD FOREIGN KEY (`mem1`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `chat` ADD FOREIGN KEY (`mem2`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;

ALTER TABLE `chat_log` ADD FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE;