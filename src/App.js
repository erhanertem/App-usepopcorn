import { useEffect, useState } from 'react'
import StarRating from './StarRating'

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
	// const [query, setQuery] = useState('inception')
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
	//Handle Add New Movie to Watched List
	function handleAddWatchedMovie(newMovieObject) {
		setWatched(watched => [...watched, newMovieObject])
	}
	//Handle Removing a movie from the watched list w/ a filter out by id function
	function handleDeleteWatchedMovie(id) {
		setWatched(watched => watched.filter(movie => movie.imdbID !== id))
	}

	// // NOTE:Experiment with useEffect dependency array
	// useEffect(function () {
	// 	console.log('After Initial Render')
	// }, [])
	// useEffect(function () {
	// 	console.log('After Every Render')
	// })
	// console.log('During Render')
	// useEffect(
	// 	function () {
	// 		console.log('After Every Query')
	// 	},
	// 	[query],
	// )

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
			const controller = new AbortController() //Browser FETCH API for aborting fetching operations - used for cleanup

			async function fetchMovies() {
				try {
					//Start loader state
					setIsLoading(true)
					//Reset error state
					setError('')

					//Start fetching data
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,
						{ signal: controller.signal }, // Declare signal property to interract with abortcontroller
					)
					// console.log(res)

					//Response error handling from API server
					if (!res.ok)
						throw new Error('Something went wrong with fetching movies')

					//Receive data
					const data = await res.json()
					// console.log(data)

					//Blank data returned @ response handling from API server
					if (data.Response === 'False') throw new Error('Movie not found')

					//Set movielist array
					setMovies(data.Search)
					// console.log(data.Search)
					//Reset error state
					setError('')
				} catch (err) {
					if (err.name !== 'AbortError') {
						console.log('⛔', err.message, '🚀', err.name)
						setError(err.message)
					} // Ignore AbortError which is not an error for us
				} finally {
					//Stop loading...
					setIsLoading(false)
				}
			}

			//Search criterion check prior to fetch async function execution
			if (query.length <= 2) {
				setMovies([])
				setError('')
				return
			}

			handleCloseMovie()
			fetchMovies()

			//CLEANUP FUNCTION FOR CANCELLING FETCH REQUEST
			return function () {
				controller.abort()
			}
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
							onAddWatchedMovie={handleAddWatchedMovie}
							watched={watched} //Transfer this watched movie list to refrain users from rating the same movie more than once.
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatchedMovie={handleDeleteWatchedMovie}
							/>
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
// // --> Instead of using abort used setTimeout to not create too many requests every time we type a letter.
// function Search({ query, setQuery }) {
// 	const [message, setMessage] = useState('')

// 	useEffect(() => {
// 		const wait = setTimeout(() => setQuery(message), 500)

// 		return () => clearTimeout(wait)
// 	}, [message, setQuery])

// 	return (
// 		<input
// 			className="search"
// 			type="text"
// 			placeholder="Search movies..."
// 			value={message}
// 			onChange={e => setMessage(e.target.value)}
// 		/>
// 	)
// }

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

function MovieDetails({
	selectedId,
	onCloseMovie,
	onAddWatchedMovie,
	watched,
}) {
	const [movieData, setMovieData] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [userRating, setUserRating] = useState('') //Keeps track of the rating inside the star rating component - extraction state

	//Derived state thru watched list
	//NOTE: We are only grasping the watched list based on their IDs and trying to make sure if whatever item's ID we clicked is actually residing inside this array.
	const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
	// console.log('🤑', isWatched)

	//Derived state to show stars rating on rated movie
	const watchedUserRating = watched.find(
		movie => movie.imdbID === selectedId,
	)?.userRating //Optional chaining to avoid undefined error

	//Rename the received AI movie object properties
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
	} = movieData

	// console.log(title, year)

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating, //transfered star rating from the star component
		}
		onAddWatchedMovie(newWatchedMovie) //Transfer movie to the watched movies array
		onCloseMovie() //Close the movie by deselecting it forcefully
	}

	useEffect(
		function () {
			async function getMovieDetails() {
				try {
					//Start loading...
					setIsLoading(true)
					//Reset error state
					setError('')

					//Start fetching data
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedId}`,
					)
					// console.log(res)

					//Response error handling from API server
					if (!res.ok)
						throw new Error('Something went wrong with fetching movie details')

					//Receive data
					const data = await res.json()
					// console.log(data)

					//Blank data returned @ response handling from API server
					if (data.Response === 'False')
						throw new Error('Movie details not found')

					//Set the movie data object
					setMovieData(data)
					console.log(data)
				} catch (err) {
					// console.error('⛔', err.message)
					setError(err.message)
				} finally {
					//Stop loading...
					setIsLoading(false)
				}
			}
			getMovieDetails()
		},
		[selectedId],
	)

	useEffect(
		function () {
			document.title = `Movie | ${title}`

			//Cleanup function
			return function () {
				document.title = 'usePopcorn'
				console.log(`Clean up effect for movie ${title}`)
			}
		},
		[title],
	)

	//LISTENER FOR ESC KEY PRESS TO CLOSE A SELECTED MOVIE
	useEffect(() => {
		function listener(e) {
			if (e.code === 'Escape') {
				onCloseMovie()
				console.log('CLOSING')
			}
		}

		document.addEventListener('keydown', listener)

		return function () {
			document.removeEventListener('keydown', listener)
		}
	}, [onCloseMovie])

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					{' '}
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
								{imdbRating}
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{/* Show button only if rating is given above 0 */}
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>You rated with movie ⭐ {watchedUserRating}</p>
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
	)
}

function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatchedMovie={onDeleteWatchedMovie}
				/>
			))}
		</ul>
	)
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.poster} alt={`${movie.title} poster`} />
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
				<button
					className="btn-delete"
					onClick={() => onDeleteWatchedMovie(movie.imdbID)}
				>
					&#10006;
				</button>
			</div>
		</li>
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
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(1)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(1)} min</span>
				</p>
			</div>
		</div>
	)
}
