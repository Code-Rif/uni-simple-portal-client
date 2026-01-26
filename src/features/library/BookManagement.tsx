import { useState, useEffect } from "react";
import { getAllBooks, createBook, updateBook, deleteBook } from "./libraryApi";
import { Book, BookFormData, BOOK_CATEGORIES } from "./libraryTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    category: "Computer Science",
    availableCopies: 0,
    totalCopies: 0,
    shelfLocation: "",
    description: "",
    publishYear: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks({}, 1, 100);
      setBooks(response.books);
    } catch (err: unknown) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook._id, formData);
        alert("Book updated successfully!");
      } else {
        await createBook(formData);
        alert("Book created successfully!");
      }
      resetForm();
      fetchBooks();
    } catch (err: unknown) {
      const backendMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          : undefined;
      alert(backendMessage ?? (err instanceof Error ? err.message : "Failed to save book"));
      console.error("Error saving book:", err);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
      shelfLocation: book.shelfLocation,
      description: book.description,
      publishYear: book.publishYear,
    });
    setShowForm(true);
  };

  const handleDelete = async (bookId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBook(bookId);
        alert("Book deleted successfully!");
        fetchBooks();
      } catch (err: unknown) {
        const backendMessage =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            : undefined;
        alert(backendMessage ?? (err instanceof Error ? err.message : "Failed to delete book"));
        console.error("Error deleting book:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "Computer Science",
      availableCopies: 0,
      totalCopies: 0,
      shelfLocation: "",
      description: "",
      publishYear: new Date().getFullYear(),
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "issued":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Book Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage library books and catalogue
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Books</CardDescription>
            <CardTitle className="text-3xl">{books.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {books.filter((b) => b.status === "available").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {books.filter((b) => b.status === "out-of-stock").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Book Form Modal */}
      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingBook ? "Edit Book" : "Add New Book"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Author *
                  </label>
                  <Input
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ISBN *
                  </label>
                  <Input
                    required
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                  >
                    {BOOK_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Copies *
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={formData.totalCopies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalCopies: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Available Copies *
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    max={formData.totalCopies}
                    value={formData.availableCopies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableCopies: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Shelf Location *
                  </label>
                  <Input
                    required
                    value={formData.shelfLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfLocation: e.target.value })
                    }
                    placeholder="e.g., A-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Publish Year
                  </label>
                  <Input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.publishYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishYear: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter book description..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingBook ? "Update Book" : "Add Book"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Books ({filteredBooks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No books found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Author</th>
                    <th className="text-left p-3">ISBN</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-center p-3">Available</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3 font-mono text-sm">{book.isbn}</td>
                      <td className="p-3">
                        <Badge variant="outline">{book.category}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        {book.availableCopies}/{book.totalCopies}
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={getStatusColor(book.status)}>
                          {book.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(book)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(book._id, book.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
