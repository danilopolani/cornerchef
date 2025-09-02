import { StyleSheet, Alert } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/Button';

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CornerChef</Text>
      
      {isAuthenticated ? (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Hello, {user?.name}!</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
      ) : (
        <Text style={styles.guestText}>Browsing as Guest</Text>
      )}

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {/* Test buttons */}
      <View style={styles.buttonContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#74b781',
  },
  emailText: {
    fontSize: 14,
    opacity: 0.7,
  },
  guestText: {
    fontSize: 16,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
});
