import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Profile {
  full_name: string | null;
  username: string | null;
  introduction: string | null;
  social_media: string[] | null;
}

interface UserPhoto {
  id: string;
  photo_url: string;
  is_primary: boolean;
}

interface SampleProfileDisplayProps {
  profile: Profile;
  photos: UserPhoto[];
}

export const SampleProfileDisplay: React.FC<SampleProfileDisplayProps> = ({
  profile,
  photos,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.full_name}</CardTitle>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-semibold mb-2">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <AspectRatio
                  ratio={1 / 1}
                  className="rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.photo_url}
                    alt={`${profile.full_name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                {photo.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-sm">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Introduction</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {profile.introduction}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Social Media</h3>
          <div className="flex flex-col space-y-2">
            {profile.social_media?.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
