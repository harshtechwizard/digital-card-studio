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
  ) || professionalInfo[0] || null;

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
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-br from-white via-slate-50 to-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        {/* subtle logo watermark */}
        {selectedProfessional?.company_logo_url && (
          <div
            className="absolute inset-0 opacity-[0.08] bg-center bg-cover"
            style={{ backgroundImage: `url(${selectedProfessional.company_logo_url})` }}
          />
        )}

        <div className="relative z-10 px-10 pt-10 pb-8 flex flex-col items-center gap-6">
          {/* Company logo */}
          {selectedProfessional?.company_logo_url && (
            <img
              src={selectedProfessional.company_logo_url}
              alt={selectedProfessional.company_name || 'Company logo'}
              className="h-16 object-contain"
            />
          )}

          {/* Rectangular profile photo */}
          <div className="w-[230px] h-[150px] rounded-[28px] border-4 border-white shadow-xl ring-4 ring-primary/15 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/40 flex items-center justify-center text-4xl font-semibold text-white">
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

          {/* Name */}
          {fieldsConfig?.full_name && personalInfo?.full_name && (
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {personalInfo.full_name}
              </h1>

              {selectedProfessional && (
                <div className="text-sm text-muted-foreground">
                  {selectedProfessional.designation && <p>{selectedProfessional.designation}</p>}
                  {selectedProfessional.company_name && (
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {selectedProfessional.company_name}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {fieldsConfig?.bio && personalInfo?.bio && (
            <p className="text-center text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              {personalInfo.bio}
            </p>
          )}

          {/* Contact buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {fieldsConfig?.primary_email && personalInfo?.primary_email && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() => (window.location.href = `mailto:${personalInfo.primary_email}`)}
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}
            {fieldsConfig?.mobile_number && personalInfo?.mobile_number && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() => (window.location.href = `tel:${personalInfo.mobile_number}`)}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {fieldsConfig?.whatsapp_number && personalInfo?.whatsapp_number && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition"
                onClick={() => handleWhatsAppClick(personalInfo.whatsapp_number!)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
            {selectedProfessional?.whatsapp_number && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition"
                onClick={() => handleWhatsAppClick(selectedProfessional.whatsapp_number!)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
            {selectedProfessional?.company_website && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() => window.open(selectedProfessional.company_website!, '_blank')}
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}
            {(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url) && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() =>
                  window.open(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url!, '_blank')
                }
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            )}
            {(personalInfo?.instagram_url || selectedProfessional?.instagram_url) && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() =>
                  window.open(personalInfo?.instagram_url || selectedProfessional?.instagram_url!, '_blank')
                }
              >
                <Instagram className="w-4 h-4" />
              </Button>
            )}
            {(personalInfo?.facebook_url || selectedProfessional?.facebook_url) && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-400 transition"
                onClick={() =>
                  window.open(personalInfo?.facebook_url || selectedProfessional?.facebook_url!, '_blank')
                }
              >
                <Facebook className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Office hours */}
          {selectedProfessional?.office_opening_time && selectedProfessional?.office_closing_time && (
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              <p className="uppercase tracking-[0.3em] text-[11px]">Office Hours</p>
              <p className="font-medium">
                {selectedProfessional.office_days || 'Mon-Fri'} ·{' '}
                {selectedProfessional.office_opening_time} – {selectedProfessional.office_closing_time}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
