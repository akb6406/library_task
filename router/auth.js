const express = require('express');
const router = express.Router();
const Author = require('../models/authorSchema');
const Book = require("../models/bookSchema");

router.get('/', async(req,res)=>{
    res.send("hello from the server side");
})

// post new book
router.post('/api/books', async (req, res) => {
  try {
    const { title, author, authorName } = req.body;

    const existingAuthor = await Author.findById(author);

    if (!existingAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      return res.status(409).json({ error: 'Book already exists' });
    }

    const book = new Book({ title, author, authorName });
    await book.save();


    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// retrive all books
router.get("/api/books",async(req, res)=>{
  try {
    const books = await Book.find().populate('author');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
// retrive books perticular
router.get("/api/books/:id",async (req,res)=>{
    try{
        const book=await Book.findById(req.params.id).populate("author");
        if(!book){
            return res.status(404).json({error:"Book not found"});
        }
        res.json(book);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
);
 // update books 
router.put("/api/books/:id",async (req,res)=>{
  try {
    const { id } = req.params;
    const { title, author, authorName } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, authorName },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// delete books
  router.delete('/api/books/:id', async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id).populate('author');
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create routes for Authors
router.post('/api/authors', async (req, res) => {
    try {
      const {name}= req.body;
      const existingAuthors = await Author.findOne({name});

    if (existingAuthors) {
      return res.status(409).json({ error: 'author already exists' });
    }
      const author = new Author(req.body);
      await author.save();
      res.status(201).json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // retrive authors
  router.get('/api/authors', async (req, res) => {
    try {
      const authors = await Author.find();
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // retrive perticular author
  router.get('/api/authors/:id', async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // update authors
  router.put('/api/authors/:id', async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // delete author and all books associated with
  router.delete('/api/authors/:id', async (req, res) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      await Book.deleteMany({ author: author._id });
      res.json({ message: 'Author and associated books deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports=router;


  



  
