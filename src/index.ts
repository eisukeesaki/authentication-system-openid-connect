import express, { Request, Response } from 'express';

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Express started on port ${process.env.PORT}`);
});

