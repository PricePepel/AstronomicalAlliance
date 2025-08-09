import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { pickI18n } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, Award, Heart, Search } from 'lucide-react';

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return {
    title: t('title'),
    description: t('mission.description'),
    alternates: {
      languages: {
        'ru': '/ru/about',
        'en': '/en/about',
      },
    },
  };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const supabase = createServerSupabaseClient();
  
  // Fetch active professors
  const { data: professors } = await supabase
    .from('professors')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

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
            {t('mission.description')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-text mb-6">
                {t('mission.title')}
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-6">
                {t('mission.description')}
              </p>
              <p className="text-text leading-relaxed">
                Our platform brings together the brightest minds in education, 
                creating an environment where knowledge flows freely and innovation 
                thrives. We believe that education should be accessible, engaging, 
                and transformative for everyone.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-accent/20 to-link/20 rounded-card flex items-center justify-center">
                <Target className="w-24 h-24 text-accent/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('whatWeDo.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-4">
                {t('whatWeDo.education.title')}
              </h3>
              <p className="text-muted">
                {t('whatWeDo.education.description')}
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-link/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-link" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-4">
                {t('whatWeDo.community.title')}
              </h3>
              <p className="text-muted">
                {t('whatWeDo.community.description')}
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-4">
                {t('whatWeDo.innovation.title')}
              </h3>
              <p className="text-muted">
                {t('whatWeDo.innovation.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('values.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-text">
                {t('values.excellence')}
              </h3>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-link/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-link" />
              </div>
              <h3 className="font-heading font-semibold text-text">
                {t('values.integrity')}
              </h3>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-text">
                {t('values.innovation')}
              </h3>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-link/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-link" />
              </div>
              <h3 className="font-heading font-semibold text-text">
                {t('values.community')}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-surface/50" id="professors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('team.title')}
            </h2>
            <p className="text-muted text-lg">
              {t('team.subtitle')}
            </p>
          </div>
          
          {professors && professors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professors.map((professor) => {
                const title = pickI18n(professor.title_i18n, locale);
                const bio = pickI18n(professor.bio_i18n, locale);
                
                return (
                  <div key={professor.id} className="card p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        {professor.photo_url ? (
                          <Image
                            src={professor.photo_url}
                            alt={professor.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-link/20 flex items-center justify-center">
                            <span className="text-xl font-bold text-accent/50">
                              {professor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-text">
                          {professor.name}
                        </h3>
                        {title && (
                          <p className="text-sm text-muted">
                            {title}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {bio && (
                      <p className="text-muted text-sm leading-relaxed">
                        {bio}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-muted text-lg">No professors available</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16" id="contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              {t('contact.title')}
            </h2>
          </div>
          
          <div className="card p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input-field w-full"
                    placeholder={t('contact.name')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input-field w-full"
                    placeholder={t('contact.email')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="input-field w-full resize-none"
                  placeholder={t('contact.message')}
                />
              </div>
              
              <button type="submit" className="button-primary w-full">
                {t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
