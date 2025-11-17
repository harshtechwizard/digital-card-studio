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
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <div className="p-8 text-center">
          {/* Avatar */}
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          {fieldsConfig.full_name && personalInfo?.full_name && (
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {personalInfo.full_name}
            </h1>
          )}

          {/* Professional Info */}
          {selectedProfessionalEntries.map((entry) => (
            <div key={entry.id} className="mb-4">
              <p className="text-lg text-foreground font-medium">{entry.designation}</p>
              <p className="text-muted-foreground">{entry.company_name}</p>
            </div>
          ))}

          {/* Bio */}
          {fieldsConfig.bio && personalInfo?.bio && (
            <p className="text-sm text-muted-foreground mb-6 mt-4">
              {personalInfo.bio}
            </p>
          )}

          {/* Contact Methods */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {fieldsConfig.primary_email && personalInfo?.primary_email && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location.href = `mailto:${personalInfo.primary_email}`}
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}

            {fieldsConfig.mobile_number && personalInfo?.mobile_number && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location.href = `tel:${personalInfo.mobile_number}`}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}

            {selectedProfessionalEntries.map((entry) => (
              entry.linkedin_url && (
                <Button
                  key={entry.id}
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(entry.linkedin_url!, '_blank')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              )
            ))}
          </div>

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
