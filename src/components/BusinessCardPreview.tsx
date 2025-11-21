import { Database } from '@/types/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative z-10 p-8">
        {/* Company Logo - Top */}
        {selectedProfessional?.company_logo_url && (
          <div className="flex justify-center mb-4 animate-fade-in">
            <img
              src={selectedProfessional.company_logo_url}
              alt={selectedProfessional.company_name || 'Company logo'}
              className="h-12 object-contain"
            />
          </div>
        )}

        {/* Profile Photo - Big & Centered */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <Avatar className="w-40 h-40 border-4 border-white shadow-xl ring-4 ring-primary/20 bg-white dark:bg-gray-800">
            {fieldsConfig?.profile_photo_url && personalInfo?.profile_photo_url ? (
              <AvatarImage src={personalInfo.profile_photo_url} alt={personalInfo.full_name || 'Profile'} className="object-cover" />
            ) : null}
            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/70 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        {fieldsConfig?.full_name && personalInfo?.full_name && (
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2 animate-slide-up">
            {personalInfo.full_name}
          </h1>
        )}

        {/* Professional Info */}
        {selectedProfessional && (
          <div className="text-center mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {selectedProfessional.designation && (
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {selectedProfessional.designation}
              </p>
            )}
            {selectedProfessional.company_name && (
              <p className="text-md text-gray-600 dark:text-gray-400">
                {selectedProfessional.company_name}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {fieldsConfig?.bio && personalInfo?.bio && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {personalInfo.bio}
          </p>
        )}

        {/* Contact Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {fieldsConfig?.primary_email && personalInfo?.primary_email && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.location.href = `mailto:${personalInfo.primary_email}`}
            >
              <Mail className="w-4 h-4" />
            </Button>
          )}

          {fieldsConfig?.mobile_number && personalInfo?.mobile_number && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.location.href = `tel:${personalInfo.mobile_number}`}
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}

          {fieldsConfig?.whatsapp_number && personalInfo?.whatsapp_number && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform bg-green-50 hover:bg-green-100 border-green-200"
              onClick={() => handleWhatsAppClick(personalInfo.whatsapp_number!)}
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
            </Button>
          )}

          {selectedProfessional?.whatsapp_number && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform bg-green-50 hover:bg-green-100 border-green-200"
              onClick={() => handleWhatsAppClick(selectedProfessional.whatsapp_number!)}
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
            </Button>
          )}

          {selectedProfessional?.company_website && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.open(selectedProfessional.company_website!, '_blank')}
            >
              <Globe className="w-4 h-4" />
            </Button>
          )}

          {(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url) && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.open(personalInfo?.linkedin_url || selectedProfessional?.linkedin_url!, '_blank')}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          )}

          {(personalInfo?.instagram_url || selectedProfessional?.instagram_url) && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.open(personalInfo?.instagram_url || selectedProfessional?.instagram_url!, '_blank')}
            >
              <Instagram className="w-4 h-4" />
            </Button>
          )}

          {(personalInfo?.facebook_url || selectedProfessional?.facebook_url) && (
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => window.open(personalInfo?.facebook_url || selectedProfessional?.facebook_url!, '_blank')}
            >
              <Facebook className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Office Hours (if available) */}
        {selectedProfessional?.office_opening_time && selectedProfessional?.office_closing_time && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p className="font-semibold">Office Hours</p>
            <p>
              {selectedProfessional.office_days || 'Mon-Fri'}: {' '}
              {selectedProfessional.office_opening_time} - {selectedProfessional.office_closing_time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
