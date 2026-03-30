import { useState } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // ✅ Login handler
  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return token ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <AuthForm onLogin={handleLogin} />
  );
}

export default App;