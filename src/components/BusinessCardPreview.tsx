import { BusinessCard } from '@/types/businessCard';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Globe, MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessCardPreviewProps {
  card: BusinessCard;
  className?: string;
}

export function BusinessCardPreview({ card, className }: BusinessCardPreviewProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const themeClasses = {
    light: 'bg-card text-card-foreground',
    dark: 'bg-primary text-primary-foreground',
    gradient: 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground',
  };

  return (
    <Card className={cn(
      'p-6 space-y-4 transition-all duration-300 hover:shadow-lg',
      themeClasses[card.theme],
      className
    )}>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={card.avatar} alt={card.name} />
          <AvatarFallback>{getInitials(card.name || 'U')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold truncate">{card.name || 'Your Name'}</h2>
          <p className="text-sm opacity-90 truncate">{card.title || 'Your Title'}</p>
        </div>
      </div>

      {card.company && (
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 shrink-0 opacity-70" />
          <span className="truncate">{card.company}</span>
        </div>
      )}

      {card.bio && (
        <p className="text-sm opacity-90 line-clamp-3">{card.bio}</p>
      )}

      <div className="space-y-2 pt-2 border-t border-current/10">
        {card.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{card.email}</span>
          </div>
        )}
        
        {card.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{card.phone}</span>
          </div>
        )}
        
        {card.website && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{card.website}</span>
          </div>
        )}
        
        {card.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{card.address}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
