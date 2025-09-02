import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function IngredientsScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Ingredients</Text>
      <View className="my-8 h-0.5 w-4/5 bg-gray-200 dark:bg-gray-700" />
      <EditScreenInfo path="app/(tabs)/ingredients.tsx" />
    </View>
  );
}

