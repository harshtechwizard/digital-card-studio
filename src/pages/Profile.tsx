import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ChangeEvent } from 'react';

type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

export default function Profile() {
  const { personalInfo, professionalInfo, loading, error, savePersonalInfo, saveProfessionalInfo, deleteProfessionalInfo } = useProfile();
  const { user } = useAuth();
  
  const [personalForm, setPersonalForm] = useState({
    full_name: '',
    primary_email: '',
    mobile_number: '',
    phone_number: '',
    home_address: '',
    bio: '',
    profile_photo_url: '',
    instagram_url: '',
    facebook_url: '',
    linkedin_url: '',
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [editingProfessional, setEditingProfessional] = useState<string | null>(null);
  const [professionalForm, setProfessionalForm] = useState({
    designation: '',
    company_name: '',
    company_website: '',
    office_email: '',
    office_phone: '',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
  });

  useEffect(() => {
    if (personalInfo) {
      setPersonalForm({
        full_name: personalInfo.full_name || '',
        primary_email: personalInfo.primary_email || '',
        mobile_number: personalInfo.mobile_number || '',
        phone_number: personalInfo.phone_number || '',
        home_address: typeof personalInfo.home_address === 'string' ? personalInfo.home_address : '',
        bio: personalInfo.bio || '',
        profile_photo_url: personalInfo.profile_photo_url || '',
        instagram_url: personalInfo.instagram_url || '',
        facebook_url: personalInfo.facebook_url || '',
        linkedin_url: personalInfo.linkedin_url || '',
      });
    }
  }, [personalInfo]);

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload a profile photo.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2 MB.",
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    try {
      setUploadingPhoto(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setPersonalForm(prev => ({
        ...prev,
        profile_photo_url: data.publicUrl,
      }));

      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload photo';
      toast({
        title: "Upload error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setPersonalForm(prev => ({
      ...prev,
      profile_photo_url: '',
    }));
  };

  const handleSavePersonal = async () => {
    if (!personalForm.full_name || personalForm.full_name.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Full name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await savePersonalInfo(personalForm);
      toast({
        title: "Profile saved",
        description: "Your personal information has been updated successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddProfessional = async () => {
    if (!professionalForm.designation || !professionalForm.company_name) {
      toast({
        title: "Missing fields",
        description: "Job Title and Company Name are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveProfessionalInfo(professionalForm);
      setProfessionalForm({
        designation: '',
        company_name: '',
        company_website: '',
        office_email: '',
        office_phone: '',
        linkedin_url: '',
        instagram_url: '',
        facebook_url: '',
      });
      toast({
        title: "Entry added",
        description: "Professional entry has been added.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add professional entry",
        variant: "destructive",
      });
    }
  };

  const handleEditProfessional = (entry: ProfessionalInfo) => {
    setEditingProfessional(entry.id);
    setProfessionalForm({
      designation: entry.designation || '',
      company_name: entry.company_name || '',
      company_website: entry.company_website || '',
      office_email: entry.office_email || '',
        office_phone: entry.office_phone || '',
        linkedin_url: entry.linkedin_url || '',
        instagram_url: entry.instagram_url || '',
        facebook_url: entry.facebook_url || '',
    });
  };

  const handleUpdateProfessional = async () => {
    if (!editingProfessional) return;

    try {
      // For updates, we need to delete and recreate since upsert needs user_id
      await deleteProfessionalInfo(editingProfessional);
      await saveProfessionalInfo(professionalForm);
      
      setEditingProfessional(null);
      setProfessionalForm({
        designation: '',
        company_name: '',
        company_website: '',
        office_email: '',
        office_phone: '',
        linkedin_url: '',
        instagram_url: '',
        facebook_url: '',
      });
      toast({
        title: "Entry updated",
        description: "Professional entry has been updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update professional entry",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProfessional = async (id: string) => {
    try {
      await deleteProfessionalInfo(id);
      toast({
        title: "Entry removed",
        description: "Professional entry has been removed.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete professional entry",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-8">Manage Your Information</h1>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Profile Photo</Label>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="w-20 h-20 border border-border">
                    {personalForm.profile_photo_url ? (
                      <AvatarImage src={personalForm.profile_photo_url} alt="Profile photo" className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-xs text-muted-foreground">
                        Add Photo
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2 w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or WEBP. Max 2 MB.
                    </p>
                    {personalForm.profile_photo_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                        className="w-fit"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={personalForm.full_name}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="primaryEmail">Primary Email</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={personalForm.primary_email}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, primary_email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={personalForm.mobile_number}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, mobile_number: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="alternateMobile">Alternate Mobile Number</Label>
                <Input
                  id="alternateMobile"
                  type="tel"
                  value={personalForm.phone_number}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="+1 (555) 987-6543"
                />
              </div>

              <div>
                <Label htmlFor="homeAddress">Home Address</Label>
                <Input
                  id="homeAddress"
                  value={personalForm.home_address}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, home_address: e.target.value }))}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={personalForm.bio}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Social Links</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="instagram" className="text-sm text-muted-foreground">Instagram</Label>
                    <Input
                      id="instagram"
                      type="url"
                      value={personalForm.instagram_url}
                      onChange={(e) => setPersonalForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook" className="text-sm text-muted-foreground">Facebook</Label>
                    <Input
                      id="facebook"
                      type="url"
                      value={personalForm.facebook_url}
                      onChange={(e) => setPersonalForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="personalLinkedin" className="text-sm text-muted-foreground">LinkedIn</Label>
                    <Input
                      id="personalLinkedin"
                      type="url"
                      value={personalForm.linkedin_url}
                      onChange={(e) => setPersonalForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
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
                  value={professionalForm.designation}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Senior Developer"
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={professionalForm.company_name}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={professionalForm.company_website}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, company_website: e.target.value }))}
                  placeholder="https://acme.com"
                />
              </div>

              <div>
                <Label htmlFor="officeEmail">Office Email</Label>
                <Input
                  id="officeEmail"
                  type="email"
                  value={professionalForm.office_email}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_email: e.target.value }))}
                  placeholder="john@acme.com"
                />
              </div>

              <div>
                <Label htmlFor="officePhone">Office Phone</Label>
                <Input
                  id="officePhone"
                  type="tel"
                  value={professionalForm.office_phone}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_phone: e.target.value }))}
                  placeholder="+1 (555) 111-2222"
                />
              </div>

              <div>
                <Label>Professional Social Handles</Label>
                <div className="space-y-4 mt-2">
                  <Input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={professionalForm.linkedin_url}
                    onChange={(e) => setProfessionalForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  />
                  <Input
                    type="url"
                    placeholder="Instagram URL"
                    value={professionalForm.instagram_url}
                    onChange={(e) => setProfessionalForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                  />
                  <Input
                    type="url"
                    placeholder="Facebook URL"
                    value={professionalForm.facebook_url}
                    onChange={(e) => setProfessionalForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                  />
                </div>
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
                      designation: '',
                      company_name: '',
                      company_website: '',
                      office_email: '',
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
              {professionalInfo.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No professional entries yet.</p>
              ) : (
                professionalInfo.map((entry) => (
                  <Card key={entry.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{entry.designation}</h4>
                        <p className="text-muted-foreground">{entry.company_name}</p>
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
                    {entry.company_website && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Website: {entry.company_website}
                      </p>
                    )}
                    {entry.office_email && (
                      <p className="text-sm text-muted-foreground">
                        Email: {entry.office_email}
                      </p>
                    )}
                    {entry.office_phone && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {entry.office_phone}
                      </p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {entry.linkedin_url && <p>LinkedIn: {entry.linkedin_url}</p>}
                      {entry.instagram_url && <p>Instagram: {entry.instagram_url}</p>}
                      {entry.facebook_url && <p>Facebook: {entry.facebook_url}</p>}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={handleSavePersonal} className="w-full" size="lg">
            Save Personal Information
          </Button>
        </div>
      </div>
    </div>
  );
}
