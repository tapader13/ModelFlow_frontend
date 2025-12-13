'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const MODEL_REQUIREMENTS = {
  'car-price-linear': {
    dataset: 'car-price',
    model: 'linear',
    columns: [
      'ID',
      'Levy',
      'Manufacturer',
      'Model',
      'Prod. year',
      'Category',
      'Leather interior',
      'Fuel type',
      'Engine volume',
      'Mileage',
      'Cylinders',
      'Gear box type',
      'Drive wheels',
      'Doors',
      'Wheel',
      'Color',
      'Airbags',
    ],
  },
  'car-price-knn': {
    dataset: 'car-price',
    model: 'knn',
    columns: [
      'ID',
      'Levy',
      'Manufacturer',
      'Model',
      'Prod. year',
      'Category',
      'Leather interior',
      'Fuel type',
      'Engine volume',
      'Mileage',
      'Cylinders',
      'Gear box type',
      'Drive wheels',
      'Doors',
      'Wheel',
      'Color',
      'Airbags',
    ],
  },
  'car-price-random-forest': {
    dataset: 'car-price',
    model: 'random-forest',
    columns: [
      'ID',
      'Levy',
      'Manufacturer',
      'Model',
      'Prod. year',
      'Category',
      'Leather interior',
      'Fuel type',
      'Engine volume',
      'Mileage',
      'Cylinders',
      'Gear box type',
      'Drive wheels',
      'Doors',
      'Wheel',
      'Color',
      'Airbags',
    ],
  },
  'car-price-svr': {
    dataset: 'car-price',
    model: 'svr',
    columns: [
      'ID',
      'Levy',
      'Manufacturer',
      'Model',
      'Prod. year',
      'Category',
      'Leather interior',
      'Fuel type',
      'Engine volume',
      'Mileage',
      'Cylinders',
      'Gear box type',
      'Drive wheels',
      'Doors',
      'Wheel',
      'Color',
      'Airbags',
    ],
  },
  'car-price-decision': {
    dataset: 'car-price',
    model: 'decision',
    columns: [
      'ID',
      'Levy',
      'Manufacturer',
      'Model',
      'Prod. year',
      'Category',
      'Leather interior',
      'Fuel type',
      'Engine volume',
      'Mileage',
      'Cylinders',
      'Gear box type',
      'Drive wheels',
      'Doors',
      'Wheel',
      'Color',
      'Airbags',
    ],
  },
  'movie-rating-linear': {
    dataset: 'movie-rating',
    model: 'linear',
    columns: [
      'rank',
      'name',
      'year',
      'genre',
      'certificate',
      'run_time',
      'tagline',
      'budget',
      'box_office',
      'casts',
      'directors',
      'writers',
    ],
  },
  'movie-rating-decision': {
    dataset: 'movie-rating',
    model: 'decision',
    columns: [
      'rank',
      'name',
      'year',
      'genre',
      'certificate',
      'run_time',
      'tagline',
      'budget',
      'box_office',
      'casts',
      'directors',
      'writers',
    ],
  },
  'movie-rating-random-forest': {
    dataset: 'movie-rating',
    model: 'random-forest',
    columns: [
      'rank',
      'name',
      'year',
      'genre',
      'certificate',
      'run_time',
      'tagline',
      'budget',
      'box_office',
      'casts',
      'directors',
      'writers',
    ],
  },
  'movie-rating-svr': {
    dataset: 'movie-rating',
    model: 'svr',
    columns: [
      'rank',
      'name',
      'year',
      'genre',
      'certificate',
      'run_time',
      'tagline',
      'budget',
      'box_office',
      'casts',
      'directors',
      'writers',
    ],
  },
  'movie-rating-knn': {
    dataset: 'movie-rating',
    model: 'knn',
    columns: [
      'rank',
      'name',
      'year',
      'genre',
      'certificate',
      'run_time',
      'tagline',
      'budget',
      'box_office',
      'casts',
      'directors',
      'writers',
    ],
  },
  'titanic-logistic': {
    dataset: 'titanic',
    model: 'logistic',
    columns: [
      'passenger_id',
      'pclass',
      'name',
      'sex',
      'age',
      'sibsp',
      'parch',
      'ticket',
      'fare',
      'cabin',
      'embarked',
      'email',
    ],
  },
};

