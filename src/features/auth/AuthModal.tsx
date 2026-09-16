import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Check, Heart, Sparkles, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register, updateInterests, user } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMode, setCurrentMode] = useState(authModalMode);

  // Sync mode
  React.useEffect(() => {
    setCurrentMode(authModalMode);
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  const interestOptions = [
    { id: 'Motherhood', label: 'Motherhood & Matrescence', icon: '🌱' },
    { id: 'Mental Wellness', label: 'Maternal Mental Wellness', icon: '🧠' },
    { id: 'Marriage', label: 'Marriage & Healthy Partnership', icon: '✨' },
    { id: 'Parenting', label: 'Conscious Parenting', icon: '👶' },
    { id: 'Personal Growth', label: 'Personal Growth & Boundaries', icon: '🌿' },
    { id: 'Relationships', label: 'In-Laws & Family Dynamics', icon: '🤝' },
    { id: 'Mentorship', label: 'Life Mentorship & Guidance', icon: '⭐' },
    { id: 'Career/life balance', label: 'Career & Life Balance', icon: '⚖️' }
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address');
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return setError('Please fill in your name and email');
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, selectedInterests);
      setCurrentMode('onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      if (selectedInterests.length > 0) {
        await updateInterests(selectedInterests);
      }
      closeAuthModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={
        currentMode === 'onboarding'
          ? 'Tailor Your Generouslee Space'
          : currentMode === 'login'
          ? 'Welcome Back to Generouslee'
          : currentMode === 'register'
          ? 'Join the Generouslee Community'
          : 'Reset Your Password'
      }
      subtitle={
        currentMode === 'onboarding'
          ? 'Select the seasons of life you are currently navigating so we can personalize your guidance.'
          : currentMode === 'login'
          ? 'Enter your email to access your saved wisdom, questions, and private dashboard.'
          : currentMode === 'register'
          ? 'A quiet, trusted digital space for honest motherhood and relationship growth.'
          : 'We will send you a secure link to recover your account.'
      }
      maxWidth={currentMode === 'onboarding' ? 'lg' : 'md'}
    >
      {error && (
        <div className="p-3 mb-4 rounded-xl bg-[#FDF2F2] border border-[#FAD6D6] text-xs text-[#A84848] font-medium">
          {error}
        </div>
      )}

      {currentMode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. amara.k@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30 focus:border-[#B95B3D]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentMode('forgot')}
                className="text-xs text-[#B95B3D] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30 focus:border-[#B95B3D]"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isSubmitting}>
            Sign In to Generouslee
          </Button>

          <div className="pt-2 text-center text-xs text-[#7E6D56]">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentMode('register')}
              className="text-[#B95B3D] font-semibold hover:underline cursor-pointer"
            >
              Create one here
            </button>
          </div>
        </form>
      )}

      {currentMode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
              Full Name or Preferred Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jessica Williams"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30 focus:border-[#B95B3D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jessica@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30 focus:border-[#B95B3D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
              Create Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30 focus:border-[#B95B3D]"
            />
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-[#7E6D56]">
            <Shield className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
            <span>We honor your privacy. We never share or sell personal data or questions.</span>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isSubmitting}>
            Continue to Personalize &rarr;
          </Button>

          <div className="pt-2 text-center text-xs text-[#7E6D56]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentMode('login')}
              className="text-[#B95B3D] font-semibold hover:underline cursor-pointer"
            >
              Sign in instead
            </button>
          </div>
        </form>
      )}

      {currentMode === 'onboarding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {interestOptions.map(opt => {
              const isSelected = selectedInterests.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleInterest(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF0ED] border-[#B95B3D] text-[#211C15] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E7DFD4] text-[#594D3C] hover:border-[#D2C4B1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#B95B3D] border-[#B95B3D] text-white' : 'border-[#D2C4B1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#7E6D56]">
              {selectedInterests.length} topic{selectedInterests.length === 1 ? '' : 's'} selected
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={handleFinishOnboarding}
              isLoading={isSubmitting}
            >
              Enter My Generouslee Space &rarr;
            </Button>
          </div>
        </div>
      )}

      {currentMode === 'forgot' && (
        <div className="space-y-4">
          <p className="text-sm text-[#594D3C]">
            Enter your registered email address and we will send you secure recovery instructions.
          </p>
          <input
            type="email"
            placeholder="your-email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#211C15] text-sm focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
          />
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => {
              alert(`Password recovery link dispatched to ${email || 'your email'}.`);
              setCurrentMode('login');
            }}
          >
            Send Recovery Link
          </Button>
          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentMode('login')}
              className="text-xs text-[#7E6D56] hover:text-[#211C15] underline cursor-pointer"
            >
              Back to login
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
