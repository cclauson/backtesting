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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import Annotation, { AnnotationOptions } from 'chartjs-plugin-annotation';
import annotationPlugin from 'chartjs-plugin-annotation';
import { NumberLiteralType } from 'typescript';
import { StockData } from './StockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Annotation,
  annotationPlugin
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

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

export const options = {
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
  },
};

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 3, 5, 2, 4, 6],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const initialDateRange: DateRange<Date> = [new Date('August 28, 2023'), new Date('October 28, 2023')];

function App() {
  const [dateRange, setDateRange] = React.useState<DateRange<Date> | null>(initialDateRange);
  const [stockData, setStockData] = React.useState<StockData | null>(null);
  React.useEffect(() => {
    (async () => {
      const stockDataI = new StockData();
      await stockDataI.initialize();
      setStockData(stockDataI);
    })();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <h1>Back Testing</h1>
      <DateRangePicker defaultValue={initialDateRange} onChange={(date) => setDateRange(date as DateRange<Date> | null)} />
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
