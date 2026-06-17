import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, TrendingUp, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Min 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setServerError(msg ?? 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center mb-4 shadow-2xl shadow-amber-900/50">
            <TrendingUp size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pocket<span className="text-amber-400">Guardian</span>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Your personal finance companion</p>
        </div>

        {/* Card */}
        <div className="glass-card p-7">
          {/* Trust badge */}
          <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <ShieldCheck size={15} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-xs font-medium">Secure · Encrypted · Private</p>
          </div>

          <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-5">Sign in to your account</p>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Email" type="email" placeholder="you@example.com"
              icon={<Mail size={15} />} error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••"
              icon={<Lock size={15} />} error={errors.password?.message} {...register('password')} />
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center mt-1">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            No account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
