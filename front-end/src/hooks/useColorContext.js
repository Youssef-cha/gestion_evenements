import { useContext } from 'react';
import { ColorState } from '../contexts/ColorProvider';

export const useColorContext = () => {
  return useContext(ColorState);
}; 