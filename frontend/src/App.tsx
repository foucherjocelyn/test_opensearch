import axios from './axios';
import { useEffect, useState } from 'react';
import LogsTable from './LogsTable';

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
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get('/logs/search', {
          params: search ? { q: search } : undefined,
        });
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }
    fetchLogs();
  }, [search]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by message..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        {loading && <div className="text-center mt-8 text-lg">Loading...</div>}
        {error && <div className="text-center mt-8 text-red-600">Error: {error}</div>}
        {!loading && !error && <LogsTable logs={logs} />}
      </div>
    </div>
  );
}

export default App;
