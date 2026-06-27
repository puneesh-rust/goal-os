import express from 'express';
import { generateRoadmap } from '../controllers/goalController.js';

const router = express.Router();

// POST /api/generate
router.post('/generate', generateRoadmap);

export default router;
