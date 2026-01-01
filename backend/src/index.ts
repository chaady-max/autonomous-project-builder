import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze';
import generateRoutes from './routes/generate';
import recommendRoutes from './routes/recommend';
import settingsRoutes from './routes/settings';
import authRoutes from './routes/auth';
import wizardRoutes from './routes/v0.8/wizard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'APB Backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/wizard', wizardRoutes); // v0.8 wizard-based flow

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  Autonomous Project Builder - Backend Server          ║
║  Version: 0.1.0                                       ║
║  Port: ${PORT}                                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                               ║
║  Frontend: ${FRONTEND_URL}                  ║
╚═══════════════════════════════════════════════════════╝
  `);
  console.log('✓ Server is running');
  console.log('✓ Health check: http://localhost:' + PORT + '/health');
});

export default app;
