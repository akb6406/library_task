const mongoose= require('mongoose');

const authorSchema = new mongoose.Schema({
   name:String,
 
}
);
authorSchema.pre('remove', async function (next) {
  const authorId = this._id;
  try {
    // Delete all books associated with the author
    await Book.deleteMany({ author: authorId });
    next();
  } catch (error) {
    next(error);
  }
});
  const Author = mongoose.model('Author', authorSchema);
    module.exports = Author;