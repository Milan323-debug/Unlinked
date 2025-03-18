import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import connectionRoutes from './routes/connection.route.js';

import {connectDB} from './lib/db.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if(process.env.NODE_ENV !== 'production'){
  app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
   })
 );
} else {
  app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }));
}
app.use(express.json({ limit:"5mb" }));  //parse json body
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

if(process.env.NODE_ENV === 'production'){
  // Serve static assets
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
  // Handle routes for SPA
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });  
}

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  connectDB();
});