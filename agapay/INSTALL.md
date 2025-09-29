# Frontend Installation Guide

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables** in `.env.local`

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Dependencies

All required dependencies are listed in `package.json` and will be automatically installed with `npm install`.

### Key Dependencies:
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **HeroUI** - UI components
- **OAuth libraries** - Authentication

## Troubleshooting

If you encounter any issues:

1. **Clear cache:** `rm -rf .next`
2. **Reinstall:** `npm install`
3. **Check Node.js version:** `node --version` (needs v18+)

## Build for Production

```bash
npm run build
npm start
```