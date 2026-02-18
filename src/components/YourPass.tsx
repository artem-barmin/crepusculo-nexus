import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/hooks/useProfile';

interface Tag {
  id: number;
  label: string | null;
  color: string | null;
}

interface YourPassProps {
  profile: Profile;
}

export function YourPass({ profile }: YourPassProps) {
  const [visibleTags, setVisibleTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!profile.tag_ids?.length) return;

    const fetchTags = async () => {
      const { data } = await supabase
        .from('tags')
        .select('id, label, color')
        .in('id', profile.tag_ids!)
        .eq('visible_to_client', true);

      if (data) setVisibleTags(data);
    };

    fetchTags();
  }, [profile.tag_ids]);

  // Create validation URL for QR code
  const validationUrl = `https://pnnapdxefbmafisglnfz.supabase.co/functions/v1/validate-pass?user_id=${profile.user_id}&event=62_crepusculo`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your 62 Crepusculo Pass</CardTitle>
        <div className="flex justify-center gap-2 flex-wrap">
          {profile.status === 'approved' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              62 verified
            </Badge>
          )}
          {visibleTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              style={tag.color ? { backgroundColor: tag.color, color: '#fff' } : undefined}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <QRCodeSVG
                value={validationUrl}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{profile.full_name}</h3>
            <p className="text-muted-foreground text-lg">@{profile.username}</p>
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
            <p className="font-medium">How to use your pass:</p>
            <ul className="text-left space-y-1">
              <li>• Present this QR code at the event entrance</li>
              <li>• Keep this pass accessible on your phone</li>
              <li>• Do not share your pass with others</li>
              <li>• Screenshot this page for offline access</li>
            </ul>
          </div>

          {/* Event Details */}
          <div className="bg-muted rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">Event Guidelines:</h4>
            <p className="text-muted-foreground">
              Remember to follow the 62|Crepusculo Rules at all times. Your pass
              is personal and non-transferable.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
