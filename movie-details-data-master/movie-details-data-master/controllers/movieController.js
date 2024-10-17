import { ObjectId } from 'mongodb';


// Get All Movies API Controller
export const getMovies = async (req, res) => {
    try {
        const movies = await global.db.collection('movie_application').find({}).toArray();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies' });
    }
};


// Get Movie Details by ID API Controller
export const getMovieById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the movie by ID
        const movie = await global.db.collection('movie_application').findOne({ _id: new ObjectId(id) });

        // Check if the movie exists
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Return the movie details
        res.status(200).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movie details' });
    }
};


// Book Movie API Controller
export const bookMovie = async (req, res) => {
    const { movieId, showId, seats, name, email, phoneNumber } = req.body;

    // Validate input
    if (!movieId || !showId || !seats || !name || !email || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure seats is a valid number
    const requestedSeats = parseInt(seats);
    if (isNaN(requestedSeats) || requestedSeats <= 0) {
        return res.status(400).json({ message: 'Invalid number of seats' });
    }

    try {
        // Find the movie by ID
        const movie = await global.db.collection('movie_application').findOne(
            { _id: new ObjectId(movieId) }
        );

        // Check if the movie exists
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Find the showtime by ID
        const show = Object.values(movie.shows).flat().find(s => s.id === showId);
        if (!show) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        // Check if there are enough seats available
        if (parseInt(show.seats) < requestedSeats) {
            return res.status(400).json({ message: 'Not enough seats available for booking' });
        }

        // Update the seats available
        const updatedSeats = parseInt(show.seats) - requestedSeats;

        // Get the index of the show in the original movie object
        const date = Object.keys(movie.shows).find(d => movie.shows[d].some(s => s.id === showId));
        const showIndex = movie.shows[date].findIndex(s => s.id === showId);

        // Prepare user data (no bookedAt field)
        const userBooking = {
            name,
            email,
            phoneNumber,
            seats: requestedSeats
        };

        // Update the movie document to reflect the new seats for the specific showtime
        const updateResult = await global.db.collection('movie_application').updateOne(
            { _id: new ObjectId(movieId) },
            {
                $set: { [`shows.${date}.${showIndex}.seats`]: updatedSeats },
                $push: { [`shows.${date}.${showIndex}.bookings`]: userBooking } // Add user booking info
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to update seats or bookings' });
        }

        // Return a success response
        res.status(200).json({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};