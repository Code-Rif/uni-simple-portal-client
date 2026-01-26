# Library Module Documentation

## 📚 Module Overview

This is the **Library Catalogue & Digital Library Card Module** for the University Portal. It provides complete library management functionality for students, librarians, and administrators.

## ✨ Features

### Student Features
- **Book Catalogue**: Browse and search all available books
- **Advanced Search**: Search by title, author, or ISBN
- **Filter by Category**: Filter books by subject categories
- **Book Details**: View detailed information about each book
- **Digital Library Card**: View and download personal library card as PDF
- **QR Code**: Each card has a unique QR code for easy identification

### Librarian/Admin Features
- **Book Management**: Add, edit, and delete books
- **Inventory Control**: Manage book copies and availability
- **Library Card Management**: Generate and manage student library cards
- **Card Activation**: Activate or deactivate library cards

## 📁 File Structure

```
src/features/library/
├── libraryTypes.ts              # TypeScript interfaces and types
├── libraryApi.ts                # API client functions
├── BookList.tsx                 # Book catalogue page (Student)
├── BookDetail.tsx               # Book details page (Student)
├── MyLibraryCard.tsx           # Library card view (Student)
├── BookManagement.tsx          # Book CRUD operations (Librarian)
└── LibraryCardManagement.tsx   # Card management (Librarian)
```

## 🔗 Routes

### Student Routes
- `/library/books` - Browse all books
- `/library/books/:bookId` - View book details
- `/library/my-card` - View personal library card

### Librarian/Admin Routes
- `/library/manage-books` - Manage books (CRUD)
- `/library/manage-cards` - Manage library cards

## 🎨 Components

### 1. BookList Component
**Path**: `src/features/library/BookList.tsx`
- Displays paginated book catalogue
- Search functionality
- Category filtering
- Real-time availability status

### 2. BookDetail Component
**Path**: `src/features/library/BookDetail.tsx`
- Detailed book information
- Availability status
- Location information
- Request to issue button

### 3. MyLibraryCard Component
**Path**: `src/features/library/MyLibraryCard.tsx`
- Digital library card display
- QR code generation
- PDF download functionality
- Card status (active/inactive)
- Expiry date tracking

### 4. BookManagement Component
**Path**: `src/features/library/BookManagement.tsx`
- Add new books
- Edit existing books
- Delete books
- Search and filter books
- Inventory statistics

### 5. LibraryCardManagement Component
**Path**: `src/features/library/LibraryCardManagement.tsx`
- Generate library cards for students
- View all library cards
- Activate/deactivate cards
- Search cards by student info

## 🔌 API Endpoints

### Book APIs

#### Get All Books
```typescript
GET /api/library/books?search=&category=&page=1&limit=10
Response: { books: Book[], total: number, page: number, totalPages: number }
```

#### Get Book by ID
```typescript
GET /api/library/books/:bookId
Response: Book
```

#### Create Book (Librarian/Admin)
```typescript
POST /api/library/books
Body: BookFormData
Response: Book
```

#### Update Book (Librarian/Admin)
```typescript
PUT /api/library/books/:bookId
Body: Partial<BookFormData>
Response: Book
```

#### Delete Book (Librarian/Admin)
```typescript
DELETE /api/library/books/:bookId
Response: { message: string }
```

### Library Card APIs

#### Get My Library Card (Student)
```typescript
GET /api/library/card/my-card
Response: LibraryCard
```

#### Generate Library Card (Librarian/Admin)
```typescript
POST /api/library/card/generate
Body: { studentId: string }
Response: LibraryCard
```

#### Download Card as PDF (Student)
```typescript
GET /api/library/card/download-pdf
Response: Blob (PDF file)
```

#### Get All Library Cards (Librarian/Admin)
```typescript
GET /api/library/card/all
Response: LibraryCard[]
```

#### Deactivate Card (Librarian/Admin)
```typescript
PUT /api/library/card/:cardId/deactivate
Response: LibraryCard
```

## 📊 Data Models

### Book Interface
```typescript
interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  shelfLocation: string;
  status: 'available' | 'issued' | 'out-of-stock';
  description?: string;
  publishYear?: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}
```

