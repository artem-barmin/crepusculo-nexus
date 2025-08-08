import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  birthday: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 21;
    }
    return age >= 21;
  }, "You must be at least 21 years old"),
  social_media: z.array(z.string().url("Please enter a valid URL")).min(1, "At least one social media link is required"),
  introduction: z.string().min(50, "Introduction must be at least 50 characters"),
  previous_events: z.string(),
  other_events: z.string().optional(),
  why_join: z.string().min(50, "Please provide a detailed answer (at least 50 characters)"),
  how_heard_about: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  birthday: string | null;
  social_media: string[] | null;
  introduction: string | null;
  previous_events: string;
  other_events: string | null;
  why_join: string | null;
  how_heard_about: string | null;
  status: string;
}

interface UserPhoto {
  id: string;
  photo_url: string;
  is_primary: boolean;
}

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [socialLinks, setSocialLinks] = useState<string[]>(profile.social_media || [""]);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      birthday: profile.birthday || "",
      social_media: profile.social_media || [""],
      introduction: profile.introduction || "",
      previous_events: profile.previous_events || "no",
      other_events: profile.other_events || "",
      why_join: profile.why_join || "",
      how_heard_about: profile.how_heard_about || ""
    }
  });

  const previousEvents = watch("previous_events");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      return;
    }

    setPhotos(data || []);
  };

  const addSocialLink = () => {
    const newLinks = [...socialLinks, ""];
    setSocialLinks(newLinks);
    setValue("social_media", newLinks);
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
    setValue("social_media", newLinks.filter(link => link.trim() !== ""));
    trigger("social_media");
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
    setValue("social_media", newLinks.filter(link => link.trim() !== ""));
    trigger("social_media");
  };

  const uploadPhoto = async (file: File) => {
    if (photos.length >= 5) {
      toast({
        title: "Upload limit reached",
        description: "You can upload maximum 5 photos",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('user_photos')
        .insert({
          user_id: profile.user_id,
          photo_url: publicUrl,
          is_primary: photos.length === 0
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setPhotos(prev => [...prev, data]);
      
      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    const { error } = await supabase
      .from('user_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setPhotos(prev => prev.filter(p => p.id !== photoId));
    toast({
      title: "Photo deleted",
      description: "Photo has been removed"
    });
  };

  const setPrimaryPhoto = async (photoId: string) => {
    // First, unset all photos as primary
    await supabase
      .from('user_photos')
      .update({ is_primary: false })
      .eq('user_id', profile.user_id);

    // Then set the selected photo as primary
    const { error } = await supabase
      .from('user_photos')
      .update({ is_primary: true })
      .eq('id', photoId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setPhotos(prev => prev.map(p => ({ ...p, is_primary: p.id === photoId })));
    toast({
      title: "Primary photo updated",
      description: "This photo is now your primary photo"
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (photos.length < 3) {
      toast({
        title: "More photos required",
        description: "Please upload at least 3 photos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          birthday: data.birthday,
          social_media: data.social_media,
          introduction: data.introduction,
          previous_events: data.previous_events,
          other_events: data.other_events,
          why_join: data.why_join,
          how_heard_about: data.previous_events === 'no' ? data.how_heard_about : null,
          status: 'pending' as const
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      onUpdate(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been submitted for approval"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete all fields to submit your application for 62 Crepusculo events
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username (read-only) */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your username is automatically generated and cannot be changed
            </p>
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-destructive text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <Label htmlFor="birthday">Birthday *</Label>
            <Input
              id="birthday"
              type="date"
              {...register("birthday")}
            />
            {errors.birthday && (
              <p className="text-destructive text-sm mt-1">{errors.birthday.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              You must be at least 21 years old to participate
            </p>
          </div>

          {/* Social Media */}
          <div>
            <Label>Social Media Links *</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Add at least one social media profile (must start with https://)
            </p>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={link}
                  onChange={(e) => updateSocialLink(index, e.target.value)}
                  placeholder="https://instagram.com/username"
                />
                {socialLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addSocialLink}
              className="mt-2"
            >
              Add Another Link
            </Button>
            {errors.social_media && (
              <p className="text-destructive text-sm mt-1">{errors.social_media.message}</p>
            )}
          </div>

          {/* Photos */}
          <div>
            <Label>Photos ({photos.length}/5) *</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload 3-5 photos. Your face should be clearly visible in at least one photo.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.photo_url}
                    alt="Profile"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {photo.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      Primary
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {!photo.is_primary && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setPrimaryPhoto(photo.id)}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {photos.length < 5 && (
                <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhoto(file);
                    }}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            
            {photos.length < 3 && (
              <p className="text-destructive text-sm">Please upload at least 3 photos</p>
            )}
          </div>

          {/* Introduction */}
          <div>
            <Label htmlFor="introduction">Introduce yourself *</Label>
            <Textarea
              id="introduction"
              {...register("introduction")}
              placeholder="Tell us about yourself..."
              rows={4}
            />
            {errors.introduction && (
              <p className="text-destructive text-sm mt-1">{errors.introduction.message}</p>
            )}
          </div>

          {/* Previous Events */}
          <div>
            <Label htmlFor="previous_events">Did you already attend any 62 Crepusculo events? *</Label>
            <Select
              value={watch("previous_events")}
              onValueChange={(value) => setValue("previous_events", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No, I haven't been</SelectItem>
                <SelectItem value="once">Yes, I've been once</SelectItem>
                <SelectItem value="multiple">Yes, I've been more than once</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* How heard about (conditional) */}
          {previousEvents === 'no' && (
            <div>
              <Label htmlFor="how_heard_about">How did you hear about our event / Who recommended 62 Crepusculo to you? *</Label>
              <Textarea
                id="how_heard_about"
                {...register("how_heard_about")}
                placeholder="Tell us how you discovered 62 Crepusculo..."
                rows={3}
              />
              {errors.how_heard_about && (
                <p className="text-destructive text-sm mt-1">{errors.how_heard_about.message}</p>
              )}
            </div>
          )}

          {/* Other Events */}
          <div>
            <Label htmlFor="other_events">Did you already take part in other sex-positive events? If so, which ones?</Label>
            <Textarea
              id="other_events"
              {...register("other_events")}
              placeholder="List any other sex-positive events you've attended..."
              rows={3}
            />
          </div>

          {/* Why Join */}
          <div>
            <Label htmlFor="why_join">Why do you want to join 62 Crepusculo? *</Label>
            <Textarea
              id="why_join"
              {...register("why_join")}
              placeholder="Tell us why you want to be part of 62 Crepusculo..."
              rows={4}
            />
            {errors.why_join && (
              <p className="text-destructive text-sm mt-1">{errors.why_join.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || uploading}
          >
            {loading ? "Submitting..." : "Submit Profile for Approval"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
