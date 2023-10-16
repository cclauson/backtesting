export interface PeriodPriceData {
    open: number,
    close: number,
    high: number,
    low: number,
    volume: number
}  

export class StockData {
    private initialDate: Date | undefined;
    private priceData: PeriodPriceData[] = [];

    constructor() {}

    private isTradingHourAfter(date1: Date, date2: Date) {
        if (date1.getDate() === date2.getDate()) {
            return date1.getHours() + 1 === date2.getHours();
        } else {
            return date1.getHours() === 19 && date2.getHours() === 4 && date1.getDate() + 1 === date2.getDate();
        }
    }

    public async initialize(): Promise<void> {
      // https://create-react-app.dev/docs/using-the-public-folder/
      const response = await fetch(`${process.env.PUBLIC_URL}/MSFT_full_1hour_adjsplit.txt`)
      const responseText = await response.text();
      const responseLines = responseText.split("\r\n");
      let lastDate: Date | undefined;
      for (let line of responseLines) {
        // Data is in the format : { DateTime (yyyy-MM-dd HH:mm:ss), Open, High, Low, Close, Volume}  
        // - Volume Numbers are in individual shares
        // - Timestamps run from the start of the period (eg 1min bars stamped 09:30 run from 09:30.00 to 09:30.59)
        // - Times with zero volume are omitted (thus gaps in the data sequence are when there have been no trades)
        const fields = line.split(',');
        const date = new Date(fields[0]);
        const periodPriceData: PeriodPriceData = {
          open: parseFloat(fields[1]),
          close: parseFloat(fields[4]),
          high: parseFloat(fields[2]),
          low: parseFloat(fields[3]),
          volume: parseInt(fields[5])
        }
        if (!lastDate) {
            this.initialDate = date;
        } else {
            if (!this.isTradingHourAfter(lastDate, date)) {
                // throw new Error(`${lastDate} not trading hour before ${date}`);
            }
        }
        lastDate = date;
        this.priceData.push(periodPriceData);
      }
    }
}