import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicCard } from '@/hooks/usePublicCard';
import { Button } from '@/components/ui/button';
import { BusinessCardPreview } from '@/components/BusinessCardPreview';
import { Download, Share2, Loader2 } from 'lucide-react';
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
  type ProfessionalFieldKey = 'linkedin_urls' | 'professional_emails' | 'professional_phones' | 'professional_instagrams' | 'professional_facebooks';

  const selectedProfessionalEntries = professionalInfo.filter(
    entry => fieldsConfig.professionalIds?.includes(entry.id)
  );

  const featuredProfessional = useMemo(
    () => selectedProfessionalEntries[0] || professionalInfo[0] || null,
    [selectedProfessionalEntries, professionalInfo]
  );

  const [logoOverlayVisible, setLogoOverlayVisible] = useState(false);
  useEffect(() => {
    if (!featuredProfessional?.company_logo_url) {
      setLogoOverlayVisible(false);
      return;
    }
    setLogoOverlayVisible(true);
    const timer = setTimeout(() => setLogoOverlayVisible(false), 1000);
    return () => clearTimeout(timer);
  }, [featuredProfessional?.company_logo_url, slug]);

  const shouldShowProfessionalField = (entryId: string, key: ProfessionalFieldKey) => {
    const list = fieldsConfig[key];
    return Array.isArray(list) && list.includes(entryId);
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

    if (fieldsConfig.alternate_mobile && personalInfo?.phone_number) {
      vcf += `TEL;TYPE=HOME:${personalInfo.phone_number}\n`;
    }
    
    selectedProfessionalEntries.forEach(entry => {
      if (entry.designation) vcf += `TITLE:${entry.designation}\n`;
      if (entry.company_name) vcf += `ORG:${entry.company_name}\n`;
      if (entry.office_email && shouldShowProfessionalField(entry.id, 'professional_emails')) {
        vcf += `EMAIL;TYPE=WORK:${entry.office_email}\n`;
      }
      if (entry.office_phone && shouldShowProfessionalField(entry.id, 'professional_phones')) {
        vcf += `TEL;TYPE=WORK:${entry.office_phone}\n`;
      }
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {featuredProfessional?.company_logo_url && (
        <div
          className={`fixed inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-background via-background/90 to-muted transition-opacity duration-700 ${
            logoOverlayVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={featuredProfessional.company_logo_url}
            alt={featuredProfessional.company_name || 'Company logo'}
            className="max-w-xs sm:max-w-sm w-full object-contain drop-shadow-2xl"
          />
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="transition duration-700 ease-out opacity-100 translate-y-0">
          <BusinessCardPreview
            personalInfo={personalInfo}
            professionalInfo={selectedProfessionalEntries}
            fieldsConfig={fieldsConfig}
          />
        </div>

        <section className="flex flex-col sm:flex-row gap-4">
          <Button onClick={generateVCF} className="w-full sm:flex-1 text-base py-6 rounded-2xl shadow-lg">
            <Download className="w-4 h-4 mr-2" />
            Save Contact
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:flex-1 text-base py-6 rounded-2xl">
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
        </section>
      </div>
    </div>
  );
}
