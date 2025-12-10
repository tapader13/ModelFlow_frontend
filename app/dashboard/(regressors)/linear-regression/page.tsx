'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

interface MoviePredictionInput {
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

interface MoviePredictionResponse {
  prediction: number;
}

export default function MovieRatingPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  console.log(session, 'Session');

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MoviePredictionInput>({
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

  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MoviePredictionInput | null>(null);

  const onSubmit = async (data: MoviePredictionInput) => {
    if (!token) {
      setError('User is not authenticated. Please log in.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setPrediction(null);
      setFormData(data);

      const response = await fetch(
        'http://127.0.0.1:8000/movie-rating/linear-predict',
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to get prediction (${response.status})`
        );
      }

      const result: MoviePredictionResponse = await response.json();
      setPrediction(result.prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <main className='min-h-screen bg-background'>
        {/* Header */}
        <div className='border-b border-border bg-card'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
              <TrendingUp className='h-8 w-8 text-primary' />
              Movie Rating Prediction
            </h1>
            <p className='text-muted-foreground'>
              Predict movie ratings using linear regression model
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
                  <CardTitle className='text-xl'>Enter Movie Details</CardTitle>
                  <CardDescription>
                    Provide movie information for rating prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Row 1: Rank and Name */}
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
                            min: {
                              value: 1,
                              message: 'Rank must be at least 1',
                            },
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
                          Movie Name *
                        </label>
                        <Input
                          placeholder='The Shawshank Redemption'
                          {...register('name', {
                            required: 'Movie name is required',
                            minLength: {
                              value: 1,
                              message: 'Movie name is required',
                            },
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.name && (
                          <span className='text-xs text-destructive'>
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Year and Certificate */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Year *
                        </label>
                        <Input
                          type='number'
                          placeholder='1994'
                          min='1800'
                          max={new Date().getFullYear()}
                          {...register('year', {
                            required: 'Year is required',
                            min: {
                              value: 1800,
                              message: 'Year must be after 1800',
                            },
                            max: {
                              value: new Date().getFullYear(),
                              message: 'Year cannot be in the future',
                            },
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.year && (
                          <span className='text-xs text-destructive'>
                            {errors.year.message}
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

                    {/* Row 3: Genre and Runtime */}
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
                    </div>

                    {/* Row 4: Tagline */}
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Tagline
                      </label>
                      <Input
                        placeholder='Fear can hold you prisoner. Hope can set you free.'
                        {...register('tagline')}
                        className='bg-input text-foreground'
                      />
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
                            min: {
                              value: 0,
                              message: 'Budget cannot be negative',
                            },
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
                            min: {
                              value: 0,
                              message: 'Box office cannot be negative',
                            },
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
                        {...register('casts', {
                          required: 'Cast is required',
                        })}
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
                      disabled={isSubmitting || loading}
                      className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                    >
                      {isSubmitting || loading
                        ? 'Predicting...'
                        : 'Get Prediction'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className='lg:col-span-1'>
              {error && (
                <Card className='border border-destructive shadow-sm mb-6'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-destructive'>
                      <AlertCircle className='h-5 w-5' />
                      Error
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>{error}</p>
                    <Button
                      onClick={() => setError(null)}
                      variant='outline'
                      size='sm'
                      className='mt-4'
                    >
                      Dismiss
                    </Button>
                  </CardContent>
                </Card>
              )}

              {prediction !== null && formData && (
                <Card className='border border-border shadow-sm sticky top-8'>
                  <CardHeader className='border-b border-border bg-secondary/30'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <CheckCircle className='h-5 w-5 text-primary' />
                      Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-6'>
                    {/* Movie Title */}
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Movie
                      </p>
                      <p className='text-lg font-semibold text-foreground line-clamp-2'>
                        {formData.name}
                      </p>
                      {formData.tagline && (
                        <p className='text-sm text-muted-foreground italic'>
                          "{formData.tagline}"
                        </p>
                      )}
                    </div>

                    {/* Rating Prediction */}
                    <div className='bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4 space-y-4'>
                      <div className='text-center'>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                          Predicted IMDb Rating
                        </p>
                        <div className='flex items-center justify-center gap-2'>
                          <span className='text-4xl font-bold text-primary'>
                            {prediction.toFixed(1)}
                          </span>
                          <span className='text-lg text-muted-foreground'>
                            /10
                          </span>
                        </div>
                        <div className='mt-4'>
                          <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                            <div
                              className='bg-gradient-to-r from-primary to-accent h-full rounded-full'
                              style={{ width: `${prediction * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Movie Details */}
                    <div className='space-y-3 border-t border-border pt-4'>
                      <div className='grid grid-cols-2 gap-3'>
                        <div>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                            Year
                          </p>
                          <p className='font-medium text-foreground'>
                            {formData.year}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                            Rank
                          </p>
                          <p className='font-medium text-foreground'>
                            #{formData.rank}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Genre
                        </p>
                        <p className='font-medium text-foreground text-sm'>
                          {formData.genre}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Runtime
                        </p>
                        <p className='font-medium text-foreground text-sm'>
                          {formData.run_time}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Budget / Box Office
                        </p>
                        <div className='grid grid-cols-2 gap-2 mt-1'>
                          <p className='font-medium text-foreground text-sm'>
                            {formatCurrency(formData.budget)}
                          </p>
                          <p className='font-medium text-foreground text-sm'>
                            {formatCurrency(formData.box_office)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className='flex gap-2'>
                      <Button
                        onClick={() => {
                          reset();
                          setPrediction(null);
                          setFormData(null);
                          setError(null);
                        }}
                        variant='outline'
                        className='flex-1'
                      >
                        Predict Another
                      </Button>
                      <Button
                        onClick={() => {
                          if (formData) {
                            onSubmit(formData);
                          }
                        }}
                        variant='secondary'
                        className='flex-1'
                      >
                        Predict Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {prediction === null && !error && (
                <Card className='border border-border shadow-sm'>
                  <CardHeader>
                    <CardTitle className='text-lg'>Ready to Predict</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Fill in the movie details on the left and click "Get
                      Prediction" to see the model's rating forecast.
                    </p>
                    <div className='space-y-2 text-xs text-muted-foreground'>
                      <p>Required fields are marked with *</p>
                      <p>Example format:</p>
                      <ul className='list-disc pl-4 space-y-1'>
                        <li>Genre: Drama,Crime,Thriller</li>
                        <li>Cast: Tim Robbins,Morgan Freeman</li>
                        <li>Runtime: 2h 22m</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
