import React from 'react';
import { Sparkles, Heart, Shield, Users, Mail, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface AboutPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Badge variant="terracotta" size="md">Our Story & Mission</Badge>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#211C15] font-normal leading-tight">
          Healthy, self-motivated women of God walking boldly in purpose.
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl mx-auto leading-relaxed">
          Generouslee is a haven for women seeking like-minded fellowship, spiritual growth, physical temple care, and family wholeness.
        </p>
      </div>

      {/* Founder Section */}
      <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src="/latisha.jpg"
            alt="Latisha Langley (Generous Lee)"
            referrerPolicy="no-referrer"
            className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border border-[#D2C4B1] shadow-md shrink-0"
          />
          <div className="space-y-4">
            <Badge variant="sage" size="sm">Founder, Purpose Mentor & Speaker</Badge>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#211C15]">
              Hello, I&apos;m Latisha Langley.
            </h2>
            <p className="text-sm sm:text-base text-[#594D3C] leading-relaxed">
              Known to many as <em>Generous Lee</em> on TikTok (<a href="https://www.tiktok.com/@latishalangley" target="_blank" rel="noopener noreferrer" className="text-[#B95B3D] underline font-medium">@latishalangley</a>), I am a woman of God, a mother, a veteran, and a passionate advocate for living a life of intentional faith, discipline, and healthy wholeness.
            </p>
          </div>
        </div>

        <div className="prose prose-stone text-sm sm:text-base text-[#383025] space-y-4 border-t border-[#F3EFE9] pt-6 leading-relaxed">
          <p>
            On TikTok, I began sharing raw, candid reflections about what it truly means to be a <strong>healthy, self-motivated woman of God</strong>: honoring your physical body as a temple, holding yourself to high standards of faith and self-discipline, and breaking free from stagnation to walk in your divine purpose.
          </p>
          <p>
            Women from all walks of life—mothers, military wives, professionals, and young women—began gathering in the comments, longing for authentic connection. They told me: <em>&ldquo;I’ve been praying for a community of women who don’t just talk about faith, but live it through health, purpose, and genuine sisterhood.&rdquo;</em>
          </p>
          <p>
            I created <strong>Generouslee</strong> to be that lasting home. Beyond short video feeds, this platform provides structured masterclasses, our signature <strong>Ask Generouslee</strong> mentorship advice, deep articles on faith, temple care, and marriage, and safe community circles where sisters lift each other up.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="gold" size="sm">What We Stand For</Badge>
          <h3 className="font-serif text-3xl font-normal text-[#211C15]">Our Guiding Commitments</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E7DFD4] space-y-2">
            <Heart className="w-6 h-6 text-[#B95B3D]" />
            <h4 className="font-serif text-lg text-[#211C15]">Faith & Divine Purpose</h4>
            <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
              We anchor every aspect of life in God. You were created intentionally with gifts, vision, and a higher assignment.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E7DFD4] space-y-2">
            <Sparkles className="w-6 h-6 text-[#C49746]" />
            <h4 className="font-serif text-lg text-[#211C15]">Temple Care & Discipline</h4>
            <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
              Honoring your body and mind with clean nutrition, movement, mental clarity, and somatic rest as acts of faithful stewardship.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E7DFD4] space-y-2">
            <Shield className="w-6 h-6 text-[#5D7052]" />
            <h4 className="font-serif text-lg text-[#211C15]">Authentic Sisterhood</h4>
            <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
              Surrounding yourself with like-minded women who hold you accountable in love, celebrate your milestones, and pray with you.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Educational Disclaimer */}
      <div className="p-6 rounded-3xl bg-[#FDF8EE] border border-[#F5E2BE] space-y-2">
        <h4 className="font-serif text-base text-[#211C15] font-semibold">
          Educational Mentorship Disclaimer
        </h4>
        <p className="text-xs text-[#594D3C] leading-relaxed">
          Generouslee is a digital publication and mentorship platform providing educational guidance, emotional support, and community connection. Content published on this website and responses provided through Ask Generouslee do not constitute clinical psychiatric treatment, psychotherapy, medical diagnosis, or legal counsel. If you or someone you know is experiencing acute postpartum psychosis, postpartum depression, or mental health crises, please consult your healthcare provider or call the National Maternal Mental Health Hotline (1-833-943-5746 in the US) or emergency services immediately.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onNavigate('explore')}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Explore Our Wisdom Library
        </Button>
      </div>
    </div>
  );
};
