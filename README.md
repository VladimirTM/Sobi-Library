# Capstone Project 5: Sobi's Library Management System

This repository showcases my fifth capstone project from the Web Development Bootcamp. The project involves building a **comprehensive personal library management system** using **Node.js**, **Express.js**, **EJS**, and **PostgreSQL**, with custom responsive styling and external API integration for quotes and book covers.

## Features

* **Complete Book Management:** Add, edit, view, and delete books from your personal library
* **Rich Book Details:** Track ISBN, title, author, rating (1-5 stars), date read, and personal notes
* **User Authentication:** Username/password authentication for secure book management operations
* **Dynamic Book Covers:** Automatically fetches book cover images using Open Library API
* **Inspirational Quotes:** Displays random literary quotes on the homepage using external quote API
* **Smart Sorting Options:** Sort books by date read or rating for better organization
* **Responsive Design:** Bootstrap-powered interface that works seamlessly across all devices
* **Visual Feedback:** Color-coded ratings, hover effects, and smooth animations
* **Data Persistence:** PostgreSQL database for reliable data storage and retrieval

## Technologies Used

* **Node.js** - JavaScript runtime for server-side development
* **Express.js** - Web application framework for routing and middleware
* **EJS** - Embedded JavaScript templating engine for dynamic HTML rendering
* **PostgreSQL** - Robust relational database for data persistence
* **Bootstrap 5** - Modern CSS framework for responsive design
* **Font Awesome** - Icon library for enhanced visual elements
* **Axios** - HTTP client for external API requests
* **Body-parser** - Middleware for parsing form data
* **Dotenv** - Environment variable management for secure configuration

## Project Structure

```
├── index.js              # Main server file with Express routes and database operations
├── views/
│   ├── index.ejs         # Homepage displaying book library with quotes
│   ├── addBook.ejs       # Form for adding new books to the library
│   └── editBook.ejs      # Form for editing existing book details
├── public/
│   └── styles.css        # Custom CSS with modern design and color scheme
├── package.json          # Project dependencies and scripts
└── .env                  # Environment variables (database configuration)
```

## Database Schema

**Books Table:**
* `isbn` (VARCHAR) - Primary key, book identifier
* `title` (VARCHAR) - Book title
* `author` (VARCHAR) - Author name
* `rating` (INTEGER) - Rating from 1-5 stars
* `date_read` (DATE) - Date when the book was read
* `notes` (TEXT) - Personal notes and thoughts about the book
* `username` (VARCHAR) - Associated user for the book entry

**Users Table:**
* `username` (VARCHAR) - User login name
* `password` (VARCHAR) - User password for authentication

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/VladimirTM/Sobi-Library.git
cd Sobi-Library
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```sql
-- Crete tables

CREATE TABLE users (
    username VARCHAR(20) PRIMARY KEY,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE books (
    isbn CHAR(13) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    date_read DATE NOT NULL,
    notes VARCHAR(255),
    username VARCHAR(20) NOT NULL REFERENCES users(username)
);

-- Populate with dummy data

-- Insert a user
INSERT INTO users (username, password)
VALUES ('user', 'password');

-- Insert 3 books linked to that user
INSERT INTO books (isbn, title, author, rating, date_read, notes, username)
VALUES
('9780140449136', 'The Odyssey', 'Homer', 5, '2023-05-01', 'Epic poem, really enjoyed it', 'user'),
('9780061120084', 'To Kill a Mockingbird', 'Harper Lee', 4, '2023-06-15', 'Powerful story about justice', 'user'),
('9780451524935', '1984', 'George Orwell', 5, '2023-07-20', 'Dystopian classic, very thought-provoking', 'user');
```

4. **Configure environment variables**
Create a `.env` file in the root directory:
```
DB_USER=your_postgresql_username
DB_HOST=your_postgresql_host
DB_NAME=your_database_name
DB_PASSWORD=your_postgresql_password
```

5. **Start the development server**
```bash
node index.js
```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Technical Implementation

* **Database Integration:** PostgreSQL with parameterized queries for security
* **Cloud-Ready Configuration:** Environment variables for database connection with SSL support
* **Authentication System:** Username/password validation for protected operations
* **External APIs:** 
  - Open Library API for book cover images
  - Quote API for inspirational literary quotes
* **Form Validation:** Server-side validation with user-friendly error messages
* **Dynamic Content:** EJS templating for data-driven page rendering
* **Error Handling:** Comprehensive error management with graceful fallbacks
* **Responsive Design:** Bootstrap grid system with custom color scheme
* **Security Features:** SQL injection prevention through parameterized queries

## Key Features Breakdown

### Book Management
* **Add Books:** Complete form with ISBN, title, author, rating, date, and notes
* **Edit Books:** Pre-populated forms for updating existing book information
* **Delete Books:** Secure deletion with confirmation dialogs
* **View Library:** Card-based layout displaying all book details

### Visual Elements
* **Custom Color Scheme:** Orange and blue theme with professional styling
* **Book Covers:** Automatic cover image retrieval with fallback placeholders
* **Rating System:** Visual star ratings with color-coded badges
* **Hover Effects:** Smooth animations and interactive elements

### Sorting & Organization
* **Date Sorting:** Organize books by reading date (newest first)
* **Rating Sorting:** Sort by rating (highest first)
* **Default View:** Display all books in database order

## Database Configuration

The application uses environment variables for secure database configuration:

```javascript
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }, // for cloud deployment
});
```

## Live Demo

Check out the live version of Sobi's Library Management System here: 
**[LIVE DEMO LINK](https://sobis-library.onrender.com/)**

*Note: Demo includes sample books and uses user/password for authentication*
