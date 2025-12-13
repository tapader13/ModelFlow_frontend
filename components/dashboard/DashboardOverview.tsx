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
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  Activity,
  Car,
  Film,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  Download,
  Filter,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Shield,
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

interface DashboardStats {
  totalPredictions: number;
  averageConfidence: number;
  recentActivity: number;
  modelAccuracy: number;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [titanicData, setTitanicData] = useState<TitanicPrediction[]>([]);
  const [movieData, setMovieData] = useState<MoviePrediction[]>([]);
  const [carData, setCarData] = useState<CarPricePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalPredictions: 0,
    averageConfidence: 0,
    recentActivity: 0,
    modelAccuracy: 0,
  });

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

        const titanicArray = Array.isArray(titanicResult)
          ? titanicResult
          : [titanicResult];
        const movieArray = Array.isArray(movieResult)
          ? movieResult
          : [movieResult];
        const carArray = Array.isArray(carResult) ? carResult : [carResult];

        setTitanicData(titanicArray);
        setMovieData(movieArray);
        setCarData(carArray);

        // Calculate stats
        const totalPreds =
          titanicArray.length + movieArray.length + carArray.length;
        const avgConfidence =
          titanicArray.length > 0
            ? (titanicArray.reduce((acc, item) => acc + item.probability, 0) /
                titanicArray.length) *
              100
            : 0;

        // Calculate recent activity (predictions from last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recent = [...titanicArray, ...movieArray, ...carArray].filter(
          (item) => new Date(item.created_at) > weekAgo
        ).length;

        setStats({
          totalPredictions: totalPreds,
          averageConfidence: avgConfidence,
          recentActivity: recent,
          modelAccuracy: 92.5, // This would come from your backend
        });
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
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center p-4'>
        <Card className='w-full max-w-md border-gray-800 bg-gray-900'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <AlertCircle className='h-5 w-5' />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-400 mb-4'>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className='w-full bg-white text-black hover:bg-gray-200'
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Top Navigation */}
      <div className='border-b border-gray-800 bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='p-2 bg-white rounded-lg'>
                  <Activity className='h-6 w-6 text-black' />
                </div>
                <h1 className='text-xl font-bold'>ML Dashboard</h1>
              </div>
              <div className='hidden md:flex items-center gap-6 ml-8'>
                <a
                  href='#'
                  className='text-sm font-medium text-white hover:text-gray-300'
                >
                  Overview
                </a>
                <a
                  href='#'
                  className='text-sm font-medium text-gray-400 hover:text-white'
                >
                  Analytics
                </a>
                <a
                  href='#'
                  className='text-sm font-medium text-gray-400 hover:text-white'
                >
                  Reports
                </a>
                <a
                  href='#'
                  className='text-sm font-medium text-gray-400 hover:text-white'
                >
                  Settings
                </a>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-400 hover:text-white'
              >
                <Filter className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-400 hover:text-white'
              >
                <Download className='h-4 w-4' />
              </Button>
              <Button className='bg-white text-black hover:bg-gray-200'>
                <Sparkles className='h-4 w-4 mr-2' />
                New Prediction
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold'>
            Welcome back, {session?.user?.name || 'User'}
          </h2>
          <p className='text-gray-400'>
            Here's what's happening with your predictions today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='bg-gray-900 border-gray-800'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-400 mb-1'>
                    Total Predictions
                  </p>
                  <h3 className='text-2xl font-bold'>
                    {stats.totalPredictions}
                  </h3>
                </div>
                <div className='p-3 bg-white/10 rounded-lg'>
                  <Target className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm'>
                <TrendingUp className='h-4 w-4 text-white mr-1' />
                <span className='text-white'>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gray-900 border-gray-800'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-400 mb-1'>
                    Avg. Confidence
                  </p>
                  <h3 className='text-2xl font-bold'>
                    {stats.averageConfidence.toFixed(1)}%
                  </h3>
                </div>
                <div className='p-3 bg-white/10 rounded-lg'>
                  <Shield className='h-6 w-6 text-white' />
                </div>
              </div>
              <Progress value={stats.averageConfidence} className='mt-4 h-2' />
            </CardContent>
          </Card>

          <Card className='bg-gray-900 border-gray-800'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-400 mb-1'>
                    Recent Activity
                  </p>
                  <h3 className='text-2xl font-bold'>{stats.recentActivity}</h3>
                </div>
                <div className='p-3 bg-white/10 rounded-lg'>
                  <Clock className='h-6 w-6 text-white' />
                </div>
              </div>
              <p className='text-sm text-gray-400 mt-4'>Last 7 days</p>
            </CardContent>
          </Card>

          <Card className='bg-gray-900 border-gray-800'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-400 mb-1'>
                    Model Accuracy
                  </p>
                  <h3 className='text-2xl font-bold'>{stats.modelAccuracy}%</h3>
                </div>
                <div className='p-3 bg-white/10 rounded-lg'>
                  <Zap className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm'>
                <span className='text-gray-400'>Across all models</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Titanic & Recent Activity */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Titanic Predictions */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader className='border-b border-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-5 w-5 text-white' />
                    <CardTitle>Titanic Survival Analysis</CardTitle>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white'
                  >
                    View all <ChevronRight className='h-4 w-4 ml-1' />
                  </Button>
                </div>
                <CardDescription className='text-gray-400'>
                  Logistic Regression predictions with confidence scores
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  {titanicData.slice(0, 5).map((item) => (
                    <div
                      key={item.passenger_id}
                      className='flex items-center justify-between p-3 bg-gray-800/50 rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center'>
                          <Users className='h-4 w-4' />
                        </div>
                        <div>
                          <p className='font-medium text-sm'>
                            {item.name.split(',')[0]}
                          </p>
                          <p className='text-xs text-gray-400'>
                            Class {item.pclass} • {item.age} yrs
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Badge
                          className={
                            item.Survived === 1
                              ? 'bg-white text-black'
                              : 'bg-gray-700 text-white'
                          }
                        >
                          {item.Survived === 1 ? 'Survived' : 'Perished'}
                        </Badge>
                        <div className='text-right'>
                          <p className='font-bold'>
                            {(item.probability * 100).toFixed(1)}%
                          </p>
                          <p className='text-xs text-gray-400'>confidence</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {titanicData.length === 0 && (
                  <div className='text-center py-8'>
                    <Users className='h-12 w-12 text-gray-700 mx-auto mb-4' />
                    <p className='text-gray-400'>No Titanic predictions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Movie Ratings */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader className='border-b border-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Film className='h-5 w-5 text-white' />
                    <CardTitle>Movie Rating Forecast</CardTitle>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white'
                  >
                    View all <ChevronRight className='h-4 w-4 ml-1' />
                  </Button>
                </div>
                <CardDescription className='text-gray-400'>
                  Linear Regression predictions for movie ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='border-gray-800'>
                      <TableHead className='text-gray-400'>Movie</TableHead>
                      <TableHead className='text-gray-400'>Year</TableHead>
                      <TableHead className='text-gray-400'>Genre</TableHead>
                      <TableHead className='text-right text-gray-400'>
                        Predicted
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movieData.slice(0, 5).map((item, index) => (
                      <TableRow
                        key={index}
                        className='border-gray-800 hover:bg-gray-800/50'
                      >
                        <TableCell>
                          <div>
                            <p className='font-medium'>{item.name}</p>
                            <p className='text-xs text-gray-400'>
                              #{item.rank}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className='border-gray-700 text-gray-300'
                          >
                            {item.genre.split(',')[0]}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='inline-flex items-center'>
                            <span className='text-lg font-bold'>
                              {item.predicted_rating.toFixed(1)}
                            </span>
                            <span className='text-xs text-gray-400 ml-1'>
                              /10
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {movieData.length === 0 && (
                  <div className='text-center py-8'>
                    <Film className='h-12 w-12 text-gray-700 mx-auto mb-4' />
                    <p className='text-gray-400'>No movie predictions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Car Prices & Quick Stats */}
          <div className='space-y-6'>
            {/* Car Price Predictions */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader className='border-b border-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Car className='h-5 w-5 text-white' />
                    <CardTitle>Vehicle Pricing</CardTitle>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-gray-400 hover:text-white'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </div>
                <CardDescription className='text-gray-400'>
                  Current market price predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {carData.slice(0, 4).map((item) => (
                    <div
                      key={item.ID}
                      className='p-3 bg-gray-800/30 rounded-lg'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <p className='font-medium'>
                            {item.Manufacturer} {item.Model}
                          </p>
                          <p className='text-xs text-gray-400'>
                            {item['Prod. year']} • {item.Category}
                          </p>
                        </div>
                        <Badge className='bg-white/10 text-white border-0'>
                          {item['Fuel type']}
                        </Badge>
                      </div>
                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='text-xs text-gray-400'>Mileage</p>
                          <p className='text-sm'>{item.Mileage}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-gray-400'>
                            Predicted Price
                          </p>
                          <p className='text-lg font-bold'>
                            $
                            {(
                              item.prediction ||
                              item.Price ||
                              0
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {carData.length === 0 && (
                  <div className='text-center py-8'>
                    <Car className='h-12 w-12 text-gray-700 mx-auto mb-4' />
                    <p className='text-gray-400'>
                      No car price predictions yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader className='border-b border-gray-800'>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Model Performance
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Accuracy across prediction types
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-300'>Titanic Survival</span>
                      <span className='font-medium'>94.2%</span>
                    </div>
                    <Progress value={94.2} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-300'>Movie Ratings</span>
                      <span className='font-medium'>88.5%</span>
                    </div>
                    <Progress value={88.5} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-300'>Car Prices</span>
                      <span className='font-medium'>91.7%</span>
                    </div>
                    <Progress value={91.7} className='h-2' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className='text-gray-400'>
                  Common tasks and predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <Button className='w-full justify-start bg-white text-black hover:bg-gray-200'>
                    <Users className='h-4 w-4 mr-2' />
                    New Survival Prediction
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start border-gray-700 text-white hover:bg-gray-800'
                  >
                    <Film className='h-4 w-4 mr-2' />
                    Predict Movie Rating
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start border-gray-700 text-white hover:bg-gray-800'
                  >
                    <Car className='h-4 w-4 mr-2' />
                    Estimate Car Price
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty State */}
        {titanicData.length === 0 &&
          movieData.length === 0 &&
          carData.length === 0 && (
            <Card className='border-gray-800 bg-gray-900'>
              <CardContent className='py-16'>
                <div className='text-center max-w-md mx-auto'>
                  <div className='p-4 bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                    <Activity className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>
                    No Predictions Yet
                  </h3>
                  <p className='text-gray-400 mb-6'>
                    Start making predictions to see your dashboard come to life
                    with insights and analytics.
                  </p>
                  <Button className='bg-white text-black hover:bg-gray-200'>
                    <Zap className='h-4 w-4 mr-2' />
                    Make Your First Prediction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </main>
  );
}
