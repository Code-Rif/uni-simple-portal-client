# 📐 Library Management System - Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     UNIVERSITY PORTAL                            │
│                   (React + TypeScript + Vite)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                             │
        ▼                                             ▼
┌───────────────┐                           ┌────────────────┐
│   Frontend    │                           │    Backend     │
│  (Complete)   │───────API Calls──────────▶│  (Needs Setup) │
└───────────────┘                           └────────────────┘
        │                                             │
        │                                             │
        ├── Components                                ├── Models
        ├── Routes                                    ├── Routes
        ├── API Layer                                 ├── Middleware
        └── State Management                          └── Controllers
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │    MongoDB      │
                                                    │   (Database)    │
                                                    └─────────────────┘
```

---

## 📂 Frontend Architecture (✅ COMPLETE)

```
src/
├── features/
│   └── library/                          # Library Module
│       ├── BookList.tsx                  # ✅ Book catalogue page
│       ├── BookDetail.tsx                # ✅ Book detail page
│       ├── MyLibraryCard.tsx             # ✅ Student library card
│       ├── BookManagement.tsx            # ✅ Book CRUD (Librarian)
│       ├── LibraryCardManagement.tsx     # ✅ Card management (Librarian)
│       ├── libraryApi.ts                 # ✅ API integration layer
│       └── libraryTypes.ts               # ✅ TypeScript definitions
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx                # ✅ Main page layout
│   │   ├── Sidebar.tsx                   # ✅ Navigation (includes library)
│   │   └── Navbar.tsx                    # ✅ Top navigation bar
│   ├── ProtectedRoute.tsx                # ✅ Route protection
│   └── ui/                               # ✅ Reusable UI components
│       ├── card.tsx
│       ├── button.tsx
│       ├── input.tsx
│       └── badge.tsx
│
├── store/
│   └── authStore.ts                      # ✅ User authentication state
│
├── lib/
│   ├── axios.ts                          # ✅ API client configuration
│   └── utils.ts                          # ✅ Utility functions
│
└── App.tsx                               # ✅ Route configuration
```

---

## 🛣️ Route Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Application Routes                      │
└────────────────────────────────────────────────────────────────┘

Public Routes:
├── /login                    # Login page
└── /register                 # Registration page

Protected Routes (All Users):
└── /dashboard                # Role-based dashboard

Student Routes:
├── /library/books            # Browse catalogue (+ Teachers)
├── /library/books/:id        # Book details (+ Teachers)
└── /library/my-card          # Student's library card

Librarian/Admin Routes:
├── /library/manage-books     # Book CRUD operations
└── /library/manage-cards     # Library card management

Legacy Redirects:
├── /library → /library/books
└── /library-card → /library/my-card
```

---

## 🔌 API Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                          API Endpoints                          │
└────────────────────────────────────────────────────────────────┘

Book Endpoints:
├── GET    /api/library/books              # Get all books
│   ├── Query: search, category, status
│   ├── Query: page, limit
│   └── Response: { books[], total, page, totalPages }
│
├── GET    /api/library/books/:id          # Get single book
│   └── Response: Book object
│
├── POST   /api/library/books              # Create book
│   ├── Auth: Required
│   ├── Role: librarian, admin
│   └── Body: BookFormData
│
├── PUT    /api/library/books/:id          # Update book
│   ├── Auth: Required
│   ├── Role: librarian, admin
│   └── Body: Partial<BookFormData>
│
└── DELETE /api/library/books/:id          # Delete book
    ├── Auth: Required
    └── Role: librarian, admin

Library Card Endpoints:
├── GET    /api/library/card/my-card       # Get student's card
│   ├── Auth: Required
│   └── Response: LibraryCard object
│
├── POST   /api/library/card/generate      # Generate new card
│   ├── Auth: Required
│   ├── Role: librarian, admin
│   ├── Body: { studentId }
│   └── Response: LibraryCard with QR code
│
├── GET    /api/library/card/download-pdf  # Download PDF
│   ├── Auth: Required
│   └── Response: PDF Blob
│
├── GET    /api/library/card/all           # Get all cards
│   ├── Auth: Required
│   ├── Role: librarian, admin
│   └── Response: LibraryCard[]
│
└── PUT    /api/library/card/:id/deactivate # Deactivate card
    ├── Auth: Required
    └── Role: librarian, admin
```

---

## 🗄️ Database Schema

```
┌────────────────────────────────────────────────────────────────┐
│                        MongoDB Collections                      │
└────────────────────────────────────────────────────────────────┘

Collection: books
├── _id: ObjectId
├── title: String *
├── author: String *
├── isbn: String * (unique)
├── category: String * (enum)
├── availableCopies: Number *
├── totalCopies: Number *
├── shelfLocation: String *
├── status: String (enum: available, issued, out-of-stock)
├── description: String
├── publishYear: Number
├── coverImage: String
├── createdAt: Date
└── updatedAt: Date

