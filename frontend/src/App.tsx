import axios from './axios';
import { useEffect, useState } from 'react';
import LogsTable from './LogsTable';
import LogsFilters from './LogsFilters';
import AddLogsFormModal from './AddLogsFormModal';
import type { Log, LogFilters } from './types';

function App() {
  const [logList, setLogList] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logFilters, setLogFilters] = useState<LogFilters>({
    search: '',
    level: '',
    service: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params = new URLSearchParams();
        if (logFilters.search) params.append('q', logFilters.search);
        if (logFilters.level) params.append('level', logFilters.level);
        if (logFilters.service) params.append('service', logFilters.service);
        const response = await axios.get('/logs/search', { params });
        setLogList(response.data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }
    fetchLogs();
  }, [logFilters]);

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <LogsFilters filters={logFilters} setFilters={setLogFilters} />

      {/* Floating + Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg hover:bg-blue-700 transition"
        aria-label="Add log"
      >
        +
      </button>

      {/* Add Log Modal */}
      <AddLogsFormModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}

      />

      <div>
        {loading && <div className="text-center mt-8 text-lg">Loading...</div>}
        {error && <div className="text-center mt-8 text-red-600">Error: {error}</div>}
        {!loading && !error && <LogsTable logs={logList} />}
      </div>
    </div>
  );
}

export default App;
