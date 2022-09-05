import { Pool } from 'pg';
import express, { json } from 'express';

interface FormBody {
  email: string;
  name: string;
  reason: string;
}

export class Form {
  private pool: Pool;
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      port: 7768,
    });
  }
  async submit(formBody: FormBody, response: express.Response) {
    if(await this.validate(formBody)) {
      this.pool.query('INSERT INTO contact (email, name, reason, sent_date) VALUES ($1, $2, $3, $4)', 
      [formBody.email, formBody.name, formBody.reason, new Date().toISOString()], (err, res) => {
        if (err) {
          response.status(400).json({success: false, message: 'Something went wrong!'});
        }
        response.json({success: true, message: 'Message sent successfully'});
        this.pool.end();
      });
    }
    else {
      response.json({success: false, message: 'You already sent a message, please wait until I check it out!'});
    }
  }
  private async validate(formBody: FormBody) {
    return new Promise((resolve, reject) => {
      this.pool.query('SELECT * FROM contact WHERE email = ($1)', [formBody.email], (err, res) => {
        if (err) {
          reject(false);
        }
        resolve(res.rowCount === 0);
      });
    })
  }
}