# Buildflow - Web App

This is a React-based web application built with Vite, using Supabase as the backend and deployed on Vercel.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from: https://app.supabase.com → Your Project → Settings → API

3. Set up the database:
   - Go to your Supabase project SQL Editor
   - Run the SQL script from `supabase_schema.sql` to create all tables and policies

4. Start the development server:
```bash
npm run dev
```

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🚢 Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the `supabase_schema.sql` script in the SQL Editor
3. Enable Authentication in Supabase (Email/Password or OAuth providers)
4. Copy your project URL and anon key to `.env`

### Supabase Storage (Optional)

For file uploads, create storage buckets in Supabase:
1. Go to Storage in your Supabase dashboard
2. Create buckets: `files` and `private-files`
3. Set up appropriate policies

### LLM Integration (Optional)

If you want to use AI features, you'll need to:
1. Get an API key from OpenAI, Anthropic, or another provider
2. Add `VITE_OPENAI_API_KEY` (or similar) to your `.env`
3. Update `src/api/integrations.js` to use the actual API

## 📁 Project Structure

```
src/
  ├── api/           # API clients and entities
  ├── components/    # React components
  ├── config/        # Configuration files
  ├── pages/         # Page components
  └── ...
```

## 🔐 Authentication

The app uses Supabase Auth. Users can:
- Sign up with email/password
- Sign in
- Sign out
- Access protected routes

## 🗄️ Database

All data is stored in Supabase PostgreSQL database. See `supabase_schema.sql` for the complete schema.

Main entities:
- Projects
- Pages
- Features
- Todos
- Design Systems
- Flows
- Sprints
- And more...

## 📝 License

This project was migrated from Base44 to Supabase.
