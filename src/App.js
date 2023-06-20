import { useEffect, useState } from 'react'
import StarRating from './StarRating'

const average = arr =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

// const APIKEY = '6cdd8a72' //@erhan10
const APIKEY = '327c17b6' //@erhan1

export default function App() {
	const [movies, setMovies] = useState([])
	const [watched, setWatched] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState(null)

	// const tempQuery = 'interstellar'
	// const tempQuery = 'xcxxcx'

	function handleSelectMovie(id) {
		setSelectedId(selectedId => (id === selectedId ? null : id))
	}

	function handleCloseMovie() {
		setSelectedId(null)
	}

	// useEffect(function () {
	// 	console.log('After Initial Render')
	// }, [])
	// useEffect(function () {
	// 	console.log('After Every Render')
	// })
	// console.log('During Render')

	// // Version #1 fetch.then version
	// useEffect(function () {
	// 	fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`)
	// 		.then(res => res.json())
	// 		.then(data => setMovies(data.Search))
	// }, [])
	// Version #2 Async-await version
	// useEffect(function () {
	// 	async function fetchMovies() {
	// 		const res = await fetch(
	// 			`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`,
	// 		)
	// 		const data = await res.json()
	// 		setMovies(data.Search)
	// 	}
	// 	fetchMovies()
	// }, [])
	useEffect(
		function () {
			async function fetchMovies() {
				try {
					setIsLoading(true)
					setError('')
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}}`,
					)
					// console.log(res)
					if (!res.ok)
						throw new Error('Something went wrong with fetching movies')

					const data = await res.json()
					if (data.Response === 'False') throw new Error('Movie not found')

					setMovies(data.Search)
					// console.log(data)
				} catch (err) {
					// console.log(err.message)
					setError(err.message)
				} finally {
					setIsLoading(false)
				}
			}

			if (query.length < 3) {
				setMovies([])
				setError('')
			} else fetchMovies()
		},
		[query],
	)

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				{/* Alternative #1 Proppping as children to cut down prop drilling */}
				<Box>
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList watched={watched} />
						</>
					)}
				</Box>
				{/* Alternative #2 Passing Elements as Props */}
				{/* <Box element={<MovieList movies={movies} />} />
				<Box
					element={
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList watched={watched} />
						</>
					}
				/> */}
			</Main>
		</>
	)
}

function Loader() {
	return <p className="loader">Loading...</p>
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span>
			{message}
		</p>
	)
}

function NavBar({ children }) {
	return <nav className="nav-bar">{children}</nav>
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	)
}

function Search({ query, setQuery }) {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => setQuery(e.target.value)}
		/>
	)
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong> {movies.length}</strong> results
		</p>
	)
}

function Main({ children }) {
	return <main className="main">{children}</main>
}

// Alternative #1 Proppping as children to cut down prop drilling
function Box({ children }) {
	// Alternative #2 Passing Elements as Props
	// function Box({ element }) {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{/* {isOpen && element} */}
			{isOpen && children}
		</div>
	)
}

function MovieList({ movies, onSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map(movie => (
				<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	)
}

function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	)
}

function MovieDetails({ selectedId, onCloseMovie }) {
	const [movie, setMovie] = useState('')
	const [isLoading, setIsLoading] = useState(false)

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
	} = movie

	// console.log(title, year)

	useEffect(
		function () {
			return async function getMovieDetails() {
				setIsLoading(true)
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedId}`,
				)
				const data = await res.json()
				// console.log(data)
				setMovie(data)
				setIsLoading(false)
			}
		},
		[selectedId],
	)

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
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB Rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							<StarRating maxRating={10} size={24} />
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
	)
}

function WatchedMoviesList({ watched }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<li key={movie.imdbID}>
					<img src={movie.Poster} alt={`${movie.Title} poster`} />
					<h3>{movie.Title}</h3>
					<div>
						<p>
							<span>⭐️</span>
							<span>{movie.imdbRating}</span>
						</p>
						<p>
							<span>🌟</span>
							<span>{movie.userRating}</span>
						</p>
						<p>
							<span>⏳</span>
							<span>{movie.runtime} min</span>
						</p>
					</div>
				</li>
			))}
		</ul>
	)
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map(movie => movie.imdbRating))
	const avgUserRating = average(watched.map(movie => movie.userRating))
	const avgRuntime = average(watched.map(movie => movie.runtime))

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
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	)
}
