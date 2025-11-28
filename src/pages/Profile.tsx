import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useEducation } from '@/hooks/useEducation';
import { useAwards } from '@/hooks/useAwards';
import { useProductsServices } from '@/hooks/useProductsServices';
import { usePhotoGallery } from '@/hooks/usePhotoGallery';
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
import { Pencil, Trash2, Plus, Loader2, X, GraduationCap, Award, Package, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ChangeEvent } from 'react';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { useNavigate } from 'react-router-dom';

type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

export default function Profile() {
  const { personalInfo, professionalInfo, loading, savePersonalInfo, saveProfessionalInfo, deleteProfessionalInfo } = useProfile();
  const { education, addEducation, updateEducation, deleteEducation } = useEducation();
  const { awards, addAward, updateAward, deleteAward } = useAwards();
  const { productsServices, addProductService, updateProductService, deleteProductService } = useProductsServices();
  const { photos, addPhoto, updatePhoto, deletePhoto } = usePhotoGallery();
  const { user } = useAuth();
  
  const [personalForm, setPersonalForm] = useState({
    full_name: '',
    primary_email: '',
    mobile_number: '',
    phone_number: '',
    whatsapp_number: '',
    home_address: '',
    bio: '',
    profile_photo_url: '',
    instagram_url: '',
    facebook_url: '',
    linkedin_url: '',
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  // Show onboarding tutorial for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && !loading && personalInfo) {
      // Check if profile is empty (new user)
      if (!personalInfo.full_name || personalInfo.full_name.trim() === '') {
        setShowOnboarding(true);
      }
    }
  }, [loading, personalInfo]);

  // Education state
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState({
    degree_name: '',
    institution: '',
    year_completed: '',
    description: '',
  });

  // Awards state
  const [editingAward, setEditingAward] = useState<string | null>(null);
  const [awardForm, setAwardForm] = useState({
    title: '',
    issuing_org: '',
    date_received: '',
    expiry_date: '',
    certificate_url: '',
  });

  // Products/Services state
  const [editingProductService, setEditingProductService] = useState<string | null>(null);
  const [productServiceForm, setProductServiceForm] = useState({
    name: '',
    description: '',
    category: '',
    photo_url: '',
    website_link: '',
  });
  const [uploadingProductPhoto, setUploadingProductPhoto] = useState(false);

  // Photo Gallery state
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState({
    photo_url: '',
    caption: '',
    display_order: '',
  });
  const [uploadingGalleryPhoto, setUploadingGalleryPhoto] = useState(false);

  const [editingProfessional, setEditingProfessional] = useState<string | null>(null);
  const [professionalForm, setProfessionalForm] = useState({
    designation: '',
    company_name: '',
    company_website: '',
    office_email: '',
    office_phone: '',
    whatsapp_number: '',
    company_logo_url: '',
    office_opening_time: '',
    office_closing_time: '',
    office_days: '',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (personalInfo) {
      setPersonalForm({
        full_name: personalInfo.full_name || '',
        primary_email: personalInfo.primary_email || '',
        mobile_number: personalInfo.mobile_number || '',
        phone_number: personalInfo.phone_number || '',
        whatsapp_number: personalInfo.whatsapp_number || '',
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

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload a company logo.",
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
      setUploadingLogo(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      setProfessionalForm(prev => ({
        ...prev,
        company_logo_url: data.publicUrl,
      }));

      toast({
        title: "Logo uploaded",
        description: "Your company logo has been updated.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload logo';
      toast({
        title: "Upload error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setProfessionalForm(prev => ({
      ...prev,
      company_logo_url: '',
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
      
      // If this is the first save, redirect to cards page
      if (!personalInfo?.full_name || personalInfo.full_name.trim() === '') {
        setTimeout(() => {
          navigate('/my-cards');
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
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
        whatsapp_number: '',
        company_logo_url: '',
        office_opening_time: '',
        office_closing_time: '',
        office_days: '',
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
      whatsapp_number: entry.whatsapp_number || '',
      company_logo_url: entry.company_logo_url || '',
      office_opening_time: entry.office_opening_time || '',
      office_closing_time: entry.office_closing_time || '',
      office_days: entry.office_days || '',
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
        whatsapp_number: '',
        company_logo_url: '',
        office_opening_time: '',
        office_closing_time: '',
        office_days: '',
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
    <>
      <OnboardingTutorial open={showOnboarding} onComplete={handleOnboardingComplete} />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl pb-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Manage Your Information</h1>
            <p className="text-muted-foreground mt-2">
              Complete your profile to create professional business cards
            </p>
          </div>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="showcase">Showcase</TabsTrigger>
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
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  value={personalForm.whatsapp_number}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1234567890)
                </p>
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

          <TabsContent value="education" className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {editingEducation ? 'Edit Education' : 'Add Education'}
                </h3>
              </div>
              
              <div>
                <Label htmlFor="degreeName">Degree/Qualification *</Label>
                <Input
                  id="degreeName"
                  value={educationForm.degree_name}
                  onChange={(e) => setEducationForm(prev => ({ ...prev, degree_name: e.target.value }))}
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="University Name"
                />
              </div>

              <div>
                <Label htmlFor="yearCompleted">Year Completed</Label>
                <Input
                  id="yearCompleted"
                  type="number"
                  value={educationForm.year_completed}
                  onChange={(e) => setEducationForm(prev => ({ ...prev, year_completed: e.target.value }))}
                  placeholder="2020"
                />
              </div>

              <div>
                <Label htmlFor="eduDescription">Description</Label>
                <Textarea
                  id="eduDescription"
                  value={educationForm.description}
                  onChange={(e) => setEducationForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details about your education..."
                  rows={3}
                />
              </div>

              <Button
                onClick={async () => {
                  if (!educationForm.degree_name || !educationForm.institution) {
                    toast({
                      title: "Missing fields",
                      description: "Degree and Institution are required.",
                      variant: "destructive",
                    });
                    return;
                  }

                  try {
                    if (editingEducation) {
                      await updateEducation(editingEducation, {
                        degree_name: educationForm.degree_name,
                        institution: educationForm.institution,
                        year_completed: educationForm.year_completed ? parseInt(educationForm.year_completed) : null,
                        description: educationForm.description || null,
                      });
                      setEditingEducation(null);
                    } else {
                      await addEducation({
                        degree_name: educationForm.degree_name,
                        institution: educationForm.institution,
                        year_completed: educationForm.year_completed ? parseInt(educationForm.year_completed) : null,
                        description: educationForm.description || null,
                      });
                    }
                    setEducationForm({ degree_name: '', institution: '', year_completed: '', description: '' });
                    toast({
                      title: editingEducation ? "Education updated" : "Education added",
                      description: "Your education entry has been saved.",
                    });
                  } catch (err) {
                    toast({
                      title: "Error",
                      description: "Failed to save education entry",
                      variant: "destructive",
                    });
                  }
                }}
                className="w-full"
              >
                {editingEducation ? 'Update Entry' : <><Plus className="w-4 h-4 mr-2" /> Add Entry</>}
              </Button>

              {editingEducation && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingEducation(null);
                    setEducationForm({ degree_name: '', institution: '', year_completed: '', description: '' });
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Your Education</h3>
              {education.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No education entries yet.</p>
              ) : (
                education.map((entry) => (
                  <Card key={entry.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{entry.degree_name}</h4>
                        <p className="text-muted-foreground">{entry.institution}</p>
                        {entry.year_completed && (
                          <p className="text-sm text-muted-foreground">Completed: {entry.year_completed}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingEducation(entry.id);
                            setEducationForm({
                              degree_name: entry.degree_name,
                              institution: entry.institution,
                              year_completed: entry.year_completed?.toString() || '',
                              description: entry.description || '',
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await deleteEducation(entry.id);
                              toast({
                                title: "Education deleted",
                                description: "Education entry has been removed.",
                              });
                            } catch (err) {
                              toast({
                                title: "Error",
                                description: "Failed to delete education entry",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    )}
                  </Card>
                ))
              )}
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
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  value={professionalForm.whatsapp_number}
                  onChange={(e) => setProfessionalForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1234567890)
                </p>
              </div>

              <div>
                <Label>Company Logo</Label>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                  {professionalForm.company_logo_url ? (
                    <div className="relative">
                      <img 
                        src={professionalForm.company_logo_url} 
                        alt="Company logo" 
                        className="w-20 h-20 object-contain border border-border rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        disabled={uploadingLogo}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-border rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No logo</span>
                    </div>
                  )}
                  <div className="space-y-2 w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or WEBP. Max 2 MB.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Office Hours</Label>
                <div className="grid gap-4 md:grid-cols-2 mt-2">
                  <div>
                    <Label htmlFor="openingTime" className="text-sm text-muted-foreground">Opening Time</Label>
                    <Input
                      id="openingTime"
                      type="time"
                      value={professionalForm.office_opening_time}
                      onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_opening_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="closingTime" className="text-sm text-muted-foreground">Closing Time</Label>
                    <Input
                      id="closingTime"
                      type="time"
                      value={professionalForm.office_closing_time}
                      onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_closing_time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label htmlFor="officeDays" className="text-sm text-muted-foreground">Working Days</Label>
                  <Input
                    id="officeDays"
                    value={professionalForm.office_days}
                    onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_days: e.target.value }))}
                    placeholder="e.g., Monday-Friday or Mon-Sat"
                  />
                </div>
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
                      office_phone: '',
                      whatsapp_number: '',
                      company_logo_url: '',
                      office_opening_time: '',
                      office_closing_time: '',
                      office_days: '',
                      linkedin_url: '',
                      instagram_url: '',
                      facebook_url: '',
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

          <TabsContent value="showcase" className="space-y-8">
            {/* Awards Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Awards & Certifications</h2>
              </div>

              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingAward ? 'Edit Award' : 'Add Award'}
                </h3>
                
                <div>
                  <Label htmlFor="awardTitle">Award Title *</Label>
                  <Input
                    id="awardTitle"
                    value={awardForm.title}
                    onChange={(e) => setAwardForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Best Employee Award"
                  />
                </div>

                <div>
                  <Label htmlFor="issuingOrg">Issuing Organization *</Label>
                  <Input
                    id="issuingOrg"
                    value={awardForm.issuing_org}
                    onChange={(e) => setAwardForm(prev => ({ ...prev, issuing_org: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="dateReceived">Date Received</Label>
                    <Input
                      id="dateReceived"
                      type="date"
                      value={awardForm.date_received}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, date_received: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={awardForm.expiry_date}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="certificateUrl">Certificate URL</Label>
                  <Input
                    id="certificateUrl"
                    type="url"
                    value={awardForm.certificate_url}
                    onChange={(e) => setAwardForm(prev => ({ ...prev, certificate_url: e.target.value }))}
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>

                <Button
                  onClick={async () => {
                    if (!awardForm.title || !awardForm.issuing_org) {
                      toast({
                        title: "Missing fields",
                        description: "Title and Issuing Organization are required.",
                        variant: "destructive",
                      });
                      return;
                    }

                    try {
                      if (editingAward) {
                        await updateAward(editingAward, {
                          title: awardForm.title,
                          issuing_org: awardForm.issuing_org,
                          date_received: awardForm.date_received || null,
                          expiry_date: awardForm.expiry_date || null,
                          certificate_url: awardForm.certificate_url || null,
                        });
                        setEditingAward(null);
                      } else {
                        await addAward({
                          title: awardForm.title,
                          issuing_org: awardForm.issuing_org,
                          date_received: awardForm.date_received || null,
                          expiry_date: awardForm.expiry_date || null,
                          certificate_url: awardForm.certificate_url || null,
                        });
                      }
                      setAwardForm({ title: '', issuing_org: '', date_received: '', expiry_date: '', certificate_url: '' });
                      toast({
                        title: editingAward ? "Award updated" : "Award added",
                        description: "Your award entry has been saved.",
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to save award entry",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                >
                  {editingAward ? 'Update Award' : <><Plus className="w-4 h-4 mr-2" /> Add Award</>}
                </Button>

                {editingAward && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingAward(null);
                      setAwardForm({ title: '', issuing_org: '', date_received: '', expiry_date: '', certificate_url: '' });
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </Card>

              <div className="space-y-4">
                {awards.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No awards yet.</p>
                ) : (
                  awards.map((entry) => (
                    <Card key={entry.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{entry.title}</h4>
                          <p className="text-muted-foreground">{entry.issuing_org}</p>
                          {entry.date_received && (
                            <p className="text-sm text-muted-foreground">Received: {new Date(entry.date_received).toLocaleDateString()}</p>
                          )}
                          {entry.expiry_date && (
                            <p className="text-sm text-muted-foreground">Expires: {new Date(entry.expiry_date).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingAward(entry.id);
                              setAwardForm({
                                title: entry.title,
                                issuing_org: entry.issuing_org,
                                date_received: entry.date_received || '',
                                expiry_date: entry.expiry_date || '',
                                certificate_url: entry.certificate_url || '',
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                await deleteAward(entry.id);
                                toast({
                                  title: "Award deleted",
                                  description: "Award entry has been removed.",
                                });
                              } catch (err) {
                                toast({
                                  title: "Error",
                                  description: "Failed to delete award entry",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {entry.certificate_url && (
                        <a href={entry.certificate_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          View Certificate
                        </a>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Products/Services Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Products & Services</h2>
              </div>

              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingProductService ? 'Edit Product/Service' : 'Add Product/Service'}
                </h3>
                
                <div>
                  <Label htmlFor="productName">Name *</Label>
                  <Input
                    id="productName"
                    value={productServiceForm.name}
                    onChange={(e) => setProductServiceForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Product or Service Name"
                  />
                </div>

                <div>
                  <Label htmlFor="productDescription">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={productServiceForm.description}
                    onChange={(e) => setProductServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product or service..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="productCategory">Category</Label>
                  <Input
                    id="productCategory"
                    value={productServiceForm.category}
                    onChange={(e) => setProductServiceForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Software, Consulting, Design"
                  />
                </div>

                <div>
                  <Label>Product Photo</Label>
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {productServiceForm.photo_url ? (
                      <div className="relative">
                        <img 
                          src={productServiceForm.photo_url} 
                          alt="Product" 
                          className="w-20 h-20 object-cover border border-border rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setProductServiceForm(prev => ({ ...prev, photo_url: '' }))}
                          disabled={uploadingProductPhoto}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-border rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No photo</span>
                      </div>
                    )}
                    <div className="space-y-2 w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0];
                          if (!file || !user) return;

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
                            setUploadingProductPhoto(true);
                            const fileExt = file.name.split('.').pop();
                            const fileName = `product-${Date.now()}.${fileExt}`;
                            const filePath = `${user.id}/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('product-photos')
                              .upload(filePath, file, {
                                cacheControl: '3600',
                                upsert: true,
                                contentType: file.type,
                              });

                            if (uploadError) throw uploadError;

                            const { data } = supabase.storage
                              .from('product-photos')
                              .getPublicUrl(filePath);

                            setProductServiceForm(prev => ({ ...prev, photo_url: data.publicUrl }));

                            toast({
                              title: "Photo uploaded",
                              description: "Product photo has been uploaded.",
                            });
                          } catch (err) {
                            const message = err instanceof Error ? err.message : 'Failed to upload photo';
                            toast({
                              title: "Upload error",
                              description: message,
                              variant: "destructive",
                            });
                          } finally {
                            setUploadingProductPhoto(false);
                            event.target.value = '';
                          }
                        }}
                        disabled={uploadingProductPhoto}
                      />
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, or WEBP. Max 2 MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="productWebsite">Website Link</Label>
                  <Input
                    id="productWebsite"
                    type="url"
                    value={productServiceForm.website_link}
                    onChange={(e) => setProductServiceForm(prev => ({ ...prev, website_link: e.target.value }))}
                    placeholder="https://example.com/product"
                  />
                </div>

                <Button
                  onClick={async () => {
                    if (!productServiceForm.name) {
                      toast({
                        title: "Missing fields",
                        description: "Name is required.",
                        variant: "destructive",
                      });
                      return;
                    }

                    try {
                      if (editingProductService) {
                        await updateProductService(editingProductService, {
                          name: productServiceForm.name,
                          description: productServiceForm.description || null,
                          category: productServiceForm.category || null,
                          photo_url: productServiceForm.photo_url || null,
                          website_link: productServiceForm.website_link || null,
                        });
                        setEditingProductService(null);
                      } else {
                        await addProductService({
                          name: productServiceForm.name,
                          description: productServiceForm.description || null,
                          category: productServiceForm.category || null,
                          photo_url: productServiceForm.photo_url || null,
                          website_link: productServiceForm.website_link || null,
                        });
                      }
                      setProductServiceForm({ name: '', description: '', category: '', photo_url: '', website_link: '' });
                      toast({
                        title: editingProductService ? "Product/Service updated" : "Product/Service added",
                        description: "Your entry has been saved.",
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to save product/service entry",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                >
                  {editingProductService ? 'Update Entry' : <><Plus className="w-4 h-4 mr-2" /> Add Entry</>}
                </Button>

                {editingProductService && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProductService(null);
                      setProductServiceForm({ name: '', description: '', category: '', photo_url: '', website_link: '' });
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </Card>

              <div className="space-y-4">
                {productsServices.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No products/services yet.</p>
                ) : (
                  productsServices.map((entry) => (
                    <Card key={entry.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          {entry.photo_url && (
                            <img src={entry.photo_url} alt={entry.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{entry.name}</h4>
                            {entry.category && (
                              <p className="text-sm text-muted-foreground">{entry.category}</p>
                            )}
                            {entry.description && (
                              <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                            )}
                            {entry.website_link && (
                              <a href={entry.website_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                View Website
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingProductService(entry.id);
                              setProductServiceForm({
                                name: entry.name,
                                description: entry.description || '',
                                category: entry.category || '',
                                photo_url: entry.photo_url || '',
                                website_link: entry.website_link || '',
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                await deleteProductService(entry.id);
                                toast({
                                  title: "Product/Service deleted",
                                  description: "Entry has been removed.",
                                });
                              } catch (err) {
                                toast({
                                  title: "Error",
                                  description: "Failed to delete entry",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Photo Gallery Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Photo Gallery</h2>
              </div>

              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingPhoto ? 'Edit Photo' : 'Add Photo'}
                </h3>
                
                <div>
                  <Label>Photo *</Label>
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {photoForm.photo_url ? (
                      <div className="relative">
                        <img 
                          src={photoForm.photo_url} 
                          alt="Gallery" 
                          className="w-32 h-32 object-cover border border-border rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhotoForm(prev => ({ ...prev, photo_url: '' }))}
                          disabled={uploadingGalleryPhoto}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-border rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No photo</span>
                      </div>
                    )}
                    <div className="space-y-2 w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0];
                          if (!file || !user) return;

                          if (file.size > 5 * 1024 * 1024) {
                            toast({
                              title: "File too large",
                              description: "Please upload an image smaller than 5 MB.",
                              variant: "destructive",
                            });
                            event.target.value = '';
                            return;
                          }

                          try {
                            setUploadingGalleryPhoto(true);
                            const fileExt = file.name.split('.').pop();
                            const fileName = `gallery-${Date.now()}.${fileExt}`;
                            const filePath = `${user.id}/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('gallery-photos')
                              .upload(filePath, file, {
                                cacheControl: '3600',
                                upsert: true,
                                contentType: file.type,
                              });

                            if (uploadError) throw uploadError;

                            const { data } = supabase.storage
                              .from('gallery-photos')
                              .getPublicUrl(filePath);

                            setPhotoForm(prev => ({ ...prev, photo_url: data.publicUrl }));

                            toast({
                              title: "Photo uploaded",
                              description: "Gallery photo has been uploaded.",
                            });
                          } catch (err) {
                            const message = err instanceof Error ? err.message : 'Failed to upload photo';
                            toast({
                              title: "Upload error",
                              description: message,
                              variant: "destructive",
                            });
                          } finally {
                            setUploadingGalleryPhoto(false);
                            event.target.value = '';
                          }
                        }}
                        disabled={uploadingGalleryPhoto}
                      />
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, or WEBP. Max 5 MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="photoCaption">Caption</Label>
                  <Input
                    id="photoCaption"
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Photo caption..."
                  />
                </div>

                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={photoForm.display_order}
                    onChange={(e) => setPhotoForm(prev => ({ ...prev, display_order: e.target.value }))}
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <Button
                  onClick={async () => {
                    if (!photoForm.photo_url) {
                      toast({
                        title: "Missing photo",
                        description: "Please upload a photo.",
                        variant: "destructive",
                      });
                      return;
                    }

                    try {
                      if (editingPhoto) {
                        await updatePhoto(editingPhoto, {
                          photo_url: photoForm.photo_url,
                          caption: photoForm.caption || null,
                          display_order: photoForm.display_order ? parseInt(photoForm.display_order) : null,
                        });
                        setEditingPhoto(null);
                      } else {
                        await addPhoto({
                          photo_url: photoForm.photo_url,
                          caption: photoForm.caption || null,
                          display_order: photoForm.display_order ? parseInt(photoForm.display_order) : null,
                        });
                      }
                      setPhotoForm({ photo_url: '', caption: '', display_order: '' });
                      toast({
                        title: editingPhoto ? "Photo updated" : "Photo added",
                        description: "Your photo has been saved.",
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to save photo",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                >
                  {editingPhoto ? 'Update Photo' : <><Plus className="w-4 h-4 mr-2" /> Add Photo</>}
                </Button>

                {editingPhoto && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPhoto(null);
                      setPhotoForm({ photo_url: '', caption: '', display_order: '' });
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 col-span-full">No photos yet.</p>
                ) : (
                  photos.map((entry) => (
                    <Card key={entry.id} className="p-4 relative group">
                      <img src={entry.photo_url} alt={entry.caption || 'Gallery photo'} className="w-full h-32 object-cover rounded mb-2" />
                      {entry.caption && (
                        <p className="text-sm text-muted-foreground truncate">{entry.caption}</p>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingPhoto(entry.id);
                            setPhotoForm({
                              photo_url: entry.photo_url,
                              caption: entry.caption || '',
                              display_order: entry.display_order?.toString() || '',
                            });
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={async () => {
                            try {
                              await deletePhoto(entry.id);
                              toast({
                                title: "Photo deleted",
                                description: "Photo has been removed.",
                              });
                            } catch (err) {
                              toast({
                                title: "Error",
                                description: "Failed to delete photo",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
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
    </>
  );
}
