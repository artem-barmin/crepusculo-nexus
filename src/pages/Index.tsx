import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/AuthForm';
import { CodeOfConduct } from '@/pages/CodeOfConduct';
import { ConductQuiz } from '@/pages/ConductQuiz';
import { Profile } from '@/pages/Profile';
import { useUserFlow } from '@/hooks/useUserFlow';
import logo from '@/assets/logo_new.png';

const Index = () => {
  console.log('Index component is rendering...');

  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>(
    'signup'
  );
  const { flowState, setFlowState, loading } = useUserFlow(user);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Always show loading if user exists or while determining auth state
  if (loading || user) {
    // If user is authenticated, handle flow states directly
    if (user) {
      if (flowState === 'code_of_conduct') {
        return <CodeOfConduct onAccept={() => setFlowState('quiz')} />;
      }

      if (flowState === 'quiz') {
        return <ConductQuiz onComplete={() => setFlowState('application')} />;
      }

      if (
        flowState === 'application' ||
        flowState === 'pending_approval' ||
        flowState === 'approved'
      ) {
        return <Profile />;
      }
    }

    // Show loading spinner
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form centered on page
  if (showAuth) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-black">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Centered content */}
        <div className="relative z-10 w-full max-w-md px-4">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img
              src={logo}
              alt="62 Crepusculo"
              className="mx-auto h-16 w-auto mb-6"
            />
          </div>

          {/* Auth Form */}
          <AuthForm
            mode={authMode}
            onToggleMode={() =>
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
            }
            onShowReset={() => setAuthMode('reset')}
            onBackToSignIn={() => setAuthMode('signin')}
          />

          {/* Back button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAuth(false)}
              className="text-muted-foreground hover:text-foreground transition-colors underline"
            >
              ← Back to main page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img src={logo} alt="62 Crepusculo" className="mx-auto h-20 w-auto" />
        </div>

        {/* Main description - only show when not in auth mode */}
        <div className="mb-12 max-w-3xl mx-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light mb-8 leading-relaxed text-center">
            Welcome to 62|Crepusculo
          </h1>
          <div className="text-base md:text-lg font-light leading-relaxed space-y-4 text-foreground/90">
            <p>
              62|Crepusculo is a kinky community. We create a safe space for
              experiments and playing. To make sure everyone feels comfortable,
              we ask all members to follow a few simple but essential rules:
            </p>
            <ul className="space-y-3 pt-4 pl-5 list-disc">
              <li>
                <strong>Respect & Consent</strong> — every interaction must be
                consensual. Ask before touching, talking or joining in.
              </li>
              <li>
                <strong>No Judgment</strong> — respect all bodies, ages, genders
                and identities.
              </li>
              <li>
                <strong>Privacy First</strong> — no photos or videos are
                allowed. We protect the intimacy of the space.
              </li>
              <li>
                <strong>Safe Space</strong> — if you feel uncomfortable or see
                inappropriate behavior, report it to the 62|Crepusculo safe
                team.
              </li>
              <li>
                <strong>Politeness</strong> — no means no, always be delicate
                and respectful.
              </li>
            </ul>
            <p className="pt-4">
              Together we keep 62 safe, free and inspiring.
            </p>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => {
              setAuthMode('signup');
              setShowAuth(true);
            }}
            className="text-base px-8 py-3"
          >
            I UNDERSTAND
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
