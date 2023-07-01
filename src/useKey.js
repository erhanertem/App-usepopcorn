import { useEffect } from 'react'

export function useKey(key, actionFunc) {
	//LISTENER FOR ESC KEY PRESS TO CLOSE A SELECTED MOVIE
	useEffect(() => {
		function listener(e) {
			if (e.code.toLowerCase() === key.toLowerCase()) {
				actionFunc()
			}
		}

		document.addEventListener('keydown', listener)

		return function () {
			document.removeEventListener('keydown', listener)
		}
	}, [key, actionFunc])
}
