import React, { useState } from 'react';
import { Award, Calendar, Clock, CheckCircle, Heart, Shield, Sparkles, Send, Compass } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { FindYourMentorModal } from '../../components/common/FindYourMentorModal';
import { useAuth } from '../../context/AuthContext';

interface MentorshipPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('Single Deep-Dive');
  const [sessionNotes, setSessionNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const packages = [
    {
      id: 'single',
      name: 'Single Clarity Deep-Dive',
      price: '$175',
      duration: '60 minutes',
      description: 'A focused, confidential 1-on-1 session to unpack an immediate crossroad: alignment in purpose, marital communication, or rebuilding healthy self-motivation.',
      features: [
        '60-minute video session with Latisha Langley (@latishalangley)',
        'Personalized follow-up action plan & reflection sheet',
        'Direct messaging support for 7 days post-session',
        'Audio recording of your session for reference'
      ]
    },
    {
      id: 'three-month',
      name: 'The 3-Month Purpose & Wholeness Container',
      price: '$450',
      duration: '3 bi-weekly sessions',
      popular: true,
      description: 'Comprehensive guided mentorship across a major season of growth—walking in divine purpose, physical temple care, and intentional family leadership.',
      features: [
        'Three 60-minute private video sessions',
        'Full access to all Generouslee Academy masterclasses',
        'Unlimited asynchronous voice note support (Mon-Fri)',
        'Custom spiritual discipline & temple care routine plan'
      ]
    },
    {
      id: 'couple',
      name: 'Couples Alignment Session',
      price: '$240',
      duration: '75 minutes',
      description: 'Facilitated dialogue for you and your partner to reset domestic labor expectations, address intimacy blocks, and rebuild team partnership.',
      features: [
        '75-minute joint video consultation',
        'The Cognitive Load Fair-Play Inventory',
        'De-escalation communication protocol',
        '14-day check-in and accountability email'
      ]
    }
  ];

  const handleOpenBooking = (pkgName: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setSelectedPackage(pkgName);
    setIsBookingModalOpen(true);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setIsBookingModalOpen(false);
      setBookingConfirmed(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-8 md:p-12 space-y-4">
        <Badge variant="gold" size="md">Confidential 1-on-1 Guidance</Badge>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#211C15] font-normal leading-tight">
          Private Mentorship & Consultation
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl leading-relaxed">
          Step out of the noise. Sit down with Latisha Langley (Generous Lee) and purpose-aligned mentors for unhurried, deeply personal counsel rooted in faith and practical discipline.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#7E6D56]">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4 text-[#5D7052]" /> 100% Confidential & Secure
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Heart className="w-4 h-4 text-[#B95B3D]" /> Non-Clinical Mentorship
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-[#C49746]" /> Flexible Scheduling (PST / EST / GMT)
          </span>
        </div>

        {/* Find Your Mentor Assessment Banner */}
        <div className="mt-6 pt-6 border-t border-[#E7DFD4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 p-5 rounded-2xl border border-[#E7DFD4]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B95B3D]" />
              <span className="text-xs font-semibold text-[#211C15] uppercase tracking-wider">Unsure where to start?</span>
            </div>
            <p className="text-xs text-[#594D3C]">
              Take our 2-minute spiritual assessment to get matched with the exact mentor and growth pathway for your current season.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAssessmentModalOpen(true)}
            icon={<Sparkles className="w-4 h-4 text-[#B95B3D]" />}
            className="shrink-0"
          >
            Find Your Mentor Match &rarr;
          </Button>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <Card
            key={pkg.id}
            className={`p-8 flex flex-col justify-between space-y-6 ${
              pkg.popular ? 'border-[#B95B3D] ring-2 ring-[#B95B3D]/20' : 'border-[#E7DFD4]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A8957C] uppercase">{pkg.duration}</span>
                {pkg.popular && <Badge variant="terracotta" size="sm">Most Popular</Badge>}
              </div>

              <h3 className="font-serif text-2xl text-[#211C15] font-normal">
                {pkg.name}
              </h3>

              <div className="font-serif text-3xl text-[#B95B3D]">
                {pkg.price}
              </div>

              <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
                {pkg.description}
              </p>

              <ul className="space-y-2 text-xs text-[#594D3C] pt-2 border-t border-[#F3EFE9]">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#5D7052] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant={pkg.popular ? 'primary' : 'outline'}
              size="md"
              className="w-full"
              onClick={() => handleOpenBooking(pkg.name)}
            >
              Book Session &rarr;
            </Button>
          </Card>
        ))}
      </div>

      {/* Testimonial Quote */}
      <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
          alt="Mentorship Client"
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-full object-cover border border-[#D2C4B1] shrink-0"
        />
        <div className="space-y-2 text-center md:text-left">
          <p className="font-serif italic text-base sm:text-lg text-[#211C15] leading-relaxed">
            &ldquo;One hour with Latisha gave me more spiritual grounding and practical discipline than months of feeling stuck. She helped me re-center my daily walk with God and lead my family with quiet confidence.&rdquo;
          </p>
          <p className="text-xs text-[#7E6D56] font-semibold">
            — Lauren T., Mother of 2 & Community Leader
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Reserve Your Mentorship Session"
        subtitle={`Package: ${selectedPackage}`}
        maxWidth="md"
      >
        {bookingConfirmed ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl text-[#211C15]">Session Requested</h4>
            <p className="text-sm text-[#594D3C]">
              Thank you, {user?.name}. We have received your booking request. Our coordination team will reach out within 24 hours to coordinate your calendar timeslot and send your pre-session intake.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
                Preferred Days / Timeslots
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]">
                <option>Mornings (9:00 AM – 12:00 PM PST)</option>
                <option>Afternoons (1:00 PM – 4:00 PM PST)</option>
                <option>Evenings (6:00 PM – 8:30 PM PST)</option>
                <option>Weekends (Saturday mornings)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
                What is the primary season or topic you wish to explore?
              </label>
              <textarea
                required
                rows={3}
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="e.g. Navigating in-law boundaries around holiday visits and communication breakdown with my spouse."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Submit Booking Request &rarr;
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Find Your Mentor Assessment Modal */}
      <FindYourMentorModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onNavigate={onNavigate}
        onSelectMentor={(mentorName) => {
          setSelectedPackage(`Mentorship with ${mentorName}`);
          setIsBookingModalOpen(true);
        }}
      />
    </div>
  );
};
