import { useState, useEffect } from 'react'

export function useLocalStorageState(initialState, localSaveKey) {
	const [value, setValue] = useState(function () {
		const storedValue = localStorage.getItem(localSaveKey)
		// console.log(storedValue)
		// IMPORTANT! What if we deleted the localstorage after saving it. It wont exist and return null. So before we parse it we have to check if it exists!
		// return JSON.parse(storedValue) //GETS THGE INITIAL VALUE FROM THE LOCAL STORAGE
		return storedValue ? JSON.parse(storedValue) : initialState //GETS THGE INITIAL VALUE FROM THE LOCAL STORAGE
	})

	useEffect(
		function () {
			localStorage.setItem(localSaveKey, JSON.stringify(value))
		},
		[value, localSaveKey],
	)

	return [value, setValue]
}
