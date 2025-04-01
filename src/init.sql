/* This is the raw sql file to be executed */

drop database project;
CREATE DATABASE project;
CREATE TABLE project.Student(
StudentID int,
Firstname varchar(50),
Surname varchar(50),
DateOfBirth date,
Email varchar(50),
PRIMARY KEY(StudentID)
);
CREATE TABLE project.Dorm(
RoomID int,
Building varchar(50),
Room varchar(50),
PRIMARY KEY(RoomID)
);
CREATE TABLE project.Course(
CRN varchar(50),
CourseName varchar(50),
Credits int,
PRIMARY KEY(CRN)
);
CREATE TABLE project.Department(
DepartmentID int,
DeparmentName varchar(50),
PRIMARY KEY(DepartmentID)
);
CREATE TABLE project.ProfessorOffice(
OfficeID int,
Faculty varchar(50),
PRIMARY KEY(OfficeID)
);
CREATE TABLE project.Faculty(
FacultyID int,
Faculty_Name varchar(50),
PRIMARY KEY(FacultyID)
);
CREATE TABLE project.Professors(
profid int,
first_and_last_name varchar(50),
FacultyID int,
OfficeID int,
PRIMARY KEY(profid),
FOREIGN KEY (FacultyID) REFERENCES
project.Faculty ON DELETE CASCADE,
FOREIGN KEY (OfficeID) REFERENCES
project.ProfessorOffice ON DELETE CASCADE
);
CREATE TABLE project.Newsletter(
NewsletterID int,
NewsletterName varchar(200),
PublishDate DATE,
PRIMARY KEY(NewsletterID)
);
CREATE TABLE project.Publications(
PublicationID int,
PublicationName varchar(200),
Author varchar(200),
PublishDate DATE,
PRIMARY KEY(PublicationID)
);
CREATE TABLE project.Seminars(
SeminarID int,
SeminarName varchar(200),
Author varchar(200),
PublishDate DATE,
PRIMARY KEY(SeminarID)
);
CREATE TABLE project.Enroll(
StudentID int NOT NULL,
DepartmentID int,
Since date,
PRIMARY KEY(StudentID, DepartmentID),
FOREIGN KEY (StudentID) REFERENCES project.student,
FOREIGN KEY (DepartmentID) REFERENCES project.Department
);
CREATE TABLE project.Recitations(
RecitationID int,
CRN varchar(50) NOT NULL,
Section varchar(50),
PRIMARY KEY(RecitationID, CRN),
FOREIGN KEY (CRN) REFERENCES project.course
ON DELETE CASCADE
);
CREATE TABLE project.prerequisites(
prerequisiteID int,
Credit int,
PRIMARY KEY(prerequisiteID)
);
CREATE TABLE project.course_prerequisites(
coursePrerequisitesID int,
CRN varchar(50),
Course_Name varchar(50),
PRIMARY KEY(coursePrerequisitesID)
);
-- Relationships
CREATE TABLE project.Deliver( -- For the "give" in the seminars
SeminarID int ,
DepartmentID int,
PublishDate date,
PRIMARY KEY(SeminarID, DepartmentID),
FOREIGN KEY (SeminarID) REFERENCES project.Seminars,
FOREIGN KEY (DepartmentID) REFERENCES project.Department
);
CREATE TABLE project.Live(
StudentID int,
RoomID int,
PRIMARY KEY(StudentID),
FOREIGN KEY (StudentID) REFERENCES project.Student ON DELETE CASCADE,
FOREIGN KEY (RoomID) REFERENCES project.Dorm ON DELETE CASCADE
);
CREATE TABLE project.Enrolled_in(
StudentID int,
CRN varchar(50),
FOREIGN KEY (StudentID) REFERENCES project.Student ON DELETE CASCADE,
FOREIGN KEY (CRN) REFERENCES project.Course ON DELETE CASCADE
);
CREATE TABLE project.Teach(
profid int,
CRN varchar(50),
FOREIGN KEY (profid) REFERENCES project.Professors ON DELETE CASCADE,
FOREIGN KEY (CRN) REFERENCES project.Course ON DELETE CASCADE
);
CREATE TABLE project.Enrolled(
enrolmentid int,
StudentID int,
DepartmentID int,
since date,
PRIMARY KEY(enrolmentid),
FOREIGN KEY (StudentID) REFERENCES project.Student ON DELETE CASCADE,
FOREIGN KEY (DepartmentID) REFERENCES project.Department ON DELETE CASCADE
);
CREATE TABLE project.Publish(
PublicationID int,
FacultyID int,
PRIMARY KEY(PublicationID, FacultyID),
FOREIGN KEY (PublicationID) REFERENCES project.Publications ON DELETE CASCADE,
FOREIGN KEY (FacultyID) REFERENCES project.Faculty ON DELETE CASCADE
);
CREATE TABLE project.write(
DepartmentID int,
PublicationID int,
PRIMARY KEY(DepartmentID, PublicationID),
FOREIGN KEY (DepartmentID) REFERENCES project.Department ON DELETE CASCADE,
FOREIGN KEY (PublicationID) REFERENCES project.Publications ON DELETE CASCADE
);
CREATE TABLE project.prereq(
prerequisiteID int,
CRN varchar(50),
coursePrerequisitesID int,
PRIMARY KEY(prerequisiteID, CRN,coursePrerequisitesID),
FOREIGN KEY (prerequisiteID) REFERENCES project.prerequisites ON DELETE CASCADE,
FOREIGN KEY (CRN) REFERENCES project.Course ON DELETE CASCADE,
FOREIGN KEY (coursePrerequisitesID) REFERENCES project.course_prerequisites ON
DELETE CASCADE
);
INSERT INTO project.Student (StudentID, Firstname, Surname, DateOfBirth, Email)
VALUES
(1, 'John', 'Doe', '2000-05-14', 'john.doe@example.com'),
(2, 'Jane', 'Smith', '2001-08-21', 'jane.smith@example.com'),
(3, 'Alice', 'Johnson', '2000-11-10', 'alice.johnson@example.com'),
(4, 'Bob', 'Brown', '1999-02-25', 'bob.brown@example.com'),
(5, 'Charlie', 'White', '2002-06-30', 'charlie.white@example.com'),
(6, 'David', 'Wilson', '2001-07-19', 'david.wilson@example.com'),
(7, 'Eve', 'Taylor', '2000-03-12', 'eve.taylor@example.com'),
(8, 'Frank', 'Anderson', '1999-09-05', 'frank.anderson@example.com'),
(9, 'Grace', 'Harris', '2001-12-15', 'grace.harris@example.com'),
(10, 'Henry', 'Clark', '2002-01-10', 'henry.clark@example.com');
INSERT INTO project.Dorm (RoomID, Building, Room) VALUES
(1, 'A', '101'),
(2, 'B', '202'),
(3, 'C', '303'),
(4, 'D', '404'),
(5, 'E', '505'),
(6, 'F', '606'),
(7, 'G', '707'),
(8, 'H', '808'),
(9, 'I', '909'),
(10, 'J', '1001');
INSERT INTO project.Course (CRN, CourseName, Credits) VALUES
('CS201', 'Introduction to Programming', 3),
('CS300', 'Data Structures', 3),
('CS301', 'Algorithms', 3),
('CS307', 'Operating Systems', 3),
('CS408', 'Computer Networks', 3),
('CS306', 'Database Systems', 3),
('CS404', 'Artificial Intelligence', 3),
('CS412', 'Machine Learning', 3),
('CS411', 'Cryptography', 3),
('CS308', 'Software Engineering', 4);
INSERT INTO project.Department (DepartmentID, DeparmentName) VALUES
(1, 'Computer Science and Engineering'),
(2, 'Mathematics'),
(3, 'Physics'),
(4, 'Electronics'),
(5, 'Industrial Engineering'),
(6, 'Material Science and Nano Engineering'),
(7, 'Economics'),
(8, 'Molecular Biology, Genetics and Bioengineering'),
(9, 'Mechatronics Engineering'),
(10, 'Data Science and Analytics');
INSERT INTO project.ProfessorOffice (OfficeID, Faculty) VALUES
(1, 'FENS'),
(2, 'FASS'),
(3, 'SL'),
(4, 'FMAN'),
(5, 'UC'),
(6, 'SC'),
(7, 'CP'),
(8, 'D4'),
(9, 'SEC'),
(10, 'Güney Kampüs');
INSERT INTO project.Faculty (FacultyID, Faculty_Name) VALUES
(1, 'Faculty of Engineering and Natural Sciences'),
(2, 'Bussiness School'),
(3, 'Faculty of Arts and Social Sciences'),
(4, 'School of Languages');
INSERT INTO project.Newsletter (NewsletterID, NewsletterName, PublishDate)
VALUES
(1, 'ACM Sigmod Record', '2004-03-01'),
(2, 'IEEE International Conference on Robotics and Automation', '2011-05-09'),
(3, 'IEEE Transactions on Knowledge and Data Engineering '
, '2004-05-30'),
(4, 'International Conference on Parallel Processing and Applied Mathematics',
'2013-09-08'),
(5, 'Journal of High Energy Physics', '2007-05-20'),
(6, 'The European Physical Journal', '2024-06-25'),
(7, 'Journal of Computer Security', '2024-07-30'),
(8, 'The Astrophysical Journal', '2000-03-07'),
(9, 'The Journal of Physical Chemistry', '2007-11-08'),
(10, 'Journal of Chemical Information and Modeling', '2018-02-26');
INSERT INTO project.Publications (PublicationID, PublicationName, Author,
PublishDate) VALUES
(1, 'A low-magnetic-field soft gamma repeater', 'Ersin Gogus', '2010-06-15'),
(2, 'Secure association rule sharing', 'Yucel Saygın', '2004-07-21'),
(3, 'The darpa twitter bot challenge', 'Onur Varol', '2016-08-30'),
(4, 'Tight logic programs', 'Esra Erdem', '2003-09-12'),
(5, 'Steering Editor', 'Albert Levi', '2024-10-25'),
(6, 'CMS tracking performance results from early LHC operation', 'Durmus Ali
Demir', '2010-11-05'),
(7, 'Search for gravitational wave bursts from six magnetars', 'Yuki Kaneko',
'2011-12-18'),
(8, 'Allosteric modulation of human Hsp90α conformational dynamics', 'Canan
Atilgan', '2018-01-10'),
(9, 'The Montgomery modular inverse-revisited', 'Erkay Savas', '2000-02-22'),
(10, 'RF power amplifier behavioral modeling', 'Ibrahim Tekin', '2008-03-30');
INSERT INTO project.Seminars (SeminarID, SeminarName, Author, PublishDate)
VALUES
(1, 'Towards the Era of Explainable AI', 'Seda Polat Erdeniz', '2024-03-20'),
(2, 'An Introduction to Quantum Optimization', 'Özlem Salehi Köken',
'2025-02-28'),
(3, 'Optimal Rank-Metric Codes with Rank-Locality from Drinfeld Modules',
'Mohamed Darwish', '2025-02-26'),
(4, 'Quantification and Spectroscopic Analysis of Side Reactions in Solid State
Lithium-ion Batteries',
' Burak Aktekin', '2025-02-26'),
(5, 'Optimizing Foster Care Visitation Scheduling', 'Erhun Kundakçıoğlu',
'2022-02-11'),
(6, 'Blockchain Tech', 'Dr. Henry', '2024-06-25'),
(7, 'Energy Bounds For Weighted Spherical Codes And Designs Via Linear
Programming', 'Peter Boyvalenkov', '2025-02-05'),
(8, 'Nanoscale Design of Layered Ferroelectrics for Future Energy-Efficient
Electronics',
' İpek Efe', '2024-11-25'),
(9, 'Food waste and ugly veg supply chains', 'Güven Demirel', '2024-11-25'),
(10, 'Generalized Spectral Bounds for Quasi-Cyclic and Quasi-Twisted Codes',
'Buket Özkaya', '2024-11-25');
INSERT INTO project.prerequisites (prerequisiteID, Credit) VALUES
(1, 30),
(2, 40),
(3, 50),
(4, 60),
(5, 70),
(6, 80),
(7, 90),
(8, 100),
(9, 110),
(10,20);
INSERT INTO project.Professors (profid, first_and_last_name, FacultyID,
OfficeID)
VALUES
(1, 'John Doe', 1, 1),
(2, 'Jane Smith', 2, 2),
(3, 'Michael Johnson', 3, 3),
(4, 'Emily Davis', 4, 4),
(5, 'Daniel Brown', 1, 5),
(6, 'Sarah Wilson', 2, 6),
(7, 'David Martinez', 3, 7),
(8, 'Laura Taylor', 4, 8),
(9, 'James Anderson', 1, 9),
(10, 'Emma Thomas', 2, 10);
insert into project.course_prerequisites(coursePrerequisitesID,CRN,Course_Name)
values
(1,'CS201','Introduction to Programming'),
(2,'CS300','Data Structures'),
(3,'CS301','Algorithms'),
(4,'CS307','Operating Systems'),
(5,'CS408','Computer Networks'),
(6,'CS306','Database Systems'),
(7,'CS404','Artificial Intelligence'),
(8,'CS412','Machine Learning'),
(9,'CS411','Cryptography'),
(10,'CS308','Software Engineering');
insert into project.Recitations values
(1,'CS201','A'),
(2,'CS300','B'),
(3,'CS301','C'),
(4,'CS307','D'),
(5,'CS408','E'),
(6,'CS306','F'),
(7,'CS404','G'),
(8,'CS412','H'),
(9,'CS411','I'),
(10,'CS308','J');
insert into project.prereq values
(1,'CS201',1),
(2,'CS300',2),
(3,'CS301',3),
(4,'CS307',4),
(5,'CS408',5),
(6,'CS306',6),
(7,'CS404',7),
(8,'CS412',8),
(9,'CS411',9),
(10,'CS308',10);
INSERT INTO project.deliver (SeminarID, DepartmentID, PublishDate) VALUES
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 1), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 1), "2024-03-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 2), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 2), "2024-04-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 3), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 3), "2024-05-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 4), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 4), "2024-06-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 5), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 5), "2024-07-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 6), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 6), "2024-08-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 7), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 7), "2024-03-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 8), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 8), "2024-10-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 9), (SELECT DepartmentID
FROM project.department WHERE DepartmentID = 9), "2024-11-20"),
((SELECT SeminarID FROM project.seminars WHERE SeminarID = 10), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 10), "2024-03-20");
INSERT INTO project.live (StudentID, RoomID) VALUES
((SELECT StudentID FROM project.student WHERE StudentID = 1), (SELECT RoomID FROM
project.dorm WHERE RoomID = 1)),
((SELECT StudentID FROM project.student WHERE StudentID = 2), (SELECT RoomID FROM
project.dorm WHERE RoomID = 2)),
((SELECT StudentID FROM project.student WHERE StudentID = 3), (SELECT RoomID FROM
project.dorm WHERE RoomID = 3)),
((SELECT StudentID FROM project.student WHERE StudentID = 4), (SELECT RoomID FROM
project.dorm WHERE RoomID = 4)),
((SELECT StudentID FROM project.student WHERE StudentID = 5), (SELECT RoomID FROM
project.dorm WHERE RoomID = 5)),
((SELECT StudentID FROM project.student WHERE StudentID = 6), (SELECT RoomID FROM
project.dorm WHERE RoomID = 6)),
((SELECT StudentID FROM project.student WHERE StudentID = 7), (SELECT RoomID FROM
project.dorm WHERE RoomID = 7)),
((SELECT StudentID FROM project.student WHERE StudentID = 8), (SELECT RoomID FROM
project.dorm WHERE RoomID = 8)),
((SELECT StudentID FROM project.student WHERE StudentID = 9), (SELECT RoomID FROM
project.dorm WHERE RoomID = 9)),
((SELECT StudentID FROM project.student WHERE StudentID = 10), (SELECT RoomID FROM
project.dorm WHERE RoomID = 10));
INSERT INTO project.Enrolled_in (StudentID, CRN) VALUES
((SELECT StudentID FROM project.student WHERE StudentID = 1), (SELECT CRN FROM
project.Course WHERE CRN = "CS201")),
((SELECT StudentID FROM project.student WHERE StudentID = 2), (SELECT CRN FROM
project.Course WHERE CRN = "CS204")),
((SELECT StudentID FROM project.student WHERE StudentID = 3), (SELECT CRN FROM
project.Course WHERE CRN = "CS300")),
((SELECT StudentID FROM project.student WHERE StudentID = 4), (SELECT CRN FROM
project.Course WHERE CRN = "CS301")),
((SELECT StudentID FROM project.student WHERE StudentID = 5), (SELECT CRN FROM
project.Course WHERE CRN = "CS306")),
((SELECT StudentID FROM project.student WHERE StudentID = 6), (SELECT CRN FROM
project.Course WHERE CRN = "CS307")),
((SELECT StudentID FROM project.student WHERE StudentID = 7), (SELECT CRN FROM
project.Course WHERE CRN = "CS308")),
((SELECT StudentID FROM project.student WHERE StudentID = 8), (SELECT CRN FROM
project.Course WHERE CRN = "CS404")),
((SELECT StudentID FROM project.student WHERE StudentID = 9), (SELECT CRN FROM
project.Course WHERE CRN = "CS412")),
((SELECT StudentID FROM project.student WHERE StudentID = 10), (SELECT CRN FROM
project.Course WHERE CRN = "CS411"));
INSERT INTO project.Teach (profid, CRN) VALUES
((SELECT profid FROM project.professors WHERE profid = 1), (SELECT CRN FROM
project.course WHERE CRN = "CS201")),
((SELECT profid FROM project.professors WHERE profid = 2), (SELECT CRN FROM
project.course WHERE CRN = "CS300")),
((SELECT profid FROM project.professors WHERE profid = 3), (SELECT CRN FROM
project.course WHERE CRN = "CS301")),
((SELECT profid FROM project.professors WHERE profid = 4), (SELECT CRN FROM
project.course WHERE CRN = "CS306")),
((SELECT profid FROM project.professors WHERE profid = 5), (SELECT CRN FROM
project.course WHERE CRN = "CS307")),
((SELECT profid FROM project.professors WHERE profid = 6), (SELECT CRN FROM
project.course WHERE CRN = "CS308")),
((SELECT profid FROM project.professors WHERE profid = 7), (SELECT CRN FROM
project.course WHERE CRN = "CS404")),
((SELECT profid FROM project.professors WHERE profid = 8), (SELECT CRN FROM
project.course WHERE CRN = "CS408")),
((SELECT profid FROM project.professors WHERE profid = 9), (SELECT CRN FROM
project.course WHERE CRN = "CS411")),
((SELECT profid FROM project.professors WHERE profid = 10), (SELECT CRN FROM
project.course WHERE CRN = "CS412"));
INSERT INTO project.enrolled (enrolmentid, StudentID, DepartmentID, since) VALUES
(1, (SELECT StudentID FROM project.student WHERE StudentID = 1), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 1), "2024-03-20"),
(2, (SELECT StudentID FROM project.student WHERE StudentID = 2), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 2), "2024-03-20"),
(3, (SELECT StudentID FROM project.student WHERE StudentID = 3), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 3), "2024-03-20"),
(4, (SELECT StudentID FROM project.student WHERE StudentID = 4), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 4), "2024-03-20"),
(5, (SELECT StudentID FROM project.student WHERE StudentID = 5), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 5), "2024-03-20"),
(6, (SELECT StudentID FROM project.student WHERE StudentID = 6), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 6), "2024-03-20"),
(7, (SELECT StudentID FROM project.student WHERE StudentID = 7), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 7), "2024-03-20"),
(8, (SELECT StudentID FROM project.student WHERE StudentID = 8), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 8), "2024-03-20"),
(9, (SELECT StudentID FROM project.student WHERE StudentID = 9), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 9), "2024-03-20"),
(10, (SELECT StudentID FROM project.student WHERE StudentID = 10), (SELECT
DepartmentID FROM project.department WHERE DepartmentID = 10), "2024-03-20");
INSERT INTO project.publish (PublicationID, FacultyID) VALUES
((SELECT PublicationID FROM project.publications WHERE PublicationID = 1), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 1)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 2), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 2)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 3), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 3)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 4), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 4)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 5), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 1)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 6), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 2)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 7), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 3)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 8), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 4)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 9), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 1)),
((SELECT PublicationID FROM project.publications WHERE PublicationID = 10), (SELECT
FacultyID FROM project.faculty WHERE FacultyID = 2));
INSERT INTO project.write (DepartmentID, PublicationID) VALUES
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 1), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 1)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 2), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 2)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 3), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 3)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 4), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 4)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 5), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 5)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 6), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 6)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 7), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 7)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 8), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 8)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 9), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 9)),
((SELECT DepartmentID FROM project.department WHERE DepartmentID = 10), (SELECT
PublicationID FROM project.publications WHERE PublicationID = 10));