import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', reportRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});