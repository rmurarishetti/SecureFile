// components/Hero.tsx
import Link from 'next/link';
import { Shield } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
      </div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-green-500/30 to-red-500/30 opacity-40"
        style={{
          maskImage: 'radial-gradient(circle at center, white, transparent)',
          WebkitMaskImage: 'radial-gradient(circle at center, white, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Your complete platform for secure file scanning.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Upload and scan your files securely using VirusTotal&apos;s powerful API. 
          Build with confidence knowing your files are safe.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center"
          >
            <Shield className="w-5 h-5 mr-2" />
            Start Scanning
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors w-full sm:w-auto"
          >
            Get a Demo
          </Link>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default Hero;