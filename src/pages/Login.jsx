import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Layers, Mail, Lock, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const redirectTo = searchParams.get('redirect') || '/Home';

  useEffect(() => {
    // Check if user is already authenticated
    base44.auth.getSession().then((session) => {
      if (session) {
        navigate(redirectTo);
      }
    }).catch(() => {
      // User is not authenticated, show login form
    });
  }, [navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        await base44.auth.signUp(email, password);
        toast.success('Account aangemaakt! Check je email voor verificatie.');
        // After signup, also sign in
        await base44.auth.signIn(email, password);
      } else {
        // Sign in
        await base44.auth.signIn(email, password);
        toast.success('Succesvol ingelogd!');
      }

      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Navigate to the redirect URL or home
      navigate(redirectTo);
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Er is iets misgegaan bij het inloggen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-xl mb-4 shadow-lg">
            <Layers className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">BuildFlow</h1>
          <p className="text-slate-500">
            {isSignUp ? 'Maak een account aan' : 'Log in op je account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jouw@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Account aanmaken...' : 'Inloggen...'}
                </>
              ) : (
                isSignUp ? 'Account aanmaken' : 'Inloggen'
              )}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              disabled={isLoading}
            >
              {isSignUp ? (
                <>
                  Al een account? <span className="font-semibold">Log in</span>
                </>
              ) : (
                <>
                  Nog geen account? <span className="font-semibold">Maak er een aan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Door in te loggen ga je akkoord met onze gebruiksvoorwaarden
        </p>
      </div>
    </div>
  );
}

