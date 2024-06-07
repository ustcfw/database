-- Active: 1716710740869@@127.0.0.1@3306@teaching_research
CREATE DATABASE teaching_research;

USE teaching_research;

DROP TABLE IF EXISTS teachers;

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    gender INT NOT NULL,
    title INT NOT NULL
);
DROP TABLE IF EXISTS papers;
ALTER TABLE papers DROP FOREIGN KEY papers_ibfk_1;
ALTER TABLE papers DROP FOREIGN KEY published_papers_ibfk_1;
CREATE TABLE papers (
    id INT PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    source VARCHAR(256) NOT NULL,
    publication_year DATE NOT NULL,
    type INT NOT NULL,
    level INT NOT NULL
);
DROP TABLE IF EXISTS published_papers;
CREATE TABLE published_papers (
    teacher_id INT NOT NULL,
    ranking INT NOT NULL,
    is_corresponding_author BOOLEAN NOT NULL,
    paper_id INT,
    PRIMARY KEY (ranking, paper_id),
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
ALTER TABLE published_papers DROP FOREIGN KEY published_papers_ibfk_1;
ALTER TABLE published_papers ADD CONSTRAINT published_papers_ibfk_1
FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE;
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    id INT PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    source VARCHAR(256) NOT NULL,
    type INT NOT NULL,
    total_funding FLOAT NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL
);
DROP TABLE IF EXISTS undertaken_projects;
CREATE TABLE undertaken_projects (
    teacher_id INT NOT NULL,
    ranking INT NOT NULL,
    funding FLOAT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (ranking, project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
ALTER TABLE undertaken_projects DROP FOREIGN KEY undertaken_projects_ibfk_1;
ALTER TABLE undertaken_projects ADD CONSTRAINT undertaken_projects_ibfk_1
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    id INT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    hours INT NOT NULL,
    type INT NOT NULL
);
ALTER TABLE main_courses DROP FOREIGN KEY main_courses_ibfk_1;
ALTER TABLE main_courses ADD CONSTRAINT main_courses_ibfk_1
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
DROP TABLE IF EXISTS main_courses;
-- 创建主讲课程表
CREATE TABLE main_courses (
    teacher_id INT NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    hours INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (year, semester, course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

DROP PROCEDURE IF EXISTS PublishPaper;
CREATE  PROCEDURE PublishPaper(
    IN id INT,
    IN title VARCHAR(256),
    IN source VARCHAR(256),
    IN publication_year DATE,
    IN author_id INT,
    IN ranking INT,
    IN is_corresponding_author BOOLEAN,
    IN type INT,
    IN level INT
)
BEGIN
    DECLARE existing_corresponding_author INT;
    DECLARE existing_ranking INT;
    DECLARE done INT DEFAULT FALSE;

    -- 检索与当前输入的论文编号一致的论文
    DECLARE cur CURSOR FOR 
    SELECT is_corresponding_author, ranking 
    FROM published_papers
    WHERE id = paper_id;

    -- 定义一个处理程序，当 NOT FOUND 条件发生时，设置 done 变量的值为 TRUE
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    FETCH NEXT FROM cur INTO existing_corresponding_author, existing_ranking;

    WHILE done = FALSE DO
        -- 检查是否已经有通讯作者存在
        IF existing_corresponding_author = TRUE AND is_corresponding_author = TRUE THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A corresponding author already exists for this paper.';
        END IF;

        -- 检查作者排名是否重复
        IF existing_ranking = ranking THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'This ranking already exists for this paper.';
        END IF;

        FETCH NEXT FROM cur INTO existing_corresponding_author, existing_ranking;
    END WHILE;

    CLOSE cur;
    INSERT INTO papers (id, title, source, publication_year, type, level)
    VALUES (id, title, source, publication_year, type, level);
    INSERT INTO published_papers (paper_id, teacher_id, ranking, is_corresponding_author)
    VALUES (id, author_id, ranking, is_corresponding_author);
    
END;

DROP PROCEDURE IF EXISTS DeletePaper;
CREATE PROCEDURE DeletePaper(
    IN paperid INT
)
BEGIN
    -- 检查是否存在这篇论文
    IF NOT EXISTS (SELECT * FROM papers WHERE id = paperid) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This paper does not exist.';
    END IF;

    DELETE FROM papers WHERE id = paperid;
    
END;
CALL `DeletePaper`(3);
ALTER TABLE teachers AUTO_INCREMENT =5;
INSERT INTO teachers (id, name, gender, title) VALUES ('1', 'Alice', 2, 6);
INSERT INTO teachers (id, name, gender, title) VALUES ('2', 'Bob', 1, 4);
INSERT INTO teachers (id, name, gender, title) VALUES ('3', 'Carol', 2, 5); 
INSERT INTO teachers (id, name, gender, title) VALUES ('4', 'David', 1, 3);
INSERT INTO papers (id,title, source, publication_year, type, level) VALUES (1,'Research on AI', 'Journal of AI', '2022-01-01', 1, 1);
INSERT INTO papers (id,title, source, publication_year, type, level) VALUES (2,'Machine Learning Techniques', 'Conference on ML', '2022-02-15', 2, 2); 

INSERT INTO published_papers (ranking, is_corresponding_author, paper_id,teacher_id) VALUES (1, TRUE, 1, 1);
INSERT INTO published_papers (ranking, is_corresponding_author, paper_id,teacher_id) VALUES (2, FALSE, 2, 2);
INSERT INTO projects (id, title, source, type, total_funding, start_year, end_year) VALUES ('1', 'AI Project', 'National Science Foundation', 1, 50000.0, 2021, 2023);
INSERT INTO undertaken_projects (ranking, funding, project_id,teacher_id) VALUES (1, 50000.0, '001', 1);

INSERT INTO courses (id, name, hours, type) VALUES ('001', 'Intro to CS', 48, 1);
INSERT INTO courses (id, name, hours, type) VALUES ('002', 'Database Management', 36, 2);

INSERT INTO main_courses (year, semester, hours, course_id,teacher_id) VALUES (2022, 1, 48, '001', 1);

INSERT INTO main_courses (year, semester, hours, course_id,teacher_id) VALUES (2022, 2, 36, '002', 2);



INSERT INTO projects (id, title, source, type, total_funding, start_year, end_year) VALUES ('2', 'Data Analysis Project', 'Department of Statistics', 2, 100000.0, 2022, 2024); 
INSERT INTO undertaken_projects (ranking, funding, project_id,teacher_id) VALUES (2, 80000.0, '002',2);
