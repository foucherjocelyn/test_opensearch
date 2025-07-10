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
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    service: ''
  });

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('q', filters.search);
        if (filters.level) params.append('level', filters.level);
        if (filters.service) params.append('service', filters.service);
        const response = await axios.get('/logs/search', { params });
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }
    fetchLogs();
  }, [filters]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <div className="mb-4 flex justify-center gap-3">
        <input
          type="text"
          placeholder="Search by message..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
        />
        <select
          value={filters.level}
          onChange={e => setFilters({ ...filters, level: e.target.value })}
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
          value={filters.service}
          onChange={e => setFilters({ ...filters, service: e.target.value })}
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
