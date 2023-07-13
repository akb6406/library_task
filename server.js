const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const dotenv = require("dotenv")
const Author = require('./models/authorSchema');
const Book = require("./models/bookSchema");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000
dotenv.config({ path: './config.env' });
const DB = require('./DB/conn')
app.use(require('./router/auth'));
// app.use(require('./models/bookSchema'));
// app.use(require('./models/authorSchema'));


// Create API to fetch books and authors for table
app.get('/api/table', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    const authors = await Author.find();

    res.json({ books, authors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create route to generate PDF from table data
app.get('/api/generate-pdf', async (req, res) => {
  try {
    const books = await Book.find().populate('author');

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('table.pdf'));

    doc.font('Helvetica-Bold').fontSize(16).text('Book and Author Data', { align: 'center' });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text('Books and their Authors:');
    doc.moveDown();

    const table = {
      headers: ['Title', 'Author'],
      rows: [],
    };

    books.forEach((book) => {
      const rowData = [book.title, book.author.name];
      table.rows.push(rowData);
    });

    // Calculate the width of each column
    const columnWidth = doc.page.width / table.headers.length;

    // Draw the table headers
    doc.font('Helvetica-Bold').fontSize(10);
    table.headers.forEach((header, index) => {
      doc.text(header, index * columnWidth, doc.y, { width: columnWidth, align: 'left' });
    });

    // Draw the table rows
    doc.font('Helvetica').fontSize(10);
    table.rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(cell, cellIndex * columnWidth, doc.y, { width: columnWidth, align: 'left' });
      });
      doc.moveDown();
    });

    doc.end();
    res.json({ message: 'PDF generated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

