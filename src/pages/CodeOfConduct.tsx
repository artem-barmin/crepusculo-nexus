import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeOfConductProps {
  onAccept: () => void;
}

export function CodeOfConduct({ onAccept }: CodeOfConductProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">62|Crepusculo Rules</h1>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              62|Crepusculo Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-foreground">
              <p className="text-lg">
                Welcome to 62 Crepusculo. Before proceeding, please read and
                understand our 62|Crepusculo Rules.
              </p>

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
                  <li>
                    <strong>Respect & Consent</strong> — every interaction must
                    be consensual. Ask before touching, talking or joining in.
                  </li>
                  <li>
                    <strong>No Judgment</strong> — respect all bodies, ages,
                    genders and identities.
                  </li>
                  <li>
                    <strong>Privacy First</strong> — no photos or videos are
                    allowed. We protect the intimacy of the space.
                  </li>
                  <li>
                    <strong>Safe Space</strong> — if you feel uncomfortable or
                    see inappropriate behavior, report it to the 62|Crepusculo
                    safe team.
                  </li>
                  <li>
                    <strong>Politeness</strong> — no means no, always be
                    delicate and respectful.
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
                    By clicking "I Understand", you acknowledge that you have
                    read, understood, and agree to abide by this Code of
                    Conduct.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleAccept} size="lg">
                I Understand
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
