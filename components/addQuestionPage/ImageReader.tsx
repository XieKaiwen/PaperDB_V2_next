import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import placeholderImage from '@/src/assets/image-placeholder.png';

interface ImageReaderProps {
  content: File,
  width: number,
  height: number,
  className?: string;
}
export default function ImageReader({content, width, height, className=""} : ImageReaderProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const imageReader = new FileReader();
      imageReader.readAsDataURL(content);
  
      imageReader.onloadend = () => {
        if (imageReader.result && typeof imageReader.result === 'string') {
          setImageUrl(imageReader.result);
        }
      };
  
      // Cleanup if necessary (if content can change)
      return () => {
        setImageUrl(null);
      };
    }, [content]);
  
    if (!imageUrl) {
      return <Image className={className} src={placeholderImage} alt="loading image..." width={width} height={height}/>; // You can add a placeholder or spinner here if needed
    }
  
    return <Image className={className} src={imageUrl} alt="question image" width={width} height={height}/>;
}
