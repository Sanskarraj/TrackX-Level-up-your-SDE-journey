import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
};


// Counter Animation Hook
const useCounterAnimation = (endValue: number, duration: number = 2000, delay: number = 0, decimalPlaces: number = 0) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (endValue - startValue) * easeOutCubic;
        
        setCurrentValue(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue); // Ensure final value is exact
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [endValue, duration, delay]);

  return { currentValue, isAnimating };
};

// Animated Number Component with decimal support
const AnimatedNumber = ({ value, className, duration = 2000, delay = 0 }: {
  value: string | number;
  className?: string;
  duration?: number;
  delay?: number;
}) => {
  // Parse the numeric value and preserve decimal places
  const parseNumericValue = (val: string | number) => {
    if (typeof val === 'number') return val;
    
    // Extract number from string (including decimals)
    const match = val.match(/-?\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
  };
  
  // Determine decimal places from original value
  const getDecimalPlaces = (val: string | number) => {
    if (typeof val === 'number') {
      const str = val.toString();
      const decimalIndex = str.indexOf('.');
      return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
    }
    
    const match = val.match(/\d+\.(\d+)/);
    return match ? match[1].length : 0;
  };
  
  const numericValue = parseNumericValue(value);
  const decimalPlaces = getDecimalPlaces(value);
  
  const { currentValue, isAnimating } = useCounterAnimation(numericValue, duration, delay, decimalPlaces);
  
  // Format the value maintaining the original format
  const formatValue = (val: number) => {
    const formattedNumber = val.toFixed(decimalPlaces);
    
    if (typeof value === 'string') {
      // Preserve original string format (like adding % back)
      if (value.includes('%')) {
        return `${formattedNumber}%`;
      }
      // Add any other format preservation logic here
      return formattedNumber;
    }
    
    return formattedNumber;
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
        {formatValue(currentValue)}
      </div>
      
      {/* Fade-in effect overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

// Enhanced StatCard with timer animation (unchanged)
const StatCard = ({ icon: Icon, value, label, gradient, delay = 0 }: StatCardProps) => (
  <div 
    className="group bg-gradient-to-br backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative overflow-hidden`}>
        <Icon className="w-6 h-6 text-white relative z-10" />
        
        {/* Icon glow effect */}
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-500"></div>
      </div>
      
      <div className="flex-1">
        <AnimatedNumber 
          value={value}
          duration={1800}
          delay={delay + 200}
          className={`text-2xl font-bold transition-colors duration-300 ${
            gradient.includes('green') 
              ? 'text-green-400 group-hover:text-green-300' 
              : gradient.includes('blue') 
                ? 'text-blue-400 group-hover:text-blue-300' 
                : 'text-purple-400 group-hover:text-purple-300'
          }`}
        />
        
        <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
          {label}
        </div>
      </div>
    </div>
    
    {/* Card shine effect */}
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  </div>
);

// Additional CSS for smoother animations (add to your CSS file)
const additionalAnimationStyles = `
@keyframes slide-in-from-bottom-4 {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes counter-glow {
  0%, 100% {
    text-shadow: 0 0 5px currentColor;
  }
  50% {
    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

.animate-counter-glow {
  animation: counter-glow 2s ease-in-out;
}

@keyframes number-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-number-pop {
  animation: number-pop 0.3s ease-out;
}
`;

export default StatCard;