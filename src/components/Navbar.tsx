import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (location.pathname === '/login') {
    return null;
  }

  const navLinks = [
    { href: '/dashboard', label: 'WAR ROOM' },
    { href: '/planning', label: 'PLANEJAMENTO' },
    { href: '/activities', label: 'MISSÕES' },
    { href: '/goals', label: 'METAS' },
  ];

  const displayName =
    profile?.name ||
    user?.email?.split('@')[0] ||
    'OPERADOR';

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== '/dashboard' && location.pathname.startsWith(href));

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060709]/95 backdrop-blur border-b border-[#2A343D]">
      {/* Top Coordinate Bar */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8F9CA8] py-1 border-b border-[#1A1F24] select-none">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#00FF66] inline-block animate-pulse" />
            <span>SEC-04 // 90KM_ULTRA_OPS</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline">
              SYS_VER: 1.0.4 [VITE]
            </span>

            <span className="text-[#00FF66]">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="relative px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Brand */}
          <Link
            to="/dashboard"
            onClick={handleNavigation}
            className="flex items-center space-x-2.5 group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#14171A] border border-[#00FF66] flex items-center justify-center group-hover:shadow-reticle transition-all">
              <span className="font-mono text-xs font-extrabold text-[#00FF66]">
                UT
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm sm:text-base tracking-heading text-[#FFFFFF] uppercase leading-none">
                ULTRATEAM{' '}
                <span className="text-[#00FF66]">
                  TRACKER
                </span>
              </span>

              <span className="font-mono text-[9px] text-[#8F9CA8] tracking-tactical leading-none mt-1 hidden sm:block">
                90KM TACTICAL TRAINING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-mono text-xs font-bold tracking-tactical px-2.5 py-1.5 uppercase transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#14171A] text-[#00FF66] border-b-2 border-[#00FF66]'
                    : 'text-[#8F9CA8] hover:text-[#FFFFFF] hover:bg-[#14171A]/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                {displayName}
              </div>

              <div className="font-mono text-[10px] text-[#8F9CA8] tracking-tight">
                {user?.email}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={signOut}
              className="text-[10px] px-2 sm:px-3 h-7 sm:h-8 border-[#2A343D] hover:border-[#FF2A3D] hover:text-[#FF2A3D]"
              title="Encerrar Sessão"
            >
              LOGOUT
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={
              isMobileMenuOpen
                ? 'Fechar menu'
                : 'Abrir menu'
            }
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center w-9 h-9 border border-[#2A343D] bg-[#14171A] text-[#00FF66] hover:border-[#00FF66] transition-colors"
          >
            <span className="font-mono text-lg leading-none">
              {isMobileMenuOpen ? '×' : '☰'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full border-t border-[#2A343D] border-b bg-[#060709] shadow-2xl">

            {/* Navigation */}
            <nav className="p-3 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={handleNavigation}
                    className={`flex items-center justify-between w-full px-4 py-3 font-mono text-xs font-bold tracking-tactical uppercase transition-colors ${
                      active
                        ? 'bg-[#14171A] text-[#00FF66] border-l-2 border-[#00FF66]'
                        : 'text-[#8F9CA8] hover:text-[#FFFFFF] hover:bg-[#14171A]'
                    }`}
                  >
                    <span>{link.label}</span>

                    {active && (
                      <span className="text-[9px]">
                        ACTIVE
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Information */}
            <div className="border-t border-[#1A1F24] p-4">
              <div className="mb-3">
                <div className="font-mono text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                  {displayName}
                </div>

                <div className="font-mono text-[10px] text-[#8F9CA8] mt-1 break-all">
                  {user?.email}
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={signOut}
                className="w-full text-[10px] h-9 border-[#2A343D] hover:border-[#FF2A3D] hover:text-[#FF2A3D]"
              >
                ENCERRAR SESSÃO
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};