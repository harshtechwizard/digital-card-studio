import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBusinessCards } from '@/hooks/useBusinessCards';
import { useProfile } from '@/hooks/useProfile';
import { generateUniqueSlug } from '@/lib/slugify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CardCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, loading: cardsLoading, addCard, updateCard } = useBusinessCards();
  const { personalInfo, professionalInfo, loading: profileLoading } = useProfile();
  
  const [cardName, setCardName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedFields, setSelectedFields] = useState({
    full_name: true,
    primary_email: true,
    mobile_number: false,
    bio: false,
    profile_photo_url: false,
    professionalIds: [] as string[],
    linkedin_urls: [] as string[], // Track which professionals' LinkedIn to show
  });

  useEffect(() => {
    if (id && cards.length > 0) {
      const card = cards.find(c => c.id === id);
      if (card) {
        setCardName(card.name);
        setSlug(card.slug);
        const config = card.fields_config as any;
        if (config) {
          setSelectedFields({
            full_name: config.full_name ?? true,
            primary_email: config.primary_email ?? true,
            mobile_number: config.mobile_number ?? false,
            bio: config.bio ?? false,
            profile_photo_url: config.profile_photo_url ?? false,
            professionalIds: config.professionalIds || [],
            linkedin_urls: config.linkedin_urls || [],
          });
        }
      }
    }
  }, [id, cards]);

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setSlug(sanitized);
  };

  const toggleProfessional = (profId: string) => {
    setSelectedFields(prev => ({
      ...prev,
      professionalIds: prev.professionalIds.includes(profId)
        ? prev.professionalIds.filter(id => id !== profId)
        : [...prev.professionalIds, profId],
    }));
  };

  const toggleLinkedIn = (profId: string) => {
    setSelectedFields(prev => ({
      ...prev,
      linkedin_urls: prev.linkedin_urls.includes(profId)
        ? prev.linkedin_urls.filter(id => id !== profId)
        : [...prev.linkedin_urls, profId],
    }));
  };

  const handleSave = async () => {
    if (!cardName || !slug) {
      toast({
        title: "Missing fields",
        description: "Card name and slug are required.",
        variant: "destructive",
      });
      return;
    }

    // Check if slug is already taken by another card
    const existingCard = cards.find(c => c.slug === slug && c.id !== id);
    if (existingCard) {
      toast({
        title: "Slug already exists",
        description: "Please choose a different slug.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (id) {
        await updateCard(id, {
          name: cardName,
          slug,
          fields_config: selectedFields,
        });
        toast({
          title: "Card updated",
          description: "Your business card has been updated.",
        });
      } else {
        await addCard({
          name: cardName,
          slug: slug || generateUniqueSlug(cardName),
          fields_config: selectedFields,
          design_config: { theme: 'light' },
          is_active: true,
        });
        toast({
          title: "Card created",
          description: "Your business card has been created.",
        });
      }
      navigate('/my-cards');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save card",
        variant: "destructive",
      });
    }
  };

  if (cardsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-cards')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Cards
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">
          {id ? 'Edit Card' : 'Create New Card'}
        </h1>

        <div className="space-y-6">
          <UICard>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Basic information about your card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardName">Card Name</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g., Personal, Work, Freelance"
                />
              </div>

              <div>
                <Label htmlFor="slug">Card Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g., john-doe-personal"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your card will be available at: {window.location.origin}/card/{slug || 'your-slug'}
                </p>
              </div>
            </CardContent>
          </UICard>

          <UICard>
            <CardHeader>
              <CardTitle>Select Information</CardTitle>
              <CardDescription>Choose which information to display on this card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="full_name"
                      checked={selectedFields.full_name}
                      onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, full_name: checked as boolean }))}
                    />
                    <Label htmlFor="full_name" className="cursor-pointer">
                      Full Name {personalInfo?.full_name && <span className="text-muted-foreground">({personalInfo.full_name})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="primary_email"
                      checked={selectedFields.primary_email}
                      onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, primary_email: checked as boolean }))}
                    />
                    <Label htmlFor="primary_email" className="cursor-pointer">
                      Primary Email {personalInfo?.primary_email && <span className="text-muted-foreground">({personalInfo.primary_email})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile_number"
                      checked={selectedFields.mobile_number}
                      onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, mobile_number: checked as boolean }))}
                    />
                    <Label htmlFor="mobile_number" className="cursor-pointer">
                      Mobile Number {personalInfo?.mobile_number && <span className="text-muted-foreground">({personalInfo.mobile_number})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bio"
                      checked={selectedFields.bio}
                      onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, bio: checked as boolean }))}
                    />
                    <Label htmlFor="bio" className="cursor-pointer">
                      Bio
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="profile_photo_url"
                      checked={selectedFields.profile_photo_url}
                      onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, profile_photo_url: checked as boolean }))}
                    />
                    <Label htmlFor="profile_photo_url" className="cursor-pointer">
                      Profile Photo
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Professional Information</h3>
                {professionalInfo.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No professional entries yet. Add them in your profile.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {professionalInfo.map((entry) => (
                      <div key={entry.id} className="border border-border rounded-lg p-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={entry.id}
                            checked={selectedFields.professionalIds.includes(entry.id)}
                            onCheckedChange={() => toggleProfessional(entry.id)}
                          />
                          <Label htmlFor={entry.id} className="cursor-pointer font-medium">
                            {entry.designation} at {entry.company_name}
                          </Label>
                        </div>
                        
                        {entry.linkedin_url && (
                          <div className="flex items-center space-x-2 ml-6">
                            <Checkbox
                              id={`linkedin-${entry.id}`}
                              checked={selectedFields.linkedin_urls.includes(entry.id)}
                              onCheckedChange={() => toggleLinkedIn(entry.id)}
                              disabled={!selectedFields.professionalIds.includes(entry.id)}
                            />
                            <Label 
                              htmlFor={`linkedin-${entry.id}`} 
                              className={`cursor-pointer text-sm ${!selectedFields.professionalIds.includes(entry.id) ? 'text-muted-foreground' : ''}`}
                            >
                              Show LinkedIn Profile
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </UICard>

          <div className="flex gap-4">
            <Button onClick={handleSave} size="lg" className="flex-1">
              {id ? 'Update Card' : 'Create Card'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/my-cards')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
