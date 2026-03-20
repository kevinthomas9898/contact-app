import { useState } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return token ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <AuthForm onLogin={(newToken) => setToken(newToken)} />
  );
}

export default App;
