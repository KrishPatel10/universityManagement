CREATE TABLE IF NOT EXISTS pms.Student_Phoneno(
	Student_ID INT NOT NULL,
	student_phone CHAR VARYING NOT NULL, 
	PRIMARY KEY(Student_ID)
);

Create TABLE IF NOT EXISTS pms.Student_Info(
	Student_ID INT NOT NULL,
	Student_FName CHAR VARYING NOT NULL,
	Student_MName CHAR VARYING NOT NULL,
	Student_LName CHAR VARYING NOT NULL,
	Student_email CHAR VARYING NOT NULL,
	Student_login_password CHAR VARYING NOT NULL,
	CPI CHAR VARYING NOT NULL, 
	Weight CHAR VARYING NOT NULL,
	Height CHAR VARYING NOT NULL,
	Date_of_Birth DATE NOT NULL,
	Street CHAR VARYING NOT NULL,
	City CHAR VARYING NOT NULL, 
	Pincode INT NOT NULL,
	PRIMARY KEY(Student_ID)
);

CREATE TABLE IF NOT EXISTS pms.Employee_Phoneno(
	Employee_ID INT NOT NULL,
	Employee_phone CHAR VARYING NOT NULL,
	PRIMARY KEY(Employee_ID)
);

Create TABLE IF NOT EXISTS pms.Employee_Info(
	Employee_ID INT NOT NULL,
	Employee_FName CHAR VARYING NOT NULL,
	Employee_MName CHAR VARYING NOT NULL,
	Employee_LName CHAR VARYING NOT NULL,
	Employee_email CHAR VARYING NOT NULL,
	Employee_login_password CHAR VARYING NOT NULL,
	Joining_Date DATE NOT NULL, 
	Salary CHAR VARYING NOT NULL,
	Date_of_Birth DATE NOT NULL,
	Street CHAR VARYING NOT NULL,
	City CHAR VARYING NOT NULL,
	Pincode INT NOT NULL,
	PRIMARY KEY(Employee_ID)
);

CREATE TABLE IF NOT EXISTS pms.Course(
	Course_ID INT NOT NULL,
	Course_Name CHAR VARYING NOT NULL,
	Semseter_with_Year CHAR VARYING NOT NULL,
	Credit CHAR VARYING NOT NULL,
	PRIMARY KEY(Course_ID)
);

CREATE TABLE IF NOT EXISTS pms.Section(
	Course_ID INT NOT NULL,
	Instructor_ID INT NOT NULL,
	Section_ID INT NOT NULL,
	Semester CHAR VARYING NOT NULL,
	Year CHAR VARYING NOT NULL,
	PRIMARY KEY(Course_ID, Instructor_ID, Section_ID),
	FOREIGN KEY(Instructor_ID) references pms.employee_Info(employee_id) 
	ON DELETE CASCADE,
	FOREIGN KEY(Course_ID) references pms.course(course_id)
	ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS pms.Occational_comp(
	Date DATE NOT NULL,
	Competition_Name CHAR VARYING NOT NULL,
	PRIMARY KEY(Date, Competition_Name)
);

CREATE TABLE IF NOT EXISTS pms.Activity(
	Activity_ID INT NOT NULL,
	Activity_Name CHAR VARYING NOT NULL,
	PRIMARY KEY(Activity_ID)
);

CREATE TABLE IF NOT EXISTS pms.NonAcedamic_Activity(
	Activity_ID INT NOT NULL,
	Date DATE NOT NULL,
	Student_ID INT NOT NULL,
	Marks CHAR VARYING NOT NULL,
	PRIMARY KEY(Activity_ID, Date, Student_ID),
	FOREIGN KEY(Student_ID) references pms.Student_info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pms.Quiz(
	Activity_ID INT NOT NULL,
	Date DATE NOT NULL,
	Student_ID INT NOT NULL,
	Marks CHAR VARYING NOT NULL,
	PRIMARY KEY(Activity_ID, Date, Student_ID),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pms.Lab(
	Activity_ID INT NOT NULL,
	Date DATE NOT NULL,
	Student_ID INT NOT NULL,
	Marks CHAR VARYING NOT NULL,
	PRIMARY KEY(Activity_ID, Date, Student_ID),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pms.Semster_Exam(
	Activity_ID INT NOT NULL,
	Date DATE NOT NULL,
	Student_ID INT NOT NULL,
	Marks CHAR VARYING NOT NULL,
	PRIMARY KEY(Activity_ID, Date, Student_ID),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS pms.Taken(
	Student_ID INT NOT NULL,
	Course_ID INT NOT NULL,
	Credit CHAR VARYING NOT NULL,
	PRIMARY KEY(Student_ID, Course_ID),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Course_ID) references pms.Course(Course_ID)
	ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS pms.Student_Activity(
	Student_ID INT NOT NULL,
	Activity_ID INT NOT NULL,
	PRIMARY KEY(Student_ID, Activity_ID),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS pms.Occasional_Perf(
	Student_ID INT NOT NULL,
	Date DATE NOT NULL,
	Competition CHAR VARYING NOT NULL,
	Marks CHAR VARYING NOT NULL,
	PRIMARY KEY(Student_ID, Date, Competition),
	FOREIGN KEY(Student_ID) references pms.Student_Info(Student_ID)
	ON DELETE CASCADE
);


CREATE TABLE  IF NOT EXISTS pms.Supervises(
	Employee_ID INT NOT NULL,
	Supervisor_ID INT NOT NULL,
	PRIMARY KEY(Employee_ID)
);

CREATE TABLE IF NOT EXISTS pms.Course_Activity(
	Course_ID INT NOT NULL,
	Activity_ID INT NOT NULL,
	PRIMARY KEY(Course_ID, Activity_ID),
 	FOREIGN KEY(Course_ID) references pms.Course(Course_ID)
	ON DELETE CASCADE,
	FOREIGN KEY(Activity_ID) references pms.Activity(Activity_ID)
	ON DELETE CASCADE
);




