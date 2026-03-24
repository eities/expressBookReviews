const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = import('axios');


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username  ||  !password) {
    return res.status(400).json({message: "Register request must include a username and password"});
  }
  else if (users.some(user => user.username === username)) {
    return res.status(409).json({message: "Username already registered"});
  }
  users.push({username: username, password: password});
  return res.send("User successfully registered!");
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const booksRetrieved = await getBooksFromDatabase();
    return res.status(200).json(booksRetrieved);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books from database."});
  }
});

async function getBooksFromDatabase() {
  return books;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    let isbn = req.params.isbn;
    const bookDetails = await getBookFromISBN(isbn);
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details from database."});
  }
 });

 async function getBookFromISBN(isbn) {
  return books[isbn];
 }
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    let author = req.params.author;
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details from database."});
  }
});

async function getBooksByAuthor(author) {
  let booksByAuthor = [];
  for (key in books) {
    (books[key].author == author) && booksByAuthor.push(books[key])};
  return booksByAuthor;

}

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
    let title = req.params.title;
    const booksByTitle = await getBookByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details from database."});
  }
});

async function getBookByTitle(title) {
  let booksByTitle = [];
  for (key in books) {
    (books[key].title == title) && booksByTitle.push(books[key]);
  }
  return booksByTitle;
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
