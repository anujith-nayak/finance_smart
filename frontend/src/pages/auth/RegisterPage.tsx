import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, TrendingUp, IndianRupee } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
  monthly_budget: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [step, setStep] = useState(1);

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const nextStep = async () => {
    const valid = await trigger(['name', 'email', 'password', 'confirmPassword']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: FormValues) => {
    setServerError('');
    try {
      await registerUser(data.name, data.email, data.password,
        data.monthly_budget ? Number(data.monthly_budget) : undefined);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setServerError(msg ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
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
          <p className="text-slate-500 mt-1.5 text-sm">Start your financial journey</p>
        </div>

        <div className="glass-card p-7">
          {/* Step bar */}
          <div className="flex gap-1.5 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-white/10'
              }`} />
            ))}
          </div>

          <h2 className="text-lg font-bold text-white mb-1">
            {step === 1 ? 'Create account' : 'Set your budget'}
          </h2>
          <p className="text-slate-500 text-sm mb-5">
            {step === 1 ? 'Just a few details to get started' : 'Optional — you can change this anytime'}
          </p>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {step === 1 && (
              <>
                <Input label="Your name" placeholder="What should we call you?"
                  icon={<User size={15} />} error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" placeholder="you@example.com"
                  icon={<Mail size={15} />} error={errors.email?.message} {...register('email')} />
                <Input label="Password" type="password" placeholder="••••••••"
                  icon={<Lock size={15} />} error={errors.password?.message} {...register('password')} />
                <Input label="Confirm password" type="password" placeholder="••••••••"
                  icon={<Lock size={15} />} error={errors.confirmPassword?.message} {...register('confirmPassword')} />
                <Button type="button" size="lg" onClick={nextStep} className="w-full justify-center mt-1">
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/15 text-center">
                  <p className="text-amber-300 text-sm font-semibold">Almost there!</p>
                  <p className="text-slate-500 text-xs mt-0.5">Set a monthly budget to track your spending</p>
                </div>
                <Input label="Monthly Budget (optional)" type="number" placeholder="e.g. 10000"
                  icon={<IndianRupee size={15} />} {...register('monthly_budget')} />
                <div className="flex gap-2.5 mt-1">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1 justify-center">
                    Back
                  </Button>
                  <Button type="submit" size="lg" loading={isSubmitting} className="flex-1 justify-center">
                    Let's Go!
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
