import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts';
import {
  Button,
  Input,
  Textarea,
  Label,
  Badge,
} from '@/components/ui';
import { recipesService } from '@/lib/database';
import { TrashIcon } from '@/components/Icons';
import type { Recipe } from '@/lib/types';
import { useForm, revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';

const recipeSchema = z.object({
  name: z.string().trim().min(1, 'Recipe name is required'),
  description: z
    .union([z.string(), z.undefined()])
    .transform((v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)),
  servings: z.string().optional(),
  cookTime: z
    .union([z.string(), z.undefined()])
    .transform((v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export default function CreateRecipeScreen() {
  const { user, requireAuth } = useAuth();

  useEffect(() => {
    if (!requireAuth()) {
      router.back();
    }
  }, [requireAuth]);

  const scrollRef = useRef<any>(null);
  const ingredientRefs = useRef<Array<TextInput | null>>([]);
  const stepRefs = useRef<Array<TextInput | null>>([]);
  
  // TanStack Form focus management for React Native
  const fields = useRef<Array<{ input: TextInput | null; name: string }>>([]);
  
  const addField = (input: TextInput | null, name: string, index: number) => {
    fields.current[index] = { input, name };
  };

  const [ingredientKeys, setIngredientKeys] = useState<string[]>(['ik-0']);
  const [stepKeys, setStepKeys] = useState<string[]>(['sk-0']);
  const makeKey = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const [categoryInput, setCategoryInput] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Form setup with TanStack Form + Zod
  const form = useForm({
    defaultValues: {
      name: '',
      description: undefined,
      servings: undefined,
      cookTime: undefined,
      ingredients: [''],
      steps: [''],
      categories: [],
    } as RecipeFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: recipeSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      const filteredIngredients = (value.ingredients ?? []).map((i) => i.trim()).filter(Boolean);
      const filteredSteps = (value.steps ?? []).map((s) => s.trim()).filter(Boolean);

      const recipeData: Omit<Recipe, '$id' | '$createdAt' | '$updatedAt'> = {
        name: value.name.trim(),
        description: value.description,
        servings: value.servings ? parseInt(value.servings, 10) : undefined,
        cookTime: value.cookTime,
        ingredients: filteredIngredients,
        steps: filteredSteps,
        categories: (value.categories ?? []).filter(Boolean),
        userId: user.$id!,
      };

      const created = await recipesService.create(recipeData);
      router.replace(`/recipes/${created.$id}`);
    },
    onSubmitInvalid: ({ formApi }) => {
      const errorMap = formApi.state.errorMap.onDynamic;
      if (!errorMap) return;

      // Find first input with error
      for (const input of fields.current) {
        if (input?.input && errorMap[input.name as keyof typeof errorMap]) {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
          setTimeout(() => input.input?.focus(), 300);
          break;
        }
      }
    },
  });


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

  const filteredSuggestions = useMemo(() => {
    const selected = ((form.state.values as unknown as RecipeFormValues).categories ?? []);
    return categorySuggestions
      .filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase()))
      .filter((c) => !selected.includes(c))
      .slice(0, 6);
  }, [categoryInput, categorySuggestions, (form.state.values as any).categories]);

  // Ingredient management
  const addIngredientAfter = (index: number) => {
    const values = form.state.values as unknown as RecipeFormValues;
    const base = values.ingredients ?? [''];
    const next = [...base];
    next.splice(index + 1, 0, '');
    form.setFieldValue('ingredients', next);
    const nextKeys = [...ingredientKeys];
    nextKeys.splice(index + 1, 0, makeKey('ik'));
    setIngredientKeys(nextKeys);
    setTimeout(() => {
      ingredientRefs.current[index + 1]?.focus?.();
    }, 0);
  };

  const removeIngredient = (index: number) => {
    const values = form.state.values as unknown as RecipeFormValues;
    const base = values.ingredients ?? [];
    const next = base.filter((_, i) => i !== index);
    form.setFieldValue('ingredients', next.length > 0 ? next : ['']);
    const nextKeys = ingredientKeys.filter((_, i) => i !== index);
    setIngredientKeys(nextKeys.length > 0 ? nextKeys : ['ik-0']);
  };

  // Step management
  const addStepAfter = (index: number) => {
    const values = form.state.values as unknown as RecipeFormValues;
    const base = values.steps ?? [''];
    const next = [...base];
    next.splice(index + 1, 0, '');
    form.setFieldValue('steps', next);
    const nextKeys = [...stepKeys];
    nextKeys.splice(index + 1, 0, makeKey('sk'));
    setStepKeys(nextKeys);
    setTimeout(() => {
      stepRefs.current[index + 1]?.focus?.();
    }, 0);
  };

  const removeStep = (index: number) => {
    const values = form.state.values as unknown as RecipeFormValues;
    const base = values.steps ?? [];
    const next = base.filter((_, i) => i !== index);
    form.setFieldValue('steps', next.length > 0 ? next : ['']);
    const nextKeys = stepKeys.filter((_, i) => i !== index);
    setStepKeys(nextKeys.length > 0 ? nextKeys : ['sk-0']);
  };

  // Category management
  const addCategory = (value?: string) => {
    const raw = (value ?? categoryInput).trim();
    if (!raw) return;
    const selected = (form.state.values as unknown as RecipeFormValues).categories ?? [];
    if (!selected.includes(raw)) {
      form.setFieldValue('categories', [...selected, raw]);
    }
    setCategoryInput('');
    setShowSuggestions(false);
  };

  const removeCategory = (category: string) => {
    const selected = (form.state.values as unknown as RecipeFormValues).categories ?? [];
    form.setFieldValue('categories', selected.filter((c) => c !== category));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} ref={scrollRef}>
        <View className="p-4 space-y-10">
          <View>
            <View className="space-y-4">
              <View>
                <Label>Name</Label>
                <form.Field
                  name={'name'}
                  children={(field) => (
                    <View>
                      <Input
                        ref={(input) => addField(input, field.name, 0)}
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Enter recipe name"
                        className={field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {!!field.state.meta.errorMap.onDynamic && (
                        <Text className="text-red-500 text-xs mt-1">{
                          Array.isArray(field.state.meta.errorMap.onDynamic)
                            ? (field.state.meta.errorMap.onDynamic[0]?.message ?? 'Invalid')
                            : (field.state.meta.errorMap.onDynamic as unknown as string)
                        }</Text>
                      )}
                    </View>
                  )}
                />
              </View>

              <View>
                <Label>Description</Label>
                <form.Field
                  name={'description'}
                  children={(field) => (
                    <View>
                      <Textarea
                        ref={(input) => addField(input, field.name, 1)}
                        value={field.state.value ?? ''}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Brief description of the recipe"
                        rows={3}
                        className={field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </View>
                  )}
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Label>Servings</Label>
                  <form.Field
                    name={'servings'}
                    children={(field) => (
                      <Input
                        ref={(input) => addField(input, field.name, 2)}
                        value={field.state.value ?? ''}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="4"
                        keyboardType="numeric"
                        className={field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Label>Cook Time</Label>
                  <form.Field
                    name={'cookTime'}
                    children={(field) => (
                      <Input
                        ref={(input) => addField(input, field.name, 3)}
                        value={field.state.value ?? ''}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="30 min"
                        className={field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View>
            <View className="space-y-3">
              <View>
                <Label>Categories</Label>
                <Input
                  value={categoryInput}
                  onChangeText={(text) => {
                    setCategoryInput(text);
                    setShowSuggestions(text.length > 0);
                  }}
                  onSubmitEditing={() => addCategory()}
                  placeholder="Type and press Enter to add"
                  returnKeyType="done"
                  hint="E.g. Italian, Sweet, Vegan"
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

              {(((form.state.values as unknown as RecipeFormValues).categories?.length ?? 0) > 0) && (
                <View className="flex-row flex-wrap gap-2">
                  {((form.state.values as unknown as RecipeFormValues).categories ?? []).map((category) => (
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
            <View className="mb-3">
              <Label>Ingredients</Label>
            </View>
            <View className="space-y-3">
              {ingredientKeys.map((_, index) => (
                <View key={ingredientKeys[index]} className="flex-row items-center gap-2">
                  <View className="flex-1">
                    <form.Field
                      name={`ingredients[${index}]`}
                      children={(field) => (
                        <Input
                          ref={(el) => {
                            ingredientRefs.current[index] = el;
                            addField(el, `ingredients[${index}]`, 4 + index);
                          }}
                          value={field.state.value ?? ''}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          placeholder={`Ingredient ${index + 1}`}
                          returnKeyType="next"
                          onSubmitEditing={() => addIngredientAfter(index)}
                          className={`flex-1 ${field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}`}
                          hint={(ingredientKeys.length <= 1) ? 'Press Enter to add ingredient' : undefined}
                        />
                      )}
                    />
                  </View>
                  {(ingredientKeys.length > 1) && (
                    <TouchableOpacity onPress={() => removeIngredient(index)}>
                      <View className="p-2 flex-grow">
                        <TrashIcon color="red" size={16} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Cooking Steps */}
          <View>
            <View className="mb-3">
              <Label>Cooking Steps</Label>
            </View>
            <View className="space-y-3">
              {stepKeys.map((_, index) => (
                <View key={stepKeys[index]} className="flex-row items-start gap-2">
                  <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mt-1">
                    <Text className="text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1 flex-row items-start gap-2">
                    <form.Field
                      name={`steps[${index}]`}
                      children={(field) => (
                        <Textarea
                          ref={(el) => {
                            stepRefs.current[index] = el as unknown as TextInput | null;
                            addField(el as unknown as TextInput | null, `steps[${index}]`, 100 + index);
                          }}
                          value={field.state.value ?? ''}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          placeholder={`Step ${index + 1} instructions`}
                          rows={2}
                          className={`flex-1 ${field.state.meta.errorMap.onDynamic ? 'border-red-500 focus:ring-red-500' : ''}`}
                          onKeyPress={(e) => {
                            if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === '\n') {
                              addStepAfter(index);
                            }
                          }}
                        />
                      )}
                    />
                    {(stepKeys.length > 1) && (
                      <TouchableOpacity onPress={() => removeStep(index)}>
                        <View className="p-2">
                          <TrashIcon color="red" size={12} />
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
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onPress={() => form.handleSubmit()}
              className="flex-1"
              loading={form.state.isSubmitting}
              disabled={form.state.isSubmitting}
            >
              Create Recipe
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
