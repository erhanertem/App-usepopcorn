import { useEffect } from 'react';

export function useKey(actionFn, eventType, ...keyCodes) {
  useEffect(
    function () {
      function cb(event) {
        // Convert event code to lowercase for case-insensitive string comparison
        const eventCode = event.code.toLowerCase();
        // Check if the event's key code matches any of the provided keyCodes
        const isKeyMatch = keyCodes.some((keyCode) => keyCode.toLowerCase() === eventCode);
        // If any of the keyCodes hit, fire the action function
        if (isKeyMatch) {
          actionFn();
        }
      }

      document.addEventListener(eventType, cb);
      // CLEANUP EVENTLISTENER
      return function cleanup() {
        document.removeEventListener(eventType, cb);
        // console.log('Removing eventlistener');
      };
    },
    [actionFn, eventType, keyCodes]
  );
}
