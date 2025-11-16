import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCards } from '@/hooks/useCards';
import { useProfile } from '@/hooks/useProfile';
import { Card, defaultFieldSelection } from '@/types/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function CardCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, addCard, updateCard } = useCards();
  const { profile } = useProfile();
  
  const [cardName, setCardName] = useState('');
  const [slug, setSlug] = useState('');
  const [fieldSelection, setFieldSelection] = useState(defaultFieldSelection);
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (id) {
      const card = cards.find(c => c.id === id);
      if (card) {
        setCardName(card.name);
        setSlug(card.slug);
        setFieldSelection(card.fieldSelection);
        setIsDefault(card.isDefault);
      }
    }
  }, [id, cards]);

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setSlug(sanitized);
  };

  const toggleField = (field: keyof typeof fieldSelection) => {
    if (field === 'professionalEntries') return;
    setFieldSelection(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleProfessionalEntry = (entryId: string) => {
    setFieldSelection(prev => ({
      ...prev,
      professionalEntries: prev.professionalEntries.includes(entryId)
        ? prev.professionalEntries.filter(id => id !== entryId)
        : [...prev.professionalEntries, entryId],
    }));
  };

  const handleSave = () => {
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

    if (id) {
      updateCard(id, {
        name: cardName,
        slug,
        fieldSelection,
        isDefault,
      });
      toast({
        title: "Card updated",
        description: "Your business card has been updated.",
      });
    } else {
      addCard({
        name: cardName,
        slug,
        fieldSelection,
        isDefault,
      });
      toast({
        title: "Card created",
        description: "Your business card has been created.",
      });
    }

    navigate('/my-cards');
  };

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default card
                </Label>
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
                      id="fullName"
                      checked={fieldSelection.fullName}
                      onCheckedChange={() => toggleField('fullName')}
                    />
                    <Label htmlFor="fullName" className="cursor-pointer">
                      Full Name {profile.fullName && <span className="text-muted-foreground">({profile.fullName})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="primaryEmail"
                      checked={fieldSelection.primaryEmail}
                      onCheckedChange={() => toggleField('primaryEmail')}
                    />
                    <Label htmlFor="primaryEmail" className="cursor-pointer">
                      Primary Email {profile.primaryEmail && <span className="text-muted-foreground">({profile.primaryEmail})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobileNumber"
                      checked={fieldSelection.mobileNumber}
                      onCheckedChange={() => toggleField('mobileNumber')}
                    />
                    <Label htmlFor="mobileNumber" className="cursor-pointer">
                      Mobile Number {profile.mobileNumber && <span className="text-muted-foreground">({profile.mobileNumber})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="homeAddress"
                      checked={fieldSelection.homeAddress}
                      onCheckedChange={() => toggleField('homeAddress')}
                    />
                    <Label htmlFor="homeAddress" className="cursor-pointer">
                      Home Address {profile.homeAddress && <span className="text-muted-foreground">({profile.homeAddress})</span>}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bio"
                      checked={fieldSelection.bio}
                      onCheckedChange={() => toggleField('bio')}
                    />
                    <Label htmlFor="bio" className="cursor-pointer">
                      Bio
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Professional Information</h3>
                {profile.professionalEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No professional entries yet. Add them in your profile.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {profile.professionalEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={entry.id}
                          checked={fieldSelection.professionalEntries.includes(entry.id)}
                          onCheckedChange={() => toggleProfessionalEntry(entry.id)}
                        />
                        <Label htmlFor={entry.id} className="cursor-pointer">
                          {entry.jobTitle} at {entry.companyName}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Links & Socials</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="linkedinUrl"
                      checked={fieldSelection.linkedinUrl}
                      onCheckedChange={() => toggleField('linkedinUrl')}
                    />
                    <Label htmlFor="linkedinUrl" className="cursor-pointer">
                      LinkedIn
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twitterUrl"
                      checked={fieldSelection.twitterUrl}
                      onCheckedChange={() => toggleField('twitterUrl')}
                    />
                    <Label htmlFor="twitterUrl" className="cursor-pointer">
                      Twitter/X
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="personalWebsite"
                      checked={fieldSelection.personalWebsite}
                      onCheckedChange={() => toggleField('personalWebsite')}
                    />
                    <Label htmlFor="personalWebsite" className="cursor-pointer">
                      Personal Website
                    </Label>
                  </div>
                </div>
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