### LibraryCard Interface
```typescript
interface LibraryCard {
  _id: string;
  studentId: string;
  studentName: string;
  department: string;
  issueDate: string;
  expiryDate: string;
  cardNumber: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Categories

The system supports the following book categories:
- Computer Science
- Engineering
- Mathematics
- Physics
- Chemistry
- Biology
- Literature
- History
- Economics
- Business
- Psychology
- Philosophy
- Other

## 🔐 Access Control

### Role-Based Permissions

| Feature | Student | Teacher | Librarian | Admin |
|---------|---------|---------|-----------|-------|
| View Books | ✅ | ✅ | ✅ | ✅ |
| View Library Card | ✅ | ❌ | ❌ | ❌ |
| Manage Books | ❌ | ❌ | ✅ | ✅ |
| Manage Cards | ❌ | ❌ | ✅ | ✅ |

## 🚀 Getting Started

### Prerequisites
- Backend server running on `http://localhost:5000`
- MongoDB database configured
- User authentication working

### Installation
Already installed with the main project dependencies.

### Usage

1. **For Students**:
   - Login with student credentials
   - Navigate to "Library Catalogue" in sidebar
   - Search and browse books
   - View your library card from "My Library Card"

2. **For Librarians/Admins**:
   - Login with librarian/admin credentials
   - Navigate to "Manage Books" to add/edit books
   - Navigate to "Library Cards" to manage student cards

## 🔧 Backend Requirements

To complete this module, you need to implement the following backend endpoints:

### MongoDB Schemas

#### Book Schema
```javascript
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  availableCopies: { type: Number, required: true, min: 0 },
  totalCopies: { type: Number, required: true, min: 0 },
  shelfLocation: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'issued', 'out-of-stock'],
    default: 'available'
  },
  description: String,
  publishYear: Number,
  coverImage: String
}, { timestamps: true });

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
```

#### LibraryCard Schema
```javascript
const libraryCardSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  studentName: { type: String, required: true },
  department: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  cardNumber: { type: String, required: true, unique: true },
  qrCode: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Generate unique card number
libraryCardSchema.pre('save', async function(next) {
  if (!this.cardNumber) {
    this.cardNumber = `LIB${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});
```

### Authentication Middleware
Ensure your backend has:
- JWT authentication middleware
- Role-based access control middleware
- Protected routes for librarian/admin-only operations

### Required NPM Packages (Backend)
```json
{
  "qrcode": "^1.5.3",
  "pdfkit": "^0.13.0"
}
```

### PDF Generation Example
```javascript
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

async function generateLibraryCardPDF(card) {
  const doc = new PDFDocument();
  
  // Generate QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(card.cardNumber);
  
  // Add content to PDF
  doc.fontSize(20).text('University Library Card', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Name: ${card.studentName}`);
  doc.text(`Student ID: ${card.studentId}`);
  doc.text(`Department: ${card.department}`);
  doc.text(`Card Number: ${card.cardNumber}`);
  doc.text(`Issue Date: ${card.issueDate}`);
  doc.text(`Expiry Date: ${card.expiryDate}`);
  
  // Add QR Code
  doc.image(qrCodeDataUrl, { width: 100 });
  
  doc.end();
  return doc;
}
```

## 🎨 UI Components Used

The module uses the following UI components:
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button`
- `Input`
- `Badge`
- Lucide React icons

## 📝 Notes

1. **Backend Integration**: The frontend is ready, but requires a backend API to function
2. **PDF Generation**: PDF download will work once backend endpoint is implemented
3. **QR Code**: QR codes will display once backend generates them
4. **Authentication**: All routes are protected and require user authentication
5. **Validation**: Form validation is implemented on frontend; add backend validation too

## 🐛 Testing Checklist

- [ ] Student can view book catalogue
- [ ] Search and filter work correctly
- [ ] Book details page displays properly
- [ ] Student can view their library card
- [ ] PDF download works (requires backend)
- [ ] Librarian can add new books
- [ ] Librarian can edit existing books
- [ ] Librarian can delete books
- [ ] Librarian can generate library cards
- [ ] Librarian can deactivate cards
- [ ] Role-based access control works
- [ ] Pagination works correctly
- [ ] Error handling displays properly

## 🔄 Future Enhancements

Potential features to add:
- Book issue/return functionality
- Fine calculation for overdue books
- Book reservation system
- Email notifications
- Book recommendations
- Reading history
- Popular books section
- Book reviews and ratings

## 👨‍💻 Module Author

**Module 1: Library Catalogue & Digital Library Card**
- Developed as part of GROUP A University Portal Project
- MERN Stack Implementation

---

**Last Updated**: January 23, 2026
