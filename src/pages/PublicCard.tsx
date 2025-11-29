import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicCard } from '@/hooks/usePublicCard';
import { Button } from '@/components/ui/button';
import { BusinessCardPreview } from '@/components/BusinessCardPreview';
import {
  Download,
  Share2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarDays,
  Clock,
  Building2,
  MessageCircle,
  Link as LinkIcon,
  type LucideIcon,
} from 'lucide-react';
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

  return <PublicCardContent data={data} slug={slug!} />;
}

type ProfessionalFieldKey =
  | 'linkedin_urls'
  | 'professional_emails'
  | 'professional_phones'
  | 'professional_instagrams'
  | 'professional_facebooks';

type ContactItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  action?: () => void;
};

const formatAddress = (address: any): string | null => {
  if (!address) return null;
  if (typeof address === 'string') return address;
  if (Array.isArray(address)) {
    return address.filter(Boolean).join(', ');
  }
  if (typeof address === 'object') {
    return Object.values(address)
      .map(part => (typeof part === 'string' ? part : null))
      .filter(Boolean)
      .join(', ');
  }
  return null;
};

const openWhatsApp = (number: string) => {
  if (!number) return;
  const cleanNumber = number.replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${cleanNumber}`, '_blank');
};

function PublicCardContent({ data, slug }: { data: any; slug: string }) {
  const { card, personalInfo, professionalInfo, education, awards, productsServices, photos } = data;
  const fieldsConfig = (card.fields_config as any) || {};

  const selectedEducation = education?.filter((e: any) => fieldsConfig.educationIds?.includes(e.id)) || [];
  const selectedAwards = awards?.filter((a: any) => fieldsConfig.awardIds?.includes(a.id)) || [];
  const selectedProducts = productsServices?.filter((p: any) => fieldsConfig.productServiceIds?.includes(p.id)) || [];
  const selectedPhotos = photos?.filter((p: any) => fieldsConfig.photoIds?.includes(p.id)) || [];

  const selectedProfessionalEntries = useMemo(
    () => professionalInfo.filter(entry => fieldsConfig.professionalIds?.includes(entry.id)),
    [professionalInfo, fieldsConfig.professionalIds]
  );

  const featuredProfessional = useMemo(
    () => selectedProfessionalEntries[0] || professionalInfo[0] || null,
    [selectedProfessionalEntries, professionalInfo]
  );

  const professionalEntriesToShow = useMemo(
    () => (selectedProfessionalEntries.length > 0 ? selectedProfessionalEntries : professionalInfo),
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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;

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
    const url = shareUrl || window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Card link has been copied to clipboard.",
    });
  };

  const contactItems: ContactItem[] = [];

  if (fieldsConfig?.primary_email && personalInfo?.primary_email) {
    contactItems.push({
      label: 'Primary Email',
      value: personalInfo.primary_email,
      icon: Mail,
      hint: 'Personal',
      action: () => (window.location.href = `mailto:${personalInfo.primary_email}`),
    });
  }

  if (fieldsConfig?.secondary_email && personalInfo?.secondary_email) {
    contactItems.push({
      label: 'Secondary Email',
      value: personalInfo.secondary_email,
      icon: Mail,
      action: () => (window.location.href = `mailto:${personalInfo.secondary_email}`),
    });
  }

  if (fieldsConfig?.mobile_number && personalInfo?.mobile_number) {
    contactItems.push({
      label: 'Mobile',
      value: personalInfo.mobile_number,
      icon: Phone,
      action: () => (window.location.href = `tel:${personalInfo.mobile_number}`),
    });
  }

  if (fieldsConfig?.alternate_mobile && personalInfo?.phone_number) {
    contactItems.push({
      label: 'Alternate Phone',
      value: personalInfo.phone_number,
      icon: Phone,
      action: () => (window.location.href = `tel:${personalInfo.phone_number}`),
    });
  }

  if (fieldsConfig?.whatsapp_number && personalInfo?.whatsapp_number) {
    contactItems.push({
      label: 'WhatsApp',
      value: personalInfo.whatsapp_number,
      icon: MessageCircle,
      action: () => openWhatsApp(personalInfo.whatsapp_number!),
    });
  }

  if (featuredProfessional?.office_email && shouldShowProfessionalField(featuredProfessional.id, 'professional_emails')) {
    contactItems.push({
      label: 'Office Email',
      value: featuredProfessional.office_email,
      icon: Mail,
      action: () => (window.location.href = `mailto:${featuredProfessional.office_email}`),
    });
  }

  if (featuredProfessional?.office_phone && shouldShowProfessionalField(featuredProfessional.id, 'professional_phones')) {
    contactItems.push({
      label: 'Office Phone',
      value: featuredProfessional.office_phone,
      icon: Phone,
      action: () => (window.location.href = `tel:${featuredProfessional.office_phone}`),
    });
  }

  if (featuredProfessional?.whatsapp_number) {
    contactItems.push({
      label: 'Corporate WhatsApp',
      value: featuredProfessional.whatsapp_number,
      icon: MessageCircle,
      action: () => openWhatsApp(featuredProfessional.whatsapp_number!),
    });
  }

  if (featuredProfessional?.company_website) {
    contactItems.push({
      label: 'Company Website',
      value: featuredProfessional.company_website,
      icon: Globe,
      action: () => window.open(featuredProfessional.company_website!, '_blank'),
    });
  }

  const officeAddress =
    formatAddress(featuredProfessional?.office_address) ||
    formatAddress(personalInfo?.home_address);

  if (officeAddress) {
    contactItems.push({
      label: featuredProfessional?.office_address ? 'Office Address' : 'Location',
      value: officeAddress,
      icon: MapPin,
    });
  }

  const hasOfficeSchedule =
    featuredProfessional?.office_days ||
    (featuredProfessional?.office_opening_time && featuredProfessional?.office_closing_time);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-10 md:py-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/10 blur-[180px] rounded-full" />
        <div className="absolute -bottom-40 -right-10 w-[28rem] h-[28rem] bg-emerald-200/40 dark:bg-emerald-500/10 blur-[220px] rounded-full" />
      </div>

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

      <div className="relative z-10 w-full max-w-6xl space-y-10">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-300/70 dark:border-slate-700 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200 shadow-sm">
            <Building2 className="w-4 h-4" />
            {featuredProfessional?.company_name || 'Digital Card'}
          </div>
          {fieldsConfig?.full_name && personalInfo?.full_name && (
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                {personalInfo.full_name}
              </h1>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed">
                {personalInfo.bio && fieldsConfig?.bio
                  ? personalInfo.bio
                  : selectedProfessionalEntries[0]?.designation || 'Building meaningful connections'}
              </p>
            </div>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-slate-300/40 dark:from-primary/25 dark:to-slate-900/60 blur-[60px] rounded-[40px]" />
            <div className="relative">
              <BusinessCardPreview
                personalInfo={personalInfo}
                professionalInfo={professionalEntriesToShow}
                fieldsConfig={fieldsConfig}
              />
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Connect</p>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold">
                  <Share2 className="w-3.5 h-3.5" />
                  Share-ready
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={generateVCF} className="flex-1 text-base py-6 rounded-2xl">
                  <Download className="w-4 h-4 mr-2" />
                  Save Contact
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-base py-6 rounded-2xl border-dashed">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Share this card</DialogTitle>
                      <DialogDescription>Show the QR or copy the public link.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5">
                      <div className="bg-muted rounded-3xl p-5 flex flex-col items-center gap-4">
                        <div className="bg-white rounded-3xl p-4 shadow-inner">
                          <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Scan to open: {shareUrl}
                        </p>
                      </div>
                      <Button onClick={handleShare} className="w-full">
                        Copy link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Reach out</p>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact details</h2>
                </div>
                <span className="text-xs text-muted-foreground">{contactItems.length} touchpoints</span>
              </div>

              {contactItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {contactItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={`${item.label}-${item.value}`}
                        type="button"
                        onClick={item.action}
                        disabled={!item.action}
                        className={`group relative overflow-hidden text-left rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 px-4 py-4 transition-all ${
                          item.action ? 'hover:-translate-y-0.5 hover:border-primary/40' : 'cursor-default'
                        } disabled:opacity-100`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                            <p className="text-base font-medium text-slate-900 dark:text-white break-words">
                              {item.value}
                            </p>
                            {item.hint && <p className="text-xs text-muted-foreground">{item.hint}</p>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  Contact details will appear here once enabled for this card.
                </p>
              )}
            </section>

            {hasOfficeSchedule && (
              <section className="rounded-[32px] border border-white/70 dark:border-slate-800/70 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-[0_20px_60px_rgba(2,6,23,0.35)] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">Availability</p>
                    <h2 className="text-xl font-semibold">Office schedule</h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  {featuredProfessional?.office_days && (
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl">
                      <CalendarDays className="w-4 h-4" />
                      <span>{featuredProfessional.office_days}</span>
                    </div>
                  )}
                  {featuredProfessional?.office_opening_time && featuredProfessional?.office_closing_time && (
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl">
                      <Clock className="w-4 h-4" />
                      <span>
                        {featuredProfessional.office_opening_time} – {featuredProfessional.office_closing_time}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {professionalEntriesToShow.length > 0 && (
          <section className="rounded-[40px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Highlights</p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Professional footprint</h2>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                <LinkIcon className="w-3.5 h-3.5" />
                {professionalEntriesToShow.length} active associations
              </span>
            </div>
            <div className="space-y-4">
              {professionalEntriesToShow.map((entry: any, index: number) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Role #{index + 1}</p>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {entry.designation || 'Professional'}
                      </h3>
                      {entry.company_name && (
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{entry.company_name}</p>
                      )}
                    </div>
                    {entry.department && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold">
                        <Building2 className="w-3.5 h-3.5" />
                        {entry.department}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {entry.office_email && shouldShowProfessionalField(entry.id, 'professional_emails') && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        <Mail className="w-3.5 h-3.5" />
                        {entry.office_email}
                      </span>
                    )}
                    {entry.office_phone && shouldShowProfessionalField(entry.id, 'professional_phones') && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        <Phone className="w-3.5 h-3.5" />
                        {entry.office_phone}
                      </span>
                    )}
                    {entry.company_website && (
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200/80"
                        onClick={() => window.open(entry.company_website!, '_blank')}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </span>
                    )}
                    {entry.linkedin_url && shouldShowProfessionalField(entry.id, 'linkedin_urls') && (
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200/80"
                        onClick={() => window.open(entry.linkedin_url!, '_blank')}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        LinkedIn
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedEducation.length > 0 && (
          <section className="rounded-[40px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Academic Background</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Education</h2>
            </div>
            <div className="space-y-4">
              {selectedEducation.map((entry: any) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {entry.degree_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{entry.institution}</p>
                  {entry.year_completed && (
                    <p className="text-sm text-muted-foreground">Completed: {entry.year_completed}</p>
                  )}
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedAwards.length > 0 && (
          <section className="rounded-[40px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Recognition</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Awards & Certifications</h2>
            </div>
            <div className="space-y-4">
              {selectedAwards.map((entry: any) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{entry.issuing_org}</p>
                  {entry.date_received && (
                    <p className="text-sm text-muted-foreground">Received: {new Date(entry.date_received).toLocaleDateString()}</p>
                  )}
                  {entry.expiry_date && (
                    <p className="text-sm text-muted-foreground">Expires: {new Date(entry.expiry_date).toLocaleDateString()}</p>
                  )}
                  {entry.certificate_url && (
                    <a href={entry.certificate_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View Certificate
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedProducts.length > 0 && (
          <section className="rounded-[40px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Offerings</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Products & Services</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedProducts.map((entry: any) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6 space-y-3"
                >
                  {entry.photo_url && (
                    <img src={entry.photo_url} alt={entry.name} className="w-full h-40 object-cover rounded-2xl" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {entry.name}
                    </h3>
                    {entry.category && (
                      <p className="text-sm text-muted-foreground">{entry.category}</p>
                    )}
                    {entry.description && (
                      <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>
                    )}
                    {entry.website_link && (
                      <a href={entry.website_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-block mt-2">
                        Learn More →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedPhotos.length > 0 && (
          <section className="rounded-[40px] border border-white/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Visual Story</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Photo Gallery</h2>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {selectedPhotos.map((entry: any) => (
                <div
                  key={entry.id}
                  className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60"
                >
                  <img src={entry.photo_url} alt={entry.caption || 'Gallery photo'} className="w-full h-48 object-cover" />
                  {entry.caption && (
                    <p className="text-sm text-muted-foreground p-3">{entry.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
