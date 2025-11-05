import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserFlowState =
  | 'unauthenticated'
  | 'authenticated'
  | 'application'
  | 'pending_approval'
  | 'approved'
  | 'approved_need_code_of_conduct'
  | 'approved_need_quiz';

export function useUserFlow(user: User | null) {
  const [flowState, setFlowState] = useState<UserFlowState>('unauthenticated');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setFlowState('unauthenticated');
        setLoading(false);
        return;
      }

      try {
        // Check if user has a profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Check if user has completed the quiz
        const { data: quizData } = await supabase
          .from('code_of_conduct_tests')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // New flow logic:
        // 1. If no profile, show application form
        // 2. If profile is pending, show pending state
        // 3. If profile is approved/approved_plus and quiz not completed, show code of conduct then quiz
        // 4. If profile is approved/approved_plus and quiz completed, show approved state

        if (!profileData) {
          setFlowState('application');
        } else if (profileData.status === 'pending') {
          setFlowState('pending_approval');
        } else if (
          (profileData.status === 'approved' ||
            profileData.status === 'approved_plus') &&
          !quizData
        ) {
          setFlowState('approved_need_code_of_conduct');
        } else if (
          profileData.status === 'approved' ||
          profileData.status === 'approved_plus'
        ) {
          setFlowState('approved');
        } else {
          setFlowState('application');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setFlowState('application');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user]);

  return { flowState, setFlowState, loading };
}
