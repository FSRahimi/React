import { useEffect, useState } from "react";

function StudyTimer() {
  const [seconds, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTime((previous) => previous + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;

  const handleStartPause = (): void => {
    setIsRunning((previous) => !previous);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <section className="info-card study-timer">
      <h2>Study Timer</h2>
      <p className="timer-time">{formattedTime}</p>
      <div className="timer-buttons">
        <button type="button" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default StudyTimer;