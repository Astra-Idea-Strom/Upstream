import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBrandStore } from '../../store/brandStore';
import { BrandMark } from './BrandMark';
import { Button } from '../ui/primitives';

/**
 * Marketing-site header. Shares its height, brand mark and button language with
 * the studio top bar so the two shells read as one product.
 */
export const Header: React.FC = () => {
  const startIdentityCreation = useBrandStore((state) => state.startIdentityCreation);

  return (
    <header className="sticky top-0 z-40 w-full select-none border-b border-brand-100/80 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
        <a
          href="#top"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2"
          aria-label="Upstream home"
        >
          <BrandMark />
        </a>

        <nav className="flex items-center gap-2">
          <a
            href="#themes"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 sm:inline-flex"
          >
            Starter kits
          </a>

          <Button
            variant="primary"
            size="sm"
            pill
            trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={() => startIdentityCreation()}
          >
            Build identity
          </Button>
        </nav>
      </div>
    </header>
  );
};
