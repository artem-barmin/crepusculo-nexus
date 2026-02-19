import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/logo_new.png';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    let cancelled = false;

    // Listen for PASSWORD_RECOVERY event (fires when Supabase processes recovery hash tokens)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    // Supabase client processes hash fragment tokens (#access_token=...&type=recovery)
    // during initialization — before React mounts. By the time this runs, the hash is
    // already consumed and the session is set. Check for an existing session as fallback.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) {
        setIsValidSession(true);
      } else {
        toast({
          title: 'Invalid Link',
          description: 'This password reset link is invalid or has expired.',
          variant: 'destructive',
        });
        navigate('/');
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Your password has been updated successfully!',
        });
        // Redirect to home page after successful password reset
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating reset link...</p>
        </div>
      </div>
    );
  }

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

        {/* Reset Password Form */}
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 8 characters long and contain
                        at least one uppercase letter and one special character.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Back to home link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
