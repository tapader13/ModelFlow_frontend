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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Activity, Car, Film, Users } from 'lucide-react';
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
}

interface MoviePrediction {
  rank: number;
  name: string;
  year: number;
  genre: string;
  predicted_rating: number;
  casts: string;
  directors: string;
  created_at: string;
}

interface CarPricePrediction {
  ID: number;
  Manufacturer: string;
  Model: string;
  'Prod. year': number;
  Category: string;
  'Fuel type': string;
  Mileage: string;
  prediction?: number;
  Price?: number;
  created_at: string;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [titanicData, setTitanicData] = useState<TitanicPrediction[]>([]);
  const [movieData, setMovieData] = useState<MoviePrediction[]>([]);
  const [carData, setCarData] = useState<CarPricePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const [titanicRes, movieRes, carRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/titanic/logistic-single-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/movie-rating/linear-single-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/car-price/car-price-single-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!titanicRes.ok || !movieRes.ok || !carRes.ok) {
          throw new Error('Failed to fetch predictions');
        }

        const titanicResult = await titanicRes.json();
        const movieResult = await movieRes.json();
        const carResult = await carRes.json();

        setTitanicData(
          Array.isArray(titanicResult) ? titanicResult : [titanicResult]
        );
        setMovieData(Array.isArray(movieResult) ? movieResult : [movieResult]);
        setCarData(Array.isArray(carResult) ? carResult : [carResult]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching predictions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

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
          <div className='flex items-center gap-3 mb-2'>
            <Activity className='h-8 w-8 text-primary' />
            <h1 className='text-3xl font-bold text-foreground'>
              ML Predictions Dashboard
            </h1>
          </div>
          <p className='text-muted-foreground'>
            Real-time model outputs and predictions across all datasets
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
        {/* Titanic Predictions Table */}
        {titanicData.length > 0 && (
          <Card className='border border-border shadow-sm'>
            <CardHeader className='border-b border-border'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-primary' />
                <div>
                  <CardTitle className='text-lg font-semibold'>
                    Titanic Survival Predictions
                  </CardTitle>
                  <CardDescription className='text-xs mt-1'>
                    Logistic Regression Model
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead className='text-right'>Confidence</TableHead>
                    <TableHead className='text-right'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {titanicData.map((item) => (
                    <TableRow key={item.passenger_id}>
                      <TableCell className='font-medium max-w-[200px] truncate'>
                        {item.name}
                      </TableCell>
                      <TableCell>Class {item.pclass}</TableCell>
                      <TableCell>{item.age} yrs</TableCell>
                      <TableCell>${item.fare.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.Survived === 1 ? 'default' : 'secondary'
                          }
                        >
                          {item.Survived === 1 ? 'Survived' : 'Not Survived'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right font-medium text-primary'>
                        {(item.probability * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className='text-right text-xs text-muted-foreground'>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Movie Rating Predictions Table */}
        {movieData.length > 0 && (
          <Card className='border border-border shadow-sm'>
            <CardHeader className='border-b border-border'>
              <div className='flex items-center gap-2'>
                <Film className='h-5 w-5 text-primary' />
                <div>
                  <CardTitle className='text-lg font-semibold'>
                    Movie Rating Predictions
                  </CardTitle>
                  <CardDescription className='text-xs mt-1'>
                    Linear Regression Model
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Movie Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead className='text-right'>
                      Predicted Rating
                    </TableHead>
                    <TableHead className='text-right'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movieData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge>#{item.rank}</Badge>
                      </TableCell>
                      <TableCell className='font-medium max-w-[250px] truncate'>
                        {item.name}
                      </TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell className='text-xs max-w-[150px] truncate'>
                        {item.genre.split(',')[0]}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span className='text-lg font-bold text-primary'>
                          {item.predicted_rating.toFixed(1)}
                        </span>
                        <span className='text-xs text-muted-foreground ml-1'>
                          /10
                        </span>
                      </TableCell>
                      <TableCell className='text-right text-xs text-muted-foreground'>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Car Price Predictions Table */}
        {carData.length > 0 && (
          <Card className='border border-border shadow-sm'>
            <CardHeader className='border-b border-border'>
              <div className='flex items-center gap-2'>
                <Car className='h-5 w-5 text-primary' />
                <div>
                  <CardTitle className='text-lg font-semibold'>
                    Car Price Predictions
                  </CardTitle>
                  <CardDescription className='text-xs mt-1'>
                    Linear Regression Model
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead className='text-right'>
                      Predicted Price
                    </TableHead>
                    <TableHead className='text-right'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carData.map((item) => (
                    <TableRow key={item.ID}>
                      <TableCell className='font-medium max-w-[200px] truncate'>
                        {item.Manufacturer} {item.Model}
                      </TableCell>
                      <TableCell>{item['Prod. year']}</TableCell>
                      <TableCell>
                        <Badge variant='secondary'>{item.Category}</Badge>
                      </TableCell>
                      <TableCell className='text-xs'>
                        {item['Fuel type']}
                      </TableCell>
                      <TableCell className='text-xs'>{item.Mileage}</TableCell>
                      <TableCell className='text-right font-bold text-primary'>
                        ${(item.prediction || item.Price || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right text-xs text-muted-foreground'>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {titanicData.length === 0 &&
          movieData.length === 0 &&
          carData.length === 0 && (
            <Card className='border border-border'>
              <CardContent className='py-12'>
                <div className='text-center'>
                  <Activity className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    No Predictions Yet
                  </h3>
                  <p className='text-sm text-muted-foreground mb-6'>
                    Start making predictions to see your results here
                  </p>
                  <Button>Make Your First Prediction</Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </main>
  );
}
