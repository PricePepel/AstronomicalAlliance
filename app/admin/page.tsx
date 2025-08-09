import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';

export default async function AdminDashboard() {
  const t = await getTranslations({ namespace: 'admin' });
  const supabase = createServerSupabaseClient();

  // Fetch statistics
  const [
    { count: professorsCount },
    { count: eventsCount },
    { count: upcomingEventsCount },
    { count: totalUsers }
  ] = await Promise.all([
    supabase.from('professors').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('starts_at', new Date().toISOString()),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      name: t('dashboard.professors'),
      value: professorsCount || 0,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      name: t('dashboard.events'),
      value: eventsCount || 0,
      icon: Calendar,
      color: 'text-link',
      bgColor: 'bg-link/20',
    },
    {
      name: t('dashboard.upcoming'),
      value: upcomingEventsCount || 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    {
      name: 'Total Users',
      value: totalUsers || 0,
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted">
          Welcome to the admin dashboard. Here's an overview of your platform.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium">{stat.name}</p>
                <p className="text-3xl font-heading font-bold text-text mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-heading font-semibold text-text mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div>
                <p className="text-text text-sm">New professor added</p>
                <p className="text-muted text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-link rounded-full"></div>
              <div>
                <p className="text-text text-sm">Event created</p>
                <p className="text-muted text-xs">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <p className="text-text text-sm">User registration</p>
                <p className="text-muted text-xs">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-6">
          <h2 className="text-xl font-heading font-semibold text-text mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/professors/new"
              className="flex items-center space-x-3 p-3 rounded-button hover:bg-surface/50 transition-colors duration-200"
            >
              <Users className="w-5 h-5 text-accent" />
              <span className="text-text">Add New Professor</span>
            </a>
            <a
              href="/admin/events/new"
              className="flex items-center space-x-3 p-3 rounded-button hover:bg-surface/50 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 text-link" />
              <span className="text-text">Create New Event</span>
            </a>
            <a
              href="/admin/professors"
              className="flex items-center space-x-3 p-3 rounded-button hover:bg-surface/50 transition-colors duration-200"
            >
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-text">Manage Professors</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
