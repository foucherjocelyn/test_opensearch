import { useState } from "react";
import axios from './axios';

interface AddLogsFormModalProps {
  show: boolean;
  onClose: () => void;

}

function AddLogsFormModal({ show, onClose }: AddLogsFormModalProps) {
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      await axios.post('/logs', { message, level, service, timestamp });
      
      // Clear form and close modal on success
      setMessage('');
      setLevel('');
      setService('');
      onClose();
      
    } catch (err) {
      setError('Failed to add log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {/* Error message */}
        {error && (
          <div className="mb-4 px-3 py-2 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <select
            className="border rounded px-3 py-2"
            value={level}
            onChange={e => setLevel(e.target.value)}
            required
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Log'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLogsFormModal;