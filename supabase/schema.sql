-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    preferred_language TEXT NOT NULL DEFAULT 'ru',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create professors table
CREATE TABLE IF NOT EXISTS public.professors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title_i18n JSONB,
    quote_i18n JSONB,
    bio_i18n JSONB,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('event', 'olympiad')),
    name_i18n JSONB NOT NULL,
    description_i18n JSONB,
    location TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    tags TEXT[],
    cover_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create professor_of_the_day view
CREATE OR REPLACE VIEW public.professor_of_the_day AS
WITH active AS (
    SELECT *, 
           ROW_NUMBER() OVER (ORDER BY created_at, id) as rn,
           COUNT(*) OVER () as total
    FROM public.professors
    WHERE is_active = true
),
k AS (
    SELECT (EXTRACT(YEAR FROM CURRENT_DATE)::int * 366
          + EXTRACT(DOY FROM CURRENT_DATE)::int) as day_key
)
SELECT a.*
FROM active a, k
WHERE a.rn = ((k.day_key % NULLIF(a.total, 0)) + 1);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Professors policies
CREATE POLICY "Anyone can view active professors" ON public.professors
    FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Only admins can insert professors" ON public.professors
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update professors" ON public.professors
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete professors" ON public.professors
    FOR DELETE USING (is_admin());

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert events" ON public.events
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update events" ON public.events
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete events" ON public.events
    FOR DELETE USING (is_admin());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('professors', 'professors', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for professors bucket
CREATE POLICY "Anyone can view professor images" ON storage.objects
    FOR SELECT USING (bucket_id = 'professors');

CREATE POLICY "Only admins can upload professor images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'professors' AND is_admin());

CREATE POLICY "Only admins can update professor images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'professors' AND is_admin());

CREATE POLICY "Only admins can delete professor images" ON storage.objects
    FOR DELETE USING (bucket_id = 'professors' AND is_admin());

-- Storage policies for events bucket
CREATE POLICY "Anyone can view event images" ON storage.objects
    FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Only admins can upload event images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'events' AND is_admin());

CREATE POLICY "Only admins can update event images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'events' AND is_admin());

CREATE POLICY "Only admins can delete event images" ON storage.objects
    FOR DELETE USING (bucket_id = 'events' AND is_admin());

-- Insert sample data
INSERT INTO public.professors (name, title_i18n, quote_i18n, bio_i18n, is_active) VALUES
(
    'Dr. Elena Kovalenko',
    '{"ru": "Ведущий астрофизик", "en": "Leading Astrophysicist"}',
    '{"ru": "Космос — это не просто пространство, это наше будущее.", "en": "Space is not just a place, it is our future."}',
    '{"ru": "Доктор Елена Коваленко — выдающийся астрофизик с более чем 15-летним опытом исследований в области космологии и темной материи. Ее работы внесли значительный вклад в понимание эволюции Вселенной.", "en": "Dr. Elena Kovalenko is a distinguished astrophysicist with over 15 years of research experience in cosmology and dark matter. Her work has made significant contributions to our understanding of the universe evolution."}',
    true
),
(
    'Prof. Michael Chen',
    '{"ru": "Профессор квантовой физики", "en": "Professor of Quantum Physics"}',
    '{"ru": "Исследование космоса — это путешествие к истокам всего сущего.", "en": "Space exploration is a journey to the origins of all existence."}',
    '{"ru": "Профессор Майкл Чен — признанный эксперт в области квантовой физики и квантовых вычислений. Его исследования открыли новые горизонты в понимании квантовых явлений.", "en": "Professor Michael Chen is a recognized expert in quantum physics and quantum computing. His research has opened new horizons in understanding quantum phenomena."}',
    true
),
(
    'Dr. Sarah Johnson',
    '{"ru": "Исследователь экзопланет", "en": "Exoplanet Researcher"}',
    '{"ru": "Каждое открытие — это шаг к пониманию нашего места во Вселенной.", "en": "Every discovery is a step towards understanding our place in the universe."}',
    '{"ru": "Доктор Сара Джонсон специализируется на поиске и изучении экзопланет. Ее работы помогли обнаружить множество потенциально обитаемых миров за пределами нашей Солнечной системы.", "en": "Dr. Sarah Johnson specializes in the search and study of exoplanets. Her work has helped discover many potentially habitable worlds beyond our solar system."}',
    true
);

INSERT INTO public.events (type, name_i18n, description_i18n, location, starts_at, ends_at, tags) VALUES
(
    'olympiad',
    '{"ru": "Марсианская экспедиция", "en": "Martian Expedition"}',
    '{"ru": "Первая пилотируемая экспедиция на Марс для исследования поверхности планеты и поиска признаков жизни.", "en": "First manned expedition to Mars to explore the planet surface and search for signs of life."}',
    'Космодром Байконур, Казахстан',
    '2024-06-15 09:00:00+00',
    '2024-08-15 18:00:00+00',
    ARRAY['марс', 'экспедиция', 'пилотируемая']
),
(
    'event',
    '{"ru": "Конференция по экзопланетам", "en": "Exoplanet Conference"}',
    '{"ru": "Международная конференция, посвященная последним открытиям экзопланет и поиску внеземной жизни.", "en": "International conference dedicated to the latest exoplanet discoveries and the search for extraterrestrial life."}',
    'Санкт-Петербург, Россия',
    '2024-07-20 10:00:00+00',
    '2024-07-22 17:00:00+00',
    ARRAY['экзопланеты', 'конференция', 'астрономия']
),
(
    'olympiad',
    '{"ru": "Лунная миссия", "en": "Lunar Mission"}',
    '{"ru": "Научная миссия на Луну для изучения лунных ресурсов и подготовки к созданию лунной базы.", "en": "Scientific mission to the Moon to study lunar resources and prepare for the creation of a lunar base."}',
    'Космодром Восточный, Россия',
    '2024-08-10 09:00:00+00',
    '2024-09-10 18:00:00+00',
    ARRAY['луна', 'миссия', 'научная']
),
(
    'event',
    '{"ru": "Лекция о черных дырах", "en": "Black Holes Lecture"}',
    '{"ru": "Публичная лекция о современных исследованиях черных дыр и их влиянии на эволюцию галактик.", "en": "Public lecture on modern black hole research and their influence on galaxy evolution."}',
    'Москва, Россия',
    '2024-09-05 15:00:00+00',
    '2024-09-05 17:00:00+00',
    ARRAY['черные дыры', 'лекция', 'астрофизика']
),
(
    'event',
    '{"ru": "Мастер-класс по космической навигации", "en": "Space Navigation Workshop"}',
    '{"ru": "Практический мастер-класс по современным методам космической навигации и орбитальной механике.", "en": "Practical workshop on modern space navigation methods and orbital mechanics."}',
    'Калуга, Россия',
    '2024-10-12 14:00:00+00',
    '2024-10-12 18:00:00+00',
    ARRAY['навигация', 'мастер-класс', 'орбитальная механика']
);
