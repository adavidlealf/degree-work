CREATE DATABASE IF NOT EXISTS degree_work_db;
CREATE USER IF NOT EXISTS 'nest'@'%' IDENTIFIED WITH mysql_native_password BY 'app';
GRANT ALL PRIVILEGES ON degree_work_db.* TO 'nest'@'%';
FLUSH PRIVILEGES;