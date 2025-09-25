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
      background: '#2563eb',
      color: 'white',
    },
    secondary: {
      background: '#64748b',
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
      element.style.background = '#1d4ed8';
      element.style.transform = 'translateY(-1px)';
    } else {
      element.style.background = '#475569';
      element.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.currentTarget;
    element.style.transform = 'translateY(0)';
    if (variant === 'primary') {
      element.style.background = '#2563eb';
    } else {
      element.style.background = '#64748b';
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
    <div style={{
      height: '100vh',
      position: 'relative',
      background: 'transparent',
      overflow: 'hidden',
      width: '100vw'
    }}>
      <Iridescence
        color={[0.15, 0.3, 0.8]}
        mouseReact={false}
        amplitude={0.08}
        speed={0.8}
        className="absolute inset-0 z-0"
      />

      <div style={{
        maxWidth: '90%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        zIndex: 10,
        padding: '0',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>

    
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#ffffff',
          letterSpacing: '-0.01em',
          lineHeight: '1.1',
        }}>
          AgaPay
        </h1>

        <p style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.375rem)',
          marginBottom: '0.75rem',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '500',
          letterSpacing: '0.01em',
          lineHeight: '1.3',
        }}>
          Secure Payment Processing & Financial Analytics
        </p>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          marginBottom: '1.75rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '36rem',
          lineHeight: '1.5',
          fontWeight: '400',
        }}>
          Comprehensive payment solution with real-time analytics, secure transactions,
          and detailed financial insights for your business.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AgaPayButton href="/payment" variant="primary" size="lg">
            Make Payment
          </AgaPayButton>

          <AgaPayButton href="/admin/login" variant="primary" size="lg">
            Admin Portal
          </AgaPayButton>
        </div>
      </div>

      {/* Custom CSS for responsive design */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem !important;
            margin-bottom: 0.75rem !important;
          }

          p:first-of-type {
            font-size: 1.125rem !important;
            margin-bottom: 0.5rem !important;
          }

          p:last-of-type {
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
            max-width: 28rem !important;
          }

          div[style*="flexDirection: column"] {
            gap: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.75rem !important;
          }

          p:first-of-type {
            font-size: 1rem !important;
          }

          p:last-of-type {
            font-size: 0.875rem !important;
            max-width: 24rem !important;
          }

          a {
            padding: 1.125rem 2.25rem !important;
            font-size: 1.125rem !important;
          }
        }

        @media (max-width: 320px) {
          h1 {
            font-size: 1.5rem !important;
          }

          p:first-of-type {
            font-size: 0.875rem !important;
          }

          p:last-of-type {
            font-size: 0.75rem !important;
            max-width: 20rem !important;
          }

          a {
            padding: 1rem 2rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;