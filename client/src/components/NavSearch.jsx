import { useRef } from 'react';
import { useKey } from '../customHooks/useKey';

export default function NavSearch({ query, setQuery }) {
  // WARNING | IMPERATIVE - non-react way of manuplating dom elements
  // useEffect(function () {
  //   const el = document.querySelector('.search');
  //   console.log(el);
  //   el.focus();
  // }, []);

  // DECLARATIVE - REACT way of manuplating dom elements
  const inputEl = useRef(null);
  // useEffect(
  //   function () {
  //     function cb(event) {
  //       // DISABLE ENTER INDUCED SEARCH FIELD RESET WHEN WE ARE ON THE SEARCH FIELD
  //       if (document.activeElement === inputEl.current) {
  //         return;
  //       }
  //       // CLEAR THE SEARCH FIELD UPON ENTER KEYPRESS
  //       if (event.code === 'Enter' || 'NumpadEnter') {
  //         // FOCUS ON SEARCH BAR UPON NAVBAR MOUNT
  //         // console.log(inputEl.current); // inputEl.current is DOM element
  //         inputEl.current.focus();
  //         // CLEAR THE SEARCH FIELD
  //         setQuery('');
  //       }
  //     }

  //     document.addEventListener('keydown', cb);
  //     return function cleanup() {
  //       document.removeEventListener('keydown', cb);
  //       // console.log('Removing event listener');
  //     };
  //   },
  //   [setQuery]
  // );
  // CUSTOM HOOK VERSION
  useKey(
    () => {
      // FOCUS ON SEARCH BAR UPON NAVBAR MOUNT
      inputEl.current.focus();
      // CLEAR THE SEARCH FIELD
      setQuery('');
    },
    'keydown',
    'Enter',
    'NumpadEnter'
  );

  return (
    <input
      ref={inputEl}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
