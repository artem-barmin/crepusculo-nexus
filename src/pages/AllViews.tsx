import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeOfConduct } from './CodeOfConduct';
import { ConductQuiz } from './ConductQuiz';
import { ProfileTabs } from '@/components/ProfileTabs';
import { Profile } from '@/hooks/useProfile';
import { ProfileForm } from '@/components/ProfileForm';
import { TicketsTab } from '@/components/TicketsTab';

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

const emptyProfile: Profile = {
  id: 'empty-profile-id',
  user_id: 'empty-user-id',
  username: null,
  full_name: null,
  gender: null,
  birthday: null,
  social_media: null,
  introduction: null,
  previous_events: 'no',
  how_heard_about: null,
  other_events: null,
  why_join: null,
  status: 'incomplete',
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
          <CardTitle>Empty Profile Form (All Placeholders Visible)</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={emptyProfile}
            photos={[]}
            onUpdate={() => console.log('Profile updated')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Tab (Approved User)</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketsTab
            profile={sampleProfile}
            stubEvents={[
              {
                name: 'sexto + a escuta',
                startTime: '2026-02-27T19:00:00.000Z',
                endTime: '2026-02-28T01:00:00.000Z',
                coverThumbnailUrl:
                  'https://res.cloudinary.com/shotgun/image/upload/c_limit,f_auto,fl_lossy,q_auto,w_1080/v1/production/artworks/Main_poster16x9_copy_q7wngl',
                url: 'https://shotgun.live/events/sexto-a-escuta',
                slug: 'sexto-a-escuta',
              },
              {
                name: 'DIGGITALITY w/ Penelope and Andrii',
                startTime: '2026-02-20T20:00:00.000Z',
                endTime: '2026-02-21T02:00:00.000Z',
                coverThumbnailUrl:
                  'https://res.cloudinary.com/shotgun/image/upload/c_limit,f_auto,fl_lossy,q_auto,w_1080/v1/production/artworks/Slide_16_9_-_3_ndlktf',
                url: 'https://shotgun.live/events/diggitality-w-penelope-and-andrii',
                slug: 'diggitality-w-penelope-and-andrii',
              },
            ]}
          />
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

    </div>
  );
};

export default AllViews;
