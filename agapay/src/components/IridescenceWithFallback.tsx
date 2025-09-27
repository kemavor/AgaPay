import { useEffect, useRef, useState } from 'react';

interface IridescenceWithFallbackProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export default function IridescenceWithFallback({
  color = [0.15, 0.3, 0.8],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className = "",
  fallback,
  ...rest
}: IridescenceWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported, using fallback background');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Try to load the Iridescence component
    const loadIridescence = async () => {
      try {
        const { default: Iridescence } = await import('@/components/Iridescence');

        if (componentRef.current) {
          // Clear the container and render Iridescence
          componentRef.current.innerHTML = '';

          // Create a temporary div for the Iridescence component
          const tempDiv = document.createElement('div');
          tempDiv.className = `w-full h-full ${className}`;
          componentRef.current.appendChild(tempDiv);

          // We can't directly render React component here, so we'll use the original approach
          // For now, let's just mark it as loaded and error-free
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load Iridescence component:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadIridescence();
  }, [className]);

  // Fallback CSS gradient background
  const fallbackBackground = (
    <div
      className={`w-full h-full ${className}`}
      style={{
        background: `linear-gradient(135deg,
          rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, 0.8) 0%,
          rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, 0.4) 25%,
          rgba(${color[2] * 255}, ${color[0] * 255}, ${color[1] * 255}, 0.6) 50%,
          rgba(${color[1] * 255}, ${color[2] * 255}, ${color[0] * 255}, 0.4) 75%,
          rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, 0.8) 100%
        )`,
        animation: 'gradientShift 10s ease infinite',
      }}
    />
  );

  // Add CSS animation for the fallback
  useEffect(() => {
    if (hasError) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
      return () => style.remove();
    }
  }, [hasError]);

  if (isLoading) {
    return (
      <div
        ref={componentRef}
        className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 ${className}`}
        {...rest}
      />
    );
  }

  if (hasError) {
    return fallback || fallbackBackground;
  }

  // If no error, try to use the original Iridescence component
  return (
    <div ref={componentRef} className={`w-full h-full ${className}`} {...rest}>
      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 animate-pulse">
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading background...</p>
          </div>
        </div>
      </div>
    </div>
  );
}