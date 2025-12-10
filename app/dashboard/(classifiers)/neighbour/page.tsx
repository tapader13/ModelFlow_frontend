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
  Users,
  User,
  Ship,
  Target,
  BarChart3,
  Mail,
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

export default function TitanicKnnPredictionPage() {
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
      setFormData(data);

      // Add email from session to the request data
      const requestData = {
        ...data,
        email: userEmail,
      };

      const response = await fetch(
        'https://fast-api-model-backend.onrender.com/titanic/neighbour-predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to get prediction (${response.status})`
        );
      }

      const result: TitanicPredictionResponse = await response.json();
      setPrediction(result.prediction);
      setConfidence(result.confidence);
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
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: CheckCircle,
          description:
            'The passenger is predicted to have survived the Titanic disaster.',
        }
      : {
          label: 'DID NOT SURVIVE',
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: AlertCircle,
          description:
            'The passenger is predicted to have not survived the Titanic disaster.',
        };
  };

  const survivalStatus = getSurvivalStatus(prediction);

  // Function to get confidence level description
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: 'High', color: 'text-green-600' };
    if (confidence >= 0.6) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  const confidenceLevel = confidence ? getConfidenceLevel(confidence) : null;

  return (
    <Layout>
      <main className='min-h-screen bg-gradient-to-b from-background to-secondary/10'>
        {/* Header */}
        <div className='border-b border-border bg-card'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-primary/10 rounded-lg'>
                <Users className='h-8 w-8 text-primary' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-foreground mb-2'>
                  Titanic KNN Survival Prediction
                </h1>
                <p className='text-muted-foreground'>
                  Predict passenger survival using K-Nearest Neighbors algorithm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Form Section */}
            <div className='lg:col-span-2'>
              <Card className='border border-border shadow-lg'>
                <CardHeader className='border-b border-border bg-gradient-to-r from-secondary/30 to-primary/5'>
                  <div className='flex items-center gap-3'>
                    <Target className='h-6 w-6 text-primary' />
                    <div>
                      <CardTitle className='text-xl'>
                        Passenger Details
                      </CardTitle>
                      <CardDescription>
                        Enter passenger information for KNN-based survival
                        prediction
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-6'>
                  {userEmail && (
                    <div className='mb-6 p-3 bg-secondary/30 rounded-lg border border-border'>
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                        <p className='text-sm'>
                          <span className='text-muted-foreground'>
                            Using email from session:
                          </span>{' '}
                          <span className='font-medium text-foreground'>
                            {userEmail}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Passenger ID and Class */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <Label htmlFor='passenger_id'>Passenger ID</Label>
                          <span className='text-xs text-muted-foreground'>
                            (Required)
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
                          className='bg-background'
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
                          <SelectTrigger className='bg-background'>
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
                          <SelectTrigger className='bg-background'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                          </SelectContent>
                        </Select>
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
                        />
                        {errors.age && (
                          <span className='text-xs text-destructive'>
                            {errors.age.message}
                          </span>
                        )}
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
                        />
                        {errors.sibsp && (
                          <span className='text-xs text-destructive'>
                            {errors.sibsp.message}
                          </span>
                        )}
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
                        />
                        {errors.parch && (
                          <span className='text-xs text-destructive'>
                            {errors.parch.message}
                          </span>
                        )}
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
                        />
                        {errors.fare && (
                          <span className='text-xs text-destructive'>
                            {errors.fare.message}
                          </span>
                        )}
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
                        />
                      </div>
                      <div className='space-y-3'>
                        <Label htmlFor='embarked'>Embarkation Port</Label>
                        <Select
                          onValueChange={(value) => setValue('embarked', value)}
                          defaultValue='S'
                        >
                          <SelectTrigger className='bg-background'>
                            <SelectValue placeholder='Select port' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='C'>Cherbourg (C)</SelectItem>
                            <SelectItem value='Q'>Queenstown (Q)</SelectItem>
                            <SelectItem value='S'>Southampton (S)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type='submit'
                      disabled={isSubmitting || loading || !userEmail}
                      className='w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium h-12 text-base'
                    >
                      {loading ? (
                        <span className='flex items-center gap-2'>
                          <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent'></div>
                          Predicting with KNN...
                        </span>
                      ) : (
                        'Predict Survival with KNN'
                      )}
                    </Button>

                    {!userEmail && (
                      <p className='text-sm text-destructive text-center'>
                        Please log in to use the prediction service.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Model Information */}
              <Card className='mt-6 border border-border'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    About K-Nearest Neighbors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 text-sm text-muted-foreground'>
                    <p>
                      The K-Nearest Neighbors (KNN) algorithm predicts survival
                      based on similarities to other passengers in the dataset.
                    </p>
                    <ul className='list-disc pl-5 space-y-1'>
                      <li>Finds the most similar historical passengers</li>
                      <li>
                        Considers features like age, class, gender, and fare
                      </li>
                      <li>
                        Predicts based on majority vote of nearest neighbors
                      </li>
                      <li>Confidence score reflects prediction certainty</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className='lg:col-span-1 space-y-6'>
              {/* Error Card */}
              {error && (
                <Card className='border border-destructive shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-destructive'>
                      <AlertCircle className='h-5 w-5' />
                      Prediction Error
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>{error}</p>
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
                <Card className='border border-border shadow-lg sticky top-8'>
                  <CardHeader className='border-b border-border bg-gradient-to-r from-secondary/30 to-primary/5'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <CheckCircle className='h-5 w-5 text-primary' />
                      KNN Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-6'>
                    {/* Passenger Summary */}
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4 text-muted-foreground' />
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Passenger Summary
                        </p>
                      </div>
                      <div className='bg-secondary/20 rounded-lg p-3'>
                        <p className='font-semibold text-foreground line-clamp-2'>
                          {formData.name}
                        </p>
                        <div className='flex flex-wrap gap-2 mt-2 text-xs'>
                          <span className='bg-secondary px-2 py-1 rounded'>
                            ID: {formData.passenger_id}
                          </span>
                          <span className='bg-secondary px-2 py-1 rounded'>
                            Class {formData.pclass}
                          </span>
                          <span className='bg-secondary px-2 py-1 rounded capitalize'>
                            {formData.sex}
                          </span>
                          <span className='bg-secondary px-2 py-1 rounded'>
                            {formData.age} yrs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Survival Prediction */}
                    <div
                      className={`rounded-lg p-5 ${survivalStatus?.bgColor} ${survivalStatus?.borderColor} border`}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                            KNN Prediction
                          </p>
                          <div className='flex items-center gap-3'>
                            {survivalStatus && (
                              <>
                                <div className='p-2 bg-white dark:bg-black rounded-lg'>
                                  <survivalStatus.icon
                                    className={`h-8 w-8 ${survivalStatus.color}`}
                                  />
                                </div>
                                <div>
                                  <p
                                    className={`text-2xl font-bold ${survivalStatus.color}`}
                                  >
                                    {survivalStatus.label}
                                  </p>
                                  <p className='text-sm text-muted-foreground mt-1'>
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
                              Model Confidence
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-primary text-lg'>
                                {(confidence * 100).toFixed(1)}%
                              </span>
                              {confidenceLevel && (
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${confidenceLevel.color} bg-white/50 dark:bg-black/50`}
                                >
                                  {confidenceLevel.level} Confidence
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='w-full bg-secondary/50 rounded-full h-3 overflow-hidden'>
                            <div
                              className='bg-gradient-to-r from-primary via-primary/80 to-accent h-full rounded-full transition-all duration-500'
                              style={{ width: `${confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 text-sm'>
                          <div className='text-center p-2 bg-white/50 dark:bg-black/50 rounded'>
                            <p className='text-muted-foreground'>
                              Probability of Survival
                            </p>
                            <p className='font-bold text-green-600'>
                              {prediction === 1
                                ? (confidence * 100).toFixed(1)
                                : (100 - confidence * 100).toFixed(1)}
                              %
                            </p>
                          </div>
                          <div className='text-center p-2 bg-white/50 dark:bg-black/50 rounded'>
                            <p className='text-muted-foreground'>
                              Probability of Not Surviving
                            </p>
                            <p className='font-bold text-red-600'>
                              {prediction === 0
                                ? (confidence * 100).toFixed(1)
                                : (100 - confidence * 100).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='bg-secondary/20 rounded p-3'>
                        <p className='text-xs text-muted-foreground'>
                          Fare Paid
                        </p>
                        <p className='font-bold'>${formData.fare.toFixed(2)}</p>
                      </div>
                      <div className='bg-secondary/20 rounded p-3'>
                        <p className='text-xs text-muted-foreground'>
                          Family Size
                        </p>
                        <p className='font-bold'>
                          {formData.sibsp + formData.parch}
                        </p>
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
                        className='flex-1'
                      >
                        Re-predict
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Initial State Card */}
              {prediction === null && !error && (
                <Card className='border border-border shadow-sm sticky top-8'>
                  <CardHeader className='border-b border-border bg-gradient-to-r from-secondary/30 to-primary/5'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Users className='h-5 w-5 text-primary' />
                      KNN Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col items-center text-center space-y-6'>
                      <div className='relative'>
                        <div className='p-4 bg-primary/10 rounded-full'>
                          <Target className='h-12 w-12 text-primary' />
                        </div>
                      </div>
                      <div>
                        <h3 className='font-semibold text-foreground mb-3'>
                          Ready for Prediction
                        </h3>
                        <p className='text-sm text-muted-foreground mb-4'>
                          Fill in passenger details and click "Predict Survival
                          with KNN" to see the K-Nearest Neighbors algorithm
                          prediction.
                        </p>
                        <div className='text-xs text-muted-foreground text-left space-y-3'>
                          <div className='flex items-start gap-2'>
                            <div className='p-1 bg-primary/10 rounded mt-0.5'>
                              <Ship className='h-3 w-3 text-primary' />
                            </div>
                            <p>
                              KNN finds similar passengers to make predictions
                            </p>
                          </div>
                          <div className='flex items-start gap-2'>
                            <div className='p-1 bg-primary/10 rounded mt-0.5'>
                              <BarChart3 className='h-3 w-3 text-primary' />
                            </div>
                            <p>Confidence score shows prediction reliability</p>
                          </div>
                          <div className='flex items-start gap-2'>
                            <div className='p-1 bg-primary/10 rounded mt-0.5'>
                              <Mail className='h-3 w-3 text-primary' />
                            </div>
                            <p>
                              Your session email will be automatically included
                            </p>
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
