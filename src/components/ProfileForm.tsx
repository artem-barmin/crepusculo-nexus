import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { X, Upload, User, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const profileSchema = z.object({
  gender: z.enum(['Male', 'Female', 'Other']),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Username can only contain letters, numbers, dots, hyphens, and underscores'
    ),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  birthday: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 21;
    }
    return age >= 21;
  }, 'You must be at least 21 years old'),
  social_media: z
    .array(z.string().url('Please enter a valid URL'))
    .min(1, 'At least one social media link is required'),
  introduction: z
    .string()
    .min(50, 'Introduction must be at least 50 characters'),
  previous_events: z.string(),
  other_events: z.string().optional(),
  why_join: z
    .string()
    .min(50, 'Please provide a detailed answer (at least 50 characters)'),
  how_heard_about: z.string().optional(),
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
  gender: 'Male' | 'Female' | 'Other' | null;
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
  photos?: UserPhoto[];
}

export function ProfileForm({
  profile,
  onUpdate,
  photos: initialPhotos,
}: ProfileFormProps) {
  const [socialLinks, setSocialLinks] = useState<string[]>(
    profile.social_media || ['']
  );
  const [photos, setPhotos] = useState<UserPhoto[]>(initialPhotos || []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || '',
      full_name: profile.full_name || '',
      birthday: profile.birthday || '',
      gender: profile.gender || undefined,
      social_media: profile.social_media || [''],
      introduction: profile.introduction || '',
      previous_events: profile.previous_events || 'no',
      other_events: profile.other_events || '',
      why_join: profile.why_join || '',
      how_heard_about: profile.how_heard_about || '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    control,
  } = form;

  const previousEvents = watch('previous_events');

  useEffect(() => {
    if (!initialPhotos) {
      fetchPhotos();
    }
  }, [initialPhotos]);

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
    const newLinks = [...socialLinks, ''];
    setSocialLinks(newLinks);
    setValue('social_media', newLinks);
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
    setValue(
      'social_media',
      newLinks.filter((link) => link.trim() !== '')
    );
    trigger('social_media');
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
    setValue(
      'social_media',
      newLinks.filter((link) => link.trim() !== '')
    );
    trigger('social_media');
  };

  const uploadPhoto = async (file: File) => {
    if (photos.length >= 5) {
      toast({
        title: 'Upload limit reached',
        description: 'You can upload maximum 5 photos',
        variant: 'destructive',
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

      const {
        data: { publicUrl },
      } = supabase.storage.from('user-photos').getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('user_photos')
        .insert({
          user_id: profile.user_id,
          photo_url: publicUrl,
          is_primary: photos.length === 0,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setPhotos((prev) => [...prev, data]);

      toast({
        title: 'Photo uploaded',
        description: 'Your photo has been uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
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
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast({
      title: 'Photo deleted',
      description: 'Photo has been removed',
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
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setPhotos((prev) =>
      prev.map((p) => ({ ...p, is_primary: p.id === photoId }))
    );
    toast({
      title: 'Primary photo updated',
      description: 'This photo is now your primary photo',
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (photos.length < 3) {
      toast({
        title: 'More photos required',
        description: 'Please upload at least 3 photos',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.full_name,
          birthday: data.birthday,
          social_media: data.social_media,
          introduction: data.introduction,
          previous_events: data.previous_events,
          other_events: data.other_events,
          why_join: data.why_join,
          how_heard_about:
            data.previous_events === 'no' ? data.how_heard_about : null,
          status: 'pending' as const,
          gender: data.gender,
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      onUpdate(updatedProfile);
      setIsEditing(false);

      // Show confirmation dialog instead of toast
      setShowConfirmation(true);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    setValue('username', profile.username || '');
    setValue('full_name', profile.full_name || '');
    setValue('birthday', profile.birthday || '');
    setValue('social_media', profile.social_media || ['']);
    setValue('introduction', profile.introduction || '');
    setValue('gender', profile.gender || undefined);
    setValue('previous_events', profile.previous_events || 'no');
    setValue('other_events', profile.other_events || '');
    setValue('why_join', profile.why_join || '');
    setValue('how_heard_about', profile.how_heard_about || '');
    setSocialLinks(profile.social_media || ['']);
  };

  // Check if profile is submitted and not in editing mode
  const isSubmitted = profile.status === 'pending' && !isEditing;
  const canEdit =
    profile.status === 'pending' ||
    profile.status === 'approved' ||
    profile.status === 'rejected';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete all fields to submit your application for 62 Crepusculo
          events
        </p>
      </CardHeader>
      <CardContent>
        {/* Status Message for Submitted Profile */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Profile Under Review
              </h3>
            </div>
            <p className="text-blue-800 text-sm">
              Your profile has been submitted and is currently under review. You
              will receive an email notification once our team has processed
              your application.
            </p>
            {canEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEditProfile}
                className="mt-3"
              >
                Edit Profile
              </Button>
            )}
          </div>
        )}

        {/* Warning for Editing */}
        {isEditing && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <X className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">
                Important Notice
              </h3>
            </div>
            <p className="text-yellow-800 text-sm">
              Any changes to your profile will reset your application status to
              "pending" and require a new review process.
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username (editable) */}
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="Enter your username"
                disabled={isSubmitted}
              />
              {errors.username && (
                <p className="text-destructive text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Your username can contain letters, numbers, dots, hyphens, and
                underscores
              </p>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder="Enter your full name"
                disabled={isSubmitted}
              />
              {errors.full_name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={isSubmitted}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthday */}
            <div>
              <Label htmlFor="birthday">Birthday *</Label>
              <Input
                id="birthday"
                type="date"
                {...register('birthday')}
                disabled={isSubmitted}
              />
              {errors.birthday && (
                <p className="text-destructive text-sm mt-1">
                  {errors.birthday.message}
                </p>
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
                    disabled={isSubmitted}
                  />
                  {socialLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      disabled={isSubmitted}
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
                disabled={isSubmitted}
              >
                Add Another Link
              </Button>
              {errors.social_media && (
                <p className="text-destructive text-sm mt-1">
                  {errors.social_media.message}
                </p>
              )}
            </div>

            {/* Photos */}
            <div>
              <Label>Photos ({photos.length}/5) *</Label>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">Photo Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload 3-5 photos.</li>
                  <li>
                    Use a photo where we can clearly recognize you: no glasses,
                    no masks, no group photos, etc.
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <AspectRatio
                      ratio={1 / 1}
                      className="rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    {photo.is_primary && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-sm">
                        Primary
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {!photo.is_primary && !isSubmitted && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryPhoto(photo.id)}
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                      {!isSubmitted && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {photos.length < 5 && !isSubmitted && (
                  <AspectRatio ratio={1 / 1}>
                    <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors w-full h-full">
                      <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            for (const file of files) {
                              uploadPhoto(file);
                            }
                          }
                        }}
                        disabled={uploading || isSubmitted}
                      />
                    </label>
                  </AspectRatio>
                )}
              </div>

              {photos.length < 3 && (
                <p className="text-destructive text-sm">
                  Please upload at least 3 photos
                </p>
              )}
            </div>

            {/* Introduction */}
            <div>
              <Label htmlFor="introduction">Introduce yourself *</Label>
              <Textarea
                id="introduction"
                {...register('introduction')}
                placeholder="Tell us about yourself..."
                rows={4}
                disabled={isSubmitted}
              />
              {errors.introduction && (
                <p className="text-destructive text-sm mt-1">
                  {errors.introduction.message}
                </p>
              )}
            </div>

            {/* Previous Events */}
            <div>
              <Label htmlFor="previous_events">
                Did you already attend any 62 Crepusculo events? *
              </Label>
              <Select
                value={watch('previous_events')}
                onValueChange={(value) => setValue('previous_events', value)}
                disabled={isSubmitted}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No, I haven't been</SelectItem>
                  <SelectItem value="once">Yes, I've been once</SelectItem>
                  <SelectItem value="multiple">
                    Yes, I've been more than once
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* How heard about (conditional) */}
            {previousEvents === 'no' && (
              <div>
                <Label htmlFor="how_heard_about">
                  How did you hear about our event / Who recommended 62
                  Crepusculo to you? *
                </Label>
                <Textarea
                  id="how_heard_about"
                  {...register('how_heard_about')}
                  placeholder="Tell us how you discovered 62 Crepusculo..."
                  rows={3}
                  disabled={isSubmitted}
                />
                {errors.how_heard_about && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.how_heard_about.message}
                  </p>
                )}
              </div>
            )}

            {/* Other Events */}
            <div>
              <Label htmlFor="other_events">
                Did you already take part in other sex-positive events? If so,
                which ones?
              </Label>
              <Textarea
                id="other_events"
                {...register('other_events')}
                placeholder="List any other sex-positive events you've attended..."
                rows={3}
                disabled={isSubmitted}
              />
            </div>

            {/* Why Join */}
            <div>
              <Label htmlFor="why_join">
                Why do you want to join 62 Crepusculo? *
              </Label>
              <Textarea
                id="why_join"
                {...register('why_join')}
                placeholder="Tell us why you want to be part of 62 Crepusculo..."
                rows={4}
                disabled={isSubmitted}
              />
              {errors.why_join && (
                <p className="text-destructive text-sm mt-1">
                  {errors.why_join.message}
                </p>
              )}
            </div>

            {/* Submit/Edit Buttons */}
            {!isSubmitted ? (
              <Button
                type="submit"
                className="w-full"
                disabled={loading || uploading}
              >
                {loading
                  ? 'Submitting...'
                  : isEditing
                    ? 'Update Profile'
                    : 'Submit Profile for Approval'}
              </Button>
            ) : null}

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="w-full mt-2"
              >
                Cancel Changes
              </Button>
            )}
          </form>
        </Form>
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold">
              Profile Submitted Successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4">
              Thank you for applying.
              <br />
              We will review your application as soon as possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => setShowConfirmation(false)}
            className="w-full mt-6"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
