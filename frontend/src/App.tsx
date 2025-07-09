import axios from './axios';
import { useEffect } from 'react';

function App() {
  const getLogs = async () => {
    try {
      const response = await axios.get('/logs/search');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // This effect runs once when the component mounts
  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Your React + Tailwind App</h1>
      <p className="text-lg text-gray-700">
        Start building your frontend!
      </p>
    </div>
  )
}

export default App
