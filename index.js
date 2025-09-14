const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Database connection
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }, // required on Render
});

db.connect();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper function to get a random quote
async function getRandomQuote() {
  try {
    const response = await axios.get(
      "https://thequoteshub.com/api/random-quote"
    );
    const rawText = response.data;
    const quote = rawText.split("Quote:")[1].split("Author:")[0].trim();
    const author = rawText.split("Author:")[1].split("\n")[0].trim();
    return { quote, author };
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Fallback quote if API fails
    return {
      quote:
        "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
    };
  }
}

// Helper function to get book cover images
function getCoverImages(books) {
  const coverImages = [];
  for (const book of books) {
    coverImages.push(
      "https://covers.openlibrary.org/b/isbn/" + book.isbn + "-M.jpg"
    );
  }
  return coverImages;
}

// Home route - Display all books
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    const books = result.rows;
    const coverImages = getCoverImages(books);
    const quoteData = await getRandomQuote();

    res.render("index.ejs", { quoteData, books, coverImages });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Error loading page");
  }
});

// New book form route
app.get("/new", (req, res) => {
  res.render("addBook.ejs");
});

// Add new book route
app.post("/new", async (req, res) => {
  try {
    // Authenticate user
    const response = await db.query(
      "SELECT 1 FROM users WHERE username = $1 AND password = $2",
      [req.body.username, req.body.password]
    );

    if (response.rowCount === 0) {
      console.error("Invalid username or password");
      return res.send(`
        <script>
          alert("Invalid username or password!");
          window.location.href = "/";
        </script>
      `);
    }

    // Insert new book
    await db.query(
      "INSERT INTO books (isbn, title, author, rating, date_read, notes, username) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        req.body.isbn,
        req.body.title,
        req.body.author,
        req.body.rating,
        req.body.dateRead,
        req.body.notes,
        req.body.username,
      ]
    );

    return res.send(`
      <script>
        alert("Book added successfully!");
        window.location.href = "/";
      </script>
    `);
  } catch (error) {
    console.error("Error adding book:", error);
    return res.send(`
      <script>
        alert("Error adding book: ${error.message.replace(/"/g, '\\"')}");
        window.location.href = "/";
      </script>
    `);
  }
});

// Sort books route - FIXED: Now includes quoteData
app.get("/sort/:criteria", async (req, res) => {
  try {
    const { criteria } = req.params;
    let result;

    if (criteria === "date") {
      result = await db.query("SELECT * FROM books ORDER BY date_read DESC");
    } else if (criteria === "rating") {
      result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    } else {
      // Handle invalid sort criteria
      return res.redirect("/");
    }

    const books = result.rows;
    const coverImages = getCoverImages(books);
    const quoteData = await getRandomQuote();

    res.render("index.ejs", { quoteData, books, coverImages });
  } catch (error) {
    console.error("Error sorting books:", error);
    res.redirect("/");
  }
});

// Edit book form route
app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [id]);

    if (result.rows.length === 0) {
      console.error("Book not found");
      return res.redirect("/");
    }

    const book = result.rows[0];
    res.render("editBook.ejs", { book });
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.redirect("/");
  }
});

// Update book route
app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Authenticate user
    const response = await db.query(
      "SELECT 1 FROM users WHERE username = $1 AND password = $2",
      [req.body.username, req.body.password]
    );

    if (response.rowCount === 0) {
      console.error("Invalid username or password");
      return res.send(`
        <script>
          alert("Invalid username or password!");
          window.location.href = "/";
        </script>
      `);
    }

    // Update book
    const updateResult = await db.query(
      "UPDATE books SET isbn = $1, title = $2, author = $3, rating = $4, date_read = $5, notes = $6 WHERE isbn = $7",
      [
        req.body.isbn,
        req.body.title,
        req.body.author,
        req.body.rating,
        req.body.dateRead,
        req.body.notes,
        id,
      ]
    );

    if (updateResult.rowCount === 0) {
      return res.send(`
        <script>
          alert("Book not found or no changes made!");
          window.location.href = "/";
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("Book updated successfully!");
        window.location.href = "/";
      </script>
    `);
  } catch (error) {
    console.error("Error updating book data:", error);
    return res.send(`
      <script>
        alert("Error updating book data: ${error.message.replace(
          /"/g,
          '\\"'
        )}");
        window.location.href = "/";
      </script>
    `);
  }
});

// Delete book route
app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM books WHERE isbn = $1", [id]);

    if (result.rowCount === 0) {
      console.error("Book not found");
      return res.send(`
        <script>
          alert("Book not found.");
          window.location.href = "/";
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("Book deleted successfully!");
        window.location.href = "/";
      </script>
    `);
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.send(`
      <script>
        alert("Error deleting book: ${String(error.message).replace(
          /"/g,
          '\\"'
        )}");
        window.location.href = "/";
      </script>
    `);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit http://localhost:${port} to access Sobi's Library`);
});
