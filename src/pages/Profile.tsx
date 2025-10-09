import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { ProfileTabs } from '@/components/ProfileTabs';

export function Profile() {
  const { profile, loading, fetchProfile, setProfile } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Failed to load profile
            </p>
            <Button
              onClick={fetchProfile}
              className="w-full mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile to get access to 62 Crepusculo events
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2"
          >
            Sign Out
          </Button>
        </div>

        <ProfileTabs profile={profile} setProfile={setProfile} />
      </div>
    </div>
  );
}
