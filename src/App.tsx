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
  responsive: true,
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

function App() {
  const [dateRange, setDateRange] = React.useState<DateRange<Date> | null>(null);
  React.useEffect(() => {
    (async () => {
      // https://create-react-app.dev/docs/using-the-public-folder/
      const response = await fetch(`${process.env.PUBLIC_URL}/MSFT_full_1hour_adjsplit.txt`)
      const responseText = await response.text();
      const responseLines = responseText.split("\r\n");
      for (let line of responseLines) {
        // Data is in the format : { DateTime (yyyy-MM-dd HH:mm:ss), Open, High, Low, Close, Volume}  
        // - Volume Numbers are in individual shares
        // - Timestamps run from the start of the period (eg 1min bars stamped 09:30 run from 09:30.00 to 09:30.59)
        // - Times with zero volume are omitted (thus gaps in the data sequence are when there have been no trades)
        // console.log(line);
      }
    })();
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker onChange={(date) => setDateRange(date as DateRange<Date> | null)} />
      <Line options={options} data={data} />
    </LocalizationProvider>
  );
}

export default App;
