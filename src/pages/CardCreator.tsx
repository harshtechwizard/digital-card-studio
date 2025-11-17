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
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Globe, Linkedin, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const getInitials = () => {
    if (!personalInfo?.full_name) return 'BC';
    return personalInfo.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedProfessionalEntries = professionalInfo.filter(
    entry => selectedFields.professionalIds.includes(entry.id)
  );

  const shouldShowLinkedIn = (entryId: string) => {
    return selectedFields.linkedin_urls.includes(entryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <UICard>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your card will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-background via-background to-muted p-4 rounded-lg">
                  <Card className="w-full max-w-md mx-auto shadow-lg">
                    {/* Header with Avatar and Name */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-3 border-4 border-background">
                        {selectedFields.profile_photo_url && personalInfo?.profile_photo_url ? (
                          <img 
                            src={personalInfo.profile_photo_url} 
                            alt={personalInfo.full_name || 'Profile'} 
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="text-2xl bg-background text-primary">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {selectedFields.full_name && personalInfo?.full_name && (
                        <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                          {personalInfo.full_name}
                        </h2>
                      )}

                      {selectedProfessionalEntries.map((entry) => (
                        <div key={entry.id}>
                          {entry.designation && (
                            <p className="text-lg text-primary-foreground/90 font-medium">{entry.designation}</p>
                          )}
                          {entry.company_name && (
                            <p className="text-base text-primary-foreground/80">{entry.company_name}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Body with Contact Details */}
                    <div className="p-6">
                      {/* Bio */}
                      {selectedFields.bio && personalInfo?.bio && (
                        <div className="mb-4 pb-4 border-b border-border">
                          <p className="text-sm text-muted-foreground text-center italic">
                            {personalInfo.bio}
                          </p>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="space-y-3">
                        {selectedFields.primary_email && personalInfo?.primary_email && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                              <p className="text-sm text-foreground break-all">
                                {personalInfo.primary_email}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedFields.mobile_number && personalInfo?.mobile_number && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Phone</p>
                              <p className="text-sm text-foreground">
                                {personalInfo.mobile_number}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedProfessionalEntries.map((entry) => (
                          <div key={entry.id}>
                            {entry.company_website && (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Globe className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Website</p>
                                  <p className="text-sm text-foreground break-all">
                                    {entry.company_website}
                                  </p>
                                </div>
                              </div>
                            )}

                            {entry.linkedin_url && shouldShowLinkedIn(entry.id) && (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 mt-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Linkedin className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">LinkedIn</p>
                                  <p className="text-sm text-foreground break-all">
                                    {entry.linkedin_url}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </UICard>
          </div>
        </div>
      </div>
    </div>
  );
}
