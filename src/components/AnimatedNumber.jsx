import { useState, useEffect, useRef } from 'react';

/**
 * A component that animates a number from 0 to its target value.
 * @param {number} value - The target value to animate to.
 * @param {number} duration - Duration of the animation in ms.
 * @param {function} formatter - Function to format the number for display.
 */
export const AnimatedNumber = ({ value, duration = 1200, formatter }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    // Reset start time and current display value when the target value changes
    startTimeRef.current = null;
    
    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Power3 ease-out: 1 - (1 - x)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(easeProgress * Math.abs(value));
      setDisplayValue(current);
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(requestRef.current);
  }, [value, duration]);

  return <span>{formatter ? formatter(displayValue) : displayValue}</span>;
};
