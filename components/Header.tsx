'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales } from '@/i18n/config';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const currentLocale = pathname.split('/')[1];
  const currentPath = pathname.split('/').slice(2).join('/');

  const navigation = [
    { name: t('home'), href: `/${currentLocale}` },
    { name: t('about'), href: `/${currentLocale}/about` },
    { name: t('events'), href: `/${currentLocale}/events` },
    { name: t('register'), href: `/${currentLocale}/register` },
  ];

  const handleLanguageChange = (locale: string) => {
    setIsLanguageOpen(false);
    const newPath = locale === 'ru' ? `/${locale}/${currentPath}` : `/${locale}/${currentPath}`;
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-heading font-semibold gradient-text">
              EduPlatform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-text hover:text-accent transition-colors duration-200 font-medium',
                  pathname === item.href && 'text-accent'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-muted hover:text-accent transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 p-2 text-muted hover:text-accent transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {currentLocale === 'ru' ? '🇷🇺' : '🇬🇧'}
                </span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-card shadow-card">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => handleLanguageChange(locale)}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-surface/50 transition-colors duration-200 flex items-center space-x-2',
                        currentLocale === locale && 'text-accent'
                      )}
                    >
                      <span>{locale === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
                      <span className="uppercase">{locale}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <Link
              href={`/${currentLocale}/register`}
              className="button-primary"
            >
              <User className="w-4 h-4 mr-2" />
              {t('register')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted hover:text-accent transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-surface border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 text-text hover:text-accent transition-colors duration-200 font-medium',
                    pathname === item.href && 'text-accent'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-4">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        handleLanguageChange(locale);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center space-x-2 text-sm',
                        currentLocale === locale ? 'text-accent' : 'text-muted hover:text-accent'
                      )}
                    >
                      <span>{locale === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
                      <span className="uppercase">{locale}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
