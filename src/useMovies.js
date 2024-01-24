import { useEffect, useState } from 'react';

export function useMovies(query, callback) {
	const APIKEY = '327c17b6'; //@erhan1
	// const APIKEY = '6cdd8a72' //Alternate @erhan10
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(
		function () {
			const controller = new AbortController(); //Controls fetching via signal property
			const signal = controller.signal;

			// If query statement is absent/not certain length, do not bother to initiate fetching algorithm
			if (query.length < 3) {
				setMovies([]);
				setError('');
				return;
			}

			//handleCloseMovie()
			callback?.();

			//API FETCH
			// async function fetchMovies() {
			(async function fetchMovies() {
				try {
					// Start loader
					setIsLoading(true);
					// Reset Error status
					setError('');

					const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`, {
						signal,
					});

					// console.log(res);
					if (!res.ok) throw new Error('Something went wrong with fetching movies');

					const data = await res.json();

					// console.log(data);
					if (data.Response === 'False') throw new Error('Movie not found');

					// Render results
					// console.log(data.Search);
					setMovies(data.Search);
					setError('');
				} catch (err) {
					if (err.name !== 'AbortError') {
						console.log(err);
						setError(err.message); // Deploy error message on UI
					}
				} finally {
					// Stop loader
					setIsLoading(false);
				}
			})();

			// fetchMovies();

			//CLEANUP FUNCTION
			return function () {
				controller.abort();
			};
		},
		[query, callback],
	);

	return { movies, isLoading, error, APIKEY };
}
