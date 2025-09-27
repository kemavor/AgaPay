"use client";

import Iridescence from '@/components/Iridescence';

export default function BackgroundTest() {
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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Background Test</h1>
        <p>If you see animated colors, the Iridescence component is working!</p>
      </div>
    </div>
  );
}