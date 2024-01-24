import { useEffect, useRef, useState } from 'react';
import { average } from './App';
import StarRating from './StarRating';
import { Loader } from './Loader';
import { useKey } from './useKey';

export function Main({ children }) {
	return <main className="main">{children}</main>;
}

//> EXPLICIT COMPOSITION
// export function Box({ element }) {
// 	const [isOpen, setIsOpen] = useState(true);
// 	return (
// 		<div className="box">
// 			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
// 				{isOpen ? '–' : '+'}
// 			</button>
// 			{isOpen && element}
// 		</div>
// 	);
// }

//> IMPLICIT COMPOSITION
export function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

// export function ListBox({ children }) {
// 	const [isOpen1, setIsOpen1] = useState(true);

// 	return (
// 		<div className="box">
// 			<button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
// 				{isOpen1 ? '–' : '+'}
// 			</button>
// 			{isOpen1 && children}
// 		</div>
// 	);
// }

// export function WatchedBox({ children }) {
// 	const [isOpen2, setIsOpen2] = useState(true);

// 	return (
// 		<div className="box">
// 			<button className="btn-toggle" onClick={() => setIsOpen2((open) => !open)}>
// 				{isOpen2 ? '–' : '+'}
// 			</button>
// 			{isOpen2 && children}
// 		</div>
// 	);
// }

export function MovieList({ movies, onSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
			))}
		</ul>
	);
}

function Movie({ movie, onSelectMovie }) {
	return (
		<li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓️</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

export function WatchedMovieListSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	// console.log(avgImdbRating);
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	// console.log(avgUserRating);
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	// console.log(avgRuntime);

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

export function WatchedMovieList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((watchedMovie) => (
				<WatchedMovie
					watchedMovie={watchedMovie}
					key={watchedMovie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ watchedMovie, onDeleteWatched }) {
	return (
		<li key={watchedMovie.imdbID}>
			<img src={watchedMovie.poster} alt={`${watchedMovie.title} poster`} />
			<h3>{watchedMovie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{watchedMovie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{watchedMovie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{watchedMovie.runtime} min</span>
				</p>
				<button className="btn-delete" onClick={() => onDeleteWatched(watchedMovie.imdbID)}>
					X
				</button>
			</div>
		</li>
	);
}

export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched, apiKey }) {
	const [movieData, setMovieData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	/* 
	NOTE: ESTABLISH A MUTABLE REACT REFERENCE KEEPING TRACK OF COUNT OF CLICKS TILL ADDTOLIST 
	BUTTON CLICKED. MUTABLE REF KEEPS GETTING INCREMENT AS NEW USERRATING STATE GETS REGISTERED.  
	*/
	const countRef = useRef(0);
	useEffect(
		function () {
			if (userRating) countRef.current = countRef.current++;
		},
		[userRating],
	);

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movieData;

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

	// BUG - CREATING BUG via VILOLATION OF REACT HOOK RULES
	// /* eslint-disable */
	// > Conditionalizing a hook
	// if (imdbRating > 8) {
	// 	[isTop, setIsTop] = useState(true);
	// }
	// > Returning from a hook other than a cleanup function or a function returning a function
	// if (imdbRating > 8) return <p>Greatest Ever!</p>;

	// const [isTop, setIsTop] = useState(imdbRating > 8);
	// console.log(isTop);
	// useEffect(
	// 	function () {
	// 		setIsTop(imdbRating > 8);
	// 	},
	// 	[imdbRating],
	// );
	// const isTop = imdbRating > 8;
	// console.log(isTop);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			runtime: Number(runtime.split(' ').at(0)),
			imdbRating: Number(imdbRating),
			userRating,
			countRatingDecisions: countRef.current,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}

	useKey('Escape', onCloseMovie);
	// useEffect(
	// 	function () {
	// 		function callback(e) {
	// 			// console.log(e);
	// 			if (e.code === 'Escape') {
	// 				onCloseMovie();
	// 				console.log('CLOSING');
	// 			}
	// 		}

	// 		document.addEventListener('keydown', callback);

	// 		//Cleanup function
	// 		return function () {
	// 			document.removeEventListener('keydown', callback);
	// 		};
	// 	},
	// 	[onCloseMovie],
	// );

	//>  details of the selected movie @ component mount
	useEffect(
		function () {
			(async function () {
				setIsLoading(true);
				const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`);
				const data = await res.json();

				console.log(apiKey);
				console.log(data);
				setMovieData(data);
				setIsLoading(false);
			})();
		},
		[apiKey, selectedId],
	);

	//> Change the tab name upon component mount
	useEffect(
		function () {
			//GUARD CLAUSE
			//In slow 3G speed, til the movie is fetched, temporariliy title is absent and returns undefined
			if (!title) return;

			//CORE LOGIC
			document.title = `Movie | ${title}`;

			return function () {
				document.title = `usePopcorn`;
			};
		},
		[title],
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${title} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating maxRating={10} size={24} onSetUserRating={setUserRating} />
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You've already rated this movie <span>🌟</span>
									{watchedUserRating}
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
