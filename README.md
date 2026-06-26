# Herb Encyclopedia PWA

A Progressive Web App for capturing, storing, and exploring information about different herbs.

## Features

- 📱 PWA with offline support
- 📷 Camera integration for herb photos
- 💾 Multiple images per herb
- 🔍 Search and filter capabilities
- 📥 Install on home screen
- ⚡ Fast loading with caching
- 🗄️ IndexedDB for offline storage

## Tech Stack

**Frontend:**
- Next.js with PWA support
- Tailwind CSS
- Service Workers
- IndexedDB

**Backend:**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- Cloudinary for image storage

## Installation

### Prerequisites
- Node.js 16+
- PostgreSQL
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npm run dev