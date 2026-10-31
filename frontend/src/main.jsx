import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";


function App() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Подключение...");
  const [error, setError] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/stream/");

    const handleProgress = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      setStatus(`Выполнено: ${data.progress}%`);
    };

    const handleComplete = (event) => {
      setStatus(event.data);
      eventSource.close();
    };

    eventSource.addEventListener("progress", handleProgress);
    eventSource.addEventListener("complete", handleComplete);
    eventSource.onerror = () => {
      setError("Ошибка подключения к SSE-потоку");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main>
      <h1>Прогресс задачи</h1>
      <p>{status}</p>
      <progress value={progress} max="100" />
      {error && <p className="error">{error}</p>}
    </main>
  );
}


createRoot(document.getElementById("root")).render(<App />);
