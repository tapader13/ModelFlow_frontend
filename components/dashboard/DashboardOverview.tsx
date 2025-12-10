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
  User,
  Users,
  Film as FilmIcon,
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
  model_name: string;
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
  const [titanicPredictions, setTitanicPredictions] = useState<
    TitanicPrediction[]
  >([]);
  const [moviePredictions, setMoviePredictions] = useState<MoviePrediction[]>(
    []
  );
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
        console.log('Titanic Data:', titanicData);
        console.log('Movie Data:', movieData);

        // Handle both single object and array responses
        if (Array.isArray(titanicData)) {
          setTitanicPredictions(titanicData);
        } else if (
          titanicData &&
          typeof titanicData === 'object' &&
          titanicData.message !== 'No prediction found for this email'
        ) {
          setTitanicPredictions([titanicData]);
        } else {
          setTitanicPredictions([]);
        }

        // Handle both single object and array responses
        if (Array.isArray(movieData)) {
          setMoviePredictions(movieData);
        } else if (
          movieData &&
          typeof movieData === 'object' &&
          movieData.message !== 'No prediction found for this email'
        ) {
          setMoviePredictions([movieData]);
        } else {
          setMoviePredictions([]);
        }
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
      ? { label: 'Survived', color: 'text-green-600', bgColor: 'bg-green-50' }
      : {
          label: 'Did Not Survive',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
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
          {/* Titanic Predictions Column */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <Users className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Titanic Survival Predictions
                </h2>
                <p className='text-muted-foreground text-sm'>
                  Logistic Regression Model • {titanicPredictions.length}{' '}
                  prediction{titanicPredictions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {titanicPredictions.length > 0 ? (
              <div className='space-y-6'>
                {titanicPredictions.map((prediction, index) => {
                  const status = getSurvivalStatus(prediction.Survived);
                  return (
                    <Card
                      key={prediction.id || index}
                      className='border border-border shadow-sm hover:shadow-md transition-shadow'
                    >
                      <CardHeader className='border-b border-border bg-secondary/30'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <CardTitle className='flex items-center gap-2'>
                              <BarChart3 className='h-5 w-5 text-primary' />
                              Passenger #{prediction.passenger_id}
                            </CardTitle>
                            <CardDescription>
                              {prediction.name} • Prediction {index + 1} of{' '}
                              {titanicPredictions.length}
                            </CardDescription>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}
                          >
                            {status.label}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-6 space-y-6'>
                        {/* Passenger Info */}
                        <div className='space-y-4'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                              <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                                <User className='inline h-3 w-3 mr-1' />
                                Name
                              </p>
                              <p className='font-medium text-foreground'>
                                {prediction.name}
                              </p>
                            </div>
                            <div className='space-y-1'>
                              <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                                Age
                              </p>
                              <p className='font-medium text-foreground'>
                                {prediction.age} years
                              </p>
                            </div>
                            <div className='space-y-1'>
                              <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                                Class
                              </p>
                              <p className='font-medium text-foreground'>
                                Class {prediction.pclass}
                              </p>
                            </div>
                            <div className='space-y-1'>
                              <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                                Gender
                              </p>
                              <p className='font-medium text-foreground capitalize'>
                                {prediction.sex}
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
                                className={`text-2xl font-bold flex items-center gap-2 ${status.color}`}
                              >
                                {status.label}
                                {prediction.Survived === 1 ? (
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
                                {((prediction.probability || 0) * 100).toFixed(
                                  2
                                )}
                                %
                              </span>
                            </div>
                            <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                              <div
                                className='bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all'
                                style={{
                                  width: `${
                                    (prediction.probability || 0) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-4'>
                          <span>Ticket: {prediction.ticket}</span>
                          <span>•</span>
                          <span>
                            Fare: ${(prediction.fare || 0).toFixed(2)}
                          </span>
                          <span>•</span>
                          <span>
                            Created: {formatDate(prediction.created_at)}
                          </span>
                          <span>•</span>
                          <span>Model: {prediction.model_name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className='border border-border shadow-sm'>
                <CardHeader className='border-b border-border bg-secondary/30'>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5 text-muted-foreground' />
                    Titanic Survival Predictions
                  </CardTitle>
                  <CardDescription>Logistic Regression Model</CardDescription>
                </CardHeader>
                <CardContent className='py-12'>
                  <div className='text-center text-muted-foreground'>
                    <Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p className='font-medium mb-2'>
                      No Titanic predictions found
                    </p>
                    <p className='text-sm'>
                      Make some predictions to see them here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Movie Predictions Column */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <FilmIcon className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Movie Rating Predictions
                </h2>
                <p className='text-muted-foreground text-sm'>
                  Linear Regression Model • {moviePredictions.length} prediction
                  {moviePredictions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {moviePredictions.length > 0 ? (
              <div className='space-y-6'>
                {moviePredictions.map((prediction, index) => (
                  <Card
                    key={prediction.id || index}
                    className='border border-border shadow-sm hover:shadow-md transition-shadow'
                  >
                    <CardHeader className='border-b border-border bg-secondary/30'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <CardTitle className='flex items-center gap-2'>
                            <TrendingUp className='h-5 w-5 text-primary' />
                            {prediction.name}
                          </CardTitle>
                          <CardDescription>
                            Prediction {index + 1} of {moviePredictions.length}{' '}
                            • Rank #{prediction.rank}
                          </CardDescription>
                        </div>
                        <div className='bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium'>
                          #{prediction.rank}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-6 space-y-6'>
                      {/* Movie Header */}
                      <div className='space-y-2'>
                        {prediction.tagline && (
                          <p className='text-muted-foreground italic text-sm border-l-4 border-primary pl-3 py-1'>
                            "{prediction.tagline}"
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
                              {prediction.run_time || 'N/A'}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              <Film className='inline h-3 w-3 mr-1' />
                              Certificate
                            </p>
                            <p className='font-medium text-foreground'>
                              {prediction.certificate || 'N/A'}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              Year
                            </p>
                            <p className='font-medium text-foreground'>
                              {prediction.year}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              Genre
                            </p>
                            <p className='font-medium text-foreground text-sm'>
                              {(prediction.genre || '').replace(/,/g, ', ')}
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
                              {formatCurrency(prediction.budget || 0)}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              <DollarSign className='inline h-3 w-3 mr-1' />
                              Box Office
                            </p>
                            <p className='font-medium text-foreground'>
                              {formatCurrency(prediction.box_office || 0)}
                            </p>
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              Directors
                            </p>
                            <p className='font-medium text-foreground text-sm'>
                              {prediction.directors}
                            </p>
                          </div>
                          <div className='space-y-2'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                              Writers
                            </p>
                            <p className='font-medium text-foreground text-sm'>
                              {prediction.writers}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                            Main Cast
                          </p>
                          <p className='font-medium text-foreground text-sm'>
                            {prediction.casts}
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
                              {(prediction.predicted_rating || 0).toFixed(1)}
                            </span>
                            <span className='text-lg text-muted-foreground'>
                              /10
                            </span>
                          </div>
                          <div className='mt-2'>
                            <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                              <div
                                className='bg-gradient-to-r from-primary to-accent h-full rounded-full'
                                style={{
                                  width: `${
                                    (prediction.predicted_rating || 0) * 10
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-4'>
                        <span>Prediction ID: {prediction.id}</span>
                        <span>•</span>
                        <span>User ID: {prediction.user_id}</span>
                        <span>•</span>
                        <span>
                          Created: {formatDate(prediction.created_at)}
                        </span>
                        <span>•</span>
                        <span>
                          Updated: {formatDate(prediction.updated_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className='border border-border shadow-sm'>
                <CardHeader className='border-b border-border bg-secondary/30'>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5 text-muted-foreground' />
                    Movie Rating Predictions
                  </CardTitle>
                  <CardDescription>Linear Regression Model</CardDescription>
                </CardHeader>
                <CardContent className='py-12'>
                  <div className='text-center text-muted-foreground'>
                    <FilmIcon className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p className='font-medium mb-2'>
                      No movie predictions found
                    </p>
                    <p className='text-sm'>
                      Make some predictions to see them here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {(titanicPredictions.length > 0 || moviePredictions.length > 0) && (
          <Card className='mt-8 border border-border'>
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Total Predictions
                  </p>
                  <p className='text-3xl font-bold text-primary'>
                    {titanicPredictions.length + moviePredictions.length}
                  </p>
                </div>
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Titanic Predictions
                  </p>
                  <div className='flex items-center justify-center gap-2'>
                    <Users className='h-5 w-5 text-primary' />
                    <p className='text-2xl font-bold'>
                      {titanicPredictions.length}
                    </p>
                  </div>
                </div>
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Movie Predictions
                  </p>
                  <div className='flex items-center justify-center gap-2'>
                    <FilmIcon className='h-5 w-5 text-primary' />
                    <p className='text-2xl font-bold'>
                      {moviePredictions.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
