import { useState, useEffect } from 'react';
import api from './api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>(token ? 'dashboard' : 'login');
  
  // Auth state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    if (token) {
      setView('dashboard');
      fetchContacts();
    } else {
      setView('login');
      setContacts([]);
    }
  }, [token]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await api.post('/api/users/register', { username, email, password });
      setView('login');
      setUsername(''); setEmail(''); setPassword('');
      console.log('Registration successful, please login');
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.post('/api/users/login', { email, password });
      const newToken = res.data.accessToken;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setEmail(''); setPassword('');
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get('/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    try {
      const payload = { name: contactName, email: contactEmail, phone: contactPhone };
      if (editingId) {
        await api.put(`/api/contacts/${editingId}`, payload);
      } else {
        await api.post('/api/contacts', payload);
      }
      setContactName(''); setContactEmail(''); setContactPhone('');
      setEditingId(null);
      fetchContacts();
    } catch (err: any) {
      setContactError(err.response?.data?.message || 'Failed to save contact');
    }
  };

  const handleEditInit = (contact: Contact) => {
    setEditingId(contact._id);
    setContactName(contact.name);
    setContactEmail(contact.email);
    setContactPhone(contact.phone);
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await api.delete(`/api/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setContactName(''); setContactEmail(''); setContactPhone('');
  };

  // Views

  const renderAuthForm = () => {
    const isLogin = view === 'login';
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="w-full max-w-md p-8 bg-neutral-800 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          {authError && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-3 rounded">{authError}</div>}
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-300">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-neutral-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setView(isLogin ? 'register' : 'login'); setAuthError(''); }}
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-800">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            Contacts Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white transition-all bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="p-6 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700/50 sticky top-8">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
              {contactError && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-3 rounded">{contactError}</div>}
              
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 font-medium text-neutral-300 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="md:col-span-2 space-y-4">
            {contacts.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-700 rounded-xl">
                No contacts found. Create your first contact!
              </div>
            ) : (
              contacts.map(c => (
                <div key={c._id} className="p-5 bg-neutral-800 rounded-xl border border-neutral-700/50 hover:border-neutral-600 transition-all flex justify-between items-center group">
                  <div>
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                      <span>{c.email}</span>
                      <span>•</span>
                      <span>{c.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditInit(c)}
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(c._id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return view === 'dashboard' ? renderDashboard() : renderAuthForm();
}

export default App;
