// components/Logo.tsx

/**
 * Logo component that renders the SecureFile brand mark and wordmark
 * Combines an SVG shield icon with a triangle motif and company name
 * 
 * @param {Object} props - Component properties
 * @param {string} props.className - Optional CSS classes for additional styling
 * @returns {JSX.Element} Combined logo mark and company name
 */
const Logo = ({ className = "" }: { className?: string }) => {
    return (
      <div className="flex items-center gap-2">
        <svg 
          viewBox="0 0 64 64" 
          className={`w-8 h-8 text-white ${className}`}
          aria-label="SecureFile logo"
        >
          <path 
            d="M32 4L8 14v18c0 16.2 10.3 31.2 24 36 13.7-4.8 24-19.8 24-36V14L32 4z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path 
            d="M32 20L22 38h20L32 20z" 
            fill="currentColor"
          />
        </svg>
        <span className="font-semibold text-lg text-white">SecureFile</span>
      </div>
    );
  };
  
  export default Logo;