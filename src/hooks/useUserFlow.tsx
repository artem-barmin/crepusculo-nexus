import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserFlowState = 
  | "unauthenticated"
  | "authenticated"
  | "code_of_conduct"
  | "quiz"
  | "application"
  | "pending_approval"
  | "approved";

export function useUserFlow(user: User | null) {
  const [flowState, setFlowState] = useState<UserFlowState>("unauthenticated");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setFlowState("unauthenticated");
        setLoading(false);
        return;
      }

      try {
        // Check if user has completed the quiz
        const { data: quizData } = await supabase
          .from('code_of_conduct_tests')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Check if user has a profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!quizData) {
          setFlowState("code_of_conduct");
        } else if (!profileData) {
          setFlowState("application");
        } else if (profileData.status === 'pending') {
          setFlowState("pending_approval");
        } else if (profileData.status === 'approved') {
          setFlowState("approved");
        } else {
          setFlowState("application");
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setFlowState("code_of_conduct");
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user]);

  return { flowState, setFlowState, loading };
}