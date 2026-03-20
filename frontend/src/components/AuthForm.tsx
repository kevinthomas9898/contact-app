import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import axios, { AxiosError } from 'axios';

interface AuthFormProps {
  onLogin: (token: string) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const isLogin = view === 'login';

  const { register, handleSubmit, reset } = useForm();

  const loginMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/users/login', data),
    onSuccess: (res) => {
      onLogin(res.data.accessToken);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setAuthError(axiosError.response?.data?.message || 'Login failed');
      }
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/users/register', data),
    onSuccess: () => {
      setView('login');
      reset();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setAuthError(axiosError.response?.data?.message || 'Registration failed');
      }
    }
  });

  const onSubmit = (data: any) => {
    setAuthError('');
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-neutral-800 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        {authError && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-3 rounded">{authError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-neutral-300">Username</label>
              <input
                type="text"
                {...register('username', { required: !isLogin })}
                className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter your username"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-300">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 mt-1 text-white bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => { setView(isLogin ? 'register' : 'login'); setAuthError(''); reset(); }}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
