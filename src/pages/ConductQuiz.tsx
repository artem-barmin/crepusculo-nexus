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
    question: 'What are the 5 principles of consent?',
    options: [
      'Explicit, Enthusiastic, Specific, Revocable, Informed',
      'Clear, Happy, General, Permanent, Simple',
      'Verbal, Physical, Emotional, Mental, Spiritual',
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'Can consent be withdrawn at any time?',
    options: [
      'No, once given it cannot be changed',
      'Yes, but only before activities begin',
      'Yes, at any time for any reason',
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "If someone says 'no' to a request, what should you do?",
    options: [
      'Try to convince them',
      'Respect their decision immediately',
      'Ask them again later',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What does 'enthusiastic consent' mean?",
    options: [
      'Consent given with genuine desire to participate',
      'Consent given loudly',
      'Consent given repeatedly',
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    question:
      'What should you do if you witness a violation of the Code of Conduct?',
    options: [
      "Ignore it if it doesn't involve you",
      'Handle it yourself',
      'Report it to event staff immediately',
    ],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: 'Consent to one activity means consent to all activities.',
    options: ['True', 'False'],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: 'What is our policy on confidentiality?',
    options: [
      'You can share anything that happens',
      'What happens at the event stays at the event',
      'You can share with close friends only',
    ],
    correctAnswer: 1,
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
        description: 'Please review the Code of Conduct and try again.',
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
                <CardTitle>Code of Conduct Quiz</CardTitle>
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
