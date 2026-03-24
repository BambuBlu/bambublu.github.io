"use client"
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import Skeleton from './Skeleton';

interface ImageWithSkeletonProps extends ImageProps {
  borderRadius?: string | number;
}

export default function ImageWithSkeleton({
  src,
  alt,
  borderRadius = '12px',
  className = '',
  style,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const wrapperStyle = props.fill
    ? { position: 'absolute' as const, inset: 0, borderRadius, overflow: 'hidden' }
    : { position: 'relative' as const, width: '100%', maxWidth: '100%', height: 'auto', borderRadius, overflow: 'hidden', boxSizing: 'border-box' as const };

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease-out',
          pointerEvents: 'none',
        }}
      >
        <Skeleton width="100%" height="100%" borderRadius="inherit" />
      </div>

      <Image
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        style={{ ...style, display: 'block', maxWidth: '100%' }} 
        {...props}
      />
    </div>
  );
}