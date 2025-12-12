'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Car } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface CarPriceInput {
  ID: number;
  Levy: number;
  Manufacturer: string;
  Model: string;
  'Prod. year': number;
  Category: string;
  'Leather interior': string;
  'Fuel type': string;
  'Engine volume': number;
  Mileage: string;
  Cylinders: number;
  'Gear box type': string;
  'Drive wheels': string;
  Doors: string;
  Wheel: string;
  Color: string;
  Airbags: number;
}

interface CarPriceOutput {
  prediction: number;
}

export default function LinearCarPricePage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CarPriceInput>({
    defaultValues: {
      ID: 45654403,
      Levy: 1399,
      Manufacturer: 'LEXUS',
      Model: 'RX 450',
      'Prod. year': 2010,
      Category: 'Jeep',
      'Leather interior': 'Yes',
      'Fuel type': 'Hybrid',
      'Engine volume': 3.5,
      Mileage: '186005 km',
      Cylinders: 6.0,
      'Gear box type': 'Automatic',
      'Drive wheels': '4x4',
      Doors: '04-May',
      Wheel: 'Left wheel',
      Color: 'Silver',
      Airbags: 12,
    },
  });

  const [result, setResult] = useState<CarPriceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  const onSubmit = async (data: CarPriceInput) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await fetch(
        'http://127.0.0.1:8000/car-price/linear-predict',
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
        throw new Error('Failed to get prediction from backend');
      }

      const prediction = await response.json();
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <main className='min-h-screen bg-background'>
        {/* Header */}
        <div className='border-b border-border bg-card'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
              <Car className='h-8 w-8 text-primary' />
              Car Price Predictor - Linear Regression
            </h1>
            <p className='text-muted-foreground'>
              Predict car prices using linear regression model
              {userEmail && (
                <span className=' ml-2 font-medium text-foreground'>
                  • {userEmail}
                </span>
              )}
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
                    Enter Car Information
                  </CardTitle>
                  <CardDescription>
                    Default values are pre-filled for quick testing - modify as
                    needed
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Row 1: ID and Levy */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Car ID *
                        </label>
                        <Input
                          type='number'
                          {...register('ID', { required: 'ID is required' })}
                          className='bg-input text-foreground'
                        />
                        {errors.ID && (
                          <span className='text-xs text-destructive'>
                            {errors.ID.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Levy *
                        </label>
                        <Input
                          type='number'
                          {...register('Levy', {
                            required: 'Levy is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Levy && (
                          <span className='text-xs text-destructive'>
                            {errors.Levy.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Manufacturer and Model */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Manufacturer *
                        </label>
                        <Input
                          {...register('Manufacturer', {
                            required: 'Manufacturer is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Manufacturer && (
                          <span className='text-xs text-destructive'>
                            {errors.Manufacturer.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Model *
                        </label>
                        <Input
                          {...register('Model', {
                            required: 'Model is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Model && (
                          <span className='text-xs text-destructive'>
                            {errors.Model.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Production Year and Category */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Production Year *
                        </label>
                        <Input
                          type='number'
                          {...register('Prod. year', {
                            required: 'Production year is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Prod. year'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Prod. year'].message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Category *
                        </label>
                        <Input
                          {...register('Category', {
                            required: 'Category is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Category && (
                          <span className='text-xs text-destructive'>
                            {errors.Category.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Leather Interior and Fuel Type */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Leather Interior *
                        </label>
                        <Input
                          {...register('Leather interior', {
                            required: 'Leather interior is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Leather interior'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Leather interior'].message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Fuel Type *
                        </label>
                        <Input
                          {...register('Fuel type', {
                            required: 'Fuel type is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Fuel type'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Fuel type'].message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 5: Engine Volume and Mileage */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Engine Volume (L) *
                        </label>
                        <Input
                          type='number'
                          step='0.1'
                          {...register('Engine volume', {
                            required: 'Engine volume is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Engine volume'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Engine volume'].message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Mileage *
                        </label>
                        <Input
                          {...register('Mileage', {
                            required: 'Mileage is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Mileage && (
                          <span className='text-xs text-destructive'>
                            {errors.Mileage.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 6: Cylinders and Gear Box Type */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Cylinders *
                        </label>
                        <Input
                          type='number'
                          step='0.1'
                          {...register('Cylinders', {
                            required: 'Cylinders is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Cylinders && (
                          <span className='text-xs text-destructive'>
                            {errors.Cylinders.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Gear Box Type *
                        </label>
                        <Input
                          {...register('Gear box type', {
                            required: 'Gear box type is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Gear box type'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Gear box type'].message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 7: Drive Wheels and Doors */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Drive Wheels *
                        </label>
                        <Input
                          {...register('Drive wheels', {
                            required: 'Drive wheels is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors['Drive wheels'] && (
                          <span className='text-xs text-destructive'>
                            {errors['Drive wheels'].message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Doors *
                        </label>
                        <Input
                          {...register('Doors', {
                            required: 'Doors is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Doors && (
                          <span className='text-xs text-destructive'>
                            {errors.Doors.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 8: Wheel Position and Color */}
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Wheel Position *
                        </label>
                        <Input
                          {...register('Wheel', {
                            required: 'Wheel position is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Wheel && (
                          <span className='text-xs text-destructive'>
                            {errors.Wheel.message}
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <label className='block text-sm font-medium text-foreground'>
                          Color *
                        </label>
                        <Input
                          {...register('Color', {
                            required: 'Color is required',
                          })}
                          className='bg-input text-foreground'
                        />
                        {errors.Color && (
                          <span className='text-xs text-destructive'>
                            {errors.Color.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 9: Airbags */}
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-foreground'>
                        Number of Airbags *
                      </label>
                      <Input
                        type='number'
                        {...register('Airbags', {
                          required: 'Airbags is required',
                        })}
                        className='bg-input text-foreground'
                      />
                      {errors.Airbags && (
                        <span className='text-xs text-destructive'>
                          {errors.Airbags.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type='submit'
                      disabled={isSubmitting || loading || !token}
                      className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                    >
                      {!token
                        ? 'Authenticating...'
                        : isSubmitting || loading
                        ? 'Predicting...'
                        : 'Predict Price'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className='lg:col-span-1'>
              {error && (
                <Card className='border border-destructive shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-destructive'>
                      <AlertCircle className='h-5 w-5' />
                      Error
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>{error}</p>
                  </CardContent>
                </Card>
              )}

              {result && (
                <Card className='border border-border shadow-sm sticky top-8'>
                  <CardHeader className='border-b border-border bg-secondary/30'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <CheckCircle className='h-5 w-5 text-primary' />
                      Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-6'>
                    {/* Prediction Price */}
                    <div className='bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 text-center space-y-3'>
                      <p className='text-xs text-muted-foreground uppercase tracking-widest font-semibold'>
                        Predicted Price
                      </p>
                      <div className='flex items-baseline justify-center gap-2'>
                        <span className='text-5xl font-bold text-primary'>
                          {formatPrice(result.prediction)}
                        </span>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <Button
                      onClick={() => {
                        reset();
                        setResult(null);
                        setError(null);
                      }}
                      variant='outline'
                      className='w-full'
                    >
                      Predict Another
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!result && !error && (
                <Card className='border border-border shadow-sm'>
                  <CardHeader>
                    <CardTitle className='text-lg'>Ready to Predict</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Default values are pre-filled. You can modify them or
                      click "Predict Price" directly to test the model.
                    </p>
                    <div className='text-xs text-muted-foreground space-y-1 pt-2 border-t border-border'>
                      <p>
                        <strong>Note:</strong> This model uses linear regression
                        to predict car prices based on vehicle specifications
                        and condition.
                      </p>
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
