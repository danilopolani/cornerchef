import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RecipesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide all headers globally for custom titles
      }}
    />
  );
}
