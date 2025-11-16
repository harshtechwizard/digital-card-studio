import { useCards } from '@/hooks/useCards';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Share2, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MyCards() {
  const { cards, deleteCard } = useCards();
  const navigate = useNavigate();

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/card/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Card link has been copied to clipboard.",
    });
  };

  const handleDelete = (id: string) => {
    deleteCard(id);
    toast({
      title: "Card deleted",
      description: "Your business card has been deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Business Cards</h1>
            <p className="text-muted-foreground mt-2">Create and manage your digital business cards</p>
          </div>
          <Button onClick={() => navigate('/cards/new')} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create New Card
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first business card</p>
            <Button onClick={() => navigate('/cards/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Card
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <UICard key={card.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">/{card.slug}</p>
                    </div>
                    {card.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Your Card</DialogTitle>
                          <DialogDescription>
                            Share your digital business card with anyone
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Public URL</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                readOnly
                                value={`${window.location.origin}/card/${card.slug}`}
                                className="flex-1"
                              />
                              <Button onClick={() => handleShare(card.slug)}>
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/cards/edit/${card.id}`)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete card?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            business card.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(card.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </UICard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
