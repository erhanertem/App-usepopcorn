import { useEffect, useRef } from 'react';
import { useKey } from './useKey';

export function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

export function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

export function SearchBar({ query, setQuery, setSelectedId }) {
	const inputElement = useRef(null);

	//FOCUSING ON THE SEARCH BAR @ INITIAL PAGE LAUNCH VIA USEREF() HOOK

	useKey('Enter', function () {
		// GUARD CLAUSE
		// if already focused to the element, do nothing
		if (document.activeElement === inputElement.current) return;
		// CORE LOGIC
		// if not focused , focus by key press ENTER and remove the query string if existsa from the previous session
		// console.log(inputElement.current);
		inputElement.current.focus();
		setQuery('');
		setSelectedId(null); //Clear the detail pane
	});

	// useEffect(
	// 	function () {
	// 		function callback(e) {
	// 			// GUARD CLAUSE
	// 			// if already focused to the element, do nothing
	// 			if (document.activeElement === inputElement.current) return;

	// 			// CORE LOGIC
	// 			// if not focused , focus by key press ENTER and remove the query string if existsa from the previous session
	// 			if (e.code === 'Enter') {
	// 				console.log(inputElement.current);
	// 				inputElement.current.focus();
	// 				setQuery('');
	// 			}
	// 		}
	// 		document.addEventListener('keydown', callback);
	// 		return () => document.removeEventListener('keydown', callback);
	// 	},
	// 	[setQuery],
	// );

	// // NOTE: WRONG(NOT IDEAL REACT WAY ) FOR LETTING THE PAGE FOCUS ON THIS OBJECT WHEN IT FIRST LAUNCHES
	// useEffect(() => {
	// 	const el = document.querySelector('.search');
	// 	console.log(el);
	// 	el.focus();
	// }, []);

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputElement}
		/>
	);
}

export function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}
