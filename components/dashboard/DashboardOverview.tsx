'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Film,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface TitanicPrediction {
  passenger_id: number;
  name: string;
  sex: string;
  age: number;
  pclass: number;
  ticket: string;
  fare: number;
  Survived: number;
  probability: number;
  created_at: string;
  id: number;
}

interface MoviePrediction {
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
  predicted_rating: number;
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [titanic, setTitanic] = useState<TitanicPrediction | null>(null);
  const [movie, setMovie] = useState<MoviePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(session, 'Session');

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const fetchPredictions = async () => {
      try {
        const [titanicRes, movieRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/titanic/logistic-single-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/movie-rating/linear-single-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!titanicRes.ok || !movieRes.ok) {
          throw new Error('Failed to fetch predictions');
        }

        const titanicData = await titanicRes.json();
        const movieData = await movieRes.json();
        console.log(titanicData, movieData);

        setTitanic(titanicData[0] || null);
        setMovie(movieData[0] || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load prediction data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

  const getSurvivalStatus = (survived: number) => {
    return survived === 1
      ? { label: 'Survived', color: 'text-green-600' }
      : { label: 'Did Not Survive', color: 'text-red-600' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md border-destructive'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-destructive'>
              <AlertCircle className='h-5 w-5' />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()} className='w-full'>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            ML Predictions Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Real-time model outputs for survival and rating predictions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Titanic Prediction Card */}
          {titanic && (
            <Card className='border border-border shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='border-b border-border bg-secondary/30'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                      <BarChart3 className='h-5 w-5 text-primary' />
                      Titanic Survival Prediction
                    </CardTitle>
                    <CardDescription>Logistic Regression Model</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-6 space-y-6'>
                {/* Passenger Info */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-foreground'>
                    Passenger Information
                  </h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Passenger Name
                      </p>
                      <p className='font-medium text-foreground'>
                        {titanic.name}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Age
                      </p>
                      <p className='font-medium text-foreground'>
                        {titanic.age} years
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Ticket Class
                      </p>
                      <p className='font-medium text-foreground'>
                        Class {titanic.pclass}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Gender
                      </p>
                      <p className='font-medium text-foreground text-capitalize'>
                        {titanic.sex}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Fare
                      </p>
                      <p className='font-medium text-foreground'>
                        ${titanic.fare.toFixed(2)}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Ticket
                      </p>
                      <p className='font-medium text-foreground text-sm'>
                        {titanic.ticket}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prediction Result */}
                <div className='bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide mb-1'>
                        Survival Prediction
                      </p>
                      <p
                        className={`text-2xl font-bold flex items-center gap-2 ${
                          getSurvivalStatus(titanic.Survived).color
                        }`}
                      >
                        {getSurvivalStatus(titanic.Survived).label}
                        {titanic.Survived === 1 ? (
                          <CheckCircle className='h-6 w-6' />
                        ) : (
                          <AlertCircle className='h-6 w-6' />
                        )}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-muted-foreground'>
                        Probability Score
                      </span>
                      <span className='font-semibold text-primary'>
                        {(titanic.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                      <div
                        className='bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all'
                        style={{ width: `${titanic.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2 text-xs text-muted-foreground border-t border-border pt-4'>
                  <span>ID: {titanic.id}</span>
                  <span>•</span>
                  <span>
                    {new Date(titanic.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movie Rating Prediction Card */}
          {movie && (
            <Card className='border border-border shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='border-b border-border bg-secondary/30'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                      <TrendingUp className='h-5 w-5 text-primary' />
                      Movie Rating Prediction
                    </CardTitle>
                    <CardDescription>Linear Regression Model</CardDescription>
                  </div>
                  <div className='bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium'>
                    #{movie.rank}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-6 space-y-6'>
                {/* Movie Header */}
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold text-foreground'>
                    {movie.name}
                  </h3>
                  {movie.tagline && (
                    <p className='text-muted-foreground italic text-sm'>
                      "{movie.tagline}"
                    </p>
                  )}
                </div>

                {/* Movie Details */}
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        <Clock className='inline h-3 w-3 mr-1' />
                        Runtime
                      </p>
                      <p className='font-medium text-foreground'>
                        {movie.run_time}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        <Film className='inline h-3 w-3 mr-1' />
                        Certificate
                      </p>
                      <p className='font-medium text-foreground'>
                        {movie.certificate}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Release Year
                      </p>
                      <p className='font-medium text-foreground'>
                        {movie.year}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        Genre
                      </p>
                      <p className='font-medium text-foreground text-sm'>
                        {movie.genre.replace(/,/g, ', ')}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        <DollarSign className='inline h-3 w-3 mr-1' />
                        Budget
                      </p>
                      <p className='font-medium text-foreground'>
                        {formatCurrency(movie.budget)}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                        <DollarSign className='inline h-3 w-3 mr-1' />
                        Box Office
                      </p>
                      <p className='font-medium text-foreground'>
                        {formatCurrency(movie.box_office)}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                      Directors
                    </p>
                    <p className='font-medium text-foreground text-sm'>
                      {movie.directors}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                      Writers
                    </p>
                    <p className='font-medium text-foreground text-sm'>
                      {movie.writers}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                      Main Cast
                    </p>
                    <p className='font-medium text-foreground text-sm'>
                      {movie.casts}
                    </p>
                  </div>
                </div>

                {/* Rating Prediction */}
                <div className='bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4 space-y-4'>
                  <div className='text-center'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Predicted IMDb Rating
                    </p>
                    <div className='flex items-center justify-center gap-2'>
                      <span className='text-4xl font-bold text-primary'>
                        {movie.predicted_rating.toFixed(1)}
                      </span>
                      <span className='text-lg text-muted-foreground'>/10</span>
                    </div>
                    <div className='mt-2'>
                      <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                        <div
                          className='bg-gradient-to-r from-primary to-accent h-full rounded-full'
                          style={{ width: `${movie.predicted_rating * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-4'>
                  <span>Movie ID: {movie.id}</span>
                  <span>•</span>
                  <span>User ID: {movie.user_id}</span>
                  <span>•</span>
                  <span>
                    Created: {new Date(movie.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Updated: {new Date(movie.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
