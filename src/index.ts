import express, { Request, Response } from 'express';

const app = express();

console.log(`
ENVIRONMENT:
    HOST: ${process.env.HOST}
    PORT: ${process.env.PORT}
    OAUTH_CLIENT_ID: ${process.env.OAUTH_CLIENT_ID}
    OAUTH_CLIENT_SECRET: ${process.env.OAUTH_CLIENT_SECRET}
`);

app.listen(process.env.PORT, () => {
  console.log(`Express started on port ${process.env.PORT}`);
});

