import { useEffect } from 'react';

export function useKey(key, action) {
	useEffect(
		function () {
			function callback(event) {
				// console.log(event);
				if (event.code.toLowerCase() === key.toLowerCase()) {
					action();
					// console.log('CLOSING');
				}
			}

			document.addEventListener('keydown', callback);

			//Cleanup function
			return function () {
				document.removeEventListener('keydown', callback);
			};
		},
		[action, key],
	);
}
