import { useParams } from 'react-router-dom';
import { usePublicCard } from '@/hooks/usePublicCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Globe, Linkedin, Download, Share2, Loader2 } from 'lucide-react';
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
  const { data, loading, error } = usePublicCard(slug!);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Card not found</h1>
          <p className="text-muted-foreground">This business card doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { card, personalInfo, professionalInfo } = data;
  const fieldsConfig = (card.fields_config as any) || {};

  const selectedProfessionalEntries = professionalInfo.filter(
    entry => fieldsConfig.professionalIds?.includes(entry.id)
  );

  const shouldShowLinkedIn = (entryId: string) => {
    return fieldsConfig.linkedin_urls?.includes(entryId);
  };

  const getInitials = () => {
    if (!personalInfo?.full_name) return 'BC';
    return personalInfo.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateVCF = () => {
    let vcf = 'BEGIN:VCARD\nVERSION:3.0\n';
    
    if (fieldsConfig.full_name && personalInfo?.full_name) {
      vcf += `FN:${personalInfo.full_name}\n`;
    }
    
    if (fieldsConfig.primary_email && personalInfo?.primary_email) {
      vcf += `EMAIL:${personalInfo.primary_email}\n`;
    }
    
    if (fieldsConfig.mobile_number && personalInfo?.mobile_number) {
      vcf += `TEL:${personalInfo.mobile_number}\n`;
    }
    
    selectedProfessionalEntries.forEach(entry => {
      if (entry.designation) vcf += `TITLE:${entry.designation}\n`;
      if (entry.company_name) vcf += `ORG:${entry.company_name}\n`;
      if (entry.office_email) vcf += `EMAIL;TYPE=WORK:${entry.office_email}\n`;
    });
    
    vcf += 'END:VCARD';
    
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personalInfo?.full_name || 'contact'}.vcf`;
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
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        {/* Header with Avatar and Name */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-background">
            {fieldsConfig.profile_photo_url && personalInfo?.profile_photo_url ? (
              <img 
                src={personalInfo.profile_photo_url} 
                alt={personalInfo.full_name || 'Profile'} 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-3xl bg-background text-primary">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>

          {fieldsConfig.full_name && personalInfo?.full_name && (
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">
              {personalInfo.full_name}
            </h1>
          )}

          {selectedProfessionalEntries.map((entry) => (
            <div key={entry.id}>
              <p className="text-xl text-primary-foreground/90 font-medium">{entry.designation}</p>
              <p className="text-lg text-primary-foreground/80">{entry.company_name}</p>
            </div>
          ))}
        </div>

        {/* Body with Contact Details */}
        <div className="p-8">
          {/* Bio */}
          {fieldsConfig.bio && personalInfo?.bio && (
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-muted-foreground text-center italic">
                {personalInfo.bio}
              </p>
            </div>
          )}

          {/* Contact Information Grid */}
          <div className="space-y-4 mb-6">
            {fieldsConfig.primary_email && personalInfo?.primary_email && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                  <a 
                    href={`mailto:${personalInfo.primary_email}`}
                    className="text-foreground hover:text-primary transition-colors break-all"
                  >
                    {personalInfo.primary_email}
                  </a>
                </div>
              </div>
            )}

            {fieldsConfig.mobile_number && personalInfo?.mobile_number && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                  <a 
                    href={`tel:${personalInfo.mobile_number}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {personalInfo.mobile_number}
                  </a>
                </div>
              </div>
            )}

            {selectedProfessionalEntries.map((entry) => (
              <div key={entry.id}>
                {entry.company_website && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Website</p>
                      <a 
                        href={entry.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors break-all"
                      >
                        {entry.company_website}
                      </a>
                    </div>
                  </div>
                )}

                {entry.linkedin_url && shouldShowLinkedIn(entry.id) && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">LinkedIn</p>
                      <a 
                        href={entry.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors break-all"
                      >
                        {entry.linkedin_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={generateVCF} className="flex-1" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Card</DialogTitle>
                  <DialogDescription>
                    Share your digital business card
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg flex justify-center">
                    <div className="bg-white p-4 rounded-lg">
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
