import { useEffect } from 'react';

const InactivityHandler = ({ timeout = 10000, onInactivity }) => {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onInactivity, timeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    // Start the timer on initial load
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [timeout, onInactivity]);

  return null; // This component only handles logic, no UI
};

export default InactivityHandler;
