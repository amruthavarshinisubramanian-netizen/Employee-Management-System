# Employee Management System

A full-stack Employee Management System developed using React.js, Spring Boot, and MySQL. This application provides a centralized platform for managing employee records with secure user authentication and complete CRUD functionality.

## Features

* User Registration and Login Authentication
* Employee Dashboard
* Add New Employees
* View Employee Records
* Update Employee Information
* Delete Employee Records
* Search Employees by Name
* Responsive User Interface
* RESTful API Integration
* MySQL Database Connectivity

## Tech Stack

### Frontend

* React.js
* Bootstrap
* JavaScript
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Data JPA

### Database

* MySQL

### Tools & Technologies

* Git
* GitHub
* Maven
* Postman

## Project Architecture

Frontend (React.js)
↓
REST API Calls
↓
Spring Boot Backend
↓
Spring Data JPA
↓
MySQL Database

## Modules

### Authentication Module

* User Registration
* User Login Validation

### Employee Management Module

* Add Employee
* View Employee List
* Edit Employee Details
* Delete Employee Records
* Search Employee Records

## API Endpoints

### User APIs

* POST /users/register
* POST /users/login

### Employee APIs

* GET /employees
* GET /employees/{id}
* POST /employees/register
* PUT /employees/{id}
* DELETE /employees/{id}

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/amruthavarshinisubramanian-netizen/Employee-Management-System.git
```

### Backend Setup

```bash
cd C:\Projects\Employee-Portal\backend
```

Configure MySQL database in:

```properties
application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=root
spring.datasource.password=Ammu@2302

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run Backend:

```bash
.\mvnw.cmd spring-boot:run
```

### Frontend Setup

```bash
cd C:\Projects\Employee-Portal\react-frontend
npm install
npm run dev
```

## Screenshots

Add screenshots of:

* Login Page
* Registration Page
* Employee Dashboard
* Add Employee Page
* Edit Employee Page

## Future Enhancements

* Role-Based Access Control
* JWT Authentication
* Pagination
* Employee Profile Images
* Advanced Filtering
* Dashboard Analytics
* Deployment on Cloud Platforms

## Author

Amruthavarshini S

GitHub:
https://github.com/amruthavarshinisubramanian-netizen
