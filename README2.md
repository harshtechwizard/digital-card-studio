# Digital Business Card MVP

A modern web application for creating and sharing digital business cards with customizable designs and analytics tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)

### Setup in 3 Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env` and add your credentials
   - Run `supabase-setup.sql` in Supabase SQL Editor

3. **Start development**
   ```bash
   npm run dev
   ```

📖 **Detailed setup guide:** See [QUICK_START.md](./QUICK_START.md)

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get up and running in 5 minutes
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase configuration guide
- **[HOOKS_API_REFERENCE.md](./HOOKS_API_REFERENCE.md)** - How to use the data hooks
- **[PAGE_UPDATE_GUIDE.md](./PAGE_UPDATE_GUIDE.md)** - Step-by-step page migration guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current status and roadmap

## ✨ Features

### MVP (Current)
- ✅ User authentication (email/password)
- ✅ Profile management (personal & professional info)
- ✅ Create multiple business cards
- ✅ Customizable card fields and design
- ✅ Public shareable URLs for each card
- ✅ QR code generation (ready to implement)
- ✅ View analytics tracking
- ✅ Row-level security for data protection

### Coming Soon
- 🔄 Profile photo uploads
- 🔄 Advanced card templates
- 🔄 Analytics dashboard
- 🔄 Export cards as images
- 🔄 React Native mobile app

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS + shadcn/ui
- TanStack Query

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Row Level Security (RLS)
- REST API

## 📁 Project Structure

```
src/
├── components/        # UI components
├── contexts/          # React contexts (Auth)
├── hooks/            # Custom hooks (data fetching)
├── lib/              # Utilities (Supabase client, helpers)
├── pages/            # Route pages
├── types/            # TypeScript types
└── App.tsx           # Root component
```

## 🔐 Security

- JWT-based authentication
- Row Level Security (RLS) at database level
- Environment variables for sensitive data
- Protected routes in frontend
- Public cards are read-only

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

### Backend (Supabase)
Already hosted - just configure your project.

## 📝 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Database Schema

Core tables:
- `personal_info` - User personal data
- `professional_info` - Job/company info
- `business_cards` - Digital cards
- `card_analytics` - View tracking

See `supabase-setup.sql` for complete schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

- Check the documentation files in the root directory
- Review Supabase logs for backend issues
- Check browser console for frontend errors
- See [Supabase docs](https://supabase.com/docs) for platform help

## 🎯 Roadmap

**Phase 1: MVP** (Current)
- [x] Authentication
- [x] Profile management
- [x] Business card creation
- [x] Public card sharing
- [x] Basic analytics

**Phase 2: Enhancement**
- [ ] Profile photos
- [ ] Card templates
- [ ] QR codes
- [ ] Analytics dashboard
- [ ] Card export

**Phase 3: Advanced**
- [ ] CRM features
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Custom domains

---

**Built with ❤️ using React, TypeScript, and Supabase**
