# Backend Implementation Guide - Library Module

## Quick Start Guide for Backend Developer

This guide will help you implement the backend API endpoints for the Library Module.

## 🎯 Required Endpoints

### Book Management Endpoints

#### 1. Get All Books with Pagination
```javascript
// GET /api/library/books
router.get('/books', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) query.category = category;
    
    // Status filter
    if (status) query.status = status;
    
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 2. Get Single Book
```javascript
// GET /api/library/books/:bookId
router.get('/books/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 3. Create Book (Protected - Librarian/Admin)
```javascript
// POST /api/library/books
router.post('/books', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

#### 4. Update Book (Protected - Librarian/Admin)
```javascript
// PUT /api/library/books/:bookId
router.put('/books/:bookId', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

#### 5. Delete Book (Protected - Librarian/Admin)
```javascript
// DELETE /api/library/books/:bookId
router.delete('/books/:bookId', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Library Card Endpoints

#### 6. Get My Library Card (Protected - Student)
```javascript
// GET /api/library/card/my-card
router.get('/card/my-card', auth, async (req, res) => {
  try {
    const card = await LibraryCard.findOne({ studentId: req.user._id });
    if (!card) {
      return res.status(404).json({ 
        message: 'Library card not found. Please contact the library.' 
      });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 7. Generate Library Card (Protected - Librarian/Admin)
```javascript
const QRCode = require('qrcode');

// POST /api/library/card/generate
router.post('/card/generate', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Check if card already exists
    const existingCard = await LibraryCard.findOne({ studentId });
    if (existingCard) {
      return res.status(400).json({ message: 'Library card already exists for this student' });
    }
    
    // Get student details
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Generate card number
    const cardNumber = `LIB${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Generate QR Code
    const qrCode = await QRCode.toDataURL(cardNumber);
    
    // Calculate expiry date (4 years from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4);
    
    // Create library card
    const card = new LibraryCard({
      studentId: student._id,
      studentName: student.name,
      department: student.department,
      cardNumber,
      qrCode,
      expiryDate,
      isActive: true
    });
    
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

#### 8. Download Library Card PDF (Protected - Student)
```javascript
const PDFDocument = require('pdfkit');

// GET /api/library/card/download-pdf
router.get('/card/download-pdf', auth, async (req, res) => {
  try {
    const card = await LibraryCard.findOne({ studentId: req.user._id });
    if (!card) {
      return res.status(404).json({ message: 'Library card not found' });
    }
    
    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=library-card-${card.studentId}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add university header
    doc.fontSize(24)
       .text('University Library Card', { align: 'center' })
       .moveDown();
    
    // Add card details
    doc.fontSize(12)
       .text(`Card Number: ${card.cardNumber}`, { bold: true })
       .moveDown(0.5)
       .text(`Student Name: ${card.studentName}`)
       .text(`Student ID: ${card.studentId}`)
       .text(`Department: ${card.department}`)
       .text(`Issue Date: ${new Date(card.issueDate).toLocaleDateString()}`)
       .text(`Expiry Date: ${new Date(card.expiryDate).toLocaleDateString()}`)
       .text(`Status: ${card.isActive ? 'Active' : 'Inactive'}`)
       .moveDown();
    
    // Add QR Code
    if (card.qrCode) {
      const qrBuffer = Buffer.from(card.qrCode.split(',')[1], 'base64');
      doc.image(qrBuffer, { width: 150, align: 'center' });
    }
    
    // Add footer
    doc.moveDown()
       .fontSize(10)
       .text('This is a digitally generated library card.', { align: 'center' })
       .text('Please carry this card when visiting the library.', { align: 'center' });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 9. Get All Library Cards (Protected - Librarian/Admin)
```javascript
// GET /api/library/card/all
router.get('/card/all', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const cards = await LibraryCard.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### 10. Deactivate Library Card (Protected - Librarian/Admin)
```javascript
// PUT /api/library/card/:cardId/deactivate
router.put('/card/:cardId/deactivate', auth, roleCheck(['librarian', 'admin']), async (req, res) => {
  try {
    const card = await LibraryCard.findByIdAndUpdate(
      req.params.cardId,
      { isActive: false },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Library card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## 📦 Required NPM Packages

Install these packages in your backend:

```bash
npm install qrcode pdfkit
```

## 🗄️ MongoDB Schemas

### Book Model
```javascript
// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Computer Science',
      'Engineering',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Literature',
      'History',
      'Economics',
      'Business',
      'Psychology',
      'Philosophy',
      'Other'
    ]
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  shelfLocation: {
    type: String,
    required: [true, 'Shelf location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'issued', 'out-of-stock'],
    default: 'available'
  },
  description: {
    type: String,
    trim: true
  },
  publishYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  coverImage: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-update status based on available copies
bookSchema.pre('save', function(next) {
  if (this.availableCopies === 0) {
    this.status = 'out-of-stock';
  } else if (this.availableCopies < this.totalCopies) {
    this.status = 'issued';
  } else {
    this.status = 'available';
  }
  next();
});

// Indexes for search performance
bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model('Book', bookSchema);
```

### LibraryCard Model
```javascript
// models/LibraryCard.js
const mongoose = require('mongoose');

const libraryCardSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
libraryCardSchema.index({ studentId: 1 });
libraryCardSchema.index({ cardNumber: 1 });
libraryCardSchema.index({ isActive: 1 });

module.exports = mongoose.model('LibraryCard', libraryCardSchema);
```

## 🔐 Middleware Examples

### Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;
```

### Role Check Middleware
```javascript
// middleware/roleCheck.js
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    next();
  };
};

module.exports = roleCheck;
```

## 📁 Folder Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Book.js
│   └── LibraryCard.js
├── routes/
│   └── library.js
├── middleware/
│   ├── auth.js
│   └── roleCheck.js
└── server.js
```

## 🔧 Complete Route File

```javascript
// routes/library.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Book = require('../models/Book');
const LibraryCard = require('../models/LibraryCard');
const User = require('../models/User');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

// ... (paste all endpoints here)

module.exports = router;
```

## 🚀 Server Integration

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const libraryRoutes = require('./routes/library');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/library', libraryRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## ✅ Testing Endpoints

Use these curl commands or Postman to test:

```bash
# Get all books
curl http://localhost:5000/api/library/books

# Get book by ID
curl http://localhost:5000/api/library/books/BOOK_ID

# Create book (requires auth token)
curl -X POST http://localhost:5000/api/library/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "category": "Computer Science",
    "totalCopies": 5,
    "availableCopies": 5,
    "shelfLocation": "CS-101"
  }'
```

## 📝 Environment Variables

Add to `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university-portal
JWT_SECRET=your_jwt_secret_key
```

## 🎯 Implementation Checklist

- [ ] Install required packages (qrcode, pdfkit)
- [ ] Create Book model
- [ ] Create LibraryCard model
- [ ] Implement authentication middleware
- [ ] Implement role-based access middleware
- [ ] Create all book endpoints
- [ ] Create all library card endpoints
- [ ] Test with Postman
- [ ] Integrate with frontend

---

**Ready to use!** The frontend is already implemented and waiting for these endpoints.
