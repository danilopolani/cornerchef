import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { HomeIcon, BookOpenIcon, PackageIcon, ChefHatIcon } from '@/components/Icons';

// SVG Tab Icon component
function TabBarIcon({ IconComponent, color }: { IconComponent: React.FC<{ color: string; size: number }>; color: string }) {
  return <IconComponent color={color} size={20} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#74b781', // Primary color from our theme (emerald) - converted from oklch(0.726 0.100 144.1)
        tabBarInactiveTintColor: '#737373', // Muted foreground color - converted from oklch(0.45 0 0)
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          paddingTop: 12,
          height: 90,
          bottom: 0,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false, // Hide all headers globally for custom titles
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon IconComponent={HomeIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <TabBarIcon IconComponent={BookOpenIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Ingredients',
          tabBarIcon: ({ color }) => <TabBarIcon IconComponent={PackageIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chef"
        options={{
          title: 'Chef',
          tabBarIcon: () => <TabBarIcon IconComponent={ChefHatIcon} color="#fc7462" />, // Secondary color from our theme
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
            color: '#fc7462', // Secondary color for label too
          },
        }}
      />
    </Tabs>
  );
}
