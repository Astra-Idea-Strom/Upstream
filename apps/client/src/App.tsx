import React from 'react';
import { useBrandStore } from './store/brandStore';
import { ReplitHeroSection } from './components/home/ReplitHeroSection';
import { StudioLayout } from './components/studio/StudioLayout';

export const App: React.FC = () => {
  const { viewMode } = useBrandStore();

  if (viewMode === 'studio') {
    return <StudioLayout />;
  }

  return <ReplitHeroSection />;
};

export default App;
