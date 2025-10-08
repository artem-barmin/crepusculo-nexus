import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold flex items-center justify-center gap-4">
            404 👻
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! This page is lost in the shadows.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
