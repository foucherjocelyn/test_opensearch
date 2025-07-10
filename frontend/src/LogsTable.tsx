import type { Log } from "./types";

interface LogsTableProps {
  logs: Log[];
}

function LogsTable({ logs }: LogsTableProps) {
  return (
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
  );
}

export default LogsTable;
