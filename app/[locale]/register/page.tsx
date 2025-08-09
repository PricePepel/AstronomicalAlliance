'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import { Eye, EyeOff, User, Mail, Lock, Building, Globe } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organization: z.string().optional(),
  preferredLanguage: z.enum(['ru', 'en']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      preferredLanguage: 'ru',
    },
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: data.fullName,
            organization: data.organization,
            preferred_language: data.preferredLanguage,
            role: 'user',
          });

        if (profileError) {
          toast.error('Error creating profile');
          return;
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        setIsSignUp(false);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/');
    } catch (error) {
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-text mb-2">
                {isSignUp ? t('signUp') : t('signIn')}
              </h1>
              <p className="text-muted">
                {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to your account'}
              </p>
            </div>

            {isSignUp ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text mb-2">
                    {t('fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      id="fullName"
                      {...signUpForm.register('fullName')}
                      className="input-field w-full pl-10"
                      placeholder={t('fullName')}
                    />
                  </div>
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      id="email"
                      {...signUpForm.register('email')}
                      className="input-field w-full pl-10"
                      placeholder={t('email')}
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-text mb-2">
                    {t('organization')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      id="organization"
                      {...signUpForm.register('organization')}
                      className="input-field w-full pl-10"
                      placeholder={t('organization')}
                    />
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label htmlFor="preferredLanguage" className="block text-sm font-medium text-text mb-2">
                    {t('preferredLanguage')}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <select
                      id="preferredLanguage"
                      {...signUpForm.register('preferredLanguage')}
                      className="input-field w-full pl-10"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...signUpForm.register('password')}
                      className="input-field w-full pl-10 pr-10"
                      placeholder={t('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...signUpForm.register('confirmPassword')}
                      className="input-field w-full pl-10 pr-10"
                      placeholder={t('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary w-full"
                >
                  {isLoading ? 'Creating account...' : t('signUp')}
                </button>
              </form>
            ) : (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="signInEmail" className="block text-sm font-medium text-text mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      id="signInEmail"
                      {...signInForm.register('email')}
                      className="input-field w-full pl-10"
                      placeholder={t('email')}
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signInPassword" className="block text-sm font-medium text-text mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signInPassword"
                      {...signInForm.register('password')}
                      className="input-field w-full pl-10 pr-10"
                      placeholder={t('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary w-full"
                >
                  {isLoading ? 'Signing in...' : t('signIn')}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent hover:text-accent/80 transition-colors duration-200"
              >
                {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
