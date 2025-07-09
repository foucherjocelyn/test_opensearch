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

  if (loading) return <div className="text-center mt-8 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">Level</th>
              <th className="py-2 px-4 border-b">Service</th>
              <th className="py-2 px-4 border-b">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{log.timestamp}</td>
                <td className={`py-2 px-4 border-b font-semibold ${
                  log.level === 'ERROR'
                    ? 'text-red-600'
                    : log.level === 'WARNING'
                    ? 'text-yellow-600'
                    : log.level === 'INFO'
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}>
                  {log.level}
                </td>
                <td className="py-2 px-4 border-b">{log.service}</td>
                <td className="py-2 px-4 border-b">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
