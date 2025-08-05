import React, { useMemo } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

const TwinklingStars = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const stars = useMemo(() => {
    const starCount = isMobile ? 50 : 100;
    const shootingStarCount = isMobile ? 1 : 3;
    
    const regularStars = Array.from({ length: starCount }, (_, i) => {
      const size = Math.random() > 0.7 ? 'large' : Math.random() > 0.3 ? 'medium' : 'small';
      return {
        id: `star-${i}`,
        className: `star ${size === 'medium' ? '' : size}`,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          '--duration': `${2 + Math.random() * 3}s`,
          '--delay': `${Math.random() * 5}s`,
        }
      };
    });

    const shootingStars = Array.from({ length: shootingStarCount }, (_, i) => ({
      id: `shooting-star-${i}`,
      className: 'shooting-star',
      style: {
        left: '0%',
        top: `${20 + Math.random() * 60}%`,
        '--shoot-duration': `${3 + Math.random() * 2}s`,
        '--shoot-delay': `${Math.random() * 10 + 5}s`,
      }
    }));

    return [...regularStars, ...shootingStars];
  }, [isMobile]);

  return (
    <div className="stars-container">
      {stars.map(star => (
        <div
          key={star.id}
          className={star.className}
          style={star.style}
        />
      ))}
    </div>
  );
};

export default TwinklingStars;