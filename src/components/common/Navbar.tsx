import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bookmark,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Sparkles,
  HelpCircle,
  Users,
  Compass,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { UserRole } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { user, isAuthenticated, logout, openAuthModal, switchRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const mainNavItems = [
    { label: 'Explore', view: 'explore' },
    { label: 'Faith & Purpose', view: 'category', params: { slug: 'faith-purpose' } },
    { label: 'Healthy Living', view: 'category', params: { slug: 'healthy-living' } },
    { label: 'Motherhood', view: 'category', params: { slug: 'motherhood' } },
    { label: 'Marriage', view: 'category', params: { slug: 'marriage' } },
    { label: 'Mindset', view: 'category', params: { slug: 'mindset' } },
    { label: 'Ask Generouslee', view: 'ask', highlight: true }
  ];

  const secondaryNavItems = [
    { label: 'Mentorship', view: 'mentorship' },
    { label: 'Academy', view: 'academy' },
    { label: 'Community', view: 'community' },
    { label: 'Events', view: 'events' },
    { label: 'Free Resources', view: 'resources' }
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'user', label: 'Member' },
    { role: 'contributor', label: 'Contributor' },
    { role: 'editor', label: 'Editor' },
    { role: 'moderator', label: 'Moderator' },
    { role: 'mentor', label: 'Mentor' },
    { role: 'admin', label: 'Admin' },
    { role: 'super_admin', label: 'Super Admin' }
  ];

  const isAdminOrStaff = user && ['super_admin', 'admin', 'editor', 'moderator'].includes(user.role);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7DFD4]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group flex flex-col justify-center cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#211C15] group-hover:text-[#B95B3D] transition-colors">
                Generous<span className="italic font-serif font-light text-[#B95B3D]">lee</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E6D56] font-medium -mt-1">
                Wellbeing &bull; Family &bull; Truth
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
              {mainNavItems.map(item => {
                const isActive = currentView === item.view || (item.params && currentView === 'category' && item.params.slug);
                return (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.view, item.params)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      item.highlight
                        ? 'bg-[#FAF0ED] text-[#B95B3D] hover:bg-[#F3DDD7] font-semibold'
                        : isActive
                        ? 'bg-[#E7DFD4] text-[#211C15]'
                        : 'text-[#594D3C] hover:text-[#211C15] hover:bg-[#F3EFE9]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* More dropdown or secondary links */}
              <div className="relative group">
                <button className="px-3 py-1.5 rounded-full text-sm font-medium text-[#594D3C] hover:text-[#211C15] hover:bg-[#F3EFE9] flex items-center gap-1 cursor-pointer">
                  <span>More</span>
                  <span className="text-[10px] text-[#A8957C]">&or;</span>
                </button>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-2xl border border-[#E7DFD4] shadow-lg py-2 hidden group-hover:block z-50">
                  {secondaryNavItems.map(sec => (
                    <button
                      key={sec.label}
                      onClick={() => onNavigate(sec.view)}
                      className="w-full text-left px-4 py-2 text-sm text-[#594D3C] hover:bg-[#FAF8F5] hover:text-[#211C15] transition-colors cursor-pointer"
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-[#594D3C] hover:text-[#211C15] hover:bg-[#F3EFE9] rounded-full transition-colors cursor-pointer"
              title="Search articles, wisdom & resources"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Role Switcher for seamless demonstration/testing */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2EB] border border-[#DCE4D6] rounded-full text-xs font-semibold text-[#4D5D44] hover:bg-[#E3ECD9] transition-colors cursor-pointer"
                    title="Change active role for testing RBAC"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Role: {user.role.replace('_', ' ')}</span>
                  </button>
                  {isRoleMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-[#E7DFD4] shadow-xl py-2 z-50">
                      <div className="px-3 py-1 text-[11px] font-semibold text-[#A8957C] uppercase tracking-wider">
                        Switch Test Role
                      </div>
                      {roles.map(r => (
                        <button
                          key={r.role}
                          onClick={() => {
                            switchRole(r.role);
                            setIsRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                            user.role === r.role ? 'bg-[#FAF0ED] text-[#B95B3D] font-bold' : 'text-[#594D3C] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <span>{r.label}</span>
                          {user.role === r.role && <span>&bull;</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-[#211C15] text-[#FAF8F5] border-[#211C15]'
                      : 'bg-white text-[#383025] border-[#D2C4B1] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#B95B3D]" />
                  <span>My Space</span>
                  {user.savedContentIds?.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#B95B3D] text-white text-[10px] flex items-center justify-center">
                      {user.savedContentIds.length}
                    </span>
                  )}
                </button>

                {/* Admin Button if authorized */}
                {isAdminOrStaff && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-[#B95B3D] text-white'
                        : 'bg-[#FAF0ED] text-[#B95B3D] hover:bg-[#F3DDD7]'
                    }`}
                  >
                    <span>Admin Desk</span>
                  </button>
                )}

                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full border border-[#D2C4B1] overflow-hidden hover:ring-2 hover:ring-[#B95B3D] transition-all cursor-pointer"
                    aria-label="User profile menu"
                  >
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E7DFD4] shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-[#F3EFE9]">
                        <p className="text-sm font-semibold text-[#211C15] truncate">{user.name}</p>
                        <p className="text-xs text-[#7E6D56] truncate">{user.email}</p>
                        <Badge variant="sage" size="sm" className="mt-1.5 capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#594D3C] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#A8957C]" />
                        <span>Member Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('ask', { tab: 'mine' });
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#594D3C] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-[#B95B3D]" />
                        <span>My Asked Questions</span>
                      </button>
                      {isAdminOrStaff && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-[#B95B3D] font-medium hover:bg-[#FAF0ED] flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </button>
                      )}
                      <div className="border-t border-[#F3EFE9] my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#A84848] hover:bg-[#FDF2F2] flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => openAuthModal('register')}>
                  Join Free
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#594D3C] hover:text-[#211C15] hover:bg-[#F3EFE9] rounded-full transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E7DFD4] px-4 py-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider px-2 mb-2">Pillars</p>
            {mainNavItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.view, item.params);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  item.highlight
                    ? 'bg-[#FAF0ED] text-[#B95B3D]'
                    : 'text-[#383025] hover:bg-[#FAF8F5]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[#F3EFE9] pt-3 space-y-1">
            <p className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider px-2 mb-2">Explore More</p>
            {secondaryNavItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#594D3C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {isAuthenticated && user && (
            <div className="border-t border-[#F3EFE9] pt-3">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-[#7E6D56]">Active Role</span>
                <select
                  value={user.role}
                  onChange={e => switchRole(e.target.value as UserRole)}
                  className="text-xs bg-[#F3EFE9] border border-[#D2C4B1] rounded-lg px-2 py-1 font-medium text-[#211C15]"
                >
                  {roles.map(r => (
                    <option key={r.role} value={r.role}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for Mobile-First access */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7DFD4] px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#B95B3D]' : 'text-[#7E6D56]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentView === 'explore' ? 'text-[#B95B3D]' : 'text-[#7E6D56]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => onNavigate('ask')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentView === 'ask' ? 'text-[#B95B3D]' : 'text-[#7E6D56]'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-[#B95B3D] text-white flex items-center justify-center -mt-2 shadow-sm">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span>Ask</span>
        </button>
        <button
          onClick={() => onNavigate('community')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentView === 'community' ? 'text-[#B95B3D]' : 'text-[#7E6D56]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Circles</span>
        </button>
        <button
          onClick={() => {
            if (isAuthenticated) onNavigate('dashboard');
            else openAuthModal('login');
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentView === 'dashboard' ? 'text-[#B95B3D]' : 'text-[#7E6D56]'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{isAuthenticated ? 'Space' : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
};
