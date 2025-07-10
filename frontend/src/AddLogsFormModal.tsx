import { useState } from "react";

interface AddLogsFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { message: string; level: string; service: string }) => void;
}

function AddLogsFormModal({ show, onClose, onSubmit }: AddLogsFormModalProps) {
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add Log Entry</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ message, level, service });
            setMessage('');
            setLevel('');
            setService('');
            onClose();
          }}
          className="flex flex-col gap-4"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={level}
            onChange={e => setLevel(e.target.value)}
            required
          >
            <option value="">Select level...</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="Service"
            value={service}
            onChange={e => setService(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            Add Log
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLogsFormModal;