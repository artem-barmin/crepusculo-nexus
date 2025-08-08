import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";

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

interface YourPassProps {
  profile: Profile;
}

export function YourPass({ profile }: YourPassProps) {
  // Create validation URL for QR code
  const validationUrl = `https://pnnapdxefbmafisglnfz.supabase.co/functions/v1/validate-pass?user_id=${profile.user_id}&event=62_crepusculo`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your 62 Crepusculo Pass</CardTitle>
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Approved
          </Badge>
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
              Remember to follow the Code of Conduct at all times. 
              Your pass is personal and non-transferable.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}