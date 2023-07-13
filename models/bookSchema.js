const mongoose= require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    unique: true,
  },
  authorName: {
    type: String,
    required: [true, 'Author name is mandatory'],
  } 
  });
    const Book = mongoose.model('Book', bookSchema);

    module.exports = Book;