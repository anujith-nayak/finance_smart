import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shield, DollarSign } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  monthly_budget: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
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
      await registerUser(
        data.name,
        data.email,
        data.password,
        data.monthly_budget ? Number(data.monthly_budget) : undefined
      );
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setServerError(msg ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center mb-4 glow-purple">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Pocket<span className="gradient-text">Guardian</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Start your financial journey</p>
        </div>

        <div className="glass-card p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'gradient-purple' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">
            {step === 1 ? 'Create your account' : 'Set your budget'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {step === 1 ? 'Tell us who you are' : 'Optional: Set a monthly budget to start'}
          </p>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {step === 1 && (
              <>
                <Input
                  label="Your name"
                  placeholder="What should we call you?"
                  icon={<User size={16} />}
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <Button
                  type="button"
                  size="lg"
                  onClick={nextStep}
                  className="w-full justify-center mt-2"
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center mb-2">
                  <p className="text-purple-300 text-sm font-medium">
                    Great! Now let's set your monthly budget.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    You can always change this later.
                  </p>
                </div>
                <Input
                  label="Monthly Budget (optional)"
                  type="number"
                  placeholder="e.g. 10000"
                  icon={<DollarSign size={16} />}
                  suffix={<span className="text-xs text-gray-500">₹</span>}
                  error={errors.monthly_budget?.message}
                  {...register('monthly_budget')}
                />
                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setStep(1)}
                    className="flex-1 justify-center"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    className="flex-1 justify-center"
                  >
                    Let's Go!
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
