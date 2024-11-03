import { useState } from 'react';

export const useSubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (onSubmit: () => Promise<void>) => {
    if (isSubmitting) return; // Evita múltiples envíos

    setIsSubmitting(true);
    try {
      await onSubmit(); // Ejecuta la función de envío proporcionada
    } finally {
      setIsSubmitting(false); // Habilita el botón después de la ejecución
    }
  };

  return { isSubmitting, handleSubmit };
};
