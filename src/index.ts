import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authRouter } from './presentation/routes/auth.routes';
import { disciplineRouter } from './presentation/routes/discipline.routes';
import { labRouter } from './presentation/routes/lab.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', disciplineRouter);
app.use('/api', labRouter);

export { app };

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
