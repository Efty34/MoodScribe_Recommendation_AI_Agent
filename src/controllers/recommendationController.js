const { generateMoviePrompt, generateBookPrompt, generateMusicPrompt, generateExercisePrompt } = require('../utils/promptGenerator');
const { getGroqRecommendations } = require('../services/groqService');
const { getMovieDetails } = require('../services/apiServices');
const { getBookDetails } = require('../services/bookService');
const { getMusicDetails } = require('../services/musicService');

async function getMovieRecommendations(req, res) {
  try {
    const { stressEntryPercentage, pastLikings = null } = req.body;

    // Validate input
    if (typeof stressEntryPercentage !== 'number' || 
        stressEntryPercentage < 0 || 
        stressEntryPercentage > 100) {
      return res.status(400).json({ 
        error: 'Invalid stress entry percentage. Must be a number between 0 and 100 representing the percentage of stress entries in the diary.' 
      });
    }

    // Extract only movie preferences if they exist
    const moviePreferences = pastLikings ? {
      favoriteMovies: pastLikings.favoriteMovies || []
    } : null;

    // Generate prompt for Groq
    const prompt = generateMoviePrompt(stressEntryPercentage, moviePreferences);

    // Get recommendations from Groq
    const groqRecommendations = await getGroqRecommendations(prompt);

    // Get movie recommendations from TMDB
    const movies = await getMovieDetails(groqRecommendations.movies);

    res.json({ 
      movies,
      analysisContext: {
        stressEntryPercentage,
        nonStressEntryPercentage: 100 - stressEntryPercentage,
        recommendationType: stressEntryPercentage >= 40 ? 'stress-relief' : 'positive-enhancement',
        personalizedRecommendations: Boolean(moviePreferences?.favoriteMovies?.length > 0)
      }
    });
  } catch (error) {
    console.error('Error in movie recommendations:', error.message);
    res.status(500).json({ 
      error: 'Failed to get movie recommendations',
      details: error.message 
    });
  }
}

async function getBookRecommendations(req, res) {
  try {
    const { stressEntryPercentage, pastLikings = null } = req.body;

    // Validate input
    if (typeof stressEntryPercentage !== 'number' || 
        stressEntryPercentage < 0 || 
        stressEntryPercentage > 100) {
      return res.status(400).json({ 
        error: 'Invalid stress entry percentage. Must be a number between 0 and 100 representing the percentage of stress entries in the diary.' 
      });
    }

    // Extract only book preferences if they exist
    const bookPreferences = pastLikings ? {
      favoriteBooks: pastLikings.favoriteBooks || []
    } : null;

    // Generate prompt for Groq
    const prompt = generateBookPrompt(stressEntryPercentage, bookPreferences);

    // Get recommendations from Groq
    const groqRecommendations = await getGroqRecommendations(prompt);

    // Get book recommendations from Google Books
    const books = await getBookDetails(groqRecommendations.books);

    res.json({ 
      books,
      analysisContext: {
        stressEntryPercentage,
        nonStressEntryPercentage: 100 - stressEntryPercentage,
        recommendationType: stressEntryPercentage >= 40 ? 'stress-relief' : 'positive-enhancement',
        personalizedRecommendations: Boolean(bookPreferences?.favoriteBooks?.length > 0)
      }
    });
  } catch (error) {
    console.error('Error in book recommendations:', error.message);
    res.status(500).json({ 
      error: 'Failed to get book recommendations',
      details: error.message 
    });
  }
}

async function getMusicRecommendations(req, res) {
  try {
    const { stressEntryPercentage, pastLikings = null } = req.body;

    if (typeof stressEntryPercentage !== 'number' || 
        stressEntryPercentage < 0 || 
        stressEntryPercentage > 100) {
      return res.status(400).json({ 
        error: 'Invalid stress entry percentage. Must be a number between 0 and 100.' 
      });
    }

    const musicPreferences = pastLikings ? {
      favoriteSongs: pastLikings.favoriteSongs || []
    } : null;

    const prompt = generateMusicPrompt(stressEntryPercentage, musicPreferences);
    const groqRecommendations = await getGroqRecommendations(prompt);
    const songs = await getMusicDetails(groqRecommendations.songs);

    res.json({ 
      songs,
      analysisContext: {
        stressEntryPercentage,
        nonStressEntryPercentage: 100 - stressEntryPercentage,
        recommendationType: stressEntryPercentage >= 40 ? 'stress-relief' : 'positive-enhancement',
        personalizedRecommendations: Boolean(musicPreferences?.favoriteSongs?.length > 0)
      }
    });
  } catch (error) {
    console.error('Error in music recommendations:', error.message);
    res.status(500).json({ 
      error: 'Failed to get music recommendations',
      details: error.message 
    });
  }
}

