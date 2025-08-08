import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/AuthForm";
import heroBackground from "@/assets/hero-background.jpg";
import logo from "@/assets/logo.png";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    // User is logged in - redirect to dashboard (will be implemented later)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
          <p className="text-muted-foreground mb-4">You are logged in as {user.email}</p>
          <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center bg-background"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="62 Crepusculo" 
            className="mx-auto h-20 w-auto"
          />
        </div>

        {/* Main description */}
        <div className="mb-12 max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-light mb-8 leading-relaxed">
            62 Crepusculo — kink & electronic music event.
          </h1>
          <div className="text-lg md:text-xl font-light leading-relaxed space-y-4 text-foreground/90">
            <p>
              A space of freedom that takes the metaphorical form of "night therapy".
            </p>
            <p>
              A spotlight on our bodies and minds, their emancipation in a quest for self-exploration...
            </p>
            <p>
              In our spaces, individual freedom does not betray that of others; a foundation that sets the tone for an essential concept within our community: consent, the cornerstone of our policy, values, and aspirations.
            </p>
            <p>
              Let's recreate moments where bodily expression is possible in a climate of total kindness, without taboos or judgment, and where all divisions and their labels are abolished.
            </p>
            <p className="text-xl font-medium">
              Welcome to you.
            </p>
          </div>
        </div>

        {/* Auth section */}
        {!showAuth ? (
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => {
                setAuthMode("signup");
                setShowAuth(true);
              }}
              className="text-lg px-8 py-3"
            >
              Join Us
            </Button>
            <div>
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setShowAuth(true);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Already a member? Sign in
              </button>
            </div>
          </div>
        ) : (
          <AuthForm 
            mode={authMode} 
            onToggleMode={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
