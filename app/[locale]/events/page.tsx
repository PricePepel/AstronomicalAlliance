import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Filter, Search } from 'lucide-react';

interface EventsPageProps {
  params: { locale: string };
  searchParams: { 
    type?: string;
    search?: string;
    page?: string;
  };
}

export async function generateMetadata({ params: { locale } }: EventsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'events' });
  
  return {
    title: t('title'),
    description: 'Browse and register for upcoming events and olympiads',
    alternates: {
      languages: {
        'ru': '/ru/events',
        'en': '/en/events',
      },
    },
  };
}

export default async function EventsPage({ 
  params: { locale }, 
  searchParams 
}: EventsPageProps) {
  const t = await getTranslations({ locale, namespace: 'events' });
  const supabase = createServerSupabaseClient();
  
  const type = searchParams.type;
  const search = searchParams.search;
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' });

  // Apply filters
  if (type && type !== 'all') {
    query = query.eq('type', type);
  }

  if (search) {
    // Search in name_i18n for current locale and fallback to English
    query = query.or(`name_i18n->${locale}.ilike.%${search}%,name_i18n->en.ilike.%${search}%`);
  }

  // Get total count for pagination
  const { count } = await query;

  // Get paginated results
  const { data: events } = await query
    .order('starts_at', { ascending: true })
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 cosmic-gradient star-field">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-text mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-light max-w-3xl mx-auto">
            Discover and participate in exciting space missions and expeditions
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  defaultValue={type || 'all'}
                  className="input-field w-full"
                >
                  <option value="all">{t('filters.all')}</option>
                  <option value="event">{t('filters.event')}</option>
                  <option value="olympiad">{t('filters.olympiad')}</option>
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-text mb-2">
                  {t('filters.search')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    id="search"
                    name="search"
                    defaultValue={search}
                    placeholder={t('filters.search')}
                    className="input-field w-full pl-10"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <button type="submit" className="button-primary w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events && events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event.id} className="card overflow-hidden">
                    {/* Event Cover */}
                    {event.cover_url && (
                      <div className="relative h-48">
                        <Image
                          src={event.cover_url}
                          alt={event.name_i18n?.[locale] || event.name_i18n?.['en'] || 'Event'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {/* Event Type Badge */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.type === 'olympiad' 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {event.type === 'olympiad' ? t('filters.olympiad') : t('filters.event')}
                        </span>
                      </div>
                      
                      {/* Event Title */}
                      <h3 className="text-xl font-heading font-semibold text-text mb-2">
                        {event.name_i18n?.[locale] || event.name_i18n?.['en'] || 'Untitled Event'}
                      </h3>
                      
                      {/* Event Description */}
                      <p className="text-muted mb-4 line-clamp-3">
                        {event.description_i18n?.[locale] || event.description_i18n?.['en'] || 'No description available'}
                      </p>
                      
                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-muted mb-4">
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
                      
                      {/* Event Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-surface text-xs text-muted rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="px-2 py-1 bg-surface text-xs text-muted rounded-full">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <Link 
                        href={`/${locale}/events/${event.id}`}
                        className="button-secondary w-full text-center"
                      >
                        {t('details')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    {page > 1 && (
                      <Link
                        href={`/${locale}/events?${new URLSearchParams({
                          ...searchParams,
                          page: (page - 1).toString()
                        })}`}
                        className="button-secondary px-4 py-2"
                      >
                        Previous
                      </Link>
                    )}
                    
                    <span className="text-muted px-4 py-2">
                      Page {page} of {totalPages}
                    </span>
                    
                    {page < totalPages && (
                      <Link
                        href={`/${locale}/events?${new URLSearchParams({
                          ...searchParams,
                          page: (page + 1).toString()
                        })}`}
                        className="button-secondary px-4 py-2"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                {t('noEvents')}
              </h3>
              <p className="text-muted">
                No events found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
