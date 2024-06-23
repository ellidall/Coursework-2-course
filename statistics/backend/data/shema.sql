USE vk_statistics;
CREATE DATABASE vk_statistics;
GRANT ALL PRIVILEGES ON vk_statistics.* TO 'username'@'%';
SHOW TABLES;
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    first_name VARCHAR(255) NOT NULL ,
    last_name VARCHAR(255) NOT NULL
);
CREATE TABLE hashtag (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    user_id INT NOT NULL ,
    hashtag VARCHAR(255) NOT NULL ,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
DROP TABLE user;
DROP TABLE hashtag;
SELECT * FROM hashtag;
SELECT * FROM user;

