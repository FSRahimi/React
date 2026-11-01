import { useEffect, useState } from "react";

function LibraryClock() {
  /*
    WHAT: Store the current time.
    WHY: The UI must update when time changes.
    WHEN: When data changes over time.
  */
  const [time, setTime] = useState<Date>(
    () => new Date()
  );

  /*
    WHAT: Start a timer after rendering.
    WHY: Timers are external to React rendering.
    WHEN: For clocks, countdowns and polling.
  */
  useEffect(() => {
    // WHAT: Run a function every 1000 milliseconds.
    const timerId = window.setInterval(() => {
      // Update the time state.
      setTime(new Date());
    }, 1000);

    /*
      WHAT: Cleanup function.
      WHY: Stop the timer when the component unmounts.
      WHEN: Whenever an effect creates a timer.
    */
    return () => {
      window.clearInterval(timerId);
    };

    /*
      WHAT: Empty dependency array.
      WHY: No changing props or state are read in setup.
      WHEN: Setup should remain active for this mount.

      NOTE: StrictMode tests setup and cleanup
      with an extra cycle in development.
    */
  }, []);

  return (
    <div className="info-card">
      <h2>Library Clock</h2>

      {/* Display the current time */}
      <p className="clock-time">
        {time.toLocaleTimeString("en-GB")}
      </p>
    </div>
  );
}

export default LibraryClock;
