'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface MovieSVRInput {
  rank: number;
  name: string;
  year: number;
  genre: string;
  certificate: string;
  run_time: string;
  tagline: string;
  budget: number;
  box_office: number;
  casts: string;
  directors: string;
  writers: string;
}

interface MovieSVROutput {
  prediction: number;
}

export default function MovieSVRPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MovieSVRInput>({
    defaultValues: {
      rank: 1,
      name: '',
      year: new Date().getFullYear(),
      genre: '',
      certificate: 'R',
      run_time: '',
      tagline: '',
      budget: 0,
      box_office: 0,
      casts: '',
      directors: '',
      writers: '',
    },
  });

  const [result, setResult] = useState<MovieSVROutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  const onSubmit = async (data: MovieSVRInput) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await fetch(
        'http://127.0.0.1:8000/movie-rating/svr-predict-rating',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get prediction from backend');
      }

      const prediction = await response.json();
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingInterpretation = (rating: number) => {
    if (rating >= 8.5) return 'Excellent';
    if (rating >= 7.5) return 'Very Good';
    if (rating >= 6.5) return 'Good';
    if (rating >= 5.5) return 'Average';
    return 'Below Average';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-green-600';
    if (rating >= 7.5) return 'text-blue-600';
    if (rating >= 6.5) return 'text-emerald-600';
    if (rating >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
            <Sparkles className='h-8 w-8 text-primary' />
            Movie Quality Predictor - SVR Model
          </h1>
          <p className='text-muted-foreground'>
            Predict movie quality ratings using Support Vector Regression
            {userEmail && (
              <span className=' ml-2 font-medium text-foreground'>
                • {userEmail}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Form */}
          <div className='lg:col-span-2'>
            <Card className='border border-border shadow-sm'>
              <CardHeader className='border-b border-border bg-secondary/30'>
                <CardTitle className='text-xl'>
                  Enter Movie Information
                </CardTitle>
                <CardDescription>
                  Provide movie details for quality prediction
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  {/* Row 1: Rank and Year */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Rank *
                      </label>
                      <Input
                        type='number'
                        placeholder='1'
                        min='1'
                        {...register('rank', {
                          required: 'Rank is required',
                          min: { value: 1, message: 'Rank must be at least 1' },
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.rank && (
                        <span className='text-xs text-destructive'>
                          {errors.rank.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Year *
                      </label>
                      <Input
                        type='number'
                        placeholder='1994'
                        min='1800'
                        max={new Date().getFullYear()}
                        {...register('year', { required: 'Year is required' })}
                        className='bg-input text-foreground'
                      />
                      {errors.year && (
                        <span className='text-xs text-destructive'>
                          {errors.year.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Movie Name */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-foreground'>
                      Movie Name *
                    </label>
                    <Input
                      placeholder='The Shawshank Redemption'
                      {...register('name', {
                        required: 'Movie name is required',
                      })}
                      className='bg-input text-foreground'
                    />
                    {errors.name && (
                      <span className='text-xs text-destructive'>
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Row 3: Genre and Certificate */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Genre *
                      </label>
                      <Input
                        placeholder='Drama,Crime,Thriller'
                        {...register('genre', {
                          required: 'Genre is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.genre && (
                        <span className='text-xs text-destructive'>
                          {errors.genre.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Certificate *
                      </label>
                      <Input
                        placeholder='R'
                        {...register('certificate', {
                          required: 'Certificate is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.certificate && (
                        <span className='text-xs text-destructive'>
                          {errors.certificate.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Runtime and Tagline */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Runtime *
                      </label>
                      <Input
                        placeholder='2h 22m'
                        {...register('run_time', {
                          required: 'Runtime is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.run_time && (
                        <span className='text-xs text-destructive'>
                          {errors.run_time.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Tagline
                      </label>
                      <Input
                        placeholder='Fear can hold you prisoner...'
                        {...register('tagline')}
                        className='bg-input text-foreground'
                      />
                    </div>
                  </div>

                  {/* Row 5: Budget and Box Office */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Budget ($) *
                      </label>
                      <Input
                        type='number'
                        placeholder='25000000'
                        min='0'
                        {...register('budget', {
                          required: 'Budget is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.budget && (
                        <span className='text-xs text-destructive'>
                          {errors.budget.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Box Office ($) *
                      </label>
                      <Input
                        type='number'
                        placeholder='28884504'
                        min='0'
                        {...register('box_office', {
                          required: 'Box office is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.box_office && (
                        <span className='text-xs text-destructive'>
                          {errors.box_office.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 6: Directors and Writers */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Directors *
                      </label>
                      <Input
                        placeholder='Frank Darabont'
                        {...register('directors', {
                          required: 'Directors is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.directors && (
                        <span className='text-xs text-destructive'>
                          {errors.directors.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Writers *
                      </label>
                      <Input
                        placeholder='Stephen King,Frank Darabont'
                        {...register('writers', {
                          required: 'Writers is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.writers && (
                        <span className='text-xs text-destructive'>
                          {errors.writers.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 7: Cast */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-foreground'>
                      Cast *
                    </label>
                    <Input
                      placeholder='Tim Robbins,Morgan Freeman,Bob Gunton'
                      {...register('casts', { required: 'Cast is required' })}
                      className='bg-input text-foreground'
                    />
                    {errors.casts && (
                      <span className='text-xs text-destructive'>
                        {errors.casts.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    disabled={isSubmitting || loading || !token}
                    className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                  >
                    {!token
                      ? 'Authenticating...'
                      : isSubmitting || loading
                      ? 'Predicting...'
                      : 'Predict Quality'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className='lg:col-span-1'>
            {error && (
              <Card className='border border-destructive shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-destructive'>
                    <AlertCircle className='h-5 w-5' />
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>{error}</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className='border border-border shadow-sm sticky top-8'>
                <CardHeader className='border-b border-border bg-secondary/30'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary' />
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6 space-y-6'>
                  {/* Prediction Rating */}
                  <div className='bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 text-center space-y-3'>
                    <p className='text-xs text-muted-foreground uppercase tracking-widest font-semibold'>
                      Predicted Quality
                    </p>
                    <div className='flex items-baseline justify-center gap-2'>
                      <span
                        className={`text-5xl font-bold ${getRatingColor(
                          result.prediction
                        )}`}
                      >
                        {result.prediction.toFixed(1)}
                      </span>
                      <span className='text-xl text-muted-foreground'>/10</span>
                    </div>
                    <div className='pt-2 border-t border-primary/20'>
                      <p
                        className={`text-sm font-semibold ${getRatingColor(
                          result.prediction
                        )}`}
                      >
                        {getRatingInterpretation(result.prediction)}
                      </p>
                    </div>
                  </div>

                  {/* Rating Scale */}
                  <div className='space-y-3'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide font-semibold'>
                      Rating Scale
                    </p>
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center text-xs'>
                        <span>8.5-10</span>
                        <span className='text-green-600 font-medium'>
                          Excellent
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-xs'>
                        <span>7.5-8.5</span>
                        <span className='text-blue-600 font-medium'>
                          Very Good
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-xs'>
                        <span>6.5-7.5</span>
                        <span className='text-emerald-600 font-medium'>
                          Good
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-xs'>
                        <span>5.5-6.5</span>
                        <span className='text-yellow-600 font-medium'>
                          Average
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-xs'>
                        <span>Below 5.5</span>
                        <span className='text-red-600 font-medium'>
                          Below Average
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    onClick={() => {
                      reset();
                      setResult(null);
                      setError(null);
                    }}
                    variant='outline'
                    className='w-full'
                  >
                    Predict Another
                  </Button>
                </CardContent>
              </Card>
            )}

            {!result && !error && (
              <Card className='border border-border shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg'>Ready to Predict</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <p className='text-sm text-muted-foreground'>
                    Fill in the movie details on the left and click "Predict
                    Quality" to generate a rating forecast.
                  </p>
                  <div className='text-xs text-muted-foreground space-y-1 pt-2 border-t border-border'>
                    <p>
                      <strong>Note:</strong> This model uses Support Vector
                      Regression (SVR) to predict movie quality based on
                      historical data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
