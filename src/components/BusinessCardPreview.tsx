import { Database } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Globe, Linkedin, Instagram, Facebook, MessageCircle } from 'lucide-react';

type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

interface BusinessCardPreviewProps {
  personalInfo: PersonalInfo | null;
  professionalInfo: ProfessionalInfo[];
  fieldsConfig: any;
}

export function BusinessCardPreview({ personalInfo, professionalInfo, fieldsConfig }: BusinessCardPreviewProps) {
  const selectedProfessional = professionalInfo.find(p => 
    fieldsConfig?.professionalIds?.includes(p.id)
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

  const handleWhatsAppClick = (number: string) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <div className="absolute inset-0 blur-3xl opacity-60 pointer-events-none">
        <div className="w-48 h-48 md:w-64 md:h-64 bg-primary/40 rounded-full absolute -top-8 -left-6" />
        <div className="w-56 h-56 md:w-72 md:h-72 bg-purple-400/30 rounded-full absolute bottom-4 right-4" />
      </div>

      <div className="relative overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-[0_30px_80px_rgba(15,23,42,.45)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -right-24 top-0 w-72 h-72 bg-primary/30 blur-[120px]" />
          <div className="absolute -left-32 bottom-0 w-80 h-80 bg-cyan-400/30 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row">
          <section className="md:w-5/12 p-10 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                <div className="flex items-center gap-3">
              {selectedProfessional?.company_logo_url ? (
                <img
                  src={selectedProfessional.company_logo_url}
                  alt={selectedProfessional.company_name || 'Company logo'}
                  className="h-12 object-contain drop-shadow-lg"
                />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-lg font-semibold">
                  {selectedProfessional?.company_name?.[0] || 'C'}
                </div>
              )}
              {selectedProfessional?.company_name && (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">company</p>
                  <p className="text-lg font-semibold">{selectedProfessional.company_name}</p>
                </div>
              )}
            </div>

            <div className="w-full rounded-[28px] border border-white/15 bg-white/5 p-3 backdrop-blur">
              <div className="w-full h-[220px] rounded-[20px] bg-gradient-to-br from-primary/40 via-primary/20 to-transparent border border-white/10 flex items-center justify-center text-5xl font-bold text-white/90 overflow-hidden">
                {fieldsConfig?.profile_photo_url && personalInfo?.profile_photo_url ? (
                  <img
                    src={personalInfo.profile_photo_url}
                    alt={personalInfo.full_name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              {fieldsConfig?.bio && personalInfo?.bio && (
                <p className="mt-4 text-sm text-white/80 leading-relaxed">{personalInfo.bio}</p>
              )}
            </div>
          </section>

          <section className="md:w-7/12 p-10 space-y-6">
            {fieldsConfig?.full_name && personalInfo?.full_name && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">digital card</p>
                <h1 className="text-4xl font-semibold tracking-tight">{personalInfo.full_name}</h1>
                {selectedProfessional && (
                  <p className="text-base text-white/70">
                    {[selectedProfessional.designation, selectedProfessional.company_name]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldsConfig?.primary_email && personalInfo?.primary_email && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">email</p>
                  <p className="text-sm font-medium break-all">{personalInfo.primary_email}</p>
                </div>
              )}
              {fieldsConfig?.mobile_number && personalInfo?.mobile_number && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">phone</p>
                  <p className="text-sm font-medium">{personalInfo.mobile_number}</p>
                </div>
              )}
              {selectedProfessional?.company_website && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">website</p>
                  <p className="text-sm font-medium break-all">{selectedProfessional.company_website}</p>
                </div>
              )}
              {selectedProfessional?.office_email && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">work email</p>
                  <p className="text-sm font-medium break-all">{selectedProfessional.office_email}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-3">connect</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {fieldsConfig?.primary_email && personalInfo?.primary_email && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() => (window.location.href = `mailto:${personalInfo.primary_email}`)}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                )}
                {fieldsConfig?.mobile_number && personalInfo?.mobile_number && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() => (window.location.href = `tel:${personalInfo.mobile_number}`)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
                {fieldsConfig?.whatsapp_number && personalInfo?.whatsapp_number && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-emerald-400/15 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/25"
                    onClick={() => handleWhatsAppClick(personalInfo.whatsapp_number!)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                )}
                {selectedProfessional?.whatsapp_number && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-emerald-400/15 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/25"
                    onClick={() => handleWhatsAppClick(selectedProfessional.whatsapp_number!)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                )}
                {selectedProfessional?.company_website && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() => window.open(selectedProfessional.company_website!, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                )}
                {(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() =>
                      window.open(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url!, '_blank')
                    }
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                )}
                {(personalInfo?.instagram_url || selectedProfessional?.instagram_url) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() =>
                      window.open(personalInfo?.instagram_url || selectedProfessional?.instagram_url!, '_blank')
                    }
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                )}
                {(personalInfo?.facebook_url || selectedProfessional?.facebook_url) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20"
                    onClick={() =>
                      window.open(personalInfo?.facebook_url || selectedProfessional?.facebook_url!, '_blank')
                    }
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {selectedProfessional?.office_opening_time && selectedProfessional?.office_closing_time && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">office hours</p>
                <p className="font-medium">
                  {selectedProfessional.office_days || 'Mon-Fri'} · {selectedProfessional.office_opening_time} –{' '}
                  {selectedProfessional.office_closing_time}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
