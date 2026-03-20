import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import api from '../api';
import type { Contact } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contactError, setContactError] = useState('');

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '', phone: '' }
  });

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await api.get('/api/contacts');
      return res.data;
    }
  });

  const saveContactMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; phone: string }) => {
      if (editingId) {
        return api.put(`/api/contacts/${editingId}`, payload);
      } else {
        return api.post('/api/contacts', payload);
      }
    },
    onSuccess: () => {
      reset();
      setEditingId(null);
      setContactError('');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setContactError(axiosError.response?.data?.message || 'Failed to save contact');
      }
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/contacts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
    onError: (err) => console.error('Failed to delete contact', err)
  });

  const onSubmit = (data: any) => {
    setContactError('');
    saveContactMutation.mutate(data);
  };

  const handleEditInit = (contact: Contact) => {
    setEditingId(contact._id);
    reset({ name: contact.name, email: contact.email, phone: contact.phone });
    setContactError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ name: '', email: '', phone: '' });
    setContactError('');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-800">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            Contacts Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-white transition-all bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="p-6 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700/50 sticky top-8">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
              {contactError && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-3 rounded">{contactError}</div>}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300">Phone</label>
                  <input
                    type="text"
                    {...register('phone', { required: true })}
                    className="w-full px-3 py-2 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saveContactMutation.isPending}
                    className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {saveContactMutation.isPending ? 'Saving...' : (editingId ? 'Update' : 'Create')}
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

          <div className="md:col-span-2 space-y-4">
            {isLoading ? (
              <div className="p-12 text-center text-neutral-500">Loading contacts...</div>
            ) : contacts.length === 0 ? (
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
                      onClick={() => deleteContactMutation.mutate(c._id)}
                      disabled={deleteContactMutation.isPending}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
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
}