Indexes:
├── Text index on: title, author, isbn
├── Index on: category
└── Index on: status

Collection: librarycards
├── _id: ObjectId
├── studentId: ObjectId * (ref: users, unique)
├── studentName: String *
├── department: String *
├── issueDate: Date *
├── expiryDate: Date *
├── cardNumber: String * (unique)
├── qrCode: String * (Data URL)
├── isActive: Boolean
├── createdAt: Date
└── updatedAt: Date

Indexes:
├── Index on: studentId
├── Index on: cardNumber
└── Index on: isActive
```

---

## 🎯 Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                          │
└────────────────────────────────────────────────────────────────┘

App
└── BrowserRouter
    └── Routes
        ├── Public Routes
        │   ├── Login
        │   └── Register
        │
        └── Protected Routes
            └── MainLayout
                ├── Navbar (Top)
                ├── Sidebar (Left)
                └── Content Area (Right)
                    ├── BookList
                    │   ├── Search Bar
                    │   ├── Category Filter
                    │   ├── Book Cards Grid
                    │   └── Pagination
                    │
                    ├── BookDetail
                    │   ├── Book Information
                    │   ├── Availability Card
                    │   └── Help Section
                    │
                    ├── MyLibraryCard
                    │   ├── Status Alert
                    │   ├── Digital Card Display
                    │   └── Card Details
                    │
                    ├── BookManagement
                    │   ├── Statistics Dashboard
                    │   ├── Search Bar
                    │   ├── Add/Edit Form
                    │   └── Books Table
                    │
                    └── LibraryCardManagement
                        ├── Statistics Dashboard
                        ├── Search Bar
                        ├── Generate Card Form
                        └── Cards Table
```

---

## 🔐 Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Security & Access Control                    │
└────────────────────────────────────────────────────────────────┘

Frontend Layer:
├── ProtectedRoute Component
│   ├── Checks authentication status
│   ├── Verifies user role
│   └── Redirects if unauthorized
│
└── Sidebar Navigation
    └── Filters menu items by role

Backend Layer (To Implement):
├── auth Middleware
│   ├── Validates JWT token
│   ├── Extracts user from token
│   └── Attaches user to request
│
└── roleCheck Middleware
    ├── Checks user role
    └── Allows/denies based on required roles

Access Matrix:
┌─────────────────┬─────────┬─────────┬───────────┬───────┐
│ Feature         │ Student │ Teacher │ Librarian │ Admin │
├─────────────────┼─────────┼─────────┼───────────┼───────┤
│ Browse Books    │    ✅   │    ✅   │     ✅    │   ✅  │
│ View Details    │    ✅   │    ✅   │     ✅    │   ✅  │
│ My Library Card │    ✅   │    ❌   │     ❌    │   ❌  │
│ Manage Books    │    ❌   │    ❌   │     ✅    │   ✅  │
│ Manage Cards    │    ❌   │    ❌   │     ✅    │   ✅  │
└─────────────────┴─────────┴─────────┴───────────┴───────┘
```

---

## 📊 Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Data Flow Example                       │
│                  (Get All Books with Filter)                    │
└────────────────────────────────────────────────────────────────┘

1. User Action:
   User types "Computer" in search box and clicks Search
   
2. Component State Update:
   BookList.tsx → setFilters({ search: "Computer" })
   
3. useEffect Trigger:
   Dependency array detects filters change
   
4. API Call:
   getAllBooks({ search: "Computer" }, page=1, limit=12)
   
5. Axios Request:
   GET /api/library/books?search=Computer&page=1&limit=12
   Headers: { Authorization: "Bearer [token]" }
   
6. Backend Processing: (To Implement)
   ├── Route: /api/library/books
   ├── Query parsing: { search, page, limit }
   ├── MongoDB query: Book.find({ $text: { $search: "Computer" }})
   ├── Pagination: .limit(12).skip(0)
   └── Response: { books[], total, page, totalPages }
   
7. Frontend Response Handling:
   ├── Success: setBooks(response.books)
   ├── Error: setError(error.message)
   └── Finally: setLoading(false)
   
8. UI Update:
   React re-renders with new books data
   
9. User sees:
   Grid of computer science books with pagination
```

---

## 🎨 UI Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Reusable UI Components                       │
└────────────────────────────────────────────────────────────────┘

Card Component:
└── Card
    ├── CardHeader
    │   ├── CardTitle
    │   └── CardDescription
    └── CardContent

Button Component:
└── Button
    ├── variants: default, outline, ghost
    └── sizes: sm, md, lg

Input Component:
└── Input
    └── className support for Tailwind

