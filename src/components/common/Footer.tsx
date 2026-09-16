import React, { useState } from 'react';
import { Heart, ShieldAlert, PhoneCall, ExternalLink, Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await api.subscribeNewsletter({
        email: email.trim(),
        firstName: name.trim() || undefined,
        interests: ['Weekly Encouragement', 'Faith & Purpose', 'Healthy Living']
      });
      setStatus('success');
      setMessage(res.message || 'You are subscribed to weekly encouragement!');
      setEmail('');
      setName('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Unable to subscribe right now. Please try again.');
    }
  };

  return (
    <footer className="bg-[#211C15] text-[#D2C4B1] pt-16 pb-24 xl:pb-16 border-t border-[#383025]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Card (Mailchimp / Weekly Encouragement) */}
        <div className="bg-[#2D261E] border border-[#483E31] rounded-3xl p-6 sm:p-10 mb-14 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B3227] text-xs text-[#E7DFD4] border border-[#594D3C]">
                <Sparkles className="w-3.5 h-3.5 text-[#B95B3D]" />
                <span>The Generouslee Weekly Circle</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                Weekly encouragement delivered straight to your heart.
              </h3>
              <p className="text-xs sm:text-sm text-[#A8957C] leading-relaxed">
                Join our private sisterhood. Every Tuesday morning, receive Latisha&apos;s faith-grounded reflections, healthy temple tips, scripture devotionals, and early invitations to live gatherings.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto shrink-0 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name (optional)"
                  className="px-4 py-3 bg-[#1C1711] border border-[#594D3C] rounded-xl text-xs sm:text-sm text-white placeholder-[#7E6D56] focus:outline-none focus:border-[#B95B3D] transition-colors"
                />
                <div className="relative flex-1 sm:w-64">
                  <Mail className="w-4 h-4 text-[#7E6D56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1711] border border-[#594D3C] rounded-xl text-xs sm:text-sm text-white placeholder-[#7E6D56] focus:outline-none focus:border-[#B95B3D] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-[#B95B3D] hover:bg-[#A8482E] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                </button>
              </div>

              {/* Status feedback */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-xs text-[#8BA87E] animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-[#D97768] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <p className="text-[11px] text-[#7E6D56]">
                Zero spam. Only grace and intentional encouragement. Unsubscribe anytime with one click.
              </p>
            </form>
          </div>
        </div>

        {/* Crisis & Safety Banner */}

        <div className="bg-[#383025] border border-[#594D3C] rounded-2xl p-5 mb-14 text-xs sm:text-sm text-[#E7DFD4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#B95B3D] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Important Wellbeing & Safety Notice</p>
              <p className="text-[#D2C4B1] mt-0.5 leading-relaxed">
                Generouslee is an educational and peer mentorship platform. It does not provide clinical diagnosis, psychiatric treatment, or legal counsel. If you are in crisis or experiencing postpartum emergency symptoms, please seek certified professional care immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#594D3C] hover:bg-[#7E6D56] text-white rounded-full text-xs font-semibold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#B95B3D]" />
              <span>Global Helpline Directory</span>
              <ExternalLink className="w-3 h-3 text-[#A8957C]" />
            </a>
          </div>
        </div>

        {/* Primary Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-normal text-white tracking-tight">
                Generous<span className="italic text-[#B95B3D]">lee</span>
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#A8957C] mt-1">
                Faith &bull; Purpose &bull; Wholeness
              </span>
            </div>
            <p className="text-sm text-[#A8957C] leading-relaxed max-w-sm">
              Empowering healthy, self-motivated women of God to walk boldly in purpose, cultivate temple care, and nurture thriving families. You are never called to walk alone.
            </p>
            <div className="pt-2 text-xs text-[#7E6D56] space-y-1">
              <div>Founded by Latisha Langley (Generous Lee) &bull; Faith, Purpose, and Healthy Living.</div>
              <div>
                <a
                  href="https://www.tiktok.com/@latishalangley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B95B3D] hover:underline inline-flex items-center gap-1"
                >
                  Follow on TikTok: @latishalangley
                  <ExternalLink className="w-3 h-3 text-[#B95B3D]" />
                </a>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Pillars</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('category', { slug: 'faith-purpose' })} className="hover:text-white transition-colors cursor-pointer">
                  Faith & Divine Purpose
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', { slug: 'healthy-living' })} className="hover:text-white transition-colors cursor-pointer">
                  Healthy Living & Temple Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', { slug: 'motherhood' })} className="hover:text-white transition-colors cursor-pointer">
                  Motherhood & Family
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', { slug: 'marriage' })} className="hover:text-white transition-colors cursor-pointer">
                  Marriage & Partnership
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', { slug: 'mindset' })} className="hover:text-white transition-colors cursor-pointer">
                  Mindset & Self-Motivation
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Growth */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('ask')} className="hover:text-white text-[#B95B3D] font-medium transition-colors cursor-pointer">
                  Ask Generouslee
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors cursor-pointer">
                  Community Circles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mentorship')} className="hover:text-white transition-colors cursor-pointer">
                  1-on-1 Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academy')} className="hover:text-white transition-colors cursor-pointer">
                  The Academy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors cursor-pointer">
                  Live Workshops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} className="hover:text-white transition-colors cursor-pointer">
                  Free Downloadable Guides
                </button>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Latisha & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Speaking & Collaborations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy & Data Dignity
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#383025] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E6D56]">
          <p>&copy; {new Date().getFullYear()} Generouslee Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with care, empathy, and truth</span>
            <Heart className="w-3.5 h-3.5 text-[#B95B3D] fill-[#B95B3D]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
