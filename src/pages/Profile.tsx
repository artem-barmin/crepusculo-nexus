import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProfileForm } from "@/components/ProfileForm";
import { YourPass } from "@/components/YourPass";

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

export function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        // Create initial profile if it doesn't exist
        const username = await generateUsername();
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            username: username,
            status: 'pending' as const
          })
          .select()
          .single();

        if (insertError) {
          toast({
            title: "Error",
            description: insertError.message,
            variant: "destructive"
          });
          return;
        }

        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateUsername = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_username');
    if (error) {
      console.error('Error generating username:', error);
      return `user${Date.now()}`;
    }
    return data || `user${Date.now()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
            <p className="text-center text-muted-foreground">Failed to load profile</p>
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

        <Tabs defaultValue={profile.status === 'approved' ? 'pass' : 'information'} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="conduct">Code of Conduct</TabsTrigger>
            <TabsTrigger 
              value="pass" 
              disabled={profile.status !== 'approved'}
              className="flex items-center gap-2"
            >
              Your Pass
              <Badge 
                variant="outline"
                className={`text-xs text-white font-medium ${
                  profile.status === 'approved' 
                    ? 'bg-green-600 border-green-600 hover:bg-green-700' 
                    : profile.status === 'rejected' 
                    ? 'bg-red-600 border-red-600 hover:bg-red-700' 
                    : 'bg-yellow-600 border-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {profile.status === 'approved' ? 'Approved' : 
                 profile.status === 'rejected' ? 'Rejected' : 
                 'Pending'}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conduct" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Code of Conduct</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Our community guidelines and expectations
                </p>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6 text-foreground">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Consent - The Foundation</h3>
                    <p>
                      Consent is the cornerstone of our community. It must be:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Explicit:</strong> Clearly communicated, not assumed or implied</li>
                      <li><strong>Enthusiastic:</strong> Given freely with genuine desire to participate</li>
                      <li><strong>Specific:</strong> Consent to one activity does not mean consent to all activities</li>
                      <li><strong>Revocable:</strong> Can be withdrawn at any time, for any reason</li>
                      <li><strong>Informed:</strong> All parties understand what they're consenting to</li>
                    </ul>

                    <h3 className="text-xl font-semibold">Community Guidelines</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Respect everyone's boundaries and limits</li>
                      <li>Ask before touching or engaging with someone</li>
                      <li>No means no, immediately and without question</li>
                      <li>Be mindful of personal space and comfort levels</li>
                      <li>Report any violations to event staff immediately</li>
                      <li>Maintain confidentiality - what happens at the event stays at the event</li>
                    </ul>

                    <h3 className="text-xl font-semibold">Zero Tolerance Policy</h3>
                    <p>
                      We have zero tolerance for harassment, non-consensual behavior, discrimination, 
                      or any actions that make others feel unsafe. Violations will result in immediate 
                      removal from the event and potential ban from future events.
                    </p>

                    <div className="mt-8 p-4 bg-accent rounded-lg">
                      <p className="font-medium">
                        Thank you for being part of our community and helping to create a safe, 
                        respectful environment for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="information" className="mt-6">
            <ProfileForm 
              profile={profile} 
              onUpdate={(updatedProfile) => setProfile(updatedProfile)}
            />
          </TabsContent>
          
          <TabsContent value="pass" className="mt-6">
            {profile.status === 'approved' ? (
              <YourPass profile={profile} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                    <p className="text-muted-foreground">
                      Your pass will be available after your profile is approved by our team.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-muted rounded-lg inline-block">
                      <span className="text-sm font-medium">
                        Status: {profile.status === 'pending' ? 'Pending Approval' : 'Under Review'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}