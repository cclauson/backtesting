import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  LineControllerChartOptions,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import Annotation, { AnnotationOptions } from 'chartjs-plugin-annotation';
import annotationPlugin from 'chartjs-plugin-annotation';
import { StockData } from './StockData';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';

type LineOptions = _DeepPartialObject<CoreChartOptions<"line"> & ElementChartOptions<"line"> & PluginChartOptions<"line"> & DatasetChartOptions<"line"> & ScaleChartOptions<"line"> & LineControllerChartOptions>;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Annotation,
  annotationPlugin,
  TimeScale
);

const annotation1: AnnotationOptions = {
  type: 'box',
  backgroundColor: 'rgba(0, 150, 0, 0.04)',
  borderColor: 'rgba(0, 150, 0, 0.4)',
  borderRadius: 4,
  borderWidth: 1,
  xMax: 1.5,
  xMin: 0.5
};

const annotation2: AnnotationOptions = {
  type: 'box',
  backgroundColor: 'rgba(150, 0, 0, 0.04)',
  borderColor: 'rgba(150, 0, 0, 0.4)',
  borderRadius: 4,
  borderWidth: 1,
  xMax: 3.5,
  xMin: 2.5
};

export const options: LineOptions = {
  // responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    annotation: {
      annotations: {
        annotation1,
        annotation2
      }
    }
  }
};

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + (hours * 60 * 60 * 1000));
}

const initialDateRange: DateRange<Date> = [new Date('August 28, 2023'), new Date('October 9, 2023')];

function computeData(dateRange: DateRange<Date>): ChartData<'line', number[], Date> {

  const labels: Date[] = [];
  const data: number[] = [];
  const startDate = dateRange[0];
  const endDate = dateRange[1];
  if (startDate === null) {
    throw new Error('start date unexpectedly undefined');
  }
  if (endDate === null) {
    throw new Error('end date unexpectedly undefined');
  }
  for (let currentDate = startDate; currentDate.getTime() <= endDate.getTime(); currentDate = addHours(currentDate, 1)) {
    labels.push(currentDate);
    data.push(Math.random());
  }
  return {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
}

function App() {
  const [dateRange, setDateRange] = React.useState<DateRange<Date>>(initialDateRange);
  const [stockData, setStockData] = React.useState<StockData | null>(null);
  React.useEffect(() => {
    (async () => {
      const stockDataI = new StockData();
      await stockDataI.initialize();
      setStockData(stockDataI);
    })();
  }, []);
  const data = computeData(dateRange);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <h1>Back Testing</h1>
      <DateRangePicker defaultValue={initialDateRange} onChange={(date) => setDateRange(date as DateRange<Date>)} />
      <div style={{width:'100%', height:'50%'}}>
      <Line options={options} data={data} />
      </div>
      <div style={{width:'100%', height:'50%'}}>
      <Line options={options} data={data} />
      </div>
    </LocalizationProvider>
  );
}

export default App;
