import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Profile as ProfileType, ProfessionalEntry } from '@/types/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function Profile() {
  const { profile, saveProfile } = useProfile();
  const [formData, setFormData] = useState<ProfileType>(profile);
  const [editingProfessional, setEditingProfessional] = useState<string | null>(null);
  const [professionalForm, setProfessionalForm] = useState<Omit<ProfessionalEntry, 'id'>>({
    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    officeEmail: '',
  });

  const handleInputChange = (field: keyof ProfileType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveProfile(formData);
    toast({
      title: "Profile saved",
      description: "Your information has been updated successfully.",
    });
  };

  const handleAddProfessional = () => {
    if (!professionalForm.jobTitle || !professionalForm.companyName) {
      toast({
        title: "Missing fields",
        description: "Job Title and Company Name are required.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: ProfessionalEntry = {
      ...professionalForm,
      id: crypto.randomUUID(),
    };

    setFormData(prev => ({
      ...prev,
      professionalEntries: [...prev.professionalEntries, newEntry],
    }));

    setProfessionalForm({
      jobTitle: '',
      companyName: '',
      companyWebsite: '',
      officeEmail: '',
    });

    toast({
      title: "Entry added",
      description: "Professional entry has been added.",
    });
  };

  const handleEditProfessional = (entry: ProfessionalEntry) => {
    setEditingProfessional(entry.id);
    setProfessionalForm({
      jobTitle: entry.jobTitle,
      companyName: entry.companyName,
      companyWebsite: entry.companyWebsite,
      officeEmail: entry.officeEmail,
    });
  };

  const handleUpdateProfessional = () => {
    if (!editingProfessional) return;

    setFormData(prev => ({
      ...prev,
      professionalEntries: prev.professionalEntries.map(entry =>
        entry.id === editingProfessional
          ? { ...entry, ...professionalForm }
          : entry
      ),
    }));

    setEditingProfessional(null);
    setProfessionalForm({
      jobTitle: '',
      companyName: '',
      companyWebsite: '',
      officeEmail: '',
    });

    toast({
      title: "Entry updated",
      description: "Professional entry has been updated.",
    });
  };

  const handleRemoveProfessional = (id: string) => {
    setFormData(prev => ({
      ...prev,
      professionalEntries: prev.professionalEntries.filter(entry => entry.id !== id),
    }));
    toast({
      title: "Entry removed",
      description: "Professional entry has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-8">Manage Your Information</h1>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="links">Links & Socials</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="primaryEmail">Primary Email</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="homeAddress">Home Address</Label>
                <Input
                  id="homeAddress"
                  value={formData.homeAddress}
                  onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingProfessional ? 'Edit Professional Entry' : 'Add Professional Entry'}
              </h3>
              
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={professionalForm.jobTitle}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Senior Developer"
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={professionalForm.companyName}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={professionalForm.companyWebsite}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, companyWebsite: e.target.value }))}
                  placeholder="https://acme.com"
                />
              </div>

              <div>
                <Label htmlFor="officeEmail">Office Email</Label>
                <Input
                  id="officeEmail"
                  type="email"
                  value={professionalForm.officeEmail}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, officeEmail: e.target.value }))}
                  placeholder="john@acme.com"
                />
              </div>

              <Button
                onClick={editingProfessional ? handleUpdateProfessional : handleAddProfessional}
                className="w-full"
              >
                {editingProfessional ? 'Update Entry' : <><Plus className="w-4 h-4 mr-2" /> Add Entry</>}
              </Button>

              {editingProfessional && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProfessional(null);
                    setProfessionalForm({
                      jobTitle: '',
                      companyName: '',
                      companyWebsite: '',
                      officeEmail: '',
                    });
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Your Professional Entries</h3>
              {formData.professionalEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No professional entries yet.</p>
              ) : (
                formData.professionalEntries.map((entry) => (
                  <Card key={entry.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{entry.jobTitle}</h4>
                        <p className="text-muted-foreground">{entry.companyName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditProfessional(entry)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveProfessional(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {entry.companyWebsite && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Website: {entry.companyWebsite}
                      </p>
                    )}
                    {entry.officeEmail && (
                      <p className="text-sm text-muted-foreground">
                        Email: {entry.officeEmail}
                      </p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  placeholder="https://x.com/johndoe"
                />
              </div>

              <div>
                <Label htmlFor="personalWebsite">Personal Website</Label>
                <Input
                  id="personalWebsite"
                  type="url"
                  value={formData.personalWebsite}
                  onChange={(e) => handleInputChange('personalWebsite', e.target.value)}
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={handleSave} className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