interface ValidationError {
  type: 'missing' | 'extra' | 'file' | 'model';
  message: string;
  columns?: string[];
}
type Prediction = {
  name: string;
  Survived: number;
  probability: number;
};

type ApiResponse = {
  message: string;
  predictions: Prediction[];
};
export default function CSVUploadPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  // Validate CSV file
  const validateCSV = async (file: File, model: string) => {
    if (!model) {
      setValidationErrors([
        { type: 'model', message: 'Please select a model first' },
      ]);
      setIsValid(false);
      return;
    }

    const errors: ValidationError[] = [];

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');

      if (lines.length === 0) {
        errors.push({ type: 'file', message: 'CSV file is empty' });
        setValidationErrors(errors);
        setIsValid(false);
        return;
      }

      // Get headers from first line
      const headers = lines[0]
        .split(',')
        .map((h) => h.trim().replace(/"/g, ''));
      setCsvHeaders(headers);

      const requiredColumns =
        MODEL_REQUIREMENTS[model as keyof typeof MODEL_REQUIREMENTS]?.columns ||
        [];

      // Check for missing columns
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );
      if (missingColumns.length > 0) {
        errors.push({
          type: 'missing',
          message: `Missing required columns`,
          columns: missingColumns,
        });
      }

      // Check for extra columns
      const extraColumns = headers.filter(
        (col) => !requiredColumns.includes(col)
      );
      if (extraColumns.length > 0) {
        errors.push({
          type: 'extra',
          message: `Extra columns not required by model`,
          columns: extraColumns,
        });
      }

      // Check if columns match exactly
      if (
        headers.length !== requiredColumns.length ||
        missingColumns.length > 0 ||
        extraColumns.length > 0
      ) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }

      setValidationErrors(errors);
    } catch (err) {
      errors.push({ type: 'file', message: 'Failed to parse CSV file' });
      setValidationErrors(errors);
      setIsValid(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setValidationErrors([
          { type: 'file', message: 'Please upload a CSV file' },
        ]);
        setIsValid(false);
        return;
      }

      setCsvFile(file);
      setPredictions([]);
      setError(null);

      if (selectedModel) {
        await validateCSV(file, selectedModel);
      }
    }
  };

  const handleModelChange = async (value: string) => {
    setSelectedModel(value);
    setPredictions([]);
    setError(null);

    if (csvFile) {
      await validateCSV(csvFile, value);
    }
  };

  const handlePredict = async () => {
    if (!csvFile || !selectedModel) {
      setError('Please upload a file and select a model');
      return;
    }

    if (!isValid) {
      setError(
        'CSV file validation failed. Please fix the errors and try again.'
      );
      return;
    }

    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', csvFile);

      const modelConfig =
        MODEL_REQUIREMENTS[selectedModel as keyof typeof MODEL_REQUIREMENTS];
      formData.append('model_name', modelConfig.model);
      formData.append('dataset', modelConfig.dataset);

      const response = await fetch(
        'http://127.0.0.1:8000/common/csv-batch-upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get predictions from backend');
      }

      const result: ApiResponse = await response.json();
      console.log(result, 'reslut from bakcend');
      setPredictions(result.predictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCsvFile(null);
    setSelectedModel('');
    setCsvHeaders([]);
    setValidationErrors([]);
    setIsValid(false);
    setPredictions([]);
    setError(null);
  };

  return (
    <Layout>
      <main className='min-h-screen bg-background'>
        {/* Header */}
        <div className='border-b border-border bg-card'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
              <Upload className='h-8 w-8 text-primary' />
              CSV Batch Predictions
            </h1>
            <p className='text-muted-foreground'>
              Upload a CSV file and select a model to get batch predictions
              {userEmail && (
                <span className='ml-2 font-medium text-foreground'>
                  • {userEmail}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Upload Form */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Upload Card */}
              <Card className='border border-border shadow-sm'>
                <CardHeader className='border-b border-border bg-secondary/30'>
                  <CardTitle className='text-xl'>Upload & Validate</CardTitle>
                  <CardDescription>
                    Select model and upload your CSV file for validation
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6 space-y-6'>
                  {/* Model Selection */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-foreground'>
                      Select Model *
                    </label>
                    <Select
                      value={selectedModel}
                      onValueChange={handleModelChange}
                    >
                      <SelectTrigger className='w-full bg-input'>
                        <SelectValue placeholder='Choose a prediction model' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='car-price-linear'>
                          Car Price - Linear Regression
                        </SelectItem>
                        <SelectItem value='car-price-knn'>
                          Car Price - K-Nearest Neighbors
                        </SelectItem>
                        <SelectItem value='car-price-random-forest'>
                          Car Price - Random Forest
                        </SelectItem>
                        <SelectItem value='car-price-svr'>
                          Car Price - Support Vector Regression
                        </SelectItem>
                        <SelectItem value='car-price-decision'>
                          Car Price - Decision Tree
                        </SelectItem>
                        <SelectItem value='movie-rating-linear'>
                          Movie Rating - Linear Regression
                        </SelectItem>
                        <SelectItem value='movie-rating-decision'>
                          Movie Rating - Decision Tree
                        </SelectItem>
                        <SelectItem value='movie-rating-random-forest'>
                          Movie Rating - Random Forest
                        </SelectItem>
                        <SelectItem value='movie-rating-svr'>
                          Movie Rating - SVR
                        </SelectItem>
                        <SelectItem value='movie-rating-knn'>
                          Movie Rating - K-Nearest Neighbors
                        </SelectItem>
                        <SelectItem value='titanic-logistic'>
                          Titanic Survival - Logistic Regression
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-foreground'>
                      Upload CSV File *
                    </label>
                    <div className='flex items-center gap-4'>
                      <Input
                        type='file'
                        accept='.csv'
                        onChange={handleFileChange}
                        disabled={!selectedModel}
                        className='bg-input text-foreground'
                      />
                      {csvFile && (
                        <Badge
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          <FileSpreadsheet className='h-3 w-3' />
                          {csvFile.name}
                        </Badge>
                      )}
                    </div>
                    {!selectedModel && (
                      <p className='text-xs text-muted-foreground'>
                        Please select a model first
                      </p>
                    )}
                  </div>

                  {/* Required Columns Display */}
                  {selectedModel && (
                    <div className='bg-secondary/30 border border-border rounded-lg p-4'>
                      <h4 className='text-sm font-semibold text-foreground mb-2'>
                        Required Columns for Selected Model:
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {MODEL_REQUIREMENTS[
                          selectedModel as keyof typeof MODEL_REQUIREMENTS
                        ].columns.map((col) => (
                          <Badge
                            key={col}
                            variant='outline'
                            className='text-xs'
                          >
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Status */}
                  {csvFile && selectedModel && (
                    <div className='space-y-3'>
                      {validationErrors.length === 0 ? (
                        <div className='flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
                          <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0' />
                          <div>
                            <h4 className='font-semibold text-green-900 dark:text-green-100 text-sm'>
                              Validation Passed
                            </h4>
                            <p className='text-sm text-green-700 dark:text-green-300 mt-1'>
                              CSV file has all required columns with correct
                              names. Ready to predict!
                            </p>
                            <div className='mt-2 text-xs text-green-600 dark:text-green-400'>
                              Found {csvHeaders.length} columns
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='space-y-3'>
                          {validationErrors.map((err, idx) => (
                            <div
                              key={idx}
                              className='flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg'
                            >
                              <AlertTriangle className='h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0' />
                              <div className='flex-1'>
                                <h4 className='font-semibold text-orange-900 dark:text-orange-100 text-sm'>
                                  {err.message}
                                </h4>
                                {err.columns && err.columns.length > 0 && (
                                  <div className='mt-2 flex flex-wrap gap-1'>
                                    {err.columns.map((col) => (
                                      <Badge
                                        key={col}
                                        variant='destructive'
                                        className='text-xs'
                                      >
                                        {col}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='flex gap-3 pt-4 border-t border-border'>
                    <Button
                      onClick={handlePredict}
                      disabled={!isValid || loading || !token}
                      className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                    >
                      {!token
                        ? 'Authenticating...'
                        : loading
                        ? 'Predicting...'
                        : 'Predict'}
                    </Button>
                    <Button onClick={resetForm} variant='outline'>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
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
                  </CardContent>
                </Card>
              )}

              {/* Results Display */}
              {predictions?.length > 0 && (
                <Card className='border border-border shadow-sm'>
                  <CardHeader className='border-b border-border bg-secondary/30'>
                    <CardTitle className='text-xl'>
                      Prediction Results
                    </CardTitle>
                    <CardDescription>
                      {predictions.length} predictions generated
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='text-xs font-semibold'>
                              Row
                            </TableHead>
                            {predictions[0] &&
                              Object.keys(predictions[0]).map((key) => (
                                <TableHead
                                  key={key}
                                  className='text-xs font-semibold'
                                >
                                  {key}
                                </TableHead>
                              ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {predictions.map((pred, idx) => (
                            <TableRow key={idx}>
                              <TableCell className='text-xs font-medium'>
                                {idx + 1}
                              </TableCell>
                              {Object.values(pred).map((value: any, colIdx) => (
                                <TableCell key={colIdx} className='text-xs'>
                                  {typeof value === 'number'
                                    ? value.toFixed(2)
                                    : String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info Sidebar */}
            <div className='lg:col-span-1'>
              <Card className='border border-border shadow-sm sticky top-8'>
                <CardHeader className='border-b border-border bg-secondary/30'>
                  <CardTitle className='text-lg'>How It Works</CardTitle>
                </CardHeader>
                <CardContent className='pt-6 space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0'>
                        1
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Select the prediction model you want to use
                      </p>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0'>
                        2
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Upload a CSV file with the exact column names required
                        by the model
                      </p>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0'>
                        3
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        System validates that all required columns are present
                        with exact names
                      </p>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0'>
                        4
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Click Predict to get batch predictions for all rows in
                        your CSV
                      </p>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-border'>
                    <h4 className='text-sm font-semibold text-foreground mb-2'>
                      Validation Rules
                    </h4>
                    <ul className='space-y-2 text-xs text-muted-foreground'>
                      <li className='flex items-start gap-2'>
                        <CheckCircle className='h-3 w-3 text-primary mt-0.5 flex-shrink-0' />
                        <span>CSV must have exact column names</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle className='h-3 w-3 text-primary mt-0.5 flex-shrink-0' />
                        <span>No missing required columns</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle className='h-3 w-3 text-primary mt-0.5 flex-shrink-0' />
                        <span>No extra columns allowed</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle className='h-3 w-3 text-primary mt-0.5 flex-shrink-0' />
                        <span>File format must be .csv</span>
                      </li>
                    </ul>
                  </div>

                  <div className='pt-4 border-t border-border'>
                    <h4 className='text-sm font-semibold text-foreground mb-2'>
                      Tips
                    </h4>
                    <ul className='space-y-2 text-xs text-muted-foreground'>
                      <li className='flex items-start gap-2'>
                        <Badge
                          variant='outline'
                          className='text-[10px] px-1 py-0 h-4'
                        >
                          TIP
                        </Badge>
                        <span>
                          Check column names match exactly (case-sensitive)
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <Badge
                          variant='outline'
                          className='text-[10px] px-1 py-0 h-4'
                        >
                          TIP
                        </Badge>
                        <span>
                          Remove any extra columns not required by the model
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <Badge
                          variant='outline'
                          className='text-[10px] px-1 py-0 h-4'
                        >
                          TIP
                        </Badge>
                        <span>
                          Ensure all data rows have values for required columns
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
