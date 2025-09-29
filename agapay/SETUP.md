# AgaPay - Requirements & Setup Instructions

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Installation Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd agapay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open your browser
Navigate to http://localhost:3000

## Dependencies

### Production Dependencies
- @emotion/react ^11.14.0
- @emotion/styled ^11.14.1
- @heroui/react ^2.8.4
- @mui/material ^7.3.2
- @radix-ui/react-label ^2.1.7
- @radix-ui/react-slot ^1.2.3
- class-variance-authority ^0.7.1
- clsx ^2.1.1
- framer-motion ^12.23.22
- gapi-script ^1.2.0
- lucide-react ^0.544.0
- next ^14.0.0
- ogl ^1.0.11
- react ^18.2.0
- react-apple-signin-auth ^1.1.2
- react-dom ^18.2.0
- tailwind-merge ^3.3.1

### Development Dependencies
- @types/node ^20.0.0
- @types/react ^18.2.0
- @types/react-dom ^18.2.0
- autoprefixer ^10.4.0
- eslint ^8.0.0
- eslint-config-next ^14.0.0
- postcss ^8.4.0
- tailwindcss ^3.3.0
- typescript ^5.0.0

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PROJECT_ID=agapay-test
GOOGLE_REDIRECT_URI=http://localhost:3000

# Apple Sign In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
agapay/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Features

- Admin dashboard with payment analytics
- OAuth integration (Google & Apple)
- Payment processing interface
- Real-time transaction monitoring
- Responsive design with Tailwind CSS
- Modern UI components with Framer Motion animations

## Troubleshooting

If you encounter ChunkLoadError or other build issues:

1. Clear the Next.js cache: `rm -rf .next`
2. Restart the development server: `npm run dev`
3. Ensure all dependencies are installed: `npm install`

## Support

For issues or questions, please contact the development team.