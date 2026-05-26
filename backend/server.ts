import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import prisma from './src/prisma';

// Always load .env manually to ensure all variables are parsed
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        // Only set if not already loaded by dotenv (to allow real env vars to override)
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// Debug: Check PayOS env vars
console.log('[DEBUG] PAYOS_CLIENT_ID:', process.env.PAYOS_CLIENT_ID ? `${process.env.PAYOS_CLIENT_ID.substring(0, 8)}...` : 'NOT SET');
console.log('[DEBUG] PAYOS_API_KEY:', process.env.PAYOS_API_KEY ? `${process.env.PAYOS_API_KEY.substring(0, 8)}...` : 'NOT SET');
console.log('[DEBUG] PAYOS_CHECKSUM_KEY:', process.env.PAYOS_CHECKSUM_KEY ? `${process.env.PAYOS_CHECKSUM_KEY.substring(0, 8)}...` : 'NOT SET');
console.log('[DEBUG] FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

import authRoutes from './src/modules/auth/routes/auth.routes';
import submissionRoutes from './src/modules/submission/routes/submission.routes';
import userRoutes from './src/modules/user/routes/user.routes';
import courseRoutes from './src/modules/course/routes/course.routes';
import phaseRoutes from './src/modules/phase/routes/phase.routes';
import lessonRoutes from './src/modules/lesson/routes/lesson.routes';
import enrollmentRoutes from './src/modules/enrollment/routes/enrollment.routes';
import problemRoutes from './src/modules/problem/routes/problem.routes';
import testcaseRoutes from './src/modules/testcase/routes/testcase.routes';
import progressRoutes from './src/modules/progress/routes/progress.routes';
import lessonProgressRoutes from './src/modules/lessonProgress/routes/lessonProgress.routes';
import notificationRoutes from './src/modules/notification/routes/notification.routes';
import minitestRoutes from './src/modules/minitest/routes/minitest.routes';
import hackathonRoutes from './src/modules/hackathon/routes/hackathon.routes';
import leaderboardRoutes from './src/modules/leaderboard/routes/leaderboard.routes';
import projectRoutes from './src/modules/project/routes/project.routes';
import certificateRoutes from './src/modules/certificate/routes/certificate.routes';
import feedbackRoutes from './src/modules/feedback/routes/feedback.routes';
import statsRoutes from './src/modules/stats/routes/stats.routes';
import uploadRoutes from './src/modules/upload/routes';
import paymentRoutes from './src/modules/payment/routes/payment.routes';
import adminRoutes from './src/modules/admin/routes/admin.routes';
import lectureRoutes from './src/modules/lecture/routes/lecture.routes';
import lessonRequestRoutes from './src/modules/lessonRequest/routes/lessonRequest.routes';
import lessonContentRoutes from './src/modules/lessonContent/routes/lessonContent.routes';
import lessonReviewRoutes from './src/modules/lessonReview/routes/lessonReview.routes';
import scoringRoutes from './src/modules/scoring/routes/scoring.routes';
import courseAccessRoutes from './src/modules/courseAccess/courseAccess.routes';
import aiRoutes from './src/modules/ai/routes/ai.routes';
import emailService from './src/modules/email/email.service';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8000',
    'http://localhost:8001',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('CodeFit API running');
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString() });
  }
});

// Test email route
app.post('/api/test-email', async (req: Request, res: Response) => {
  const { to, userName, courseTitle, lessonTitle } = req.body;
  
  if (!to) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const lessonUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/lessons/${lessonTitle}`;
  
  await emailService.sendNewLessonNotification(
    to,
    userName || 'Test User',
    courseTitle || 'Test Course',
    lessonTitle || 'Test Lesson',
    lessonUrl
  );

  res.json({ success: true, message: `Test email sent to ${to}` });
});

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/phases', phaseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/testcases', testcaseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lesson-progress', lessonProgressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/minitests', minitestRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lecture', lectureRoutes);
app.use('/api/lesson-requests', lessonRequestRoutes);
app.use('/api/lesson-content', lessonContentRoutes);
app.use('/api/lesson-reviews', lessonReviewRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/course-access', courseAccessRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
