import { useState } from 'react';
import { BusinessCard, defaultCard } from '@/types/businessCard';
import { useBusinessCards } from '@/hooks/useBusinessCards';
import { BusinessCardForm } from '@/components/BusinessCardForm';
import { BusinessCardPreview } from '@/components/BusinessCardPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { cards, addCard, updateCard, deleteCard } = useBusinessCards();
  const [currentCard, setCurrentCard] = useState<Partial<BusinessCard>>(defaultCard);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!currentCard.name || !currentCard.title || !currentCard.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, title, and email.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateCard(editingId, currentCard);
      toast({ title: "Card updated successfully!" });
    } else {
      addCard(currentCard as Omit<BusinessCard, 'id' | 'createdAt' | 'updatedAt'>);
      toast({ title: "Card created successfully!" });
    }

    setCurrentCard(defaultCard);
    setEditingId(null);
  };

  const handleEdit = (card: BusinessCard) => {
    setCurrentCard(card);
    setEditingId(card.id);
  };

  const handleDelete = (id: string) => {
    deleteCard(id);
    toast({ title: "Card deleted" });
  };

  const handleNew = () => {
    setCurrentCard(defaultCard);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Digital Business Card Creator</h1>
          <p className="text-muted-foreground mt-2">Create and manage your professional business cards</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="create">Create Card</TabsTrigger>
            <TabsTrigger value="saved">
              Saved Cards {cards.length > 0 && <Badge className="ml-2">{cards.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Card' : 'Create New Card'}</CardTitle>
                  <CardDescription>Fill in your information to create a business card</CardDescription>
                </CardHeader>
                <CardContent>
                  <BusinessCardForm
                    card={currentCard}
                    onChange={(updates) => setCurrentCard({ ...currentCard, ...updates })}
                  />
                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleSave} className="flex-1">
                      {editingId ? 'Update Card' : 'Create Card'}
                    </Button>
                    {editingId && (
                      <Button variant="outline" onClick={handleNew}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <BusinessCardPreview 
                  card={{ 
                    ...defaultCard, 
                    ...currentCard, 
                    id: '', 
                    createdAt: '', 
                    updatedAt: '' 
                  } as BusinessCard} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {cards.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No saved cards yet</p>
                  <Button onClick={() => document.querySelector('[value="create"]')?.dispatchEvent(new Event('click'))}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <div key={card.id} className="relative group">
                    <BusinessCardPreview card={card} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleEdit(card)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
