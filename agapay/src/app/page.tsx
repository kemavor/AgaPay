import React from 'react';

const Home: React.FC = () => {
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 10vw, 4.5rem)',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>
          AgaPay
        </h1>
        <p style={{
          fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
          marginBottom: '2rem',
          color: '#dbeafe'
        }}>
          Secure Payment Processing & Financial Analytics
        </p>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '3rem',
          color: '#dbeafe',
          maxWidth: '48rem',
          lineHeight: '1.5'
        }}>
          Comprehensive payment solution with real-time analytics, secure transactions,
          and detailed financial insights for your business.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <a
            href="/dashboard"
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            View Dashboard
          </a>
          <a
            href="/payment"
            style={{
              border: '1px solid white',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Make Payment
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;