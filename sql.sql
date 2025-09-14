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
