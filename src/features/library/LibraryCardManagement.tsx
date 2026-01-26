import { useState, useEffect } from "react";
import { getAllLibraryCards, generateLibraryCard, deactivateLibraryCard } from "./libraryApi";
import { LibraryCard } from "./libraryTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  XCircle,
  Search,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function LibraryCardManagement() {
  const [cards, setCards] = useState<LibraryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchLibraryCards();
  }, []);

  const fetchLibraryCards = async () => {
    try {
      setLoading(true);
      const data = await getAllLibraryCards();
      setCards(data);
      setError(null);
    } catch (err: unknown) {
      const backendMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          : undefined;
      setError(backendMessage ?? (err instanceof Error ? err.message : "Failed to fetch library cards"));
      console.error("Error fetching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      await generateLibraryCard(studentId);
      alert("Library card generated successfully!");
      setStudentId("");
      setShowForm(false);
      fetchLibraryCards();
    } catch (err: unknown) {
      const backendMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          : undefined;
      alert(backendMessage ?? (err instanceof Error ? err.message : "Failed to generate card"));
      console.error("Error generating card:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeactivate = async (cardId: string, studentName: string) => {
    if (
      window.confirm(
        `Are you sure you want to deactivate the card for ${studentName}?`
      )
    ) {
      try {
        await deactivateLibraryCard(cardId);
        alert("Library card deactivated successfully!");
        fetchLibraryCards();
      } catch (err: unknown) {
        const backendMessage =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            : undefined;
        alert(backendMessage ?? (err instanceof Error ? err.message : "Failed to deactivate card"));
        console.error("Error deactivating card:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCards = cards.filter(
    (card) =>
      card.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCards = cards.filter((c) => c.isActive).length;
  const inactiveCards = cards.filter((c) => !c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Library Card Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage student library cards
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate New Card
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Cards</CardDescription>
            <CardTitle className="text-3xl">{cards.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Cards</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {activeCards}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive Cards</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {inactiveCards}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Generate Card Form */}
      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Generate Library Card</CardTitle>
            <CardDescription>
              Enter student ID to generate a new library card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateCard} className="flex gap-3">
              <Input
                required
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={generating}>
                {generating ? "Generating..." : "Generate"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by student name, ID, or card number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Library Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No library cards found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Card Number</th>
                    <th className="text-left p-3">Student Name</th>
                    <th className="text-left p-3">Student ID</th>
                    <th className="text-left p-3">Department</th>
                    <th className="text-left p-3">Issue Date</th>
                    <th className="text-left p-3">Expiry Date</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map((card) => (
                    <tr key={card._id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">
                        {card.cardNumber}
                      </td>
                      <td className="p-3 font-medium">{card.studentName}</td>
                      <td className="p-3">{card.studentId}</td>
                      <td className="p-3">{card.department}</td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(card.issueDate)}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(card.expiryDate)}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          className={
                            card.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {card.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          {card.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeactivate(card._id, card.studentName)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
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