Badge Component:
└── Badge
    └── Custom className for status colors

Usage Example:
<Card>
  <CardHeader>
    <CardTitle>Book Title</CardTitle>
    <CardDescription>by Author</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge>Available</Badge>
    <Button variant="outline">View Details</Button>
  </CardContent>
</Card>
```

---

## 🔄 State Management Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      State Management                           │
└────────────────────────────────────────────────────────────────┘

Global State (Zustand):
└── authStore
    ├── user: User | null
    ├── token: string | null
    ├── isAuthenticated: boolean
    ├── login(email, password)
    ├── logout()
    └── setUser(user)

Component Local State:
├── BookList
│   ├── books: Book[]
│   ├── loading: boolean
│   ├── error: string | null
│   ├── filters: BookFilters
│   ├── currentPage: number
│   └── totalPages: number
│
├── BookDetail
│   ├── book: Book | null
│   ├── loading: boolean
│   └── error: string | null
│
├── MyLibraryCard
│   ├── card: LibraryCard | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── downloading: boolean
│
├── BookManagement
│   ├── books: Book[]
│   ├── loading: boolean
│   ├── showForm: boolean
│   ├── editingBook: Book | null
│   ├── formData: BookFormData
│   └── searchQuery: string
│
└── LibraryCardManagement
    ├── cards: LibraryCard[]
    ├── loading: boolean
    ├── error: string | null
    ├── showForm: boolean
    ├── studentId: string
    ├── generating: boolean
    └── searchQuery: string
```

---

## 🚀 Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Production Deployment                        │
└────────────────────────────────────────────────────────────────┘

Frontend Deployment:
├── Build: npm run build
├── Output: dist/
├── Host: Vercel, Netlify, or any static host
└── Environment Variables:
    └── VITE_API_URL=https://api.yourapp.com

Backend Deployment:
├── Host: Heroku, Railway, AWS, Azure, or DigitalOcean
├── Database: MongoDB Atlas (Cloud)
└── Environment Variables:
    ├── PORT=5000
    ├── MONGODB_URI=mongodb+srv://...
    ├── JWT_SECRET=your_secret_key
    └── CORS_ORIGIN=https://yourapp.com

Full Stack Flow:
┌──────────────┐      HTTPS       ┌──────────────┐
│   Frontend   │ ───────────────▶ │   Backend    │
│  (Vercel)    │ ◀─────────────── │  (Railway)   │
└──────────────┘     JSON          └──────────────┘
                                           │
                                           ▼
                                  ┌──────────────┐
                                  │   MongoDB    │
                                  │   (Atlas)    │
                                  └──────────────┘
```

---

## 📦 Package Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       NPM Packages Used                         │
└────────────────────────────────────────────────────────────────┘

Frontend (✅ Installed):
├── react: UI library
├── react-dom: DOM rendering
├── react-router-dom: Routing
├── axios: HTTP client
├── zustand: State management
├── lucide-react: Icons
├── tailwindcss: Styling
├── class-variance-authority: Component variants
└── clsx & tailwind-merge: Class name utilities

Backend (⏳ To Install):
├── express: Web framework
├── mongoose: MongoDB ODM
├── jsonwebtoken: JWT authentication
├── bcryptjs: Password hashing
├── cors: Cross-origin requests
├── qrcode: QR code generation
├── pdfkit: PDF generation
└── dotenv: Environment variables
```

---

## 🔍 Search & Filter Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Search & Filter Flow                         │
└────────────────────────────────────────────────────────────────┘

Frontend Query Building:
const params = new URLSearchParams();
if (filters?.search) params.append("search", filters.search);
if (filters?.category) params.append("category", filters.category);
if (filters?.status) params.append("status", filters.status);
params.append("page", page.toString());
params.append("limit", limit.toString());

Backend Query Processing: (To Implement)
const query = {};

// Text search
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

// Execute query
const books = await Book.find(query)
  .limit(limit)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 });
```

---

## 📄 PDF Generation Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                  Library Card PDF Generation                    │
└────────────────────────────────────────────────────────────────┘

Frontend Request:
├── User clicks "Download as PDF"
├── API call: downloadLibraryCardPDF()
├── Response type: blob
└── Trigger browser download

Backend Processing: (To Implement)
├── Get library card from database
├── Create PDF document (PDFKit)
├── Add university header
├── Add card details
├── Embed QR code image
├── Add footer text
├── Stream to response
└── Set headers: Content-Type, Content-Disposition

QR Code Flow:
├── Card generated with unique number
├── QRCode.toDataURL(cardNumber)
├── Store Data URL in database
├── Display in frontend <img>
└── Embed in PDF as image
```

---

*This architecture document provides a complete overview of the library management system structure.*

*Last Updated: January 26, 2026*
