import { Alert } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui';

export default function HomeScreen() {
  const { user, isAuthenticated, logout, requireAuth } = useAuth();

  const handleProtectedAction = () => {
    if (requireAuth()) {
      // User is authenticated, perform the action
      Alert.alert('Success', 'You can access this protected feature!');
    }
    // If user is not authenticated, the auth modal will be shown automatically
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-2xl font-bold mb-2.5">Welcome to CornerChef</Text>
      
      {isAuthenticated ? (
        <View className="items-center mb-2.5">
          <Text className="text-lg font-semibold text-primary">Hello, {user?.name}!</Text>
          <Text className="text-sm opacity-70">{user?.email}</Text>
        </View>
      ) : (
        <Text className="text-base opacity-60 italic">Browsing as Guest</Text>
      )}

      <View className="my-8 h-0.5 w-4/5 bg-gray-200 dark:bg-gray-700" />
      
      {/* Test buttons */}
      <View className="w-full gap-3 mb-5">
        <Button onPress={handleProtectedAction} size="sm">
          🔒 Protected Feature
        </Button>
        
        {isAuthenticated && (
          <Button onPress={handleLogout} variant="destructive" size="sm">
            Logout
          </Button>
        )}
      </View>

      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
