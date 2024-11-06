import { useState, useEffect } from 'react';

export const useLoadingSkeleton = (loadingData: boolean, minSkeletonTime = 500) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!loadingData) {
      // Mantener el skeleton visible durante un mínimo de tiempo
      timer = setTimeout(() => setShowSkeleton(false), minSkeletonTime);
    } else {
      // Mostrar skeleton si los datos están en estado de carga
      setShowSkeleton(true);
    }

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, [loadingData, minSkeletonTime]);

  return { showSkeleton };
};
