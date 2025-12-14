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
  Brain,
  User,
  Ship,
  Target,
  BarChart3,
  Mail,
  Zap,
  Sparkles,
  Shield,
  Calculator,
  TrendingUp,
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

export default function TitanicNaiveBayesPage() {
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
  const [probabilityBreakdown, setProbabilityBreakdown] = useState<{
    survivalProb: number;
    nonSurvivalProb: number;
    features: Array<{ name: string; survivalImpact: string; value: string }>;
  } | null>(null);

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
      setProbabilityBreakdown(null);
      setFormData(data);

      // Add email from session to the request data
      const requestData = {
        ...data,
        email: userEmail,
      };

      const startTime = performance.now();

      const response = await fetch(
        'https://fast-api-model-backend.onrender.com/titanic/naive-bayse-predict',
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

      // Calculate probability breakdown based on Naive Bayes principles
      calculateProbabilityBreakdown(data, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProbabilityBreakdown = (
    data: TitanicPredictionInput,
    result: TitanicPredictionResponse
  ) => {
    // Naive Bayes probability calculations based on feature values
    const features = [
      {
        name: 'Gender',
        survivalImpact: data.sex === 'female' ? 'High (+)' : 'Low (-)',
        value: data.sex,
      },
      {
        name: 'Class',
        survivalImpact:
          data.pclass === 1
            ? 'High (+)'
            : data.pclass === 2
            ? 'Medium'
            : 'Low (-)',
        value: `Class ${data.pclass}`,
      },
      {
        name: 'Age',
        survivalImpact:
          data.age < 18 ? 'High (+)' : data.age > 60 ? 'Medium' : 'Neutral',
        value: `${data.age} years`,
      },
      {
        name: 'Family Size',
        survivalImpact: data.sibsp + data.parch > 0 ? 'Medium (+)' : 'Neutral',
        value: `${data.sibsp + data.parch} members`,
      },
      {
        name: 'Fare',
        survivalImpact:
          data.fare > 50 ? 'High (+)' : data.fare > 20 ? 'Medium' : 'Low',
        value: `$${data.fare.toFixed(2)}`,
      },
    ];

    setProbabilityBreakdown({
      survivalProb:
        result.prediction === 1 ? result.confidence : 1 - result.confidence,
      nonSurvivalProb:
        result.prediction === 0 ? result.confidence : 1 - result.confidence,
      features,
    });
  };

  const getSurvivalStatus = (prediction: number | null) => {
    if (prediction === null) return null;

    return prediction === 1
      ? {
          label: 'SURVIVED',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: CheckCircle,
          description:
            'The Naive Bayes model predicts this passenger survived.',
          badgeColor:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        }
      : {
          label: 'DID NOT SURVIVE',
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: AlertCircle,
          description:
            'The Naive Bayes model predicts this passenger did not survive.',
          badgeColor:
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
  };

  const survivalStatus = getSurvivalStatus(prediction);

  // Function to get confidence level description
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.95)
      return {
        level: 'Extremely High',
        color: 'text-green-700',
        bg: 'bg-green-100 dark:bg-green-900',
      };
    if (confidence >= 0.85)
      return {
        level: 'Very High',
        color: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-800',
      };
    if (confidence >= 0.75)
      return {
        level: 'High',
        color: 'text-green-500',
        bg: 'bg-green-50/50 dark:bg-green-800/50',
      };
    if (confidence >= 0.6)
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900',
      };
    if (confidence >= 0.4)
      return {
        level: 'Low',
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-900',
      };
    return {
      level: 'Very Low',
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900',
    };
  };

  const confidenceLevel = confidence ? getConfidenceLevel(confidence) : null;

  return (
    <Layout>
      <main className='min-h-screen bg-gradient-to-b from-background to-secondary/5'>
        {/* Header */}
        <div className='border-b border-border '>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col md:flex-row md:items-center gap-6'>
              <div className='p-4 bg-black rounded-xl shadow-lg'>
                <Brain className='h-12 w-12 text-white' />
              </div>
              <div className='flex-1'>
                <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
                  Titanic Naive Bayes Prediction
                </h1>
                <p className='text-muted-foreground text-lg'>
                  Predict passenger survival using probabilistic Naive Bayes
                  algorithm
                </p>
              </div>
              <div className='hidden md:block'>
                <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50'>
                  <Calculator className='h-5 w-5 text-black' />
                  <span className='text-sm font-medium text-black dark:text-blue-300'>
                    Probabilistic Model
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
              <Card className='border border-border  overflow-hidden'>
                <div className=' border-b border-border p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2  rounded-lg'>
                      <Target className='h-6 w-6 text-black' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Passenger Details
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Enter passenger information for Naive Bayes probability
                        calculation
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className='pt-6'>
                  {userEmail && (
                    <div className='mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full'>
                          <Mail className='h-4 w-4 text-black' />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-black dark:text-blue-300'>
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
                          })}
                          className='bg-background border-border focus:border-black'
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
                          <SelectTrigger className='bg-background border-border focus:border-black'>
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
                        <p className='text-xs text-black dark:text-blue-400'>
                          Class is a strong predictor in Naive Bayes
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
                        className='bg-background border-border focus:border-black'
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
                          <SelectTrigger className='bg-background border-border focus:border-black'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-black dark:text-blue-400'>
                          Most important feature for Naive Bayes prediction
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
                          })}
                          className='bg-background border-border focus:border-black'
                        />
                        {errors.age && (
                          <span className='text-xs text-destructive'>
                            {errors.age.message}
                          </span>
                        )}
                        <p className='text-xs text-black dark:text-blue-400'>
                          Age groups have different survival probabilities
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
                          })}
                          className='bg-background border-border focus:border-black'
                        />
                        {errors.sibsp && (
                          <span className='text-xs text-destructive'>
                            {errors.sibsp.message}
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          Conditional probability factor
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
                          })}
                          className='bg-background border-border focus:border-black'
                        />
                        {errors.parch && (
                          <span className='text-xs text-destructive'>
                            {errors.parch.message}
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          Affects family survival probability
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
                          className='bg-background border-border focus:border-black'
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
                          })}
                          className='bg-background border-border focus:border-black'
                        />
                        {errors.fare && (
                          <span className='text-xs text-destructive'>
                            {errors.fare.message}
                          </span>
                        )}
                        <p className='text-xs text-black dark:text-blue-400'>
                          Fare correlates with class and survival probability
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
                          className='bg-background border-border focus:border-black'
                        />
                        <p className='text-xs text-muted-foreground'>
                          Optional - used for conditional probability if
                          available
                        </p>
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='embarked'>Embarkation Port</Label>
                        <Select
                          onValueChange={(value) => setValue('embarked', value)}
                          defaultValue='S'
                        >
                          <SelectTrigger className='bg-background border-border focus:border-black'>
                            <SelectValue placeholder='Select port' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='C'>Cherbourg (C)</SelectItem>
                            <SelectItem value='Q'>Queenstown (Q)</SelectItem>
                            <SelectItem value='S'>Southampton (S)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-muted-foreground'>
                          Port-specific survival rates
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className='pt-4'>
                      <Button
                        type='submit'
                        disabled={isSubmitting || loading || !userEmail}
                        className='w-full bg-black text-white font-medium h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300'
                      >
                        {loading ? (
                          <span className='flex items-center justify-center gap-3'>
                            <div className='animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent'></div>
                            <span>Calculating Probabilities...</span>
                          </span>
                        ) : (
                          <span className='flex items-center justify-center gap-3'>
                            <Brain className='h-5 w-5' />
                            <span>Predict with Naive Bayes</span>
                            <Zap className='h-4 w-4' />
                          </span>
                        )}
                      </Button>

                      {!userEmail && (
                        <div className='mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
                          <p className='text-sm text-destructive text-center'>
                            Please log in to use the Naive Bayes prediction
                            service.
                          </p>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className='lg:col-span-1 space-y-6'>
              {/* Error Card */}
              {error && (
                <Card className='border border-destructive '>
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
                <Card className='border border-border  sticky top-8 overflow-hidden'>
                  <div className=' border-b border-border p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg'>
                          <Brain className='h-6 w-6 text-black' />
                        </div>
                        <div>
                          <h2 className='text-lg font-bold text-foreground'>
                            NB Prediction Result
                          </h2>
                          <p className='text-sm text-muted-foreground'>
                            Naive Bayes Model
                          </p>
                        </div>
                      </div>
                      {predictionTime && (
                        <div className='text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-black dark:text-blue-300 px-2 py-1 rounded'>
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
                          Passenger Summary
                        </p>
                      </div>
                      <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4'>
                        <p className='font-bold text-foreground text-lg line-clamp-2'>
                          {formData.name}
                        </p>
                        <div className='flex flex-wrap gap-2 mt-3'>
                          <span className='px-2 py-1 bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-black dark:text-blue-300 text-xs rounded-full'>
                            ID: {formData.passenger_id}
                          </span>
                          <span className='px-2 py-1 bg-secondary text-foreground text-xs rounded-full'>
                            Class {formData.pclass}
                          </span>
                          <span className='px-2 py-1 bg-secondary text-foreground text-xs rounded-full capitalize'>
                            {formData.sex}
                          </span>
                          <span className='px-2 py-1 bg-secondary text-foreground text-xs rounded-full'>
                            {formData.age} yrs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Survival Prediction */}
                    <div
                      className={`rounded-xl p-5 ${survivalStatus?.bgColor} ${survivalStatus?.borderColor} border `}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                            Bayesian Prediction
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

                      {/* Confidence Section */}
                      <div className='space-y-4 pt-4 border-t border-border/50'>
                        <div>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm text-muted-foreground'>
                              Posterior Probability
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='font-bold text-black dark:text-blue-400 text-xl'>
                                {(confidence * 100).toFixed(1)}%
                              </span>
                              {confidenceLevel && (
                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full ${confidenceLevel.bg} ${confidenceLevel.color}`}
                                >
                                  {confidenceLevel.level}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='w-full bg-secondary/50 rounded-full h-3 overflow-hidden'>
                            <div
                              className='bg-black h-full rounded-full transition-all duration-700'
                              style={{ width: `${confidence * 100}%` }}
                            ></div>
                          </div>
                          <p className='text-xs text-muted-foreground mt-2'>
                            Calculated using Bayes' theorem with feature
                            likelihoods
                          </p>
                        </div>

                        {/* Probability Distribution */}
                        {probabilityBreakdown && (
                          <div className='grid grid-cols-2 gap-3'>
                            <div className='text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg border border-green-200 dark:border-green-800'>
                              <p className='text-xs text-muted-foreground mb-1'>
                                P(Survive)
                              </p>
                              <p className='text-xl font-bold text-green-600'>
                                {(
                                  probabilityBreakdown.survivalProb * 100
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                            <div className='text-center p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-lg border border-red-200 dark:border-red-800'>
                              <p className='text-xs text-muted-foreground mb-1'>
                                P(Not Survive)
                              </p>
                              <p className='text-xl font-bold text-red-600'>
                                {(
                                  probabilityBreakdown.nonSurvivalProb * 100
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3 pt-4 border-t border-border'>
                      <Button
                        onClick={() => {
                          reset();
                          setPrediction(null);
                          setConfidence(null);
                          setFormData(null);
                          setError(null);
                          setPredictionTime(null);
                          setProbabilityBreakdown(null);
                        }}
                        variant='outline'
                        className='flex-1'
                      >
                        New Passenger
                      </Button>
                      <Button
                        onClick={() => {
                          if (formData) {
                            onSubmit(formData);
                          }
                        }}
                        variant='secondary'
                        className='flex-1 bg-black'
                      >
                        Re-calculate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Initial State Card */}
              {prediction === null && !error && (
                <Card className='border border-border  sticky top-8 overflow-hidden'>
                  <div className=' border-b border-border p-6'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg'>
                        <Brain className='h-6 w-6 text-black' />
                      </div>
                      <div>
                        <h2 className='text-lg font-bold text-foreground'>
                          Naive Bayes Prediction
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                          Ready for probability calculation
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col items-center text-center space-y-6'>
                      <div>
                        <h3 className='font-bold text-foreground text-lg mb-3'>
                          Ready for Bayesian Analysis
                        </h3>
                        <p className='text-sm text-muted-foreground mb-6'>
                          Fill in passenger details and run the Naive Bayes
                          algorithm for a probability-based survival prediction.
                        </p>
                        <div className='space-y-4 text-left'>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mt-0.5'>
                              <Calculator className='h-4 w-4 text-black' />
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                Bayesian Probability
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Calculates P(Survive | Features) using Bayes'
                                theorem
                              </p>
                            </div>
                          </div>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mt-0.5'>
                              <Shield className='h-4 w-4 text-purple-600' />
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                Feature Independence
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Assumes features contribute independently to
                                probability
                              </p>
                            </div>
                          </div>
                          <div className='flex items-start gap-3'>
                            <div className='p-1.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mt-0.5'>
                              <Mail className='h-4 w-4 text-black' />
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
