# Astronomical Alliance

**Live:** [astronomical-alliance.vercel.app](https://astronomical-alliance.vercel.app)

A NASA-style educational platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. Features internationalization, role-based access control, and a comprehensive admin panel.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Storage, RLS)
- **Internationalization**: next-intl v3
- **Forms**: React Hook Form + Zod
- **UI**: Lucide React icons, Framer Motion (optional)
- **Notifications**: Sonner

## 📋 Features

- 🌍 **Internationalization**: Russian (default) and English locales
- 👥 **Authentication**: Supabase email/password auth with profile creation
- 🎯 **Professor of the Day**: Deterministic daily rotation
- 📅 **Events & Olympiads**: Filterable list with pagination
- 👨‍💼 **Admin Panel**: Role-based CRUD operations for professors and events
- 🖼️ **Image Upload**: Supabase Storage integration
- 🔒 **Security**: Row Level Security (RLS) policies
- 📱 **Responsive**: Mobile-first design

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone https://github.com/PricePepel/AstronomicalAlliance.git
cd AstronomicalAlliance
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/schema.sql`
4. This will create:
   - Tables: `profiles`, `professors`, `events`
   - View: `professor_of_the_day`
   - Storage buckets: `professors`, `events`
   - RLS policies and sample data

### 4. Create First Admin

After running the schema, create your first admin user:

1. Register a new account at `/ru/register`
2. In Supabase SQL Editor, run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to `/ru`

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically detect Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

### Environment Variables

Set these in your Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📁 Project Structure

```
AstronomicalAlliance/
├── app/
│   ├── [locale]/           # Localized pages
│   │   ├── page.tsx        # Home page
│   │   ├── about/          # About page
│   │   ├── events/         # Events page
│   │   └── register/       # Auth page
│   ├── admin/              # Admin panel
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation
│   ├── Footer.tsx          # Footer
│   ├── ProfessorOfTheDay.tsx
│   └── admin/              # Admin components
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utilities
├── messages/
│   ├── ru.json             # Russian translations
│   └── en.json             # English translations
├── i18n/
│   ├── config.ts           # i18n configuration
│   └── request.ts          # i18n utilities
├── supabase/
│   └── schema.sql          # Database schema
└── middleware.ts           # Next.js middleware
```

## 🎨 Customization

### Colors and Theme

Edit `tailwind.config.js` to customize:
- Colors: `background`, `surface`, `text`, `muted`, `link`, `accent`
- Border radius: `card`, `button`
- Shadows: `card`, `card-hover`
- Fonts: `heading`, `body`

### Adding New Locales

1. Add locale to `i18n/config.ts`
2. Create `messages/[locale].json`
3. Update navigation in `components/Header.tsx`

### Database Schema

The schema supports:
- **i18n fields**: JSONB columns for multilingual content
- **RLS policies**: Secure data access
- **Storage buckets**: Image uploads for professors and events
- **Views**: Deterministic professor rotation

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🌐 Internationalization

The platform supports:
- **URL-based locales**: `/ru/`, `/en/`
- **Auto-redirect**: `/` → `/{best-locale}/`
- **Persistent language**: Stored in user profile and cookies
- **SEO-friendly**: `hreflang` alternates

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Role-based access**: Admin-only admin panel
- **Authentication**: Supabase Auth integration
- **Input validation**: Zod schemas
- **CSRF protection**: Built into Next.js

## 📊 Performance

- **Lighthouse Score**: ≥90 on desktop
- **Accessibility**: AA contrast, focus visible
- **SEO**: Server-side metadata, structured data
- **Optimization**: Image optimization, code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Open an issue in this repository

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
