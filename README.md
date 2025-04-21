# Student Management System

A simple CRUD application built with Spring Boot, SQLite, and a frontend using HTML, CSS, and JavaScript.

## Project Description

This project is a Student Management System that allows you to:
- Create new student records
- Read and display student information
- Update existing student records
- Delete student records

The backend is built with Spring Boot and uses SQLite as the database. The frontend is implemented with vanilla HTML, CSS, and JavaScript.

## How to Run

1. Make sure you have Java 11 (or newer) installed
2. Clone the repository
3. Navigate to the project directory
4. Run the application using the following command:

```bash
./mvnw spring-boot:run
```

Or on Windows:

```bash
mvnw.cmd spring-boot:run
```

5. Open your browser and navigate to `http://localhost:8080`

## API Endpoints

The application exposes the following REST endpoints:

- `GET /info` - Check if the application is running
- `POST /createstudent` - Create a new student
- `GET /readstudents` - Get a list of all students
- `PUT /updatestudent` - Update an existing student
- `DELETE /deletestudent` - Delete a student

## Frontend

The frontend is located in the `src/main/resources/static` directory and consists of:

- `index.html` - The main HTML file
- `styles.css` - CSS styling
- `script.js` - JavaScript for API interactions and DOM manipulation

## Technologies Used

- Backend:
  - Spring Boot
  - Spring Data JPA
  - SQLite

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+) "# checkpoint-1-" 
"# checkpoint-1-" 
"# checkpoint-2" 
"# checkpoint" 
