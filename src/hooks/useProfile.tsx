import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const generateUsernameFromEmail = async (email: string): Promise<string> => {
    const emailPrefix = email.split('@')[0];
    let username = emailPrefix;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        return `${emailPrefix}_${Date.now()}`;
      }

      if (!data) {
        return username;
      }

      username = `${emailPrefix}_${counter}`;
      counter++;

      if (counter > 1000) {
        return `${emailPrefix}_${Date.now()}`;
      }
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (!data) {
        const username = await generateUsernameFromEmail(user.email || '');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            username: username,
            status: 'pending' as const,
          })
          .select()
          .single();

        if (insertError) {
          toast({
            title: 'Error',
            description: insertError.message,
            variant: 'destructive',
          });
          return;
        }
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, fetchProfile, setProfile };
}
