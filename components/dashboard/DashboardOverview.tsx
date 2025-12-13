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
  Bell,
  Search,
  Settings,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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
  predicted_price: number;
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
          modelAccuracy: 92.5,
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
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center p-4'>
        <Card className='w-full max-w-md border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-black'>
              <AlertCircle className='h-5 w-5' />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-600 mb-4'>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className='w-full bg-black text-white hover:bg-gray-800'
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-white text-black'>
      {/* <div className='flex items-center gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search predictions...'
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-600 hover:text-black'
              >
                <Bell className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-600 hover:text-black'
              >
                <Settings className='h-5 w-5' />
              </Button>
            </div> */}

      {/* Main Dashboard Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Dashboard Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold'>Dashboard Overview</h2>
            <p className='text-gray-600'>
              Real-time insights from your prediction models
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              className='border-gray-300 hover:bg-gray-50'
            >
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </Button>
            <Button
              variant='outline'
              className='border-gray-300 hover:bg-gray-50'
            >
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
            <Button className='bg-black text-white hover:bg-gray-800'>
              <Sparkles className='h-4 w-4 mr-2' />
              New Prediction
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='border-gray-200 shadow-sm'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Total Predictions
                  </p>
                  <h3 className='text-2xl font-bold'>
                    {stats.totalPredictions}
                  </h3>
                </div>
                <div className='p-3 bg-gray-100 rounded-lg'>
                  <Target className='h-6 w-6 text-black' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm'>
                <TrendingUp className='h-4 w-4 text-green-600 mr-1' />
                <span className='text-green-600'>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-gray-200 shadow-sm'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Avg. Confidence
                  </p>
                  <h3 className='text-2xl font-bold'>
                    {stats.averageConfidence.toFixed(1)}%
                  </h3>
                </div>
                <div className='p-3 bg-gray-100 rounded-lg'>
                  <Shield className='h-6 w-6 text-black' />
                </div>
              </div>
              <Progress
                value={stats.averageConfidence}
                className='mt-4 h-2 bg-gray-200'
              />
            </CardContent>
          </Card>

          <Card className='border-gray-200 shadow-sm'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Recent Activity
                  </p>
                  <h3 className='text-2xl font-bold'>{stats.recentActivity}</h3>
                </div>
                <div className='p-3 bg-gray-100 rounded-lg'>
                  <Clock className='h-6 w-6 text-black' />
                </div>
              </div>
              <p className='text-sm text-gray-500 mt-4'>Last 7 days</p>
            </CardContent>
          </Card>

          <Card className='border-gray-200 shadow-sm'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Model Accuracy
                  </p>
                  <h3 className='text-2xl font-bold'>{stats.modelAccuracy}%</h3>
                </div>
                <div className='p-3 bg-gray-100 rounded-lg'>
                  <Zap className='h-6 w-6 text-black' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm'>
                <span className='text-gray-500'>Across all models</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Left Column - Titanic & Movie */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Titanic Predictions Card */}
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='border-b border-gray-200 pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-black rounded-lg'>
                      <Users className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <CardTitle>Titanic Survival Predictions</CardTitle>
                      <CardDescription className='text-gray-600'>
                        Logistic Regression Model • {titanicData.length}{' '}
                        predictions
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 hover:text-black'
                  >
                    View all <ChevronRight className='h-4 w-4 ml-1' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-b border-gray-200'>
                        <TableHead className='text-gray-700 font-semibold'>
                          Passenger
                        </TableHead>
                        <TableHead className='text-gray-700 font-semibold'>
                          Class
                        </TableHead>
                        <TableHead className='text-gray-700 font-semibold'>
                          Age
                        </TableHead>
                        <TableHead className='text-gray-700 font-semibold'>
                          Status
                        </TableHead>
                        <TableHead className='text-right text-gray-700 font-semibold'>
                          Confidence
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {titanicData.slice(0, 5).map((item) => (
                        <TableRow
                          key={item.passenger_id}
                          className='border-b border-gray-100 hover:bg-gray-50'
                        >
                          <TableCell className='font-medium'>
                            <div>
                              <p className='text-sm'>
                                {item.name.split(',')[0]}
                              </p>
                              <p className='text-xs text-gray-500'>
                                ${item.fare.toFixed(2)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant='outline'
                              className='border-gray-300'
                            >
                              Class {item.pclass}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.age} yrs</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.Survived === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {item.Survived === 1 ? 'Survived' : 'Perished'}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='inline-flex items-center justify-end'>
                              <span className='font-bold'>
                                {(item.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {titanicData.length === 0 && (
                  <div className='text-center py-12 border border-gray-200 rounded-lg'>
                    <Users className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-600'>No Titanic predictions yet</p>
                    <Button variant='outline' className='mt-4 border-gray-300'>
                      Make First Prediction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Movie Rating Predictions Card */}
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='border-b border-gray-200 pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-black rounded-lg'>
                      <Film className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <CardTitle>Movie Rating Predictions</CardTitle>
                      <CardDescription className='text-gray-600'>
                        Linear Regression Model • {movieData.length} predictions
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 hover:text-black'
                  >
                    View all <ChevronRight className='h-4 w-4 ml-1' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {movieData.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                    >
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <Badge className='bg-gray-100 text-gray-800 mb-2'>
                            #{item.rank}
                          </Badge>
                          <h4 className='font-semibold text-sm line-clamp-1'>
                            {item.name}
                          </h4>
                          <p className='text-xs text-gray-500'>{item.year}</p>
                        </div>
                        <div className='text-right'>
                          <div className='text-lg font-bold'>
                            {item.predicted_rating.toFixed(1)}
                          </div>
                          <div className='text-xs text-gray-500'>
                            /10 rating
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-600 truncate'>
                          {item.genre.split(',')[0]}
                        </span>
                        <span className='text-gray-500'>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {movieData.length === 0 && (
                  <div className='text-center py-12 border border-gray-200 rounded-lg'>
                    <Film className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-600'>No movie predictions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Car Prices & Quick Stats */}
          <div className='space-y-6'>
            {/* Car Price Predictions Card */}
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='border-b border-gray-200 pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-black rounded-lg'>
                      <Car className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <CardTitle>Car Price Predictions</CardTitle>
                      <CardDescription className='text-gray-600'>
                        {carData.length} vehicles analyzed
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-gray-600 hover:text-black'
                  >
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {carData.slice(0, 3).map((item) => (
                    <div
                      key={item.ID}
                      className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                    >
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <h4 className='font-semibold text-sm'>
                            {item.Manufacturer} {item.Model}
                          </h4>
                          <p className='text-xs text-gray-500'>
                            {item['Prod. year']} • {item.Category}
                          </p>
                        </div>
                        <Badge className='bg-gray-100 text-gray-800'>
                          {item['Fuel type']}
                        </Badge>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Mileage</span>
                          <span className='font-medium'>{item.Mileage}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Predicted Price</span>
                          <span className='font-bold text-lg'>
                            $
                            {(
                              item.prediction ||
                              item.predicted_price ||
                              0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {carData.length === 0 && (
                  <div className='text-center py-12 border border-gray-200 rounded-lg'>
                    <Car className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-600'>
                      No car price predictions yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Performance Card */}
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='border-b border-gray-200 pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <BarChart3 className='h-5 w-5 text-black' />
                    <CardTitle>Model Performance</CardTitle>
                  </div>
                </div>
                <CardDescription className='text-gray-600'>
                  Accuracy across prediction types
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-6'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-gray-700'>Titanic Survival</span>
                      <span className='font-bold'>
                        {(
                          (titanicData.reduce(
                            (sum, item) => sum + item.probability,
                            0
                          ) /
                            titanicData.length) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (titanicData.reduce(
                          (sum, item) => sum + item.probability,
                          0
                        ) /
                          titanicData.length) *
                        100
                      }
                      className='h-2 bg-gray-200'
                    />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-gray-700'>Movie Ratings</span>
                      <span className='font-bold'>
                        {(
                          movieData.reduce(
                            (sum, item) => sum + item.predicted_rating,
                            0
                          ) / movieData.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={
                        movieData.reduce(
                          (sum, item) => sum + item.predicted_rating,
                          0
                        ) / movieData.length
                      }
                      className='h-2 bg-gray-200'
                    />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-gray-700'>Car Prices</span>
                      <span className='font-bold'>
                        $
                        {(
                          carData.reduce(
                            (sum, item) => sum + item.predicted_price,
                            0
                          ) / carData.length
                        ).toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={
                        carData.reduce(
                          (sum, item) => sum + item.predicted_price,
                          0
                        ) / carData.length
                      }
                      className='h-2 bg-gray-200'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='border-b border-gray-200 pb-4'>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className='text-gray-600'>
                  Common tasks and predictions
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='flex flex-col gap-3'>
                  <Link href={'/dashboard/logistic-regression'}>
                    <Button className='w-full justify-start bg-black text-white hover:bg-gray-800'>
                      <Users className='h-4 w-4 mr-3' />
                      New Survival Prediction
                    </Button>
                  </Link>
                  <Link href={'/dashboard/linear-regression'}>
                    <Button
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:bg-gray-50'
                    >
                      <Film className='h-4 w-4 mr-3' />
                      Predict Movie Rating
                    </Button>
                  </Link>
                  <Link href={'/dashboard/svr-car-price'}>
                    <Button
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:bg-gray-50'
                    >
                      <Car className='h-4 w-4 mr-3' />
                      Estimate Car Price
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    className='w-full justify-start border-gray-300 hover:bg-gray-50'
                  >
                    <Download className='h-4 w-4 mr-3' />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        {(titanicData.length > 0 ||
          movieData.length > 0 ||
          carData.length > 0) && (
          <Card className='border-gray-200 shadow-sm'>
            <CardHeader className='border-b border-gray-200 pb-4'>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription className='text-gray-600'>
                Latest predictions across all models
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='space-y-4'>
                {[...titanicData, ...movieData, ...carData]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-lg ${
                            'passenger_id' in item
                              ? 'bg-blue-100'
                              : 'rank' in item
                              ? 'bg-purple-100'
                              : 'bg-green-100'
                          }`}
                        >
                          {'passenger_id' in item ? (
                            <Users className='h-4 w-4 text-blue-800' />
                          ) : 'rank' in item ? (
                            <Film className='h-4 w-4 text-purple-800' />
                          ) : (
                            <Car className='h-4 w-4 text-green-800' />
                          )}
                        </div>
                        <div>
                          <p className='font-medium text-sm'>
                            {'passenger_id' in item
                              ? 'Titanic Survival'
                              : 'rank' in item
                              ? 'Movie Rating'
                              : 'Car Price'}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {'passenger_id' in item
                              ? item.name.split(',')[0]
                              : 'rank' in item
                              ? item.name
                              : `${item.Manufacturer} ${item.Model}`}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-medium'>
                          {'passenger_id' in item
                            ? item.Survived === 1
                              ? 'Survived'
                              : 'Perished'
                            : 'rank' in item
                            ? `${item.predicted_rating.toFixed(1)}/10`
                            : `$${(
                                item.prediction ||
                                item.predicted_price ||
                                0
                              ).toLocaleString()}`}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {titanicData.length === 0 &&
          movieData.length === 0 &&
          carData.length === 0 && (
            <Card className='border-gray-200 shadow-sm'>
              <CardContent className='py-16'>
                <div className='text-center max-w-md mx-auto'>
                  <div className='p-4 bg-black rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                    <Activity className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>
                    No Predictions Yet
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Start making predictions to see your dashboard come to life
                    with insights and analytics.
                  </p>
                  <Button className='bg-black text-white hover:bg-gray-800'>
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
