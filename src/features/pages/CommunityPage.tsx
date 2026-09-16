import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Shield, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { api } from '../../services/api';
import { CommunityGroup } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

interface CommunityPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const { user, openAuthModal, isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [activeCircleModal, setActiveCircleModal] = useState<CommunityGroup | null>(null);

  useEffect(() => {
    async function loadGroups() {
      const data = await api.getCommunityGroups();
      setGroups(data);
    }
    loadGroups();
  }, []);

  const handleJoinCircle = (groupId: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setJoinedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Banner */}
      <div className="bg-[#EEF2EB] rounded-3xl border border-[#DCE4D6] p-8 md:p-12 space-y-4">
        <Badge variant="sage" size="md">Safe-Space Circles</Badge>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#211C15] font-normal">
          The Generouslee Circles
        </h1>
        <p className="text-base sm:text-lg text-[#4D5D44] max-w-2xl leading-relaxed">
          Intimate, moderator-guided conversation circles for every season of life. No unsolicited advice, no comparison, and no toxic positivity.
        </p>

        <div className="pt-2 flex items-center gap-6 text-xs text-[#5D7052]">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4" /> Confidential & Moderated
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Heart className="w-4 h-4" /> Non-Judgmental Village
          </span>
        </div>
      </div>

      {/* Community Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map(group => {
          const isJoined = joinedGroups.includes(group.id);
          return (
            <Card key={group.id} className="p-8 flex flex-col justify-between space-y-6 border-[#E7DFD4]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="terracotta" size="sm" className="capitalize">{group.category}</Badge>
                  <span className="text-xs font-semibold text-[#A8957C]">
                    {group.memberCount.toLocaleString()} members
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#211C15] font-normal">
                  {group.title}
                </h3>

                <p className="text-sm text-[#594D3C] leading-relaxed">
                  {group.description}
                </p>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7DFD4] space-y-1">
                  <span className="text-[11px] font-semibold text-[#A8957C] uppercase tracking-wider">
                    Recent Village Discussion:
                  </span>
                  <p className="text-xs text-[#211C15] italic">
                    &ldquo;{group.recentTopic}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3EFE9] flex items-center justify-between">
                <button
                  onClick={() => handleJoinCircle(group.id)}
                  className="text-xs font-semibold text-[#594D3C] hover:text-[#B95B3D] flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isJoined ? 'Discussion Active' : 'Enter Discussion'}</span>
                </button>

                <Button
                  variant={isJoined ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleJoinCircle(group.id)}
                >
                  {isJoined ? 'Joined &bull; Leave' : 'Join Circle'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Community Code of Conduct */}
      <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-10 space-y-4">
        <h3 className="font-serif text-2xl text-[#211C15]">The Village Ground Rules</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#594D3C]">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
            <span><strong>No shaming or comparison:</strong> We support women in every season of purpose, work, fitness, and family life.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
            <span><strong>Ask before advising:</strong> Always ask <em>&ldquo;Are you looking for prayer, empathy, or practical discipline?&rdquo;</em> before offering tips.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
            <span><strong>Strict confidentiality:</strong> What is shared in our circles stays in our circles. Screenshots are strictly forbidden.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
            <span><strong>Direct mentor escalation:</strong> Sensitive distress signals are flagged directly to Latisha and our pastoral mentorship team.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
