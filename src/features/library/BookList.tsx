import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "./libraryApi";
import { Book, BookFilters, BOOK_CATEGORIES } from "./libraryTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Eye } from "lucide-react";

// Mock books data for testing
const getMockBooks = (): Book[] => [
  {
    _id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Computer Science",
    availableCopies: 3,
    totalCopies: 5,
    shelfLocation: "CS-101",
    status: "available" as const,
    description: "A Handbook of Agile Software Craftsmanship",
    publishYear: 2008,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    availableCopies: 0,
    totalCopies: 3,
    shelfLocation: "CS-205",
    status: "out-of-stock" as const,
    description: "Comprehensive introduction to algorithms",
    publishYear: 2009,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Design Patterns",
    author: "Gang of Four",
    isbn: "978-0201633610",
    category: "Computer Science",
    availableCopies: 2,
    totalCopies: 4,
    shelfLocation: "CS-150",
    status: "issued" as const,
    description: "Elements of Reusable Object-Oriented Software",
    publishYear: 1994,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Engineering Mechanics",
    author: "J.L. Meriam",
    isbn: "978-1118807330",
    category: "Engineering",
    availableCopies: 5,
    totalCopies: 8,
    shelfLocation: "ENG-201",
    status: "available" as const,
    description: "Dynamics and Statics fundamentals",
    publishYear: 2015,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    category: "Mathematics",
    availableCopies: 4,
    totalCopies: 6,
    shelfLocation: "MATH-101",
    status: "available" as const,
    description: "Comprehensive calculus textbook",
    publishYear: 2015,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Physics for Scientists",
    author: "Raymond A. Serway",
    isbn: "978-1133954057",
    category: "Physics",
    availableCopies: 1,
    totalCopies: 4,
    shelfLocation: "PHY-102",
    status: "issued" as const,
    description: "Modern physics and mechanics",
    publishYear: 2013,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0321803221",
    category: "Chemistry",
    availableCopies: 3,
    totalCopies: 5,
    shelfLocation: "CHEM-201",
    status: "available" as const,
    description: "Comprehensive organic chemistry guide",
    publishYear: 2016,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "8",
    title: "Campbell Biology",
    author: "Jane B. Reece",
    isbn: "978-0321558237",
    category: "Biology",
    availableCopies: 6,
    totalCopies: 10,
    shelfLocation: "BIO-101",
    status: "available" as const,
    description: "General biology textbook",
    publishYear: 2014,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "9",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    category: "Literature",
    availableCopies: 2,
    totalCopies: 4,
    shelfLocation: "LIT-305",
    status: "issued" as const,
    description: "Classic romantic novel",
    publishYear: 1813,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "10",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0553380163",
    category: "Physics",
    availableCopies: 0,
    totalCopies: 3,
    shelfLocation: "PHY-450",
    status: "out-of-stock" as const,
    description: "From the Big Bang to Black Holes",
    publishYear: 1988,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "11",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "978-0062316110",
    category: "History",
    availableCopies: 4,
    totalCopies: 6,
    shelfLocation: "HIST-201",
    status: "available" as const,
    description: "A Brief History of Humankind",
    publishYear: 2015,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "12",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    isbn: "978-1305585126",
    category: "Economics",
    availableCopies: 5,
    totalCopies: 7,
    shelfLocation: "ECON-101",
    status: "available" as const,
    description: "Microeconomics and macroeconomics principles",
    publishYear: 2017,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "13",
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "978-0307887894",
    category: "Business",
    availableCopies: 3,
    totalCopies: 5,
    shelfLocation: "BUS-302",
    status: "available" as const,
    description: "How Today's Entrepreneurs Use Innovation",
    publishYear: 2011,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "14",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    category: "Psychology",
    availableCopies: 2,
    totalCopies: 4,
    shelfLocation: "PSY-201",
    status: "issued" as const,
    description: "Two systems that drive the way we think",
    publishYear: 2011,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "15",
    title: "Meditations",
    author: "Marcus Aurelius",
    isbn: "978-0812968255",
    category: "Philosophy",
    availableCopies: 4,
    totalCopies: 5,
    shelfLocation: "PHIL-101",
    status: "available" as const,
    description: "Stoic philosophy and wisdom",
    publishYear: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "16",
    title: "Data Structures and Algorithms",
    author: "Michael T. Goodrich",
    isbn: "978-1118290279",
    category: "Computer Science",
    availableCopies: 7,
    totalCopies: 10,
    shelfLocation: "CS-301",
    status: "available" as const,
    description: "Comprehensive guide to data structures",
    publishYear: 2013,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "17",
    title: "Fluid Mechanics",
    author: "Frank M. White",
    isbn: "978-0073398273",
    category: "Engineering",
    availableCopies: 2,
    totalCopies: 5,
    shelfLocation: "ENG-401",
    status: "issued" as const,
    description: "Fundamentals of fluid mechanics",
    publishYear: 2015,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "18",
    title: "Linear Algebra Done Right",
    author: "Sheldon Axler",
    isbn: "978-3319110790",
    category: "Mathematics",
    availableCopies: 3,
    totalCopies: 6,
    shelfLocation: "MATH-301",
    status: "available" as const,
    description: "Modern approach to linear algebra",
    publishYear: 2014,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // TEMPORARY: Mock data for testing (remove when backend is ready)
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiUrl) {
          console.log("Using mock book data");
          setBooks(getMockBooks());
          setTotalPages(2);
          setError(null);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await getAllBooks(filters, currentPage, 12);
        setBooks(response.books);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching books, using mock data:", err);
        // Fallback to mock data if API fails
        setBooks(getMockBooks());
        setTotalPages(2);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters, currentPage]);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setFilters({ ...filters, search: searchQuery });
      setCurrentPage(1);
    } else {
      const newFilters = { ...filters };
      delete newFilters.search;
      setFilters(newFilters);
    }
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      const newFilters = { ...filters };
      delete newFilters.category;
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, category });
    }
    setCurrentPage(1);
  };

  // Get status badge variant
  const getStatusBadge = (book: Book) => {
    if (book.status === "available" && book.availableCopies > 0) {
      return <Badge variant="success">Available ({book.availableCopies})</Badge>;
    } else if (book.status === "out-of-stock" || book.availableCopies === 0) {
      return <Badge variant="error">Out of Stock</Badge>;
    } else {
      return <Badge variant="warning">Limited ({book.availableCopies})</Badge>;
    }
  };

  if (loading && (!books || books.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Catalogue</h1>
        <p className="text-gray-600 mt-2">Browse and search for available books in the library</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("all")}
              >
                All
              </Button>
              {BOOK_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      {!books || books.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Books Found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="mt-1">{book.author}</CardDescription>
                    </div>
                    {getStatusBadge(book)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ISBN:</span>
                      <span className="font-medium">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{book.shelfLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Copies:</span>
                      <span className="font-medium">
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                    </div>
                  </div>

                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                  )}

                  <Link to={`/library/books/${book._id}`}>
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
