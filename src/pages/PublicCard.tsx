import { useParams } from 'react-router-dom';
import { usePublicCard } from '@/hooks/usePublicCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, PhoneCall, Globe, Linkedin, Instagram, Facebook, Download, Share2, Loader2 } from 'lucide-react';
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

  const shouldShowProfessionalField = (entryId: string, key: ProfessionalFieldKey) => {
    const list = fieldsConfig[key];
    return Array.isArray(list) && list.includes(entryId);
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
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.2)] border-none">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 text-primary-foreground">
          <Avatar className="w-28 h-28 border-4 border-white/30 shadow-lg">
            {fieldsConfig.profile_photo_url && personalInfo?.profile_photo_url ? (
              <img 
                src={personalInfo.profile_photo_url} 
                alt={personalInfo.full_name || 'Profile'} 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-3xl bg-primary-foreground/20 text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-2">
            {fieldsConfig.full_name && personalInfo?.full_name && (
              <h1 className="text-3xl font-bold tracking-tight">
                {personalInfo.full_name}
              </h1>
            )}
            {selectedProfessionalEntries.length > 0 ? (
              <div className="space-y-1 text-primary-foreground/80">
                {selectedProfessionalEntries.map((entry) => (
                  <p key={entry.id} className="text-lg leading-tight">
                    <span className="font-medium">{entry.designation}</span>
                    {entry.company_name && <> · {entry.company_name}</>}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-background p-6 sm:p-8 space-y-6">
          {fieldsConfig.bio && personalInfo?.bio && (
            <div className="bg-muted/40 rounded-2xl p-5 text-center text-base text-muted-foreground italic">
              {personalInfo.bio}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Contact
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {fieldsConfig.primary_email && personalInfo?.primary_email && (
                <a
                  href={`mailto:${personalInfo.primary_email}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 p-3 hover:border-primary transition-colors"
                >
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">Email</p>
                    <p className="text-sm font-medium break-all">{personalInfo.primary_email}</p>
                  </div>
                </a>
              )}

              {fieldsConfig.mobile_number && personalInfo?.mobile_number && (
                <a
                  href={`tel:${personalInfo.mobile_number}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 p-3 hover:border-primary transition-colors"
                >
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">Phone</p>
                    <p className="text-sm font-medium break-all">{personalInfo.mobile_number}</p>
                  </div>
                </a>
              )}

              {fieldsConfig.alternate_mobile && personalInfo?.phone_number && (
                <a
                  href={`tel:${personalInfo.phone_number}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 p-3 hover:border-primary transition-colors"
                >
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <PhoneCall className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">Alternate</p>
                    <p className="text-sm font-medium break-all">{personalInfo.phone_number}</p>
                  </div>
                </a>
              )}
            </div>
          </section>

          {(fieldsConfig.social_instagram && personalInfo?.instagram_url) ||
            (fieldsConfig.social_facebook && personalInfo?.facebook_url) ||
            (fieldsConfig.social_linkedin && personalInfo?.linkedin_url) ? (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Social
              </h2>
              <div className="flex flex-wrap gap-3">
                {fieldsConfig.social_linkedin && personalInfo?.linkedin_url && (
                  <a
                    href={personalInfo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm hover:border-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-primary" />
                    LinkedIn
                  </a>
                )}
                {fieldsConfig.social_instagram && personalInfo?.instagram_url && (
                  <a
                    href={personalInfo.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm hover:border-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    Instagram
                  </a>
                )}
                {fieldsConfig.social_facebook && personalInfo?.facebook_url && (
                  <a
                    href={personalInfo.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm hover:border-primary transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-primary" />
                    Facebook
                  </a>
                )}
              </div>
            </section>
          ) : null}

          {selectedProfessionalEntries.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Professional
              </h2>
              <div className="space-y-3">
                {selectedProfessionalEntries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-border/60 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {entry.designation}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.company_name}</p>
                      </div>
                      {entry.company_website && (
                        <a
                          href={entry.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                        >
                          Visit site
                        </a>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {entry.office_email && shouldShowProfessionalField(entry.id, 'professional_emails') && (
                        <a
                          href={`mailto:${entry.office_email}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="truncate">{entry.office_email}</span>
                        </a>
                      )}
                      {entry.office_phone && shouldShowProfessionalField(entry.id, 'professional_phones') && (
                        <a
                          href={`tel:${entry.office_phone}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="truncate">{entry.office_phone}</span>
                        </a>
                      )}
                      {entry.linkedin_url && shouldShowProfessionalField(entry.id, 'linkedin_urls') && (
                        <a
                          href={entry.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-primary" />
                          <span className="truncate">{entry.linkedin_url}</span>
                        </a>
                      )}
                      {entry.instagram_url && shouldShowProfessionalField(entry.id, 'professional_instagrams') && (
                        <a
                          href={entry.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="w-4 h-4 text-primary" />
                          <span className="truncate">{entry.instagram_url}</span>
                        </a>
                      )}
                      {entry.facebook_url && shouldShowProfessionalField(entry.id, 'professional_facebooks') && (
                        <a
                          href={entry.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Facebook className="w-4 h-4 text-primary" />
                          <span className="truncate">{entry.facebook_url}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={generateVCF} className="w-full sm:flex-1 text-base py-6">
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:flex-1 text-base py-6">
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
      </Card>
    </div>
  );
}
