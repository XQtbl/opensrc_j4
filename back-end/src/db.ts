import * as sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface ReportBase {
  category: string,
  location: string,
  seriousness: number,
  memo?: string,
};

export interface Report extends ReportBase {
  created_time: Date
}

const db = new sqlite3.Database('db.sqlite3');

let runP: (sql: string, params?: Object) => Promise<unknown> = promisify(db.run).bind(db);
let getP: (sql: string) => Promise<unknown> = promisify(db.get).bind(db);
let allP: (sql: string, params?: Object) => Promise<unknown> = promisify(db.all).bind(db);
let execP: (sql: string) => Promise<unknown> = promisify(db.exec).bind(db);

export async function createTbl() {
  try {
    await execP('CREATE TABLE IF NOT EXISTS report_data( \
      category TEXT NOT NULL, \
      location TEXT NOT NULL, \
      seriousness INT NOT NULL, \
      memo TEXT, \
      created_time INT NOT NULL )');
  }
  catch (err) {
    console.error(`SQLite3 Error: ${err}`);
  }
}

export async function registerReport(opt: Report): Promise<boolean> {
  try {
    await runP(`INSERT INTO report_data(
       category,  location,  seriousness, ${opt.memo ? 'memo,' : ''}   created_time ) VALUES ( 
      $category, $location, $serious,     ${opt.memo ? '$memo,' : ''} $created_time )`,
      {
        $category: opt.category,
        $location: opt.location,
        $serious: opt.seriousness,
        $created_time: opt.created_time,
        $memo: opt.memo,
      });

      return true;
  }
  catch (err) {
    console.error(`SQLite3 Error: ${err}`);
  }
  return false;
}

export async function getReports(): Promise<Report[] | null> {
  try {
    let rows = await allP('SELECT * FROM report_data') as Array<any>;


    rows.map(row => {
      row.created_time = new Date(row.created_time);
      
      if (!row.memo)
        delete row.memo;

      return row;
    });

    return await rows as Report[];
  }
  catch (err) {
    console.error(`Error while processing getReports(): ${err}`);
  }
  return null;
}

(async () => {
  try {
    let row = await getP('SELECT DATETIME("NOW", "+9 hours")');
    
    console.log(row);
  }
  catch (err) {
    console.error(`SQLite3 Error: ${err}`);
  }
})();