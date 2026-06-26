# Malse Family Tree Admin

Admin panel for the Malse Family Tree system.

## Tech Stack

- React + Vite (JavaScript)
- React Router
- Tailwind CSS + shadcn/ui
- Axios
- TanStack Query
- React Hook Form + Zod
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and configure `VITE_API_BASE_URL` when backend integration is added.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
├── layouts/         # AuthLayout, DashboardLayout
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── services/        # Axios API client
├── contexts/        # React context providers
├── routes/          # Route definitions
├── constants/       # App-wide constants
├── utils/           # Utility functions
├── types/           # Zod schemas
└── lib/             # shadcn utils, query client
```

## Routes

| Path         | Page       |
| ------------ | ---------- |
| `/login`     | Login      |
| `/dashboard` | Dashboard  |
| `/members`   | Members    |
| `/admins`    | Admins     |
| `*`          | 404        |
