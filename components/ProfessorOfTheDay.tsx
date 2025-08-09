import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { pickI18n } from '@/lib/utils';
import { createServerSupabaseClient } from '@/lib/supabase-server';

interface Professor {
  id: string;
  name: string;
  title_i18n: Record<string, string> | null;
  quote_i18n: Record<string, string> | null;
  bio_i18n: Record<string, string> | null;
  photo_url: string | null;
}

interface ProfessorOfTheDayProps {
  professor: Professor | null;
  locale: string;
}

export default function ProfessorOfTheDay({ professor, locale }: ProfessorOfTheDayProps) {
  const t = useTranslations('home.profOfDay');

  if (!professor) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('title')}
            </h2>
            <p className="text-muted text-lg">
              {t('quote')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const title = pickI18n(professor.title_i18n, locale);
  const quote = pickI18n(professor.quote_i18n, locale);
  const bio = pickI18n(professor.bio_i18n, locale);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl font-heading font-bold text-text">
                {t('title')}
              </h2>
              
              <blockquote className="text-xl text-text italic border-l-4 border-white pl-6">
                "{quote || t('quote')}"
              </blockquote>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-semibold text-white">
                  {professor.name}
                </h3>
                {title && (
                  <p className="text-lg text-muted">
                    {title}
                  </p>
                )}
                {bio && (
                  <p className="text-text leading-relaxed">
                    {bio}
                  </p>
                )}
              </div>
              
              <button className="button-secondary">
                {t('readMore')}
              </button>
            </div>

            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 rounded-card overflow-hidden">
                {professor.photo_url ? (
                  <Image
                    src={professor.photo_url}
                    alt={professor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-gray-500/20 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white/50">
                      {professor.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Server-side function to get professor of the day
export async function getProfessorOfTheDay(locale: string): Promise<Professor | null> {
  const supabase = createServerSupabaseClient();
  
  try {
    // Try to get from the view first
    const { data: viewData, error: viewError } = await supabase
      .from('professor_of_the_day')
      .select('*')
      .single();

    if (viewData && !viewError) {
      return viewData;
    }

    // Fallback: get all active professors and calculate manually
    const { data: professors, error } = await supabase
      .from('professors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error || !professors || professors.length === 0) {
      return null;
    }

    // Calculate professor of the day index
    const today = new Date();
    const year = today.getFullYear();
    const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = (year * 366 + dayOfYear) % professors.length;

    return professors[index];
  } catch (error) {
    console.error('Error fetching professor of the day:', error);
    return null;
  }
}
