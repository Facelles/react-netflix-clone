import React from "react";

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const { title, vote_average,
    poster_path, release_date, original_language, budget, overview,
    runtime, status, genres, production_companies, tagline, vote_count, trailerUrl,
    backdrops = [], posters = []
        } = movie;

  return (
    <div className="modal-overlay">
        <div className="modal-wrapper">
            <h2>{title}</h2>
                <section className="section-header">
                    <img src="star-movie.svg" alt="Star Icon" className="w-5 h-5" />
                    <p>{vote_average ? (vote_average.toFixed(1) + '/10' + `(${vote_count})`) : 'N/A'}</p>
                </section>
               <p>
                    {release_date ? release_date.split('-')[0] : 'N/A'}
                    <span> • </span>
                    {original_language ? original_language.toUpperCase() : 'N/A'}
                    <span> • </span>
                    {runtime ? `${runtime} min` : 'N/A'}
                </p>

            <div className="modal-content">
                <div className="images">
                    <img  className="first-img h-126" src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />
                    <iframe 
                    className="second-img h-126"
                    src={trailerUrl ? trailerUrl.replace("watch?v=", "embed/") : ""}
                    title="YouTube trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>

                <div className="details">
                    <div className="flex flex-col space-y-4">
                        <div className="generes-row">
                            <p>Genres</p>
                            <ul className="generes">
                                {genres.map((genre) => (
                                <li key={genre.id}>{genre.name}</li>
                                ))}
                            </ul>
                            <button className="home-page" onClick={onClose}>Visit Home Page → </button>
                        </div>

                        <div className="overview">
                            <p>Overview</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
  );
};

export default MovieModal;
