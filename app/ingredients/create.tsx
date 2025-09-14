import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts';
import { ChevronLeftIcon } from '@/components/Icons';

export default function CreateIngredientScreen() {
  const { requireAuth } = useAuth();

  useEffect(() => {
    if (!requireAuth()) {
      router.back();
    }
  }, [requireAuth]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={handleCancel} className="flex-row items-center">
          <ChevronLeftIcon color="#374151" size={24} />
          <Text className="ml-1 text-base font-medium text-slate-700">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900">New Ingredient</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Placeholder content */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-slate-800 mb-2">Ingredient creation</Text>
        <Text className="text-slate-500 text-center">
          The creation form will be available soon.
        </Text>
      </View>
    </View>
  );
}


