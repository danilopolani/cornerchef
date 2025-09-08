import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  View,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui';
import { recipesService } from '@/lib/database';
import { BookOpenIcon, PlusIcon } from '@/components/Icons';
import type { Recipe } from '@/lib/types';
import { ScreenTitle } from '@/components/ui/ScreenTitle';
import { ScreenContent } from '@/components/ui/ScreenContent';

export default function RecipesScreen() {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recipes when user changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setRecipes([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userRecipes = await recipesService.getByUserId(user.$id!);
        setRecipes(userRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setRecipes([]);
        Alert.alert('Error', 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const handleCreateRecipe = () => {
    if (requireAuth()) {
      // User is authenticated - navigate to create recipe form
      router.push('/recipes/create');
    }
    // If user is not authenticated, the auth modal will be shown automatically
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center px-10">
          <ActivityIndicator size="large" color="#74b781" />
          <Text className="mt-4 text-base text-slate-500">Loading recipes...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center px-10">
        <BookOpenIcon color="#6b7280" size={48} />
        <Text className="text-lg font-semibold text-slate-800 mt-4 mb-2">No recipes found</Text>
        <Text className="text-sm text-slate-500 text-center leading-5">
          {isAuthenticated
            ? 'Create your first recipe to get started'
            : 'Sign in to view and create your recipes'}
        </Text>
        <View className="mt-4">
          <Button 
            onPress={handleCreateRecipe} 
            size="default" 
            className="mt-4"
            icon={<PlusIcon color="white" size={16} />}
          >
            Create Recipe
          </Button>
        </View>
      </View>
    );
  };

  const renderRecipeItem = (recipe: Recipe) => (
    <TouchableOpacity 
      key={recipe.$id} 
      className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200"
      onPress={() => router.push(`/(tabs)/recipes/${recipe.$id}`)}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold text-slate-800 mb-1">{recipe.name}</Text>
        {recipe.description && (
          <Text className="text-sm text-slate-500 mb-2 leading-5" numberOfLines={2}>
            {recipe.description}
          </Text>
        )}
        <View className="flex-row gap-4 mb-2">
          {recipe.cookTime && (
            <Text className="text-xs text-slate-500">⏱️ {recipe.cookTime}</Text>
          )}
          {recipe.servings && (
            <Text className="text-xs text-slate-500">👥 {recipe.servings} servings</Text>
          )}
        </View>
        {recipe.categories && recipe.categories.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 items-center">
            {recipe.categories.slice(0, 3).map((category, index) => (
              <View key={index} className="bg-emerald-100 px-2 py-0.5 rounded-md">
                <Text className="text-xs text-emerald-800 font-medium">{category}</Text>
              </View>
            ))}
            {recipe.categories.length > 3 && (
              <Text className="text-xs text-slate-500 italic">
                +{recipe.categories.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContent>
      <ScreenTitle>Recipes</ScreenTitle>

      {/* Content */}
      {recipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="pb-24">
            {recipes.map(renderRecipeItem)}
          </View>
        </ScrollView>
      )}

      {/* Floating Action Button for authenticated users with recipes */}
      {isAuthenticated && recipes.length > 0 && (
        <TouchableOpacity 
          className="absolute bottom-24 right-5 bg-primary w-10 h-10 rounded-full justify-center items-center shadow-sm"
          onPress={handleCreateRecipe}
        >
          <PlusIcon color="white" size={16} />
        </TouchableOpacity>
      )}
    </ScreenContent>
  );
}
