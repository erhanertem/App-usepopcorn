import { useEffect, useState } from 'react'

const APIKEY = '327c17b6' //@erhan1
// const APIKEY = '6cdd8a72' //Alternate @erhan10

export function useMovies(query, callback) {
	const [movies, setMovies] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

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

			// handleCloseMovie() //We receive this from App component thru callback parameter to this cuzstom hook as follows!
			callback?.() //Added a callback parameter in order to customize custom hook further
			fetchMovies()

			//CLEANUP FUNCTION FOR CANCELLING FETCH REQUEST
			return function () {
				controller.abort()
			}
		},
		[query, callback],
	)

	return { movies, isLoading, error } // App component requires these in its own code so we need to return these preferably in an object literal.
}
