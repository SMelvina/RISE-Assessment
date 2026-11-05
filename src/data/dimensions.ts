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
    colorName: 'Phoszade Amber-Ochre',
    tailwindBorder: 'border-[#873806]',
    tailwindBgLight: 'bg-[#FBF3E8]',
    tailwindText: 'text-[#873806]',
    tailwindBadge: 'bg-[#FBF3E8] text-[#873806] border-[#E8CDB5]',
    tailwindAccent: 'bg-[#873806]',
    hex: '#873806',
    lightHex: '#FBF3E8',
  },
  E: {
    id: 'E',
    name: 'Expand',
    theme: 'Multiplying results and establishing lasting impact.',
    colorName: 'Regal Mulberry',
    tailwindBorder: 'border-[#4A2840]',
    tailwindBgLight: 'bg-[#F6EDF3]',
    tailwindText: 'text-[#4A2840]',
    tailwindBadge: 'bg-[#F6EDF3] text-[#4A2840] border-[#DAC3D3]',
    tailwindAccent: 'bg-[#4A2840]',
    hex: '#4A2840',
    lightHex: '#F6EDF3',
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
  4: { bg: '#EED468', text: '#2E1E00', contrastColor: '#724F00', introBg: '#5A4508', name: 'Articulate', dimensionId: 'I' },
  5: { bg: '#F7E082', text: '#2E1E00', contrastColor: '#6E4C00', introBg: '#684E06', name: 'Architect', dimensionId: 'I' },

  // Dimension S (Start - Terracotta to Peach Pastels)
  6: { bg: '#E6976F', text: '#2B0E02', contrastColor: '#8C3B07', introBg: '#6E320A', name: 'Launch', dimensionId: 'S' },
  7: { bg: '#F2AC87', text: '#2B0E02', contrastColor: '#8C3B07', introBg: '#7C3707', name: 'Build', dimensionId: 'S' },

  // Dimension E (Expand - Mauve to Lilac Pastels)
  8: { bg: '#BD89B1', text: '#140410', contrastColor: '#542247', introBg: '#522547', name: 'Scale', dimensionId: 'E' },
  9: { bg: '#CF9DC4', text: '#1E0719', contrastColor: '#5C244E', introBg: '#451E3B', name: 'Lead', dimensionId: 'E' },
};
