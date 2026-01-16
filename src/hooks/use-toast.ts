
import { useSnackbar } from 'notistack';

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const toast = (options: {
    title?: string;
    description?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  }) => {
    const message = options.title || options.description || '';
    const variant = options.variant === 'default' ? 'info' : options.variant || 'info';
    
    enqueueSnackbar(message, { variant });
  };

  return { toast };
};

export { useToast as toast };
