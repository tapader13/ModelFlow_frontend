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
import {
  AlertCircle,
  Activity,
  Car,
  Film,
  Users,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

interface Prediction {
  dataset: string;
  model_name: string;
  output: number;
  confidence?: number;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  total_records: number;
  data: Prediction[];
}

export default function AllPredictionsPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
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
        const response = await fetch(
          'http://127.0.0.1:8000/common/all-predictions',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch predictions');
        }

        const result: ApiResponse = await response.json();
        setPredictions(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching predictions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

  // Group predictions by dataset
  const groupedPredictions = predictions.reduce((acc, pred) => {
    if (!acc[pred.dataset]) {
      acc[pred.dataset] = [];
    }
    acc[pred.dataset].push(pred);
    return acc;
  }, {} as Record<string, Prediction[]>);

  // Format output based on dataset type
  const formatOutput = (
    dataset: string,
    output: number,
    confidence?: number
  ) => {
    switch (dataset) {
      case 'Titanic Survival':
        return {
          value: output === 1 ? 'Survived' : 'Not Survived',
          badge: output === 1 ? 'default' : 'secondary',
          confidence: confidence ? `${(confidence * 100).toFixed(1)}%` : null,
        };
      case 'Car Price':
        return {
          value: `$${output.toLocaleString()}`,
          badge: 'default',
          confidence: null,
        };
      case 'Movie Rating':
        return {
          value: `${output.toFixed(1)}/10`,
          badge: 'default',
          confidence: null,
        };
      default:
        return {
          value: output.toString(),
          badge: 'default',
          confidence: confidence ? `${(confidence * 100).toFixed(1)}%` : null,
        };
    }
  };

  // Get icon based on dataset
  const getDatasetIcon = (dataset: string) => {
    switch (dataset) {
      case 'Titanic Survival':
        return <Users className='h-5 w-5 text-primary' />;
      case 'Car Price':
        return <Car className='h-5 w-5 text-primary' />;
      case 'Movie Rating':
        return <Film className='h-5 w-5 text-primary' />;
      default:
        return <BarChart3 className='h-5 w-5 text-primary' />;
    }
  };

  //   if (loading) {
  //     return (
  //       <div className='min-h-screen bg-background flex items-center justify-center'>
  //         <div className='text-center'>
  //           <div className='animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4'></div>
  //           <p className='text-muted-foreground'>Loading predictions...</p>
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
        <div className='min-h-screen bg-background flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading predictions...</p>
          </div>
        </div>
      ) : (
        <main className='min-h-screen bg-background'>
          {/* Header */}
          <div className='border-b border-border bg-card'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <TrendingUp className='h-8 w-8 text-primary' />
                    <h1 className='text-3xl font-bold text-foreground'>
                      All Predictions History
                    </h1>
                  </div>
                  <p className='text-muted-foreground'>
                    Complete history of predictions across all datasets and
                    models
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-muted-foreground'>Total Records</p>
                  <p className='text-3xl font-bold text-primary'>
                    {predictions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
            {Object.entries(groupedPredictions).map(
              ([dataset, datasetPredictions]) => (
                <Card key={dataset} className='border border-border shadow-sm'>
                  <CardHeader className='border-b border-border'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {getDatasetIcon(dataset)}
                        <div>
                          <CardTitle className='text-lg font-semibold'>
                            {dataset}
                          </CardTitle>
                          <CardDescription className='text-xs mt-1'>
                            {datasetPredictions.length} prediction
                            {datasetPredictions.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant='outline' className='text-xs'>
                        {
                          new Set(datasetPredictions.map((p) => p.model_name))
                            .size
                        }{' '}
                        model
                        {new Set(datasetPredictions.map((p) => p.model_name))
                          .size !== 1
                          ? 's'
                          : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Model</TableHead>
                          <TableHead>Output</TableHead>
                          {datasetPredictions.some(
                            (p) => p.confidence !== undefined
                          ) && (
                            <TableHead className='text-right'>
                              Confidence
                            </TableHead>
                          )}
                          <TableHead className='text-right'>
                            Created At
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datasetPredictions.map((pred, index) => {
                          const formatted = formatOutput(
                            pred.dataset,
                            pred.output,
                            pred.confidence
                          );
                          return (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {pred.model_name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    formatted.badge as 'default' | 'secondary'
                                  }
                                >
                                  {formatted.value}
                                </Badge>
                              </TableCell>
                              {datasetPredictions.some(
                                (p) => p.confidence !== undefined
                              ) && (
                                <TableCell className='text-right font-medium text-primary'>
                                  {formatted.confidence || '-'}
                                </TableCell>
                              )}
                              <TableCell className='text-right text-xs text-muted-foreground'>
                                {new Date(pred.created_at).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            )}

            {/* Empty State */}
            {predictions.length === 0 && (
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
      )}
    </Layout>
  );
}
