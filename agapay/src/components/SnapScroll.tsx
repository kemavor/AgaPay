'use client'

import { ReactNode } from 'react'

interface SnapScrollProps {
  children: ReactNode[]
  className?: string
  direction?: 'vertical' | 'horizontal'
  showNavigation?: boolean
  navigationType?: 'dots' | 'arrows' | 'both'
  autoScroll?: boolean
  autoScrollInterval?: number
}

const SnapScroll = ({
  children,
  className = '',
  direction = 'vertical',
  showNavigation = true,
  navigationType = 'dots',
  autoScroll = false,
  autoScrollInterval = 5000
}: SnapScrollProps) => {
  const scrollClasses = direction === 'vertical'
    ? 'snap-y snap-mandatory overflow-y-scroll h-screen'
    : 'snap-x snap-mandatory overflow-x-scroll flex w-screen'

  const containerClasses = direction === 'vertical'
    ? 'h-screen'
    : 'flex w-max'

  return (
    <div className={`relative ${scrollClasses} ${className}`}>
      <div className={containerClasses}>
        {children.map((child, index) => (
          <div
            key={index}
            className={`snap-start ${
              direction === 'vertical'
                ? 'h-screen w-full'
                : 'w-screen h-screen flex-shrink-0'
            }`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <Navigation
          direction={direction}
          type={navigationType}
          totalSections={children.length}
          autoScroll={autoScroll}
          autoScrollInterval={autoScrollInterval}
        />
      )}
    </div>
  )
}

interface NavigationProps {
  direction: 'vertical' | 'horizontal'
  type: 'dots' | 'arrows' | 'both'
  totalSections: number
  autoScroll: boolean
  autoScrollInterval: number
}

const Navigation = ({ direction, type, totalSections, autoScroll }: NavigationProps) => {
  return (
    <>
      {/* Dots Navigation */}
      {(type === 'dots' || type === 'both') && (
        <div className={`
          fixed flex gap-2 z-50
          ${direction === 'vertical'
            ? 'right-4 top-1/2 -translate-y-1/2 flex-col'
            : 'bottom-4 left-1/2 -translate-x-1/2'
          }
        `}>
          {Array.from({ length: totalSections }, (_, i) => (
            <button
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                bg-white/30 hover:bg-white/60
                ${i === 0 ? 'bg-white' : ''}
              `}
              onClick={() => {
                const scrollContainer = document.querySelector('.snap-mandatory')
                const targetSection = scrollContainer?.children[i] as HTMLElement
                targetSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          ))}
        </div>
      )}

      {/* Arrow Navigation */}
      {(type === 'arrows' || type === 'both') && (
        <>
          {direction === 'vertical' && (
            <>
              <button
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onClick={() => {
                  const scrollContainer = document.querySelector('.snap-mandatory')
                  scrollContainer?.scrollBy({
                    top: -window.innerHeight,
                    behavior: 'smooth'
                  })
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onClick={() => {
                  const scrollContainer = document.querySelector('.snap-mandatory')
                  scrollContainer?.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  })
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}

          {direction === 'horizontal' && (
            <>
              <button
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onClick={() => {
                  const scrollContainer = document.querySelector('.snap-mandatory')
                  scrollContainer?.scrollBy({
                    left: -window.innerWidth,
                    behavior: 'smooth'
                  })
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onClick={() => {
                  const scrollContainer = document.querySelector('.snap-mandatory')
                  scrollContainer?.scrollBy({
                    left: window.innerWidth,
                    behavior: 'smooth'
                  })
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </>
      )}
    </>
  )
}

export default SnapScroll