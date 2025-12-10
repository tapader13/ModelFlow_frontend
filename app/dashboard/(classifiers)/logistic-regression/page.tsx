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
  BarChart3,
  User,
  Ship,
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

export default function TitanicPredictionPage() {
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
      const requestData = {
        ...data,
        email: userEmail,
      };

      const response = await fetch(
        'http://127.0.0.1:8000/titanic/logistic-predict',
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
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
        }
      : {
          label: 'DID NOT SURVIVE',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertCircle,
        };
  };

  const survivalStatus = getSurvivalStatus(prediction);

  return (
    <Layout>
      <main className='min-h-screen bg-background'>
        {/* Header */}
        <div className='border-b border-border bg-card'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
              <BarChart3 className='h-8 w-8 text-primary' />
              Titanic Survival Prediction
            </h1>
            <p className='text-muted-foreground'>
              Predict passenger survival using logistic regression model
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
                    Enter Passenger Details
                  </CardTitle>
                  <CardDescription>
                    Provide passenger information for survival prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Row 1: Passenger ID and Class */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='passenger_id'>Passenger ID *</Label>
                        <Input
                          id='passenger_id'
                          type='number'
                          placeholder='1'
                          min='1'
                          {...register('passenger_id', {
                            required: 'Passenger ID is required',
                            min: { value: 1, message: 'ID must be positive' },
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.passenger_id && (
                          <span className='text-xs text-destructive'>
                            {errors.passenger_id.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='pclass'>Ticket Class *</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('pclass', parseInt(value))
                          }
                          defaultValue='3'
                        >
                          <SelectTrigger className='bg-input text-foreground'>
                            <SelectValue placeholder='Select class' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='1'>1st Class</SelectItem>
                            <SelectItem value='2'>2nd Class</SelectItem>
                            <SelectItem value='3'>3rd Class</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.pclass && (
                          <span className='text-xs text-destructive'>
                            {errors.pclass.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Name */}
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Passenger Name *</Label>
                      <Input
                        id='name'
                        placeholder='Braund, Mr. Owen Harris'
                        {...register('name', {
                          required: 'Name is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.name && (
                        <span className='text-xs text-destructive'>
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Row 3: Gender and Age */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='sex'>Gender *</Label>
                        <Select
                          onValueChange={(value) => setValue('sex', value)}
                          defaultValue='male'
                        >
                          <SelectTrigger className='bg-input text-foreground'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.sex && (
                          <span className='text-xs text-destructive'>
                            {errors.sex.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='age'>Age *</Label>
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
                          className='bg-input text-foreground'
                        />
                        {errors.age && (
                          <span className='text-xs text-destructive'>
                            {errors.age.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Family Members */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='sibsp'>Siblings/Spouses Aboard *</Label>
                        <Input
                          id='sibsp'
                          type='number'
                          placeholder='1'
                          min='0'
                          {...register('sibsp', {
                            required: 'This field is required',
                            min: { value: 0, message: 'Cannot be negative' },
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.sibsp && (
                          <span className='text-xs text-destructive'>
                            {errors.sibsp.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='parch'>Parents/Children Aboard *</Label>
                        <Input
                          id='parch'
                          type='number'
                          placeholder='0'
                          min='0'
                          {...register('parch', {
                            required: 'This field is required',
                            min: { value: 0, message: 'Cannot be negative' },
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.parch && (
                          <span className='text-xs text-destructive'>
                            {errors.parch.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 5: Ticket and Fare */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='ticket'>Ticket Number *</Label>
                        <Input
                          id='ticket'
                          placeholder='A/5 21171'
                          {...register('ticket', {
                            required: 'Ticket number is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.ticket && (
                          <span className='text-xs text-destructive'>
                            {errors.ticket.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='fare'>Fare ($) *</Label>
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
                          className='bg-input text-foreground'
                        />
                        {errors.fare && (
                          <span className='text-xs text-destructive'>
                            {errors.fare.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 6: Cabin and Embarked */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='cabin'>Cabin</Label>
                        <Input
                          id='cabin'
                          placeholder='C85'
                          {...register('cabin')}
                          className='bg-input text-foreground'
                        />
                        {errors.cabin && (
                          <span className='text-xs text-destructive'>
                            {errors.cabin.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='embarked'>Port of Embarkation *</Label>
                        <Select
                          onValueChange={(value) => setValue('embarked', value)}
                          defaultValue='S'
                        >
                          <SelectTrigger className='bg-input text-foreground'>
                            <SelectValue placeholder='Select port' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='C'>Cherbourg (C)</SelectItem>
                            <SelectItem value='Q'>Queenstown (Q)</SelectItem>
                            <SelectItem value='S'>Southampton (S)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.embarked && (
                          <span className='text-xs text-destructive'>
                            {errors.embarked.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 7: Email */}
                    <div className='space-y-2'>
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
                    </div>

                    {/* Submit Button */}
                    <Button
                      type='submit'
                      disabled={isSubmitting || loading}
                      className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                    >
                      {isSubmitting || loading
                        ? 'Predicting...'
                        : 'Predict Survival'}
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

              {prediction !== null && confidence !== null && formData && (
                <Card className='border border-border shadow-sm sticky top-8'>
                  <CardHeader className='border-b border-border bg-secondary/30'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <BarChart3 className='h-5 w-5 text-primary' />
                      Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-6'>
                    {/* Passenger Info */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 mb-2'>
                        <User className='h-4 w-4 text-muted-foreground' />
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Passenger
                        </p>
                      </div>
                      <p className='text-lg font-semibold text-foreground line-clamp-2'>
                        {formData.name}
                      </p>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <span>ID: {formData.passenger_id}</span>
                        <span>•</span>
                        <span>Class {formData.pclass}</span>
                      </div>
                    </div>

                    {/* Survival Prediction */}
                    <div
                      className={`border rounded-lg p-4 ${survivalStatus?.bgColor} ${survivalStatus?.borderColor}`}
                    >
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide mb-1'>
                            Survival Prediction
                          </p>
                          <div className='flex items-center gap-2'>
                            {survivalStatus && (
                              <>
                                <survivalStatus.icon
                                  className={`h-6 w-6 ${survivalStatus.color}`}
                                />
                                <p
                                  className={`text-2xl font-bold ${survivalStatus.color}`}
                                >
                                  {survivalStatus.label}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Confidence */}
                      <div className='mt-4 space-y-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-muted-foreground'>
                            Model Confidence
                          </span>
                          <span className='font-semibold text-primary'>
                            {(confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className='w-full bg-border rounded-full h-2 overflow-hidden'>
                          <div
                            className='bg-gradient-to-r from-primary to-accent h-full rounded-full'
                            style={{ width: `${confidence * 100}%` }}
                          ></div>
                        </div>
                        <p className='text-xs text-muted-foreground mt-2'>
                          Probability of{' '}
                          {prediction === 1 ? 'survival' : 'not surviving'}:{' '}
                          {(confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Passenger Details */}
                    <div className='space-y-3 border-t border-border pt-4'>
                      <div className='grid grid-cols-2 gap-3'>
                        <div>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                            Age
                          </p>
                          <p className='font-medium text-foreground'>
                            {formData.age} years
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                            Gender
                          </p>
                          <p className='font-medium text-foreground capitalize'>
                            {formData.sex}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Family Members
                        </p>
                        <div className='grid grid-cols-2 gap-2 mt-1'>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Siblings/Spouses:
                            </p>
                            <p className='font-medium text-foreground'>
                              {formData.sibsp}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Parents/Children:
                            </p>
                            <p className='font-medium text-foreground'>
                              {formData.parch}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Ticket Details
                        </p>
                        <div className='grid grid-cols-2 gap-2 mt-1'>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Ticket:
                            </p>
                            <p className='font-medium text-foreground text-sm'>
                              {formData.ticket}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Fare:
                            </p>
                            <p className='font-medium text-foreground'>
                              ${formData.fare.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                          Travel Details
                        </p>
                        <div className='grid grid-cols-2 gap-2 mt-1'>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Cabin:
                            </p>
                            <p className='font-medium text-foreground'>
                              {formData.cabin || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-muted-foreground'>
                              Embarked:
                            </p>
                            <p className='font-medium text-foreground'>
                              {formData.embarked === 'C'
                                ? 'Cherbourg'
                                : formData.embarked === 'Q'
                                ? 'Queenstown'
                                : 'Southampton'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className='flex gap-2'>
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
                        New Prediction
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
                    <div className='flex flex-col items-center text-center space-y-4'>
                      <div className='relative'>
                        <Ship className='h-12 w-12 text-primary' />
                        <BarChart3 className='h-6 w-6 text-white bg-primary rounded-full p-1 absolute -top-1 -right-1' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Fill in the passenger details on the left and click
                          "Predict Survival" to see the model's prediction.
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Required fields are marked with *
                        </p>
                      </div>
                      <div className='text-xs text-muted-foreground text-left w-full space-y-2'>
                        <p className='font-medium'>Quick Tips:</p>
                        <ul className='list-disc pl-4 space-y-1'>
                          <li>Use realistic passenger data</li>
                          <li>Check email format</li>
                          <li>Fare reflects ticket class</li>
                        </ul>
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
