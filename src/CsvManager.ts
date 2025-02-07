import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer'

class CsvManager {
  private numberCounts: { [key: number]: number } = {};
  private inputCsvFilePath = path.resolve(__dirname, 'data.csv');
  private outputCsvFilePath = path.resolve(__dirname, 'output_data.csv');
  private records: any[] = [];
  private cumulativeCounts: { [key: number]: number } = {};

  constructor() {
    for (let i = 1; i <= 49; i++) {
      this.numberCounts[i] = 0;
    }
  }

  public async cal(){
    fs.createReadStream(this.inputCsvFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const record = { ...data };
        const fieldsToCount = ['DrawnNo1', 'DrawnNo2', 'DrawnNo3', 'DrawnNo4', 'DrawnNo5', 'DrawnNo6', 'XDrawnNo'];

        fieldsToCount.forEach((field) => {
          const number = parseInt(data[field], 10);
          if (this.numberCounts.hasOwnProperty(number)) {
            this.numberCounts[number]++;
          }
        });

        for (let i = 1; i <= 49; i++) {
          record[`Number${i}`] = this.numberCounts[i];
        }

        this.records.push(record);
      })
      .on('end', () => {
        console.log('CSV file successfully read.');

        this.calTotalRepeat()
        this.saveToCSV()

        const sortedCounts = Object.keys(this.numberCounts)
        .map((key) => ({
          number: parseInt(key, 10),
          count: this.numberCounts[key]
        }))
        .sort((a, b) => a.number - b.number);
  
        console.log('Number counts sorted by number:');
        sortedCounts.forEach(({ number, count }) => {
          console.log(`Number ${number}: ${count} times`);
        });
      });
  }
  
  private async calTotalRepeat() {
    for (let i = 1; i < this.records.length; i++) {
      const previousRecord = this.records[i - 1];
      const currentRecord = this.records[i];

      let repeatCount = 0;
      const fieldsToCompare = ['DrawnNo1', 'DrawnNo2', 'DrawnNo3', 'DrawnNo4', 'DrawnNo5', 'DrawnNo6', 'XDrawnNo'];

      fieldsToCompare.forEach((field) => {
        if (currentRecord[field] === previousRecord[field]) {
          repeatCount++;
        }
      });

      currentRecord['No of repeat'] = repeatCount;
    }    
  }

  private async saveToCSV(){
    const csvHeader = [
      { id: 'Id', title: 'Id' },
      { id: 'DrawnNo1', title: 'DrawnNo1' },
      { id: 'DrawnNo2', title: 'DrawnNo2' },
      { id: 'DrawnNo3', title: 'DrawnNo3' },
      { id: 'DrawnNo4', title: 'DrawnNo4' },
      { id: 'DrawnNo5', title: 'DrawnNo5' },
      { id: 'DrawnNo6', title: 'DrawnNo6' },
      { id: 'XDrawnNo', title: 'XDrawnNo' },
      { id: 'No of repeat', title: 'No of repeat' }
      ...Array.from({ length: 49 }, (_, i) => ({
        id: `Number${i + 1}`,
        title: `Number${i + 1}`
      }))
    ];

    const csvWriter = createObjectCsvWriter({
      path: this.outputCsvFilePath,
      header: csvHeader
    });

    csvWriter.writeRecords(this.records)
      .then(() => {
        console.log('The CSV file was written successfully.');
      })
      .catch((error) => {
        console.error('Error writing CSV file:', error);
      });    
  }
}

export default CsvManager;
