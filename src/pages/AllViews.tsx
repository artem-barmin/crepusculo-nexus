import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeOfConduct } from './CodeOfConduct';
import { ConductQuiz } from './ConductQuiz';
import Index from './Index';
import NotFound from './NotFound';
import { ResetPassword } from './ResetPassword';
import { ProfileTabs } from '@/components/ProfileTabs';
import { Profile } from '@/hooks/useProfile';
import { ProfileForm } from '@/components/ProfileForm';

const sampleProfile: Profile = {
  id: '16cdaefa-0de2-4b65-9085-d3bf1122dc80',
  user_id: '2a5db04d-e234-4dca-bd91-ed64e3f071de',
  username: 'bob.valentinov',
  full_name: 'Bobyleva Svitlana',
  gender: 'Female' as const,
  birthday: '2000-05-15',
  social_media: ['https://www.instagram.com/sexto.lisboa/'],
  introduction:
    'k;jnq;kewjnqw;kjdnqwek;jdnqedmn wqd;kjqwned;jkqwend;klqwejnd;qw',
  previous_events: 'once',
  how_heard_about: null,
  other_events: 'jhcjlhqwbcqlhjbwljhbwelhjdbwqelhd',
  why_join: 'lkjdckqjnekjnqwkeldnwqwknqwk;jdnqwek;jdnqwek;dbqwekdjbqwe;kdb',
  status: 'approved',
};

const nonApprovedProfile: Profile = {
  ...sampleProfile,
  status: 'pending',
};

const samplePhotos = [
  {
    id: 'c91f0cbf-5b27-4e31-b1ca-9e0401b7043c',
    user_id: '2a5db04d-e234-4dca-bd91-ed64e3f071de',
    photo_url:
      'https://pnnapdxefbmafisglnfz.supabase.co/storage/v1/object/public/user-photos/2a5db04d-e234-4dca-bd91-ed64e3f071de/1755702904513.jpg',
    is_primary: true,
    created_at: '2025-08-20 15:15:05.756473+00',
  },
  {
    id: 'e59f6567-a8e8-4482-bcd8-2eb63f7fabf4',
    user_id: '2a5db04d-e234-4dca-bd91-ed64e3f071de',
    photo_url:
      'https://pnnapdxefbmafisglnfz.supabase.co/storage/v1/object/public/user-photos/2a5db04d-e234-4dca-bd91-ed64e3f071de/1755702909120.jpg',
    is_primary: false,
    created_at: '2025-08-20 15:15:09.9696+00',
  },
  {
    id: 'd4255a67-572f-4a67-9f7a-fee4a9b94a3d',
    user_id: '2a5db04d-e234-4dca-bd91-ed64e3f071de',
    photo_url:
      'https://pnnapdxefbmafisglnfz.supabase.co/storage/v1/object/public/user-photos/2a5db04d-e234-4dca-bd91-ed64e3f071de/1755702919675.jpg',
    is_primary: false,
    created_at: '2025-08-20 15:15:20.553217+00',
  },
];

const AllViews: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">All Page Views</h1>

      <Card>
        <CardHeader>
          <CardTitle>Approved User Profile Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileTabs
            profile={sampleProfile}
            setProfile={() => console.log('Profile updated')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Non-Approved User Profile Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileTabs
            profile={nonApprovedProfile}
            setProfile={() => console.log('Profile updated')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved User Profile Form</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={sampleProfile}
            photos={samplePhotos}
            onUpdate={() => console.log('Profile updated')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Non-Approved User Profile Form</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={nonApprovedProfile}
            photos={samplePhotos}
            onUpdate={() => console.log('Profile updated')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Index Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Index />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password Page</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPassword />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>62|Crepusculo Rules Page</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeOfConduct
            onAccept={() => console.log('62|Crepusculo Rules accepted')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conduct Quiz Page</CardTitle>
        </CardHeader>
        <CardContent>
          <ConductQuiz onComplete={() => console.log('Quiz completed')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Not Found Page</CardTitle>
        </CardHeader>
        <CardContent>
          <NotFound />
        </CardContent>
      </Card>
    </div>
  );
};

export default AllViews;
