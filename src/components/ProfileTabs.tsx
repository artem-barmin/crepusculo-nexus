import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/ProfileForm';
import { YourPass } from '@/components/YourPass';
import { Profile } from '@/hooks/useProfile';

interface ProfileTabsProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export function ProfileTabs({ profile, setProfile }: ProfileTabsProps) {
  return (
    <Tabs
      defaultValue={profile.status === 'approved' ? 'pass' : 'information'}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="conduct">62|Crepusculo Rules</TabsTrigger>
        <TabsTrigger
          value="pass"
          disabled={profile.status !== 'approved'}
          className="flex items-center gap-2"
        >
          Your Pass
          <div
            className={`text-xs text-white font-medium px-2 py-1 rounded-sm ${
              profile.status === 'approved'
                ? 'bg-green-600'
                : profile.status === 'rejected'
                  ? 'bg-red-600'
                  : 'bg-yellow-600'
            }`}
          >
            {profile.status === 'approved'
              ? '62 verified'
              : profile.status === 'rejected'
                ? 'Not confirmed'
                : 'Pending'}
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="conduct" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>62|Crepusculo Rules</CardTitle>
            <p className="text-sm text-muted-foreground">
              Our community guidelines and expectations
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-foreground">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Consent - The Foundation
                </h3>
                <p>Consent is the cornerstone of our community. It must be:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Explicit:</strong> Clearly communicated, not assumed
                    or implied
                  </li>
                  <li>
                    <strong>Enthusiastic:</strong> Given freely with genuine
                    desire to participate
                  </li>
                  <li>
                    <strong>Specific:</strong> Consent to one activity does not
                    mean consent to all activities
                  </li>
                  <li>
                    <strong>Revocable:</strong> Can be withdrawn at any time,
                    for any reason
                  </li>
                  <li>
                    <strong>Informed:</strong> All parties understand what
                    they're consenting to
                  </li>
                </ul>

                <h3 className="text-xl font-semibold">Community Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respect everyone's boundaries and limits</li>
                  <li>Ask before touching or engaging with someone</li>
                  <li>No means no, immediately and without question</li>
                  <li>Be mindful of personal space and comfort levels</li>
                  <li>Report any violations to event staff immediately</li>
                  <li>
                    Maintain confidentiality - what happens at the event stays
                    at the event
                  </li>
                </ul>

                <h3 className="text-xl font-semibold">Zero Tolerance Policy</h3>
                <p>
                  We have zero tolerance for harassment, non-consensual
                  behavior, discrimination, or any actions that make others feel
                  unsafe. Violations will result in immediate removal from the
                  event and potential ban from future events.
                </p>

                <div className="mt-8 p-4 bg-accent rounded-lg">
                  <p className="font-medium">
                    Thank you for being part of our community and helping to
                    create a safe, respectful environment for everyone.
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
                <h3 className="text-lg font-semibold mb-2">
                  Access Restricted
                </h3>
                <p className="text-muted-foreground">
                  Your pass will be available after your profile is approved by
                  our team.
                </p>
                <div className="mt-4 px-4 py-2 bg-muted rounded-lg inline-block">
                  <span className="text-sm font-medium">
                    Status:{' '}
                    {profile.status === 'pending'
                      ? 'Pending Approval'
                      : 'Under Review'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
