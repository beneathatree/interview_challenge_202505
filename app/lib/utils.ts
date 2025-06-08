import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CARDS_BACKGROUND_COLORS = [
  "#00809D",
  "#FCECDD",
  "#FF7601",
  "#F3A26D",
  "#819A91",
  "#A7C1A8",
  "#D1D8BE",
  "#EEEFE0",
  "#FCEF91",
  "#FB9E3A",
  "#C562AF",
  "#4DA8DA",
  "#FFE6E1",
  "#0065F8",
]

const getContrastTextColor = (hex: string): string => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "black" : "white";
};

export const getRandomBackgroundColorCard = () => {
  const randomHex = CARDS_BACKGROUND_COLORS[Math.floor(Math.random() * CARDS_BACKGROUND_COLORS.length)];
  const textColor = getContrastTextColor(randomHex);

  return {
    backgroundClass: `bg-[${randomHex}]`,
    style: { backgroundColor: randomHex, color: textColor },
  };
}
