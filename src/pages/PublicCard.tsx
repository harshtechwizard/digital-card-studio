import { useParams } from 'react-router-dom';
import { useCards } from '@/hooks/useCards';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Globe, Linkedin, Twitter, Download, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function PublicCard() {
  const { slug } = useParams();
  const { getCardBySlug } = useCards();
  const { profile } = useProfile();

  const card = getCardBySlug(slug || '');

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Card not found</h1>
          <p className="text-muted-foreground">This business card doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { fieldSelection } = card;

  const selectedProfessionalEntries = profile.professionalEntries.filter(
    entry => fieldSelection.professionalEntries.includes(entry.id)
  );

  const getInitials = () => {
    if (!fieldSelection.fullName || !profile.fullName) return 'BC';
    return profile.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateVCF = () => {
    let vcf = 'BEGIN:VCARD\nVERSION:3.0\n';
    
    if (fieldSelection.fullName && profile.fullName) {
      vcf += `FN:${profile.fullName}\n`;
    }
    
    if (fieldSelection.primaryEmail && profile.primaryEmail) {
      vcf += `EMAIL:${profile.primaryEmail}\n`;
    }
    
    if (fieldSelection.mobileNumber && profile.mobileNumber) {
      vcf += `TEL:${profile.mobileNumber}\n`;
    }
    
    if (fieldSelection.homeAddress && profile.homeAddress) {
      vcf += `ADR:;;${profile.homeAddress}\n`;
    }
    
    if (fieldSelection.personalWebsite && profile.personalWebsite) {
      vcf += `URL:${profile.personalWebsite}\n`;
    }
    
    selectedProfessionalEntries.forEach(entry => {
      vcf += `TITLE:${entry.jobTitle}\n`;
      vcf += `ORG:${entry.companyName}\n`;
      if (entry.officeEmail) vcf += `EMAIL;TYPE=WORK:${entry.officeEmail}\n`;
    });
    
    vcf += 'END:VCARD';
    
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.fullName || 'contact'}.vcf`;
    link.click();
    
    toast({
      title: "Contact saved",
      description: "VCF file has been downloaded.",
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Card link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <div className="p-8 text-center">
          {/* Avatar */}
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          {fieldSelection.fullName && profile.fullName && (
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {profile.fullName}
            </h1>
          )}

          {/* Professional Info */}
          {selectedProfessionalEntries.map((entry) => (
            <div key={entry.id} className="mb-4">
              <p className="text-lg text-foreground font-medium">{entry.jobTitle}</p>
              <p className="text-muted-foreground">{entry.companyName}</p>
            </div>
          ))}

          {/* Bio */}
          {fieldSelection.bio && profile.bio && (
            <p className="text-sm text-muted-foreground mb-6 mt-4">
              {profile.bio}
            </p>
          )}

          {/* Contact Methods */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {fieldSelection.primaryEmail && profile.primaryEmail && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location.href = `mailto:${profile.primaryEmail}`}
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}

            {fieldSelection.mobileNumber && profile.mobileNumber && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location.href = `tel:${profile.mobileNumber}`}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}

            {fieldSelection.personalWebsite && profile.personalWebsite && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(profile.personalWebsite, '_blank')}
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}

            {fieldSelection.linkedinUrl && profile.linkedinUrl && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(profile.linkedinUrl, '_blank')}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            )}

            {fieldSelection.twitterUrl && profile.twitterUrl && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(profile.twitterUrl, '_blank')}
              >
                <Twitter className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Address */}
          {fieldSelection.homeAddress && profile.homeAddress && (
            <p className="text-sm text-muted-foreground mb-6">
              {profile.homeAddress}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={generateVCF} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Card</DialogTitle>
                  <DialogDescription>
                    Share this digital business card with others
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">QR Code</p>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                  <Button onClick={handleShare} className="w-full">
                    Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
