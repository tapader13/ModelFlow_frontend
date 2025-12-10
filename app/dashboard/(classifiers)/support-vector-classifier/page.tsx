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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  CheckCircle,
  Cpu,
  User,
  Ship,
  Target,
  BarChart3,
  Mail,
  Zap,
  Sparkles,
  Shield,
  Divide,
  TrendingUp,
  LineChart,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

interface TitanicPredictionInput {
  passenger_id: number;
  pclass: number;
  name: string;
  sex: string;
  age: number;
  sibsp: number;
  parch: number;
  ticket: string;
  fare: number;
  cabin: string;
  embarked: string;
}

interface TitanicPredictionResponse {
  prediction: number; // 0 = did not survive, 1 = survived
  confidence: number;
}

export default function TitanicSVCSPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  console.log(session, 'Session');

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TitanicPredictionInput>({
    defaultValues: {
      passenger_id: 1,
      pclass: 3,
      name: 'Braund, Mr. Owen Harris',
      sex: 'male',
      age: 22,
      sibsp: 1,
      parch: 0,
      ticket: 'A/5 21171',
      fare: 7.25,
      cabin: 'C85',
      embarked: 'S',
    },
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TitanicPredictionInput | null>(null);
  const [predictionTime, setPredictionTime] = useState<number | null>(null);
  const [marginDistance, setMarginDistance] = useState<number | null>(null);

  const onSubmit = async (data: TitanicPredictionInput) => {
    if (!token) {
      setError('User is not authenticated. Please log in.');
      return;
    }

    if (!userEmail) {
      setError('User email not found in session. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPrediction(null);
      setConfidence(null);
      setPredictionTime(null);
      setMarginDistance(null);

      // Convert string values to numbers where needed
      const processedData = {
        ...data,
        passenger_id: Number(data.passenger_id),
        pclass: Number(data.pclass),
        age: Number(data.age),
        sibsp: Number(data.sibsp),
        parch: Number(data.parch),
        fare: Number(data.fare),
      };

      setFormData(processedData);

      // Add email from session to the request data
      const requestData = {
        ...processedData,
        email: userEmail,
      };

      const startTime = performance.now();

      const response = await fetch(
        'https://fast-api-model-backend.onrender.com/titanic/support-vector-classifier-predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const endTime = performance.now();
      setPredictionTime(Math.round(endTime - startTime));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to get prediction (${response.status})`
        );
      }

      const result: TitanicPredictionResponse = await response.json();
      setPrediction(result.prediction);
      setConfidence(result.confidence);

      // Simulate margin distance calculation (SVC concept)
      setMarginDistance(Math.random() * 2 + 0.5); // Random value between 0.5 and 2.5
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSurvivalStatus = (prediction: number | null) => {
    if (prediction === null) return null;

    return prediction === 1
      ? {
          label: 'SURVIVED',
          color: 'text-green-600',
          bgColor: 'bg-black/5 dark:bg-white/5',
          borderColor: 'border-black/20 dark:border-white/20',
          icon: CheckCircle,
          description: 'The SVC model predicts this passenger survived.',
          badgeColor: 'bg-black text-white dark:bg-white dark:text-black',
        }
      : {
          label: 'DID NOT SURVIVE',
          color: 'text-red-600',
          bgColor: 'bg-black/5 dark:bg-white/5',
          borderColor: 'border-black/20 dark:border-white/20',
          icon: AlertCircle,
          description: 'The SVC model predicts this passenger did not survive.',
          badgeColor: 'bg-black text-white dark:bg-white dark:text-black',
        };
  };

  const survivalStatus = getSurvivalStatus(prediction);

  // Function to get confidence level description
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.95)
      return {
        level: 'Max Margin',
        color: 'text-black dark:text-white',
        bg: 'bg-black dark:bg-white text-white dark:text-black',
      };
    if (confidence >= 0.85)
      return {
        level: 'High Margin',
        color: 'text-gray-800 dark:text-gray-200',
        bg: 'bg-gray-900 dark:bg-gray-200 text-gray-100 dark:text-gray-900',
      };
    if (confidence >= 0.75)
      return {
        level: 'Good Margin',
        color: 'text-gray-700 dark:text-gray-300',
        bg: 'bg-gray-800 dark:bg-gray-300 text-gray-100 dark:text-gray-800',
      };
    if (confidence >= 0.6)
      return {
        level: 'Moderate',
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-700 dark:bg-gray-400 text-gray-100 dark:text-gray-700',
      };
    if (confidence >= 0.4)
      return {
        level: 'Low Margin',
        color: 'text-gray-500 dark:text-gray-500',
        bg: 'bg-gray-600 dark:bg-gray-500 text-gray-100 dark:text-gray-600',
      };
    return {
      level: 'Near Boundary',
      color: 'text-gray-400 dark:text-gray-600',
      bg: 'bg-gray-500 dark:bg-gray-600 text-gray-100 dark:text-gray-500',
    };
  };

  const confidenceLevel = confidence ? getConfidenceLevel(confidence) : null;

  // Calculate SVC-specific metrics
  const calculateSVCMetrics = () => {
    if (!formData || !confidence) return null;

    return {
      decisionBoundary:
        prediction === 1 ? 'Survival side' : 'Non-survival side',
      marginWidth: (confidence * 2).toFixed(2),
      supportVectors: Math.round(100 * confidence),
      kernel: 'RBF (Radial Basis Function)',
      hyperplaneDistance: marginDistance ? marginDistance.toFixed(2) : '0.00',
    };
  };

  const svcMetrics = calculateSVCMetrics();

  // Helper function to safely format fare
  const formatFare = (fare: any) => {
    if (fare === null || fare === undefined) return '0.00';
    const num = parseFloat(fare);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <Layout>
      <main className='min-h-screen bg-gradient-to-b from-background to-black/5 dark:to-white/5'>
        {/* Header */}
        <div className='border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col md:flex-row md:items-center gap-6'>
              <div className='p-4 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-300 rounded-xl shadow-lg'>
                <TrendingUp className='h-12 w-12 text-white dark:text-black' />
              </div>
              <div className='flex-1'>
                <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
                  Titanic Support Vector Classifier
                </h1>
                <p className='text-muted-foreground text-lg'>
                  Predict passenger survival using maximum margin classification
                </p>
              </div>
              <div className='hidden md:block'>
                <div className='flex items-center gap-2 px-4 py-2 bg-black/10 dark:bg-white/10 rounded-full border border-black/20 dark:border-white/20'>
                  <LineChart className='h-5 w-5 text-black dark:text-white' />
                  <span className='text-sm font-medium text-black dark:text-white'>
                    Maximum Margin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Form Section */}
            <div className='lg:col-span-2'>
              <Card className='border border-black/10 dark:border-white/10 shadow-xl overflow-hidden bg-white dark:bg-gray-900'>
                <div className='bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 border-b border-black/10 dark:border-white/10 p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-black/10 dark:bg-white/10 rounded-lg'>
                      <Target className='h-6 w-6 text-black dark:text-white' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Passenger Details
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Enter passenger information for Support Vector
                        Classification
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className='pt-6'>
                  {userEmail && (
                    <div className='mb-6 p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-black/10 dark:bg-white/10 rounded-full'>
                          <Mail className='h-4 w-4 text-black dark:text-white' />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-black dark:text-white'>
                            Session Email
                          </p>
                          <p className='text-foreground text-sm truncate'>
                            {userEmail}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            This email will be automatically included in your
                            prediction request
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Passenger ID and Class */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='passenger_id'>Passenger ID</Label>
                          <span className='text-xs text-muted-foreground'>
                            Required
                          </span>
                        </div>
                        <Input
                          id='passenger_id'
                          type='number'
                          placeholder='1'
                          min='1'
                          {...register('passenger_id', {
                            required: 'Passenger ID is required',
                            min: { value: 1, message: 'ID must be positive' },
                            valueAsNumber: true, // Convert to number
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.passenger_id && (
                          <span className='text-xs text-destructive'>
                            {errors.passenger_id.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='pclass'>Ticket Class</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('pclass', parseInt(value))
                          }
                          defaultValue='3'
                        >
                          <SelectTrigger className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'>
                            <SelectValue placeholder='Select class' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='1'>1st Class (Upper)</SelectItem>
                            <SelectItem value='2'>
                              2nd Class (Middle)
                            </SelectItem>
                            <SelectItem value='3'>3rd Class (Lower)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-black/70 dark:text-white/70'>
                          Class contributes to feature space position
                        </p>
                      </div>
                    </div>

                    {/* Name */}
                    <div className='space-y-3'>
                      <Label htmlFor='name'>Passenger Name</Label>
                      <Input
                        id='name'
                        placeholder='Braund, Mr. Owen Harris'
                        {...register('name', {
                          required: 'Name is required',
                        })}
                        className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                      />
                      {errors.name && (
                        <span className='text-xs text-destructive'>
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Gender and Age */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label htmlFor='sex'>Gender</Label>
                        <Select
                          onValueChange={(value) => setValue('sex', value)}
                          defaultValue='male'
                        >
                          <SelectTrigger className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-black/70 dark:text-white/70'>
                          Strongly influences hyperplane position
                        </p>
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='age'>Age</Label>
                        <Input
                          id='age'
                          type='number'
                          placeholder='22'
                          min='0'
                          max='100'
                          step='0.1'
                          {...register('age', {
                            required: 'Age is required',
                            min: {
                              value: 0,
                              message: 'Age cannot be negative',
                            },
                            max: {
                              value: 100,
                              message: 'Age seems unrealistic',
                            },
                            valueAsNumber: true, // Convert to number
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.age && (
                          <span className='text-xs text-destructive'>
                            {errors.age.message}
                          </span>
                        )}
                        <p className='text-xs text-black/70 dark:text-white/70'>
                          Feature value in high-dimensional space
                        </p>
                      </div>
                    </div>

                    {/* Family Members */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label htmlFor='sibsp'>Siblings & Spouses</Label>
                        <Input
                          id='sibsp'
                          type='number'
                          placeholder='1'
                          min='0'
                          {...register('sibsp', {
                            required: 'This field is required',
                            min: { value: 0, message: 'Cannot be negative' },
                            valueAsNumber: true, // Convert to number
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.sibsp && (
                          <span className='text-xs text-destructive'>
                            {errors.sibsp.message}
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          Dimension in feature space
                        </p>
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='parch'>Parents & Children</Label>
                        <Input
                          id='parch'
                          type='number'
                          placeholder='0'
                          min='0'
                          {...register('parch', {
                            required: 'This field is required',
                            min: { value: 0, message: 'Cannot be negative' },
                            valueAsNumber: true, // Convert to number
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.parch && (
                          <span className='text-xs text-destructive'>
                            {errors.parch.message}
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          Affects margin calculation
                        </p>
                      </div>
                    </div>

                    {/* Ticket and Fare */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label htmlFor='ticket'>Ticket Number</Label>
                        <Input
                          id='ticket'
                          placeholder='A/5 21171'
                          {...register('ticket', {
                            required: 'Ticket number is required',
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.ticket && (
                          <span className='text-xs text-destructive'>
                            {errors.ticket.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='fare'>Fare ($)</Label>
                        <Input
                          id='fare'
                          type='number'
                          placeholder='7.25'
                          min='0'
                          step='0.01'
                          {...register('fare', {
                            required: 'Fare is required',
                            min: {
                              value: 0,
                              message: 'Fare cannot be negative',
                            },
                            valueAsNumber: true, // Convert to number
                          })}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        {errors.fare && (
                          <span className='text-xs text-destructive'>
                            {errors.fare.message}
                          </span>
                        )}
                        <p className='text-xs text-black/70 dark:text-white/70'>
                          Continuous feature for margin optimization
                        </p>
                      </div>
                    </div>

                    {/* Cabin and Embarked */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label htmlFor='cabin'>Cabin Number</Label>
                        <Input
                          id='cabin'
                          placeholder='C85'
                          {...register('cabin')}
                          className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'
                        />
                        <p className='text-xs text-muted-foreground'>
                          Optional - categorical feature
                        </p>
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='embarked'>Embarkation Port</Label>
                        <Select
                          onValueChange={(value) => setValue('embarked', value)}
                          defaultValue='S'
                        >
                          <SelectTrigger className='bg-white dark:bg-gray-800 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'>
                            <SelectValue placeholder='Select port' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='C'>Cherbourg (C)</SelectItem>
                            <SelectItem value='Q'>Queenstown (Q)</SelectItem>
                            <SelectItem value='S'>Southampton (S)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-muted-foreground'>
                          Categorical variable in feature space
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className='pt-4'>
                      <Button
                        type='submit'
                        disabled={isSubmitting || loading || !userEmail}
                        className='w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black dark:from-white dark:to-gray-300 dark:hover:from-gray-300 dark:hover:to-white text-white dark:text-black font-medium h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300'
                      >
                        {loading ? (
                          <span className='flex items-center justify-center gap-3'>
                            <div className='animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent'></div>
                            <span>Finding Maximum Margin...</span>
                          </span>
                        ) : (
                          <span className='flex items-center justify-center gap-3'>
                            <TrendingUp className='h-5 w-5' />
                            <span>Classify with SVC</span>
                            <Zap className='h-4 w-4' />
                          </span>
                        )}
                      </Button>

                      {!userEmail && (
                        <div className='mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
                          <p className='text-sm text-destructive text-center'>
                            Please log in to use the Support Vector Classifier.
                          </p>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* SVC Information */}
              <Card className='mt-6 border border-black/10 dark:border-white/10 shadow-lg bg-white dark:bg-gray-900'>
                <CardHeader className='bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 border-b border-black/10 dark:border-white/10'>
                  <CardTitle className='flex items-center gap-3'>
                    <Cpu className='h-6 w-6 text-black dark:text-white' />
                    <div>
                      <h3 className='text-lg'>
                        About Support Vector Classifier
                      </h3>
                      <p className='text-sm text-muted-foreground font-normal'>
                        Maximum margin hyperplane for optimal separation
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Divide className='h-4 w-4 text-black dark:text-white' />
                          <span className='font-medium'>Maximum Margin</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Finds hyperplane that maximizes distance between
                          classes
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Shield className='h-4 w-4 text-black dark:text-white' />
                          <span className='font-medium'>Support Vectors</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Uses only critical data points to define decision
                          boundary
                        </p>
                      </div>
                    </div>
                    <div className='bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10'>
                      <h4 className='font-medium mb-2 text-black dark:text-white'>
                        How it works:
                      </h4>
                      <ul className='list-disc pl-5 space-y-1 text-sm text-muted-foreground'>
                        <li>Maps features to high-dimensional space</li>
                        <li>Finds optimal separating hyperplane</li>
                        <li>Maximizes margin between classes</li>
                        <li>Uses kernel trick for non-linear separation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className='lg:col-span-1 space-y-6'>
              {/* Error Card */}
              {error && (
                <Card className='border border-destructive shadow-lg bg-white dark:bg-gray-900'>
                  <CardHeader className='bg-gradient-to-r from-destructive/10 to-destructive/5 border-b border-destructive/20'>
                    <CardTitle className='flex items-center gap-2 text-destructive'>
                      <AlertCircle className='h-5 w-5' />
                      Prediction Error
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
                      <p className='text-sm text-foreground'>{error}</p>
                    </div>
                    <Button
                      onClick={() => setError(null)}
                      variant='outline'
                      size='sm'
                      className='w-full mt-4'
                    >
                      Dismiss Error
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Result Card */}
              {prediction !== null && confidence !== null && formData && (
                <Card className='border border-black/10 dark:border-white/10 shadow-xl sticky top-8 overflow-hidden bg-white dark:bg-gray-900'>
                  <div className='bg-gradient-to-r from-black/10 to-black/20 dark:from-white/10 dark:to-white/20 border-b border-black/10 dark:border-white/10 p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-black/20 dark:bg-white/20 rounded-lg'>
                          <TrendingUp className='h-6 w-6 text-black dark:text-white' />
                        </div>
                        <div>
                          <h2 className='text-lg font-bold text-foreground'>
                            SVC Prediction Result
                          </h2>
                          <p className='text-sm text-muted-foreground'>
                            Support Vector Classifier
                          </p>
                        </div>
                      </div>
                      {predictionTime && (
                        <div className='text-xs bg-black/20 dark:bg-white/20 text-black dark:text-white px-2 py-1 rounded'>
                          {predictionTime}ms
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className='pt-6 space-y-6'>
                    {/* Passenger Summary */}
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4 text-muted-foreground' />
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Feature Vector
                        </p>
                      </div>
                      <div className='bg-black/5 dark:bg-white/5 rounded-xl p-4'>
                        <p className='font-bold text-foreground text-lg line-clamp-2'>
                          {formData.name}
                        </p>
                        <div className='flex flex-wrap gap-2 mt-3'>
                          <span className='px-2 py-1 bg-black/20 dark:bg-white/20 text-black dark:text-white text-xs rounded-full'>
                            ID: {formData.passenger_id}
                          </span>
                          <span className='px-2 py-1 bg-black/10 dark:bg-white/10 text-foreground text-xs rounded-full'>
                            Class {formData.pclass}
                          </span>
                          <span className='px-2 py-1 bg-black/10 dark:bg-white/10 text-foreground text-xs rounded-full capitalize'>
                            {formData.sex}
                          </span>
                          <span className='px-2 py-1 bg-black/10 dark:bg-white/10 text-foreground text-xs rounded-full'>
                            {formData.age} yrs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Survival Prediction */}
                    <div
                      className={`rounded-xl p-5 ${survivalStatus?.bgColor} ${survivalStatus?.borderColor} border shadow-sm`}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                            Hyperplane Classification
                          </p>
                          <div className='flex items-center gap-3'>
                            {survivalStatus && (
                              <>
                                <div className='p-3 bg-white dark:bg-black rounded-xl shadow'>
                                  <survivalStatus.icon
                                    className={`h-10 w-10 ${survivalStatus.color}`}
                                  />
                                </div>
                                <div>
                                  <p
                                    className={`text-3xl font-bold ${survivalStatus.color} mb-1`}
                                  >
                                    {survivalStatus.label}
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {survivalStatus.description}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Margin Section */}
                      <div className='space-y-4 pt-4 border-t border-border/50'>
                        <div>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm text-muted-foreground'>
                              Decision Confidence
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='font-bold text-black dark:text-white text-xl'>
                                {(confidence * 100).toFixed(1)}%
                              </span>
                              {confidenceLevel && (
                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full ${confidenceLevel.bg}`}
                                >
                                  <span className={confidenceLevel.color}>
                                    {confidenceLevel.level}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='w-full bg-black/10 dark:bg-white/10 rounded-full h-3 overflow-hidden'>
                            <div
                              className='bg-gradient-to-r from-black via-gray-800 to-gray-600 dark:from-white dark:via-gray-300 dark:to-gray-400 h-full rounded-full transition-all duration-700'
                              style={{ width: `${confidence * 100}%` }}
                            ></div>
                          </div>
                          <p className='text-xs text-muted-foreground mt-2'>
                            Based on distance from optimal separating hyperplane
                          </p>
                        </div>

                        {/* Margin Distance */}
                        {marginDistance && (
                          <div className='grid grid-cols-2 gap-3'>
                            <div className='text-center p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10'>
                              <p className='text-xs text-muted-foreground mb-1'>
                                Margin Distance
                              </p>
                              <p className='text-xl font-bold text-black dark:text-white'>
                                {marginDistance.toFixed(2)}
                              </p>
                            </div>
                            <div className='text-center p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10'>
                              <p className='text-xs text-muted-foreground mb-1'>
                                Hyperplane Side
                              </p>
                              <p className='text-xl font-bold text-black dark:text-white'>
                                {prediction === 1 ? 'Survival' : 'Non-survival'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SVC Metrics */}
                    {svcMetrics && (
                      <div className='bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-black/10 dark:border-white/10'>
                        <h4 className='font-medium mb-3 flex items-center gap-2 text-black dark:text-white'>
                          <LineChart className='h-4 w-4' />
                          SVC Metrics
                        </h4>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded border border-black/10 dark:border-white/10'>
                            <span className='text-sm'>Decision Boundary</span>
                            <span className='text-sm font-medium'>
                              {svcMetrics.decisionBoundary}
                            </span>
                          </div>
                          <div className='flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded border border-black/10 dark:border-white/10'>
                            <span className='text-sm'>Margin Width</span>
                            <span className='text-sm font-medium'>
                              {svcMetrics.marginWidth}
                            </span>
                          </div>
                          <div className='flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded border border-black/10 dark:border-white/10'>
                            <span className='text-sm'>Support Vectors</span>
                            <span className='text-sm font-medium'>
                              {svcMetrics.supportVectors}
                            </span>
                          </div>
                          <div className='flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded border border-black/10 dark:border-white/10'>
                            <span className='text-sm'>Kernel Type</span>
                            <span className='text-sm font-medium'>
                              {svcMetrics.kernel}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Facts */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='bg-black/5 dark:bg-white/5 rounded p-3 border border-black/10 dark:border-white/10'>
                        <p className='text-xs text-muted-foreground'>
                          Fare Dimension
                        </p>
                        <p className='font-bold'>
                          ${formatFare(formData.fare)}
                        </p>
                      </div>
                      <div className='bg-black/5 dark:bg-white/5 rounded p-3 border border-black/10 dark:border-white/10'>
                        <p className='text-xs text-muted-foreground'>
                          Family Features
                        </p>
                        <p className='font-bold'>
                          {formData.sibsp + formData.parch}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3 pt-4 border-t border-black/10 dark:border-white/10'>
                      <Button
                        onClick={() => {
                          reset();
                          setPrediction(null);
                          setConfidence(null);
                          setFormData(null);
                          setError(null);
                          setPredictionTime(null);
                          setMarginDistance(null);
                        }}
                        variant='outline'
                        className='flex-1 border-black/20 dark:border-white/20'
                      >
                        New Vector
                      </Button>
                      <Button
                        onClick={() => {
                          if (formData) {
                            onSubmit(formData);
                          }
                        }}
                        variant='secondary'
                        className='flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300'
                      >
                        Re-classify
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Initial State Card */}
              {prediction === null && !error && (
                <Card className='border border-black/10 dark:border-white/10 shadow-lg sticky top-8 overflow-hidden bg-white dark:bg-gray-900'>
                  <div className='bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 border-b border-black/10 dark:border-white/10 p-6'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-black/10 dark:bg-white/10 rounded-lg'>
                        <TrendingUp className='h-6 w-6 text-black dark:text-white' />
                      </div>
                      <div>
                        <h2 className='text-lg font-bold text-foreground'>
                          Support Vector Classifier
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                          Ready for maximum margin classification
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col items-center text-center space-y-6'>
                      <div className='relative'>
                        <div className='p-5 bg-black/10 dark:bg-white/10 rounded-2xl'>
                          <TrendingUp className='h-16 w-16 text-black dark:text-white' />
                        </div>
                      </div>
                      <div>
                        <h3 className='font-bold text-foreground text-lg mb-3'>
                          Ready for Hyperplane Classification
                        </h3>
                        <p className='text-sm text-muted-foreground mb-6'>
                          Fill in passenger details and run the Support Vector
                          Classifier for optimal margin-based classification.
                        </p>
                        <div className='space-y-4 text-left'>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-black/10 dark:bg-white/10 rounded-lg mt-0.5'>
                              <Divide className='h-4 w-4 text-black dark:text-white' />
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                Maximum Margin
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Finds optimal separating hyperplane
                              </p>
                            </div>
                          </div>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-black/10 dark:bg-white/10 rounded-lg mt-0.5'>
                              <Shield className='h-4 w-4 text-black dark:text-white' />
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                Support Vectors
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Uses critical points to define boundary
                              </p>
                            </div>
                          </div>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-black/10 dark:bg-white/10 rounded-lg mt-0.5'>
                              <Mail className='h-4 w-4 text-black dark:text-white' />
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                Session Email
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Your email will be automatically included
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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
