import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle?: string;
  image: string;
  cta?: {
    text: string;
    link: string;
  };
  overlayOpacity?: number; // Opacity as a percentage (0-100)
}

export default function Hero({
  title,
  subtitle,
  image,
  cta,
  overlayOpacity = 90, // Default opacity
}: HeroProps) {
  const primaryColor = '#06205c'; // Primary color
  const overlayStyle = {
    backgroundColor: primaryColor,
    opacity: overlayOpacity / 100, // Convert percentage to decimal
  };

  return (
    <div className="relative border-none overflow-hidden min-h-[60vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover border-none"
        />
        {/* Overlay with Primary Color */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={overlayStyle}
        />
        {/* Decorative Border Box */}
        <div className="absolute bottom-[70px] left-[70px] w-[calc(100%-140px)] h-[3px] bg-[#a9343a]"></div>
        <div className="absolute bottom-[70px] left-[70px] w-[3px] h-[calc(100%-140px)] bg-[#a9343a]"></div>
      </div>
      {/* Content */}
      <div className="relative max-w-7xl mx-auto p-8 sm:p-12 flex flex-col justify-center h-full text-left">
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-6 text-xl text-neutral-200 max-w-3xl">
            {subtitle}
          </p>
        )}

        {/* Call to Action */}
        {cta && (
          <div className="mt-10">
            <Link
              to={cta.link}
              className="group inline-flex items-center px-6 py-3 text-lg font-medium text-[#06205c] bg-white hover:bg-neutral-light transition-all duration-300 rounded-lg"
            >
              {cta.text}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}