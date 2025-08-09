'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const footerLinks = [
    { name: t('links.privacy'), href: `/${currentLocale}/privacy` },
    { name: t('links.terms'), href: `/${currentLocale}/terms` },
    { name: t('links.contact'), href: `/${currentLocale}/about#contact` },
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-heading font-semibold gradient-text">
                EduPlatform
              </span>
            </div>
            <p className="text-muted max-w-md">
              Discover new horizons of knowledge with leading professors. 
              Join our community of learners and educators.
            </p>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-text font-semibold mb-4">{t('newsletter.title')}</h3>
            <div className="flex">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="input-field flex-1 rounded-r-none"
              />
              <button className="button-primary rounded-l-none px-4">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-text font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted text-sm">{t('copyright')}</p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted hover:text-accent transition-colors duration-200"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
