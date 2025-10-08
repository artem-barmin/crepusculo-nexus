import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'What is the most important principle for any interaction?',
    options: ['Respect & Consent', 'Fun & Freedom', 'Spontaneity'],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'Which of these is a non-verbal sign of NO consent?',
    options: ['Avoiding eye contact', 'Smiling', 'Active body language'],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: 'Which of these is a non-verbal sign of possible consent?',
    options: [
      'Pulling someone closer',
      'Closed body language',
      'Shaking head no',
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    question:
      'What should you do if you want to touch, talk to or watch someone?',
    options: [
      'Ask first',
      'Just do it, it’s a free space',
      'Wait until they touch you',
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: 'What is the rule about photos and videos?',
    options: [
      'Any kind of photos or videos are not allowed',
      'Photos are allowed only with permission',
      'Selfies are always okay',
    ],
    correctAnswer: 0,
  },
  {
    id: 6,
    question: 'What should you do if you see or feel inappropriate behavior?',
    options: [
      'Report it to the safe team',
      'Ignore it, it’s part of the party',
      'Try to fix it by yourself',
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    question: 'What does “No means no” mean?',
    options: [
      'Respect boundaries, no pressure',
      'Try again later',
      'Depends on the situation',
    ],
    correctAnswer: 0,
  },
];

interface ConductQuizProps {
  onComplete: () => void;
}

export function ConductQuiz({ onComplete }: ConductQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId: number, answer: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    // Clear error when user selects an answer
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const validateCurrentAnswer = () => {
    const question = questions[currentQuestion];
    const userAnswer = answers[question.id];

    if (userAnswer === undefined) {
      setErrors((prev) => ({ ...prev, [question.id]: true }));
      toast({
        title: 'Please select an answer',
        variant: 'destructive',
      });
      return false;
    }

    if (userAnswer !== question.correctAnswer) {
      setErrors((prev) => ({ ...prev, [question.id]: true }));
      toast({
        title: 'Incorrect answer',
        description: 'Please review the 62|Crepusculo Rules and try again.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentAnswer()) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentAnswer()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('code_of_conduct_tests').insert({
        user_id: (await supabase.auth.getUser()).data.user!.id,
        answers: answers,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Quiz completed!',
          description: 'Proceeding to application form.',
        });
        onComplete();
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

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <CardTitle>62|Crepusculo Rules Quiz</CardTitle>
                <p className="text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{question.question}</h3>

              <RadioGroup
                value={answers[question.id]?.toString() || ''}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, parseInt(value))
                }
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {errors[question.id] && (
                <p className="text-destructive text-sm">
                  Please select the correct answer to continue.
                </p>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <Button onClick={handleNext} disabled={loading}>
                  {loading
                    ? 'Submitting...'
                    : currentQuestion === questions.length - 1
                      ? 'Submit'
                      : 'Next'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
