import { BusinessCard } from '@/types/businessCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusinessCardFormProps {
  card: Partial<BusinessCard>;
  onChange: (updates: Partial<BusinessCard>) => void;
}

export function BusinessCardForm({ card, onChange }: BusinessCardFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={card.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={card.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Senior Developer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={card.company || ''}
          onChange={(e) => onChange({ company: e.target.value })}
          placeholder="Tech Corp"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={card.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={card.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={card.website || ''}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={card.address || ''}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="123 Main St, City"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={card.bio || ''}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="A brief description about yourself..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Card Theme</Label>
        <Select
          value={card.theme || 'light'}
          onValueChange={(value: 'light' | 'dark' | 'gradient') => onChange({ theme: value })}
        >
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
