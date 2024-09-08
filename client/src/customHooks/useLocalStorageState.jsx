import { useEffect, useState } from 'react';

export function useLocalStorageState(initialState, localStorageTag) {
  const storedValue = JSON.parse(localStorage.getItem(localStorageTag));
  const [watched, setWatched] = useState(storedValue ? storedValue : initialState);

  // WRITE OFF TO LOCALSTORAGE WHENEVER WACTHED MOVIES LIST STATE CHANGES
  useEffect(
    function () {
      localStorage.setItem(localStorageTag, JSON.stringify(watched));
    },
    [watched, localStorageTag]
  );

  return [watched, setWatched];
}
