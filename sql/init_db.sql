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
    PRIMARY KEY (teacher_id, paper_id),
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
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
    PRIMARY KEY (teacher_id, project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    id INT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    hours INT NOT NULL,
    type INT NOT NULL
);
DROP TABLE IF EXISTS main_courses;
-- 创建主讲课程表
CREATE TABLE main_courses (
    teacher_id INT NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    hours INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (teacher_id, course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
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

DELIMITER $$

CREATE PROCEDURE InsertPublishedPaper(
    IN _teacher_id INT,
    IN _ranking INT,
    IN _is_corresponding_author BOOLEAN,
    IN _paper_id INT
)
BEGIN
    -- 检查是否已有通讯作者
    IF EXISTS (
        SELECT 1
        FROM published_papers
        WHERE paper_id = _paper_id AND is_corresponding_author = TRUE AND _is_corresponding_author = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This paper already has a corresponding author.';
    END IF;

    -- 检查作者排名是否重复
    IF EXISTS (
        SELECT 1
        FROM published_papers
        WHERE paper_id = _paper_id AND ranking = _ranking
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This ranking for the paper already exists.';
    END IF;

    -- 插入记录
    INSERT INTO published_papers(teacher_id, ranking, is_corresponding_author, paper_id)
    VALUES (_teacher_id, _ranking, _is_corresponding_author, _paper_id);
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UpdatePublishedPaper(
    IN _teacher_id INT,
    IN _ranking INT,
    IN _is_corresponding_author BOOLEAN,
    IN _paper_id INT
)
BEGIN
    -- 检查是否已有通讯作者
    IF _is_corresponding_author = TRUE AND EXISTS (
        SELECT 1
        FROM published_papers
        WHERE paper_id = _paper_id AND is_corresponding_author = TRUE AND teacher_id <> _teacher_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Another corresponding author exists for this paper.';
    END IF;

    -- 检查作者排名是否重复
    IF EXISTS (
        SELECT 1
        FROM published_papers
        WHERE paper_id = _paper_id AND ranking = _ranking AND teacher_id <> _teacher_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This ranking for the paper already exists with a different author.';
    END IF;

    -- 更新记录
    UPDATE published_papers
    SET ranking = _ranking, is_corresponding_author = _is_corresponding_author
    WHERE teacher_id = _teacher_id AND paper_id = _paper_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeletePublishedPaper(
    IN _teacher_id INT,
    IN _paper_id INT
)
BEGIN
    -- 删除记录
    DELETE FROM published_papers
    WHERE teacher_id = _teacher_id AND paper_id = _paper_id;
END$$

DELIMITER ;


DROP TRIGGER IF EXISTS update_total_funding;
DROP TRIGGER IF EXISTS after_insert_undertaken_projects;
DROP TRIGGER IF EXISTS after_delete_undertaken_projects;
DROP TRIGGER IF EXISTS after_update_undertaken_projects;

DELIMITER $$

-- 插入触发器，直接更新total_funding
CREATE TRIGGER after_insert_undertaken_projects AFTER INSERT ON undertaken_projects
FOR EACH ROW
BEGIN
    UPDATE projects
    SET total_funding = (SELECT SUM(funding) FROM undertaken_projects WHERE project_id = NEW.project_id)
    WHERE id = NEW.project_id;
END$$

-- 更新触发器，直接更新total_funding
CREATE TRIGGER after_update_undertaken_projects AFTER UPDATE ON undertaken_projects
FOR EACH ROW
BEGIN
    UPDATE projects
    SET total_funding = (SELECT SUM(funding) FROM undertaken_projects WHERE project_id = NEW.project_id)
    WHERE id = NEW.project_id;
END$$

DELIMITER ;

DELIMITER $$

DELIMITER $$

CREATE TRIGGER after_delete_undertaken_projects
AFTER DELETE ON undertaken_projects
FOR EACH ROW
BEGIN
    UPDATE projects
    SET total_funding = COALESCE(
        (SELECT SUM(funding) FROM undertaken_projects WHERE project_id = OLD.project_id),
        0
    )
    WHERE id = OLD.project_id;
END$$

DELIMITER ;

DELIMITER ;


DROP PROCEDURE IF EXISTS RegisterTeacherProject;
DELIMITER $$

CREATE PROCEDURE RegisterTeacherProject(IN teacher_id INT, IN projectid INT, IN rank1 INT, IN fund FLOAT)
BEGIN
    -- 首先检查项目是否存在
    DECLARE project_exists INT DEFAULT 0;
    DECLARE rank_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO project_exists
    FROM projects
    WHERE id = projectid;

    IF project_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project does not exist.';
    ELSE
        -- 检查是否存在相同项目中的相同排名
        
        SELECT COUNT(*) INTO rank_exists
        FROM undertaken_projects
        WHERE project_id = projectid AND ranking = rank1;

        IF rank_exists > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rank already exists for this project.';
        ELSE
            -- 插入新的承担项目记录
            INSERT INTO undertaken_projects (teacher_id, project_id, ranking, funding)
            VALUES (teacher_id, projectid, rank1, fund);
        END IF;
    END IF;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateUndertakenProject;
DELIMITER $$



CREATE PROCEDURE UpdateUndertakenProject(IN teacherid INT, IN projectid INT, IN rank1 INT, IN fund FLOAT)
BEGIN
    DECLARE project_exists INT DEFAULT 0;
    DECLARE rank_exists INT DEFAULT 0;
    DECLARE total_fund FLOAT DEFAULT 0;
    DECLARE project_funding FLOAT DEFAULT 0;

    SELECT COUNT(*) INTO project_exists FROM projects WHERE id = projectid;
    IF project_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project does not exist.';
    ELSE
        SELECT COUNT(*) INTO rank_exists FROM undertaken_projects WHERE project_id = projectid AND ranking = rank1 AND teacher_id != teacherid;
        IF rank_exists > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rank already exists for this project with a different teacher.';
        ELSE
            -- 计算指定项目的所有教师经费总和，假设当前教师的经费已更新
            SELECT SUM(funding) - COALESCE((SELECT funding FROM undertaken_projects WHERE teacher_id = teacherid AND project_id = projectid), 0) + fund INTO total_fund FROM undertaken_projects WHERE project_id = projectid;
            -- 获取项目的总经费
            SELECT total_funding INTO project_funding FROM projects WHERE id = projectid;
            
            -- 检查项目总经费是否等于所有教师的经费总和
            IF total_fund = project_funding THEN
                -- 如果相等，更新当前教师的经费和排名
                UPDATE undertaken_projects SET ranking = rank1, funding = fund WHERE teacher_id = teacherid AND project_id = projectid;
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Total funding does not match the sum of all teachers'' funding for this project.';
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeleteUndertakenProject(IN teacherid INT, IN projectid INT)
BEGIN
    DECLARE project_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO project_exists FROM undertaken_projects WHERE teacher_id = teacherid AND project_id = projectid;
    IF project_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project undertaking does not exist for this teacher.';
    ELSE
        DELETE FROM undertaken_projects WHERE teacher_id = teacherid AND project_id = projectid;
    END IF;
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS trg_maincourse_insert;
DROP TRIGGER IF EXISTS trg_maincourse_update;
DROP TRIGGER IF EXISTS trg_maincourse_delete;
-- INSERT 触发器
CREATE TRIGGER trg_maincourse_insert
AFTER INSERT ON main_courses
FOR EACH ROW
BEGIN
    UPDATE courses c
    JOIN (
        SELECT course_id, year, semester, SUM(hours) AS total_hours
        FROM main_courses
        WHERE course_id = NEW.course_id AND year = NEW.year AND semester = NEW.semester
        GROUP BY course_id, year, semester
    ) mc ON c.id = mc.course_id
    SET c.hours = mc.total_hours;
END;


DROP TRIGGER IF EXISTS trg_maincourse_update;
-- UPDATE 触发器
CREATE TRIGGER trg_maincourse_update
AFTER UPDATE ON main_courses
FOR EACH ROW
BEGIN
    UPDATE courses c
    JOIN (
        SELECT course_id, year, semester, SUM(hours) AS total_hours
        FROM main_courses
        WHERE course_id = NEW.course_id AND year = NEW.year AND semester = NEW.semester
        GROUP BY course_id, year, semester
    ) mc ON c.id = mc.course_id
    SET c.hours = mc.total_hours;
END;

-- DELETE 触发器
CREATE TRIGGER trg_maincourse_delete
AFTER DELETE ON main_courses
FOR EACH ROW
BEGIN
    UPDATE courses c
    JOIN (
        SELECT course_id, year, semester, SUM(hours) AS total_hours
        FROM main_courses
        WHERE course_id = OLD.course_id AND year = OLD.year AND semester = OLD.semester
        GROUP BY course_id, year, semester
    ) mc ON c.id = mc.course_id
    SET c.hours = mc.total_hours;
END;
-- 添加课程的过程
DELIMITER $$

DROP PROCEDURE IF EXISTS AddMainCourse;
CREATE PROCEDURE AddMainCourse(IN _course_id INT, IN _year INT, IN _semester INT, IN _hours INT, IN _teacher_id INT)
BEGIN
    DECLARE course_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO course_exists FROM courses WHERE id = _course_id;

    IF course_exists > 0 THEN
        INSERT INTO main_courses (course_id, year, semester, hours, teacher_id) VALUES (_course_id, _year, _semester, _hours, _teacher_id);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course does not exist.';
    END IF;
END$$
DELIMITER ;
DROP PROCEDURE IF EXISTS UpdateMainCourse;
-- 修改课程的过程
DELIMITER $$
CREATE PROCEDURE UpdateMainCourse(IN _course_id INT, IN _year INT, IN _semester INT, IN _new_hours INT, IN _teacher_id INT)
BEGIN
    DECLARE total_hours INT DEFAULT 0;
    DECLARE course_hours INT DEFAULT 0;
    DECLARE adjusted_total_hours INT DEFAULT 0;

    IF EXISTS (SELECT 1 FROM courses WHERE id = _course_id) THEN
        
        
        -- 计算相同学年学期的课程各教师主讲学时总和
        SELECT SUM(hours) INTO total_hours FROM main_courses WHERE course_id = _course_id AND year = _year AND semester = _semester  AND teacher_id != _teacher_id;
        
        -- 获取课程的总学时
        SELECT hours INTO course_hours FROM courses WHERE id = _course_id;

        SET adjusted_total_hours = total_hours + _new_hours;
        
        -- 检查课程总学时是否等于各教师主讲学时总和
        IF adjusted_total_hours != course_hours THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Total teaching hours do not match the course''s total hours for the given year and semester.';
        ELSE
            UPDATE main_courses SET hours = _new_hours, year = _year, semester = _semester WHERE course_id = _course_id AND teacher_id = _teacher_id;
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course does not exist.';
    END IF;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteMainCourse;
-- 删除课程的过程
DELIMITER $$
CREATE PROCEDURE DeleteMainCourse(IN _course_id INT,  IN _teacher_id INT)
BEGIN
    IF EXISTS (SELECT 1 FROM main_courses WHERE course_id = _course_id AND teacher_id = _teacher_id) THEN
        DELETE FROM main_courses WHERE course_id = _course_id  AND teacher_id = _teacher_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course or record does not exist.';
    END IF;
END$$
DELIMITER ;

CALL `DeletePaper`(3);
CALL `RegisterTeacherProject`(1, 2, 1, 50000.0);
CALL `DeleteUndertakenProject`(1, 2);
CALL `UpdateUndertakenProject`(2, 2, 1, 70000.0);

CALL `AddMainCourse`(2, 2022, 1, 24, 1);
CALL `UpdateMainCourse`(2, 2022, 2, 24, 1);
CALL `DeleteMainCourse`(2, 2022, 2, 1);


CALL `InsertPublishedPaper`(1, 1, TRUE, 2);
CALL `UpdatePublishedPaper`(1, 2, FALSE, 2);
CALL `DeletePublishedPaper`(1, 2);
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
