# AgaPay - Complete Project Setup

This project consists of a Next.js frontend and a FastAPI backend. Follow these instructions to set up the entire application.

## Prerequisites

- Node.js (v18 or higher recommended)
- Python 3.8+
- npm or yarn package manager
- pip package manager

## Quick Start

### Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd agapay

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup (FastAPI) - Optional

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload
```

## Detailed Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Monthly-Capstone-September-AgaPay
```

### 2. Frontend Setup

```bash
cd agapay
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the `agapay` directory:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PROJECT_ID=agapay-test

# JWT Secret for OAuth authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Application URL
NEXTAUTH_URL=http://localhost:3000

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
```

### 4. Backend Configuration (Optional)

If using the backend:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration.

### 5. Run the Application

**Frontend only:**
```bash
cd agapay
npm run dev
```

**Full stack (frontend + backend):**
```bash
# Terminal 1 - Frontend
cd agapay
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn main:app --reload
```

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests (if configured)

## Dependencies

### Frontend Dependencies
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- HeroUI Components
- OAuth integration libraries

### Backend Dependencies
- FastAPI
- SQLAlchemy
- PostgreSQL support
- JWT authentication
- Paystack integration

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `JWT_SECRET` - JWT signing secret
- `PAYSTACK_SECRET_KEY` - Paystack secret key

### Optional Variables
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Paystack public key
- `GOOGLE_PROJECT_ID` - Google project ID
- `NEXTAUTH_URL` - Application URL

## Troubleshooting

### Common Issues

1. **ChunkLoadError**: Clear Next.js cache
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Module not found**: Ensure all dependencies are installed
   ```bash
   npm install
   ```

3. **OAuth errors**: Verify environment variables are correctly set

4. **Backend connection issues**: Ensure backend server is running on correct port

### Port Configuration

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Project Structure

```
AgaPay/
├── agapay/                  # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
├── backend/                # FastAPI backend
│   ├── app/
│   ├── services/
│   └── requirements.txt    # Python dependencies
└── README.md              # This file
```

## Features

- Admin dashboard with payment analytics
- OAuth integration (Google)
- Payment processing with Paystack
- Real-time transaction monitoring
- Responsive design
- Modern UI components with animations

## Support

For issues or questions, please refer to the project documentation or contact the development team.
