import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';

dotenv.config();
console.log("process.env.MONGODB_URL: ", process.env.MONGODB_URL);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); //50mb file limit

app.get('/', (req: Request, res: any) => {
  res.send({ message: 'Hello World!' });
})

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL as string);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

startServer();