async function getExerciseRecommendations(req, res) {
  try {
    const { stressEntryPercentage, pastLikings = null } = req.body;

    if (typeof stressEntryPercentage !== 'number' || 
        stressEntryPercentage < 0 || 
        stressEntryPercentage > 100) {
      return res.status(400).json({ 
        error: 'Invalid stress entry percentage. Must be a number between 0 and 100.' 
      });
    }

    const exercisePreferences = pastLikings ? {
      favoriteExercises: pastLikings.favoriteExercises || []
    } : null;

    const prompt = generateExercisePrompt(stressEntryPercentage, exercisePreferences);
    const groqRecommendations = await getGroqRecommendations(prompt);

    res.json({ 
      exercises: groqRecommendations.exercises,
      analysisContext: {
        stressEntryPercentage,
        nonStressEntryPercentage: 100 - stressEntryPercentage,
        recommendationType: stressEntryPercentage >= 40 ? 'stress-relief' : 'positive-enhancement',
        personalizedRecommendations: Boolean(exercisePreferences?.favoriteExercises?.length > 0)
      }
    });
  } catch (error) {
    console.error('Error in exercise recommendations:', error.message);
    res.status(500).json({ 
      error: 'Failed to get exercise recommendations',
      details: error.message 
    });
  }
}

async function getCombinedRecommendations(req, res) {
  try {
    const { stressEntryPercentage, pastLikings = null } = req.body;

    if (typeof stressEntryPercentage !== 'number' || 
        stressEntryPercentage < 0 || 
        stressEntryPercentage > 100) {
      return res.status(400).json({ 
        error: 'Invalid stress entry percentage. Must be a number between 0 and 100.' 
      });
    }

    const moviePreferences = pastLikings ? {
      favoriteMovies: pastLikings.favoriteMovies || []
    } : null;

    const bookPreferences = pastLikings ? {
      favoriteBooks: pastLikings.favoriteBooks || []
    } : null;

    const musicPreferences = pastLikings ? {
      favoriteSongs: pastLikings.favoriteSongs || []
    } : null;

    const exercisePreferences = pastLikings ? {
      favoriteExercises: pastLikings.favoriteExercises || []
    } : null;

    const [movieRecommendations, bookRecommendations, musicRecommendations, exerciseRecommendations] = await Promise.all([
      getGroqRecommendations(generateMoviePrompt(stressEntryPercentage, moviePreferences)),
      getGroqRecommendations(generateBookPrompt(stressEntryPercentage, bookPreferences)),
      getGroqRecommendations(generateMusicPrompt(stressEntryPercentage, musicPreferences)),
      getGroqRecommendations(generateExercisePrompt(stressEntryPercentage, exercisePreferences))
    ]);

    const [movies, books, songs] = await Promise.all([
      getMovieDetails(movieRecommendations.movies),
      getBookDetails(bookRecommendations.books),
      getMusicDetails(musicRecommendations.songs)
    ]);

    res.json({ 
      movies,
      books,
      songs,
      exercises: exerciseRecommendations.exercises,
      analysisContext: {
        stressEntryPercentage,
        nonStressEntryPercentage: 100 - stressEntryPercentage,
        recommendationType: stressEntryPercentage >= 40 ? 'stress-relief' : 'positive-enhancement',
        personalizedRecommendations: {
          movies: Boolean(moviePreferences?.favoriteMovies?.length > 0),
          books: Boolean(bookPreferences?.favoriteBooks?.length > 0),
          songs: Boolean(musicPreferences?.favoriteSongs?.length > 0),
          exercises: Boolean(exercisePreferences?.favoriteExercises?.length > 0)
        }
      }
    });
  } catch (error) {
    console.error('Error in combined recommendations:', error.message);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message 
    });
  }
}

module.exports = {
  getMovieRecommendations,
  getBookRecommendations,
  getMusicRecommendations,
  getExerciseRecommendations,
  getCombinedRecommendations
}; 