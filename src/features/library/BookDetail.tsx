import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById } from "./libraryApi";
import { Book } from "./libraryTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, MapPin, Calendar, Hash } from "lucide-react";

export default function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const data = await getBookById(bookId!);
        setBook(data);
        setError(null);
      } catch (err: unknown) {
        const backendMessage =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            : undefined;
        setError(backendMessage ?? (err instanceof Error ? err.message : "Failed to fetch book details"));
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "issued":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/library/books")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        <Card className="border-red-300 bg-red-50">
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error || "Book not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/library/books")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Button>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getStatusColor(book.status)}>
                  {book.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
              <CardTitle className="text-3xl">{book.title}</CardTitle>
              <CardDescription className="text-lg">
                by {book.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Book Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Book Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Hash className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <BookOpen className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{book.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Shelf Location
                      </p>
                      <p className="font-medium">{book.shelfLocation}</p>
                    </div>
                  </div>

                  {book.publishYear && (
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Published Year
                        </p>
                        <p className="font-medium">{book.publishYear}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability Card */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {book.availableCopies}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Copies
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Copies:</span>
                  <span className="font-medium">{book.totalCopies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currently Issued:</span>
                  <span className="font-medium">
                    {book.totalCopies - book.availableCopies}
                  </span>
                </div>
              </div>

              {book.availableCopies > 0 ? (
                <Button className="w-full" size="lg">
                  Request to Issue
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Currently Unavailable
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Visit the library desk at <strong>{book.shelfLocation}</strong>{" "}
                to issue this book.
              </p>
              <p className="text-muted-foreground">
                Don't forget to bring your{" "}
                <Link to="/library/my-card" className="text-primary hover:underline">
                  Digital Library Card
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
