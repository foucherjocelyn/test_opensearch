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
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params = new URLSearchParams();
        if (search) params.append('q', search);
        if (level) params.append('level', level);
        if (service) params.append('service', service);
        const response = await axios.get('/logs/search', { params });
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }
    fetchLogs();
  }, [search, level, service]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <div className="mb-4 flex justify-center gap-3">
        <input
          type="text"
          placeholder="Search by message..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
        />
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-max max-w-3xs"
        >
          <option value="">Filter by level...</option>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARNING</option>
          <option value="ERROR">ERROR</option>
          <option value="DEBUG">DEBUG</option>
        </select>
        <input
          type="text"
          placeholder="Filter by service..."
          value={service}
          onChange={e => setService(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-2xs"
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
