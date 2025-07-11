import axios from './axios';
import { useEffect, useState } from 'react';
import LogsTable from './components/LogsTable';
import LogsFilters from './components/LogsFilters';
import AddLogsFormModal from './components/AddLogsFormModal';
import type { Log, LogFilters } from './types';
import Pagination from './components/Pagination';

function App() {
  const itemsPerPage = 20; // Number of logs per page
  const [logList, setLogList] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logFilters, setLogFilters] = useState<LogFilters>({
    search: '',
    level: '',
    service: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Reset current page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [logFilters]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params = new URLSearchParams();
        if (logFilters.search) params.append('q', logFilters.search);
        if (logFilters.level) params.append('level', logFilters.level);
        if (logFilters.service) params.append('service', logFilters.service);
        params.append('page', String(currentPage));
        const response = await axios.get('/logs/search', { params });
        setLogList(response.data);
        setLoading(false);
        // Check if there are at least as many logs as items per page
        // to determine if there's a next page
        setHasNextPage(response.data.length === itemsPerPage);
      } catch (err) {
        setError(String(err));
        setLoading(false);
        setHasNextPage(false);
      }
    }
    fetchLogs();
  }, [logFilters, currentPage]);

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      <LogsFilters filters={logFilters} setFilters={setLogFilters} />
      <Pagination
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)}
        hasNextPage={hasNextPage}
      />

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
