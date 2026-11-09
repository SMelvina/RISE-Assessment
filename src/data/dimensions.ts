import { DimensionId, DimensionInfo } from '../types';

export const DIMENSIONS: Record<DimensionId, DimensionInfo> = {
  R: {
    id: 'R',
    name: 'Realize',
    theme: 'Understanding yourself and defining your direction.',
    colorName: 'Phoszade Green',
    tailwindBorder: 'border-[#024F28]',
    tailwindBgLight: 'bg-[#E6EFEA]',
    tailwindText: 'text-[#024F28]',
    tailwindBadge: 'bg-[#E6EFEA] text-[#024F28] border-[#B6D6C4]',
    tailwindAccent: 'bg-[#024F28]',
    hex: '#024F28',
    lightHex: '#E6EFEA',
  },
  I: {
    id: 'I',
    name: 'Illuminate',
    theme: 'Giving expression, illumination, and structure to the envisioned future.',
    colorName: 'Illuminate Gold',
    tailwindBorder: 'border-[#724F00]',
    tailwindBgLight: 'bg-[#FEF9E6]',
    tailwindText: 'text-[#724F00]',
    tailwindBadge: 'bg-[#FEF9E6] text-[#724F00] border-[#ECC867]',
    tailwindAccent: 'bg-[#724F00]',
    hex: '#724F00',
    lightHex: '#FEF9E6',
  },
  S: {
    id: 'S',
    name: 'Start',
    theme: 'Initiating and developing the undertaking.',
    colorName: 'Pastel Orange',
    tailwindBorder: 'border-[#D45711]',
    tailwindBgLight: 'bg-[#FFF7F2]',
    tailwindText: 'text-[#D45711]',
    tailwindBadge: 'bg-[#FFF7F2] text-[#D45711] border-[#FFDCC6]',
    tailwindAccent: 'bg-[#D45711]',
    hex: '#D45711',
    lightHex: '#FFF7F2',
  },
  E: {
    id: 'E',
    name: 'Expand',
    theme: 'Multiplying results and establishing lasting impact.',
    colorName: 'Warm Peach',
    tailwindBorder: 'border-[#8C3A2B]',
    tailwindBgLight: 'bg-[#FDF2EE]',
    tailwindText: 'text-[#8C3A2B]',
    tailwindBadge: 'bg-[#FDF2EE] text-[#8C3A2B] border-[#F5C7B8]',
    tailwindAccent: 'bg-[#8C3A2B]',
    hex: '#8C3A2B',
    lightHex: '#FDF2EE',
  },
};

export const BRAND = {
  name: 'Phoszade',
  frameworkTitle: 'THE RISE Framework',
  toolkitName: 'Vision Capacity Diagnosis',
  primaryHex: '#024F28',
  goldHex: '#E39F00',
  logoDarkBg: '/brand-logo.svg',
  logoLightBg: '/brand-logo.svg',
};

// Distinct Editorial Pastel Palette for each of the 9 stages / levels with verified WCAG AAA contrast
export interface PillarPastelTheme {
  bg: string;
  text: string;
  contrastColor: string; // High-contrast authoritative version for text and UI elements on light backgrounds
  introBg: string; // Rich authoritative level background for level page breakers / intro screens
  name: string;
  dimensionId: DimensionId;
}

export const PILLAR_PASTELS: Record<number, PillarPastelTheme> = {
  // Dimension R (Realize - Sage to Mint Pastels)
  1: { bg: '#6FB995', text: '#051D11', contrastColor: '#024F28', introBg: '#024F28', name: 'Identity', dimensionId: 'R' },
  2: { bg: '#81C8A5', text: '#051D11', contrastColor: '#075E31', introBg: '#075E31', name: 'Clarify', dimensionId: 'R' },
  3: { bg: '#94D7B5', text: '#051D11', contrastColor: '#095E32', introBg: '#095E32', name: 'Crystallize', dimensionId: 'R' },

  // Dimension I (Illuminate - Sunlit to Buttercup Pastel Yellows)
  4: { bg: '#EED468', text: '#2E1E00', contrastColor: '#724F00', introBg: '#EED468', name: 'Articulate', dimensionId: 'I' },
  5: { bg: '#F7E082', text: '#2E1E00', contrastColor: '#6E4C00', introBg: '#F7E082', name: 'Architect', dimensionId: 'I' },

  // Dimension S (Start - Soft Luminous Pastel Orange)
  6: { bg: '#F8B179', text: '#2B0E02', contrastColor: '#A03E06', introBg: '#F8B179', name: 'Launch', dimensionId: 'S' },
  7: { bg: '#F8B179', text: '#2B0E02', contrastColor: '#A03E06', introBg: '#F8B179', name: 'Build', dimensionId: 'S' },

  // Dimension E (Expand - Warm Luminous Peach)
  8: { bg: '#F6A890', text: '#2B0E02', contrastColor: '#8C3A2B', introBg: '#F6A890', name: 'Scale', dimensionId: 'E' },
  9: { bg: '#F6A890', text: '#2B0E02', contrastColor: '#8C3A2B', introBg: '#F6A890', name: 'Lead', dimensionId: 'E' },
};
