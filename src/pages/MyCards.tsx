import { useBusinessCards } from '@/hooks/useBusinessCards';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Share2, Settings, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ProfileCompletionBanner } from '@/components/ProfileCompletionBanner';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
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
  const { cards, loading, error, deleteCard } = useBusinessCards();
  const { isProfileComplete } = useProfileCompletion();
  const navigate = useNavigate();

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/card/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Card link has been copied to clipboard.",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCard(id);
      toast({
        title: "Card deleted",
        description: "Your business card has been deleted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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

        <ProfileCompletionBanner isProfileComplete={isProfileComplete} />

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
              <UICard 
                key={card.id} 
                className="relative hover:shadow-xl transition-all cursor-pointer"
                onClick={() => window.open(`/card/${card.slug}`, '_blank')}
              >
                <CardContent className="pt-6">
                  {/* Card Preview */}
                  <div className="mb-4 p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">{card.name}</h3>
                        <p className="text-xs text-muted-foreground">/{card.slug}</p>
                      </div>
                      {card.is_default && (
                        <Badge variant="secondary" className="ml-2">Default</Badge>
                      )}
                    </div>
                    
                    {/* Mini card preview */}
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p className="text-xs opacity-70">Click to view full card</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
                            Share your digital business card
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
                      onClick={() => navigate(`/cards/edit/${card.id}`)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
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
