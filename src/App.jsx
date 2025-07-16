import { use, useEffect, useState } from "react";
import { Search } from "./components/Search";
import { Spinner } from "./components/Spinner";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import { getTrendingMovies } from "./appwrite";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovieAssets = async (movieId) => {

    try{
      
      const[imagesRes, videosRes] = await Promise.all([
        
        fetch(`${API_BASE_URL}/movie/${movieId}/images?language=en-US`, API_OPTIONS),
        fetch(`${API_BASE_URL}/movie/${movieId}/videos?language=en-US`, API_OPTIONS)

      ]);

      const imagesData = await imagesRes.json();
      const videosData = await videosRes.json();

      const backdrops = imagesData.backdrops.slice(0,2);
      const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

      return {
        backdrops,
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        posters: imagesData.posters || [],
      }

    }
    catch (er){
      console.error("Error fetching movie assets: ", er);
      return { backdrops: [], trailerUrl: null };
    }

  }

  const fetchMovieDetails = async (movieId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/movie/${movieId}?language=en-US`, API_OPTIONS);
    const data = await res.json();

    const assets = await fetchMovieAssets(movieId);

    setSelectedMovie({ ...data, ...assets });
  } catch (err) {
    console.error("Error fetching movie details: ", err);
  }
};

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(
          data.Error || "Failed to fetch movies. Please try again later."
        );
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0] );
      }


    } catch (error) {
      console.error("Error fetching movies: ", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    }
    catch (error) {
      console.error("Error fetching trending movies: ", error);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  },[]);

  useEffect(() => {
    if (selectedMovie) {
      console.log("Selected movie:", selectedMovie);
    }
  },[selectedMovie]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero-img.png" alt="hero-bg" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

        </div>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>
              Trending Movies
            </h2>
            <ul >
              {trendingMovies.map((movie, index) => (
                <li onClick={() => fetchMovieDetails(movie.id)} key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => fetchMovieDetails(movie.id)}/>
              ))}
            </ul>
          )}
        </section>

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}

      </div>
    </main>
  );
};

export default App;
