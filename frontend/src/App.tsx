import axios from './axios';
import { useEffect, useState } from 'react';
import LogsTable from './LogsTable';
import LogsFilters from './LogsFilters';
import AddLogsFormModal from './AddLogsFormModal';
import type { LogModel } from './Models/LogModel';
import type { FiltersModel } from './Models/FilterModel';

function App() {
  const [logs, setLogs] = useState<LogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersModel>({
    search: '',
    level: '',
    service: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddLog = async (data: { message: string; level: string; service: string }) => {
    // TODO: implement actual POST logic
    setShowAddModal(false);
  };

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <LogsFilters filters={filters} setFilters={setFilters} />

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
        onSubmit={handleAddLog}
      />

      <div>
        {loading && <div className="text-center mt-8 text-lg">Loading...</div>}
        {error && <div className="text-center mt-8 text-red-600">Error: {error}</div>}
        {!loading && !error && <LogsTable logs={logs} />}
      </div>
    </div>
  );
}

export default App;
