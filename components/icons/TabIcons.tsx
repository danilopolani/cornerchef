import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

// Home icon (Lucide home equivalent)
export const HomeIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

// BookOpen icon (Lucide book-open equivalent)
export const BookOpenIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

// Package icon (Lucide package equivalent)
export const PackageIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m7.5 4.27 9 5.15" />
    <Path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <Path d="m3.3 7 8.7 5 8.7-5" />
    <Path d="M12 22V12" />
  </Svg>
);

// ChefHat icon (Lucide chef-hat equivalent)
export const ChefHatIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <Path d="M6 17h12" />
  </Svg>
);

// Plus icon for add button
export const PlusIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

// Search icon
export const SearchIcon: React.FC<IconProps> = ({ color = '#000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
  </Svg>
);

