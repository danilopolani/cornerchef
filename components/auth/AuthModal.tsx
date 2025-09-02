import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AuthModal({ visible, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  
  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Bottom sheet snap points - specific to auth modal context
  const snapPoints = useMemo(() => ['75%', '90%'], []);
  
  // Show/hide bottom sheet based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);
  
  // Handle sheet close
  const handleSheetClose = useCallback(() => {
    onClose();
  }, [onClose]);
  
  // Backdrop component
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      // Modal will close automatically via context
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setIsLoading(false);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <TouchableOpacity
            onPress={handleSheetClose}
            className="w-8 h-8 rounded-full bg-muted items-center justify-center"
          >
            <Text className="text-muted-foreground text-lg font-medium">×</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Login/Register */}
        <View className="flex-row bg-muted rounded-lg p-1 mb-6">
          <Button
            onPress={() => setIsLogin(true)}
            variant={isLogin ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 mx-1"
          >
            Sign In
          </Button>
          <Button
            onPress={() => setIsLogin(false)}
            variant={!isLogin ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 mx-1"
          >
            Sign Up
          </Button>
        </View>

        {/* Form Fields */}
        {!isLogin && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-background"
              autoCapitalize="words"
            />
          </View>
        )}

        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            className="border border-border rounded-lg px-4 py-3 text-foreground bg-background"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#6b7280"
            className="border border-border rounded-lg px-4 py-3 text-foreground bg-background"
            secureTextEntry
          />
        </View>

        {/* Submit Button */}
        <Button
          onPress={handleSubmit}
          loading={isLoading}
          size="default"
          className="mb-4"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Footer Text */}
        <Text className="text-center text-muted-foreground text-sm mb-4">
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <Text
            onPress={() => setIsLogin(!isLogin)}
            className="text-primary font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </Text>
        </Text>
      </BottomSheetView>
    </BottomSheet>
  );
}
