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
import { AlertCircle, BarChart3, TrendingUp, Award } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

interface ModelData {
  dataset: string;
  model_name: string;
  avg_output: number;
  records: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GroupedModels {
  [dataset: string]: ModelData[];
}

export default function ModelComparisonPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [modelsData, setModelsData] = useState<ModelData[]>([]);
  const [groupedModels, setGroupedModels] = useState<GroupedModels>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const fetchModelsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://fast-api-model-backend.onrender.com/common/get-all-models-data',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch models data');
        }

        const data = await response.json();
        setModelsData(data);

        // Group models by dataset
        const grouped = data.reduce((acc: GroupedModels, model: ModelData) => {
          if (!acc[model.dataset]) {
            acc[model.dataset] = [];
          }
          acc[model.dataset].push(model);
          return acc;
        }, {});

        // Sort models within each dataset by avg_output
        Object.keys(grouped).forEach((dataset) => {
          grouped[dataset].sort((a: ModelData, b: ModelData) => {
            // if (dataset === 'Titanic Survival') {
            //   return a.avg_output - b.avg_output;
            // }
            // // For others, higher is better
            return b.avg_output - a.avg_output;
          });
        });

        setGroupedModels(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching models data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsData();
  }, [token]);

  const getBestModelIndex = (dataset: string) => {
    return 0; // First model after sorting is the best
  };

  const formatOutput = (value: number, dataset: string) => {
    if (dataset === 'Titanic Survival') {
      return `${(value * 100).toFixed(2)}%`;
    } else if (dataset === 'Car Price') {
      return `$${value.toLocaleString()}`;
    } else if (dataset === 'Movie Rating') {
      return `${value.toFixed(1)}/10`;
    }
    return value.toFixed(2);
  };

  //   if (loading) {
  //     return (
  //       <div className='min-h-screen bg-background flex items-center justify-center'>
  //         <div className='text-center'>
  //           <div className='animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4'></div>
  //           <p className='text-muted-foreground'>Loading model comparisons...</p>
  //         </div>
  //       </div>
  //     );
  //   }
  //   if (loading) {
  //     return (
  //       <div className='min-h-screen bg-white flex items-center justify-center'>
  //         <div className='text-center'>
  //           <div className='animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent mx-auto mb-4'></div>
  //           <p className='text-gray-600'>Loading model comparisons...</p>
  //         </div>
  //       </div>
  //     );
  //   }
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
    <Layout>
      {loading ? (
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading model comparisons...</p>
          </div>
        </div>
      ) : (
        <main className='min-h-screen bg-background'>
          {/* Header */}
          <div className='border-b border-border bg-card'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
              <div className='flex items-center gap-3 mb-2'>
                <BarChart3 className='h-8 w-8 text-primary' />
                <h1 className='text-3xl font-bold text-foreground'>
                  Model Performance Comparison
                </h1>
              </div>
              <p className='text-muted-foreground'>
                Compare ML model performance within each dataset to identify the
                best performing model
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
            {Object.keys(groupedModels).length === 0 ? (
              <Card className='border border-border'>
                <CardContent className='py-12'>
                  <div className='text-center'>
                    <BarChart3 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <h3 className='text-lg font-semibold mb-2'>
                      No Model Data Available
                    </h3>
                    <p className='text-sm text-muted-foreground mb-6'>
                      Start making predictions to see model performance
                      comparisons
                    </p>
                    <Button>Make Your First Prediction</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedModels).map(([dataset, models]) => (
                <Card key={dataset} className='border border-border shadow-sm'>
                  <CardHeader className='border-b border-border'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='h-5 w-5 text-primary' />
                        <div>
                          <CardTitle className='text-lg font-semibold'>
                            {dataset}
                          </CardTitle>
                          <CardDescription className='text-xs mt-1'>
                            {models.length} model{models.length > 1 ? 's' : ''}{' '}
                            comparison
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant='outline' className='text-xs'>
                        Total Predictions:{' '}
                        {models.reduce((sum, m) => sum + m.records, 0)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Model Name</TableHead>
                          <TableHead className='text-right'>
                            Average Output
                          </TableHead>
                          <TableHead className='text-center'>
                            Predictions
                          </TableHead>
                          <TableHead className='text-center'>Status</TableHead>
                          <TableHead className='text-right'>
                            Last Updated
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {models.map((model, index) => {
                          const isBest = index === getBestModelIndex(dataset);
                          return (
                            <TableRow
                              key={`${model.dataset}-${model.model_name}`}
                              className={isBest ? 'bg-muted/50' : ''}
                            >
                              <TableCell>
                                {isBest ? (
                                  <div className='flex items-center gap-1'>
                                    <Award className='h-4 w-4 text-primary' />
                                    <span className='font-bold text-primary'>
                                      #{index + 1}
                                    </span>
                                  </div>
                                ) : (
                                  <span className='text-muted-foreground'>
                                    #{index + 1}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {model.model_name}
                                {isBest && (
                                  <Badge
                                    variant='default'
                                    className='ml-2 text-xs'
                                  >
                                    Best
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className='text-right'>
                                <span
                                  className={`text-lg font-bold ${
                                    isBest ? 'text-primary' : 'text-foreground'
                                  }`}
                                >
                                  {formatOutput(model.avg_output, dataset)}
                                </span>
                              </TableCell>
                              <TableCell className='text-center'>
                                <Badge variant='secondary'>
                                  {model.records}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-center'>
                                <Badge
                                  variant={
                                    model.status === 'Active'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {model.status}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-right text-xs text-muted-foreground'>
                                {new Date(
                                  model.updated_at
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      )}
    </Layout>
  );
}
