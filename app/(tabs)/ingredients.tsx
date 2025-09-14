import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts';
import { ingredientsService } from '@/lib/database';
import type { Ingredient } from '@/lib/types';
import { highlightMeasurements } from '@/lib/measurement-parser';
import { Button } from '@/components/ui';
import { PackageIcon, PlusIcon } from '@/components/Icons';
import { ScreenContent } from '@/components/ui/ScreenContent';
import { ScreenTitle } from '@/components/ui/ScreenTitle';

export default function IngredientsScreen() {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadIngredients = useCallback(async () => {
    if (!user?.$id) return;
    setIsLoading(true);
    try {
      const data = await ingredientsService.getByUserId(user.$id);
      setIngredients(data);
    } catch (error) {
      console.error('Failed to load ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    if (isAuthenticated) {
      loadIngredients();
    }
  }, [isAuthenticated, loadIngredients]);

  const onRefresh = useCallback(async () => {
    if (!user?.$id) return;
    setIsRefreshing(true);
    try {
      const data = await ingredientsService.getByUserId(user.$id);
      setIngredients(data);
    } catch (error) {
      console.error('Failed to refresh ingredients:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user?.$id]);

  const renderItem = ({ item }: { item: Ingredient }) => {
    const quantityText = item.quantity != null
      ? `${item.quantity}${item.quantityType ? ` ${item.quantityType}` : ''}`
      : '';

    return (
      <View className="flex-row items-center justify-between p-4 rounded-lg bg-slate-50 mb-2.5">
          <Text className="text-base font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-slate-500">{quantityText}</Text>
      </View>
    );
  };

  const handleCreateIngredient = () => {
    if (requireAuth()) {
      router.push('/ingredients/create' as any);
    }
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center px-10">
          <ActivityIndicator size="large" color="#74b781" />
          <Text className="mt-4 text-base text-slate-500">Loading ingredients...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center px-10">
        <PackageIcon color="#6b7280" size={48} />
        <Text className="text-lg font-semibold text-slate-800 mt-4 mb-2">No ingredients found</Text>
        <View className="mt-4">
          <Button 
            onPress={handleCreateIngredient}
            size="default"
            className="mt-4"
            icon={<PlusIcon color="white" size={16} />}
          >
            Create one
          </Button>
        </View>
      </View>
    );
  };

  return (
    <ScreenContent>
      <ScreenTitle>Ingredients</ScreenTitle>
      {ingredients.length === 0 ? (
        renderEmptyState()
      ) : (
        <View className="flex-1">
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.$id || item.name}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentInsetAdjustmentBehavior="automatic"
          />
          {/* Floating Action Button for authenticated users with items */}
          {isAuthenticated && (
            <TouchableOpacity 
              className="absolute bottom-24 right-5 bg-primary w-10 h-10 rounded-full justify-center items-center shadow-sm"
              onPress={handleCreateIngredient}
            >
              <PlusIcon color="white" size={16} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScreenContent>
  );
}

