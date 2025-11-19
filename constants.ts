import { StyleOption } from "./types";

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'corporate',
    name: 'Corporate Professional',
    description: 'Clean grey or neutral background, professional attire, studio lighting.',
    promptContext: 'Professional corporate headshot, solid neutral grey background, suit or business formal attire, confident expression, studio softbox lighting',
    icon: '💼'
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    description: 'Bright, modern office environment with glass and depth of field.',
    promptContext: 'Modern tech startup CEO headshot, blurred bright office background, smart casual attire (blazer over t-shirt or crisp shirt), approachable yet professional',
    icon: '💻'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Natural',
    description: 'Soft natural lighting with urban or park background blur.',
    promptContext: 'Outdoor professional portrait, golden hour lighting, blurred city park or urban nature background, warm tones, business casual',
    icon: '🌳'
  },
  {
    id: 'studio_bw',
    name: 'Studio B&W',
    description: 'High contrast, artistic black and white studio photography.',
    promptContext: 'Black and white artistic headshot, dramatic lighting, remix noir style, high contrast, sharp focus on eyes, clean black background',
    icon: '📷'
  }
];
