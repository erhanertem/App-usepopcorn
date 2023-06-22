import { useEffect, useState } from 'react'

const average = arr =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const APIKEY = '327c17b6' //@erhan1
// const APIKEY = '6cdd8a72' //Alternate @erhan10

export default function App() {
	const [movies, setMovies] = useState([])
	const [watched, setWatched] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState(null)
	// const [selectedId, setSelectedId] = useState('tt1570538')
	// const tempQuery = 'interstellar'

	//Handle movie select from the movie list
	function handleSelectMovie(id) {
		setSelectedId(selectedId => (id === selectedId ? null : id))
	}
	//Handle close action @ movie detail button
	function handleCloseMovie() {
		setSelectedId(null)
	}

	// NOTE:Experiment with useEffect depedency array
	// useEffect(function () {
	// 	console.log('After Initial Render')
	// }, [])
	// useEffect(function () {
	// 	console.log('After Every Render')
	// })
	// console.log('During Render')

	//NOTE: Fetching w/out useEffect creates infinite loop side-effect at render time!!
	// fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`)
	// 		.then(res => res.json())
	// 		.then(data => setMovies(data.Search))
	// NOTE: Fetching w/useEffect for dealing with side-effect at rendertime.
	// useEffect(function () {
	// 	fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`)
	// 		.then(res => res.json())
	// 		.then(data => setMovies(data.Search))
	// }, [])
	// NOTE: Fetching w/useEffect async-await version
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
					//Reset loader state
					setIsLoading(true)
					//Reset error state
					setError('')

					//Start fetching data
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,
					)
					// console.log(res)

					//Response error handling from API server
					if (!res.ok)
						throw new Error('Something went wrong with fetching movies')

					//Receive data
					const data = await res.json()
					// console.log(data)

					//No data returned @ response handling from API server
					if (data.Response === 'False') throw new Error('Movie not found')

					//Set movielist array
					setMovies(data.Search)
					// console.log(data.Search)
				} catch (err) {
					// console.error('⛔', err.message)
					setError(err.message)
				} finally {
					setIsLoading(false)
				}
			}

			if (query.length <= 2) {
				setMovies([])
				setError('')
				return
			}

			fetchMovies()
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
					{/* while loading run the loader component else show the movielist component */}
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />}  */}
					{/* while loading run the loader component */}
					{isLoading && <Loader />}
					{/* while not loading and no error display the movielist component */}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{/* while there is error run the error message component */}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{/* If a movie is selected show movie details */}
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

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span>
			{message}
		</p>
	)
}

function Loader() {
	return <p className="loader">Loading...</p>
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
	return (
		<div className="details">
			<button className="btn-back" onClick={onCloseMovie}>
				&larr;
			</button>
			{selectedId}
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
