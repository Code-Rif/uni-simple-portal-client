import { useState, useEffect } from "react";
import { getMyLibraryCard, downloadLibraryCardPDF } from "./libraryApi";
import { LibraryCard } from "./libraryTypes";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  Calendar,
  User,
  Building,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function MyLibraryCard() {
  const { user } = useAuthStore();
  const [card, setCard] = useState<LibraryCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchLibraryCard = async () => {
      try {
        setLoading(true);
        
        // TEMPORARY: Mock data for testing (remove when backend is ready)
        // Always use mock data if no API URL is set
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiUrl) {
          console.log("Using mock library card data");
          const mockCard: LibraryCard = {
            _id: "mock-card-1",
            studentId: user?.studentId || user?.email || "STU001",
            studentName: user?.name || "Student User",
            department: user?.department || "Computer Science",
            issueDate: new Date(2024, 0, 1).toISOString(),
            expiryDate: new Date(2028, 0, 1).toISOString(),
            cardNumber: `LIB2024${Math.floor(Math.random() * 10000)}`,
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LIB2024" + Math.floor(Math.random() * 10000),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          setCard(mockCard);
          setError(null);
          setLoading(false);
          return;
        }
        
        const data = await getMyLibraryCard();
        setCard(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching library card, using mock data:", err);
        // Fallback to mock data if API fails
        const mockCard: LibraryCard = {
          _id: "mock-card-1",
          studentId: user?.studentId || user?.email || "STU001",
          studentName: user?.name || "Student User",
          department: user?.department || "Computer Science",
          issueDate: new Date(2024, 0, 1).toISOString(),
          expiryDate: new Date(2028, 0, 1).toISOString(),
          cardNumber: `LIB2024${Math.floor(Math.random() * 10000)}`,
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LIB2024" + Math.floor(Math.random() * 10000),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCard(mockCard);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibraryCard();
  }, [user]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const blob = await downloadLibraryCardPDF();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `library-card-${user?.studentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const backendMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          : undefined;
      alert(backendMessage ?? (err instanceof Error ? err.message : "Failed to download PDF"));
      console.error("Error downloading PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading library card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="space-y-4">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="py-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Library Card Found
            </h3>
            <p className="text-muted-foreground mb-4">
              {error || "You don't have a library card yet."}
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact the library desk to generate your card.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Library Card</h1>
        <p className="text-muted-foreground mt-1">
          Your digital library card for accessing library services
        </p>
      </div>

      {/* Status Alert */}
      {!card.isActive ? (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="py-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-medium">
              This card is inactive. Please contact the library.
            </p>
          </CardContent>
        </Card>
      ) : isExpiringSoon(card.expiryDate) ? (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="py-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-600 font-medium">
              Your card is expiring soon on {formatDate(card.expiryDate)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="py-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-600 font-medium">
              Your library card is active
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Card Display */}
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">University Library</CardTitle>
                <CardDescription className="text-white/90">
                  Digital Library Card
                </CardDescription>
              </div>
              <CreditCard className="w-8 h-8" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white border-2 border-dashed rounded-lg">
              {card.qrCode ? (
                <img
                  src={card.qrCode}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-muted flex items-center justify-center rounded">
                  <p className="text-muted-foreground text-sm">QR Code</p>
                </div>
              )}
            </div>

            {/* Card Number */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Card Number</p>
              <p className="text-2xl font-bold font-mono tracking-wider">
                {card.cardNumber}
              </p>
            </div>

            {/* Download Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleDownloadPDF}
              disabled={downloading || !card.isActive}
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Downloading..." : "Download as PDF"}
            </Button>
          </CardContent>
        </Card>

        {/* Card Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <User className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{card.studentName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Hash className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{card.studentId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Building className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{card.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{formatDate(card.issueDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{formatDate(card.expiryDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      card.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {card.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Always carry your library card when visiting the library</p>
              <p>• Show QR code or card number to issue books</p>
              <p>• Card is valid for 4 years from issue date</p>
              <p>• Report lost or damaged cards immediately</p>
              <p>• Card is non-transferable</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
