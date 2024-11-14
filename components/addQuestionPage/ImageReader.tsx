import { ImageReaderProps } from '@/src/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import placeholderImage from '@/src/assets/image-placeholder.png';

export default function ImageReader({content, width, height} : ImageReaderProps) {
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
      return <Image src={placeholderImage} alt="loading image..." width={width} height={height}/>; // You can add a placeholder or spinner here if needed
    }
  
    return <Image src={imageUrl} alt="Question Image" width={width} height={height}/>;
}
