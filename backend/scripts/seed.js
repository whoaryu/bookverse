require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
const Book = require('../src/models/Book');

const MONGO_URI = process.env.MONGO_URI;

const usersData = [
  { username: 'alice', email: 'alice@example.com', password: 'password123' },
  { username: 'bob', email: 'bob@example.com', password: 'password456' },
  { username: 'charlie', email: 'charlie@example.com', password: 'password789' },
];

const booksData = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic' },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Programming' },
  { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Programming' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clean up
    await User.deleteMany({});
    await Book.deleteMany({});

    // Insert users
    const users = [];
    for (const u of usersData) {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = new User({ ...u, password: hashed });
      await user.save();
      users.push(user);
    }
    console.log('Inserted users:', users.map(u => ({ id: u._id, email: u.email })));

    // Insert books, assign random user as creator
    const books = [];
    for (const b of booksData) {
      const createdBy = users[Math.floor(Math.random() * users.length)]._id;
      const book = new Book({ ...b, createdBy });
      await book.save();
      books.push(book);
    }
    console.log('Inserted books:', books.map(b => ({ id: b._id, title: b.title })));

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed(); 