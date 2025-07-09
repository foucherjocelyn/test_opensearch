import axios from './axios';
import { useEffect, useState } from 'react';

type Log = {
  timestamp: string;
  level: string;
  service: string;
  message: string;
};

function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get('/logs/search');
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {logs.map((log, index) => (
        <li key={index}>{log.timestamp} - {log.level} - {log.service} - {log.message}</li>
      ))}
    </ul>
  );
}

export default App;
