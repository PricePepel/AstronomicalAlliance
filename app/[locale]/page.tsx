import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessorOfTheDay, { getProfessorOfTheDay } from '@/components/ProfessorOfTheDay';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      languages: {
        'ru': '/ru',
        'en': '/en',
      },
    },
  };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const supabase = createServerSupabaseClient();
  
  // Fetch professor of the day
  const professor = await getProfessorOfTheDay(locale);
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden cosmic-gradient star-field">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-text mb-6">
            {t('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-muted-light max-w-3xl mx-auto mb-8 text-balance">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/events`} className="button-primary">
              {t('events.viewAll')}
            </Link>
            <Link href={`/${locale}/about`} className="button-secondary">
              {t('highlights.title')}
            </Link>
          </div>
        </div>
      </section>

      {/* Professor of the Day */}
      <ProfessorOfTheDay professor={professor} locale={locale} />

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-text">
              {t('events.title')}
            </h2>
            <Link 
              href={`/${locale}/events`}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <span>{t('events.viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="card p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'olympiad' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {event.type === 'olympiad' ? 'Expedition' : 'Mission'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold text-text mb-2">
                    {event.name_i18n?.[locale] || event.name_i18n?.['en'] || 'Untitled Event'}
                  </h3>
                  
                  <p className="text-muted mb-4 line-clamp-2">
                    {event.description_i18n?.[locale] || event.description_i18n?.['en'] || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(event.starts_at, locale)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/${locale}/events/${event.id}`}
                    className="button-secondary w-full mt-4 text-center"
                  >
                    {t('events.details')}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-muted text-lg">{t('events.noEvents')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('highlights.title')}
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {t('highlights.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Quality Education
              </h3>
              <p className="text-muted">
                Access to world-class educational content and expert professors
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-link/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Global Community
              </h3>
              <p className="text-muted">
                Connect with learners and educators from around the world
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Innovation
              </h3>
              <p className="text-muted">
                Cutting-edge learning technologies and methodologies
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
