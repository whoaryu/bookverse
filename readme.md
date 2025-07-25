# Book Review Platform – Cursor Build Guide

## 1. Project Overview
A **full-stack Book Review Platform** with:
- **Frontend:** React (Hooks, React Router, Axios)
- **Backend:** Node.js (Express.js)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT-based
- **Styling:** TailwindCSS

The platform allows:
- Adding/viewing books (with filters & pagination).
- Adding/viewing reviews and ratings.
- User authentication (signup/login).

---

## 2. Core Features

### Authentication
- Signup/Login via JWT.
- Only authenticated users can add books or reviews.

### Books
- Add a book (title, author, genre).
- View books with **pagination**.
- Filter books by **author** and **genre**.
- Show **average rating** for each book.

### Reviews
- Add a review with **rating (1–5)** and text.
- View all reviews for a book.
- Show **average rating** on list and detail pages.

### Frontend Pages
1. **Login / Signup**  
2. **Book List (with filters & pagination)**  
3. **Add Book**  
4. **Book Detail (reviews + add review)**  

---

## 3. Project Structure

```
/project-root
  /backend
    server.js
    /src
      /models        # User.js, Book.js, Review.js
      /routes        # auth.js, books.js, reviews.js
      /controllers   # authController.js, bookController.js, reviewController.js
      /middleware    # authMiddleware.js
      /utils         # db.js (MongoDB connection)
  /frontend
    /src
      /components    # BookCard.jsx, Filter.jsx, Pagination.jsx, RatingStars.jsx
      /pages         # Login.jsx, Signup.jsx, BookList.jsx, AddBook.jsx, BookDetail.jsx
      /context       # AuthContext.jsx
      /services      # api.js (axios instance), auth.js
      App.jsx
      index.jsx
  README.md
  .cursor/rules
```

---

## 4. Backend Setup

### Dependencies
```bash
cd backend
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon express-validator
```

### Scripts (`package.json`)
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Run Backend
```bash
npm run dev
```

---

## 5. Frontend Setup

### Dependencies
```bash
cd frontend
npm create vite@latest .   # Choose React
npm install
npm install axios react-router-dom tailwindcss
npx tailwindcss init -p
```

### Run Frontend
```bash
npm run dev
```

---

## 6. API Endpoints

### Auth
- `POST /api/auth/signup` – Register user.  
- `POST /api/auth/login` – Login and get token.

### Books
- `GET /api/books?page=&limit=&genre=&author=` – List books with filters/pagination.
- `POST /api/books` – Add new book (JWT required).
- `GET /api/books/:id` – Get book details (with average rating).

### Reviews
- `POST /api/books/:id/reviews` – Add review (JWT required).
- `GET /api/books/:id/reviews` – List reviews for a book.

---

## 7. Tasks for Cursor

### Backend
- Create `server.js` with Express setup.
- Connect to MongoDB using Mongoose (`db.js`).
- Define models: **User**, **Book**, **Review**.
- Create controllers and routes for **auth**, **books**, **reviews**.
- Implement JWT authentication middleware.
- Add input validation with `express-validator`.

### Frontend
- Build pages: Login, Signup, BookList, AddBook, BookDetail.
- Add `AuthContext` for user authentication state.
- Use Axios for API requests (`api.js`).
- Implement **pagination and filters** in BookList.
- Create **RatingStars** component for average ratings.
- Add forms (with validation) for books and reviews.

---

## 8. Bonus (Optional)
- Add sorting (by rating/date).
- Improve UI with TailwindCSS or MUI.
- Add responsive design.
- Deploy (Frontend: Vercel, Backend: Render/Railway).

---

## 9. Environment Variables
Create a `.env` file in `/backend`:
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 10. Known Limitations
- No advanced search implemented by default.
- Ratings are limited to integers (1–5).
- Pagination defaults: `page=1, limit=10`.
