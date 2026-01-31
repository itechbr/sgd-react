'use client'; // Isso é OBRIGATÓRIO para Lottie funcionar no Next.js App Router

import Lottie from 'lottie-react';
import animationData from '@/app/assets/animations/erro-404.json'; // Ajuste o caminho se necessário

export default function NotFoundAnimation() {
  return (
    <div className="w-full max-w-md">
      <Lottie 
        animationData={animationData} 
        loop={true} 
        className="w-full h-auto"
      />
    </div>
  );
}