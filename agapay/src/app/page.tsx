'use client';

import React from 'react';
import Iridescence from '@/components/Iridescence';

// Simple button component for consistent styling
const AgaPayButton: React.FC<{
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'lg' | 'md';
}> = ({ href, children, variant = 'primary', size = 'md' }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontWeight: '500',
    letterSpacing: '0.025em',
    textTransform: 'uppercase' as const,
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  };

  const sizeStyles = {
    lg: {
      padding: '1.25rem 2.5rem',
      fontSize: '1.25rem',
    },
    md: {
      padding: '1.125rem 2.25rem',
      fontSize: '1.125rem',
    },
  };

  const variantStyles = {
    primary: {
      background: '#DC2626',
      color: 'white',
    },
    secondary: {
      background: '#991B1B',
      color: 'white',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.currentTarget;
    if (variant === 'primary') {
      element.style.background = '#B91C1C';
      element.style.transform = 'translateY(-1px)';
    } else {
      element.style.background = '#7F1D1D';
      element.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.currentTarget;
    element.style.transform = 'translateY(0)';
    if (variant === 'primary') {
      element.style.background = '#DC2626';
    } else {
      element.style.background = '#991B1B';
    }
  };

  return (
    <a
      href={href}
      style={combinedStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </a>
  );
};

const Home: React.FC = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <Iridescence
        color={[0.8, 0.2, 0.2]}
        mouseReact={false}
        amplitude={0.08}
        speed={0.8}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          AgaPay
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl">
          Secure Payment Processing & Financial Analytics
        </p>

        <p className="text-lg text-white/70 mb-8 max-w-2xl">
          Comprehensive payment solution with real-time analytics, secure transactions,
          and detailed financial insights for your business.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <AgaPayButton href="/contributions" variant="primary" size="lg">
            Make Contributions
          </AgaPayButton>

          <AgaPayButton href="/admin/login" variant="primary" size="lg">
            Admin Portal
          </AgaPayButton>
        </div>
      </div>
    </div>
  );
};

export default Home;