import express from 'express';
import { getMovies, bookMovie, getMovieById } from '../controllers/movieController.js';

const router = express.Router();

// Get All Movies API Route
router.get('/get-movie', getMovies);

// Get Particular movie details by movie ID API Route
router.get('/:id', getMovieById);

// Route for booking a movie
router.post('/book-movie', bookMovie);

export default router;
