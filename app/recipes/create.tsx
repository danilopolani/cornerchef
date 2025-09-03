import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts';
import {
  Button,
  Input,
  Textarea,
  Label,
  Badge,
} from '@/components/ui';
import { recipesService } from '@/lib/database';
import { PlusIcon } from '@/components/icons/TabIcons';
import type { Recipe } from '@/lib/types';

interface RecipeFormValues {
  name: string;
  description: string;
  servings: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  categories: string[];
}

export default function CreateRecipeScreen() {
  const { user, requireAuth } = useAuth();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!requireAuth()) {
      router.back();
    }
  }, [requireAuth]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    servings: '',
    cookTime: '',
  });

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const ingredientRefs = useRef<Array<TextInput | null>>([]);
  const stepRefs = useRef<Array<TextInput | null>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch category suggestions
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!user) return;
        const recipes = await recipesService.getByUserId(user.$id!);
        const unique = Array.from(
          new Set(
            recipes
              .flatMap((r) => r.categories ?? [])
              .map((c) => c.trim())
              .filter((c) => c.length > 0)
          )
        ).sort();
        setCategorySuggestions(unique);
      } catch (err) {
        setCategorySuggestions([]);
      }
    };
    fetchCategories();
  }, [user]);

  const filteredSuggestions = categorySuggestions
    .filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase()))
    .filter((c) => !selectedCategories.includes(c))
    .slice(0, 6);

  // Ingredient management
  const addIngredient = () => setIngredients((prev) => [...prev, '']);
  const addIngredientAfter = (index: number) => {
    setIngredients((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, '');
      return next;
    });
    requestAnimationFrame(() => {
      ingredientRefs.current[index + 1]?.focus?.();
    });
  };
  const removeIngredient = (index: number) => 
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => 
    setIngredients((prev) => prev.map((v, i) => (i === index ? value : v)));

  // Step management
  const addStep = () => setSteps((prev) => [...prev, '']);
  const addStepAfter = (index: number) => {
    setSteps((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, '');
      return next;
    });
    requestAnimationFrame(() => {
      stepRefs.current[index + 1]?.focus?.();
    });
  };
  const removeStep = (index: number) => 
    setSteps((prev) => prev.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) => 
    setSteps((prev) => prev.map((v, i) => (i === index ? value : v)));

  // Category management
  const addCategory = (value?: string) => {
    const raw = (value ?? categoryInput).trim();
    if (!raw) return;
    if (!selectedCategories.includes(raw)) {
      setSelectedCategories((prev) => [...prev, raw]);
    }
    setCategoryInput('');
    setShowSuggestions(false);
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a recipe');
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Recipe name is required');
      return;
    }

    const filteredIngredients = ingredients.filter(i => i.trim());
    const filteredSteps = steps.filter(s => s.trim());

    if (filteredIngredients.length === 0) {
      Alert.alert('Error', 'At least one ingredient is required');
      return;
    }

    if (filteredSteps.length === 0) {
      Alert.alert('Error', 'At least one cooking step is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const recipeData: Omit<Recipe, '$id' | '$createdAt' | '$updatedAt'> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        cookTime: formData.cookTime.trim() || undefined,
        ingredients: filteredIngredients,
        steps: filteredSteps,
        categories: selectedCategories,
        userId: user.$id!,
      };

      await recipesService.create(recipeData);
      
      Alert.alert(
        'Success',
        'Recipe created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to create recipe:', error);
      Alert.alert('Error', 'Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-10">
          {/* Basic Information */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Basic Information</Text>
            <View className="space-y-4">
              <View>
                <Label>Recipe Name</Label>
                <Input
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter recipe name"
                />
              </View>

              <View>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Brief description of the recipe"
                  rows={3}
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Label>Servings</Label>
                  <Input
                    value={formData.servings}
                    onChangeText={(text) => setFormData({ ...formData, servings: text })}
                    placeholder="4"
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Label>Cook Time</Label>
                  <Input
                    value={formData.cookTime}
                    onChangeText={(text) => setFormData({ ...formData, cookTime: text })}
                    placeholder="30 min"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Categories</Text>
            <View className="space-y-3">
              <View>
                <Input
                  value={categoryInput}
                  onChangeText={(text) => {
                    setCategoryInput(text);
                    setShowSuggestions(text.length > 0);
                  }}
                  onSubmitEditing={() => addCategory()}
                  placeholder="Type and press Enter to add"
                  returnKeyType="done"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <View className="mt-2 border rounded-md bg-white border-gray-300">
                    {filteredSuggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        onPress={() => addCategory(suggestion)}
                        className="px-3 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <Text className="text-sm">{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {selectedCategories.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <TouchableOpacity key={category} onPress={() => removeCategory(category)}>
                      <Badge variant="secondary" className="px-3 py-1">
                        {`${category} ×`}
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Ingredients */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900">Ingredients</Text>
              <TouchableOpacity onPress={addIngredient}>
                <View className="bg-primary rounded-full p-2">
                  <PlusIcon color="white" size={16} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row items-center gap-2">
                  <Input
                    ref={(el) => {
                      ingredientRefs.current[index] = el;
                    }}
                    value={ingredient}
                    onChangeText={(text) => updateIngredient(index, text)}
                    placeholder={`Ingredient ${index + 1}`}
                    returnKeyType="next"
                    onSubmitEditing={() => addIngredientAfter(index)}
                    className="flex-1"
                  />
                  {ingredients.length > 1 && (
                    <TouchableOpacity onPress={() => removeIngredient(index)}>
                      <View className="p-2">
                        <Text className="text-destructive text-lg">×</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Cooking Steps */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900">Cooking Steps</Text>
              <TouchableOpacity onPress={addStep}>
                <View className="bg-primary rounded-full p-2">
                  <PlusIcon color="white" size={16} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="space-y-3">
              {steps.map((step, index) => (
                <View key={index} className="flex-row items-start gap-2">
                  <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mt-1">
                    <Text className="text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1 flex-row items-start gap-2">
                    <Textarea
                      ref={(el) => {
                        stepRefs.current[index] = el as unknown as TextInput | null;
                      }}
                      value={step}
                      onChangeText={(text) => updateStep(index, text)}
                      placeholder={`Step ${index + 1} instructions`}
                      rows={2}
                      className="flex-1"
                      onKeyPress={(e) => {
                        // Add next step on Enter
                        if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === '\n') {
                          addStepAfter(index);
                        }
                      }}
                    />
                    {steps.length > 1 && (
                      <TouchableOpacity onPress={() => removeStep(index)}>
                        <View className="p-2">
                          <Text className="text-destructive text-lg">×</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 pb-8">
            <Button
              variant="outline"
              onPress={handleCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              className="flex-1"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Recipe
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
