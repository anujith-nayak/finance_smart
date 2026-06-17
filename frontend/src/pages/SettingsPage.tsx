import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../store/authStore';
import { getInitials } from '../lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const onSave = async (data: ProfileValues) => {
    await updateUser(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your account</p>
      </div>

      {/* Profile card */}
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center text-white text-xl font-bold">
            {user ? getInitials(user.name) : 'PG'}
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          icon={<User size={16} />}
          onClick={() => setShowEditProfile(true)}
          className="w-full justify-center"
        >
          Edit Profile
        </Button>
      </Card>

      {/* App info */}
      <Card>
        <h3 className="text-white font-semibold mb-4">About Pocket Guardian</h3>
        <div className="space-y-3">
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="Made with" value="❤️ + TypeScript" />
          <SettingRow label="Stack" value="React + FastAPI + Supabase" />
        </div>
      </Card>

      {/* Companion info */}
      <Card className="bg-purple-900/20 border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Your Finance Companion</h3>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              Pocket Guardian watches over your finances with humor, insight, and just the right amount of drama.
              Never judging. Always watching.
            </p>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Account</h3>
        <Button
          variant="danger"
          icon={<LogOut size={16} />}
          onClick={handleLogout}
          className="w-full justify-center"
        >
          Sign Out
        </Button>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile" size="sm">
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
              Profile updated!
            </div>
          )}
          <Input
            label="Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
            Save Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-300 text-sm">{value}</span>
    </div>
  );
}
