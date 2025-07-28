import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AuthScreen from './screens/AuthScreen';
import { SnackbarProvider } from './components/SnackbarProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeFirebase } from './utils/firebase';
import LoadingView from './components/LoadingView';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Firebase...');
        await initializeFirebase();
        console.log('✅ Firebase initialization complete');
        setFirebaseInitialized(true);
      } catch (error: any) {
        console.error('❌ Firebase initialization error:', error);
        setFirebaseError(error.message || 'Firebase initialization failed');
        // Still allow app to continue with fallback
        setFirebaseInitialized(true);
      }
    };
    
    initializeApp();
  }, []);

  if (isLoading || !firebaseInitialized) {
    const fadeAnim = new Animated.Value(0);
    return <LoadingView fadeAnim={fadeAnim} />;
  }

  if (firebaseError) {
    console.warn('⚠️ App continuing with Firebase error:', firebaseError);
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <AppContent />
      </SnackbarProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;