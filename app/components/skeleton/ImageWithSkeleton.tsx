"use client"
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import Skeleton from './Skeleton'; 
import styles from './imagewithskeleton.module.css';

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  borderRadius?: string | number;
  aspectRatio?: string | number;
}

export default function ImageWithSkeleton({
  src,
  alt,
  containerClassName = '',
  borderRadius = '12px',
  aspectRatio,
  className = '',
  ...props 
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`${styles.wrapper} ${containerClassName}`}
      style={{
        borderRadius,
        aspectRatio,
        position: props.fill ? 'absolute' : 'relative', 
        inset: props.fill ? 0 : undefined,
        width: '100%',
        height: props.fill ? '100%' : 'auto',
        overflow: 'hidden',
      }}
    >
      <div 
        className={`${styles.skeleton_container} ${isLoaded ? styles.skeleton_hidden : ''}`}
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      >
        <Skeleton width="100%" height="100%" borderRadius="inherit" />
      </div>

      <Image
        src={src}
        alt={alt}
        className={className} 
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}