import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface PersonalisationScreenProps {
  initialName?: string;
  onContinue: (name: string) => void;
  onBack: () => void;
  onHomeClick?: () => void;
}

export const PersonalisationScreen: React.FC<PersonalisationScreenProps> = ({
  initialName = '',
  onContinue,
  onBack,
  onHomeClick,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Please enter your first name.');
      return;
    }

    if (trimmed.length > 40) {
      setError('First name cannot exceed 40 characters.');
      return;
    }

    // Validation: First name only (single word, no full names or surnames)
    if (trimmed.includes(' ')) {
      setError('Please provide only your first name (no surname or middle name).');
      return;
    }

    setError(null);
    onContinue(trimmed);
  };

  return (
    <div className="min-h-screen w-full bg-warm-50 text-charcoal flex flex-col justify-between select-none">
      {/* Top Header: Brand Logo on TOP LEFT, Back action on RIGHT */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b border-warm-300">
        <BrandLogo variant="dark" size="md" showSubtitle={true} onClick={onHomeClick} />

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-charcoal-muted hover:text-charcoal transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Overview</span>
        </button>
      </header>

      {/* Center Content matching First Page Spacing */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-8 lg:py-12 flex flex-col items-center animate-screen-in">
        <div className="max-w-xl w-full">
          <div className="w-12 h-12 rounded-2xl bg-warm-200 border border-warm-300 flex items-center justify-center text-charcoal mb-8">
            <User className="w-6 h-6 text-charcoal-muted" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-charcoal tracking-tight mb-4">
            Let's begin with you.
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed font-sans font-normal mb-8">
            Before we begin your Phoszade RISE journey, what should we call you?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs uppercase font-semibold tracking-wider text-charcoal-muted mb-2"
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Maya"
                autoFocus
                maxLength={40}
                className={`w-full px-5 py-4 rounded-xl border text-lg font-medium text-charcoal bg-white focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-warm-300 focus:border-[#024F28] focus:ring-[#024F28]/20'
                }`}
              />
              {error ? (
                <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>
              ) : (
                <p className="text-xs text-charcoal-muted mt-2">
                  Your first name will be used to personalize your questions and diagnostic report.
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-[#024F28] hover:bg-[#013D1F] text-white font-semibold text-base transition-all shadow-md group cursor-pointer"
              >
                <span>Begin Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer matching First Page Spacing */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-warm-300 flex items-center justify-between text-xs text-charcoal-muted">
        <span>Phoszade &copy; {new Date().getFullYear()} · THE RISE Framework</span>
      </footer>
    </div>
  );
};
