import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { recipesService } from '@/lib/database';
import type { Recipe } from '@/lib/types';
import { Button } from '@/components/ui';
import { ChevronLeftIcon } from '@/components/Icons';

export default function RecipeViewScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!params.id) return;
        const data = await recipesService.getById(params.id as string);
        setRecipe(data);
      } catch (error) {
        Alert.alert('Error', 'Recipe not found');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeftIcon color="#374151" size={24} />
            <Text className="ml-1 text-base font-medium text-gray-700">Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Recipe</Text>
          <View className="w-16" />
        </View>
        
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#74b781" />
          <Text className="mt-4 text-base text-gray-500">Loading recipe...</Text>
        </View>
      </View>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <ChevronLeftIcon color="#374151" size={24} />
          <Text className="ml-1 text-base font-medium text-gray-700">Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">{recipe.name}</Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5 pb-24">
        <Text className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</Text>
        {!!recipe.description && (
          <Text className="text-base text-gray-600 leading-6 mb-4">{recipe.description}</Text>
        )}

        <View className="flex-row gap-4 mb-4">
          {!!recipe.cookTime && (
            <Text className="text-sm text-gray-500">⏱️ {recipe.cookTime}</Text>
          )}
          {!!recipe.servings && (
            <Text className="text-sm text-gray-500">👥 {recipe.servings} servings</Text>
          )}
        </View>

        {!!recipe.categories?.length && (
          <View className="flex-row flex-wrap gap-1.5 mb-6">
            {recipe.categories.map((c, i) => (
              <View key={`${c}-${i}`} className="bg-emerald-100 px-2 py-0.5 rounded-md">
                <Text className="text-xs text-emerald-800 font-medium">{c}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-2">Ingredients</Text>
          {recipe.ingredients.map((ing, idx) => (
            <View key={idx} className="flex-row items-start gap-2 mb-1">
              <Text className="text-base">•</Text>
              <Text className="text-base text-gray-800 flex-1">{ing}</Text>
            </View>
          ))}
        </View>

        <View className="mb-10">
          <Text className="text-xl font-semibold text-gray-900 mb-2">Steps</Text>
          {recipe.steps.map((s, idx) => (
            <View key={idx} className="flex-row items-start gap-3 mb-3">
              <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-primary-foreground text-xs font-medium">{idx + 1}</Text>
              </View>
              <Text className="text-base text-gray-800 flex-1 leading-6">{s}</Text>
            </View>
          ))}
        </View>

        </View>
      </ScrollView>
    </View>
  );
}
