import { useEffect, useState } from 'react'

const average = arr =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const APIKEY = '327c17b6' //@erhan1
// const APIKEY = '6cdd8a72' //Alternate @erhan10

export default function App() {
	const [movies, setMovies] = useState([])
	const [watched, setWatched] = useState([])
	const [isLoading, setIsLoading] = useState(false)

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
	useEffect(function () {
		return async function fetchMovies() {
			setIsLoading(true)
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${APIKEY}&s=interstellar`,
			)
			const data = await res.json()
			setMovies(data.Search)
			setIsLoading(false)
		}
	}, [])

	return (
		<>
			<NavBar>
				<Logo />
				<Search />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				{/* Alternative #1 Proppping as children to cut down prop drilling */}
				<Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box>
				<Box>
					<>
						<WatchedSummary watched={watched} />
						<WatchedMoviesList watched={watched} />
					</>
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

function Search() {
	const [query, setQuery] = useState('')

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

function MovieList({ movies }) {
	return (
		<ul className="list">
			{movies?.map(movie => (
				<Movie movie={movie} key={movie.imdbID} />
			))}
		</ul>
	)
}

function Movie({ movie }) {
	return (
		<li>
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
