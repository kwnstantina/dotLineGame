import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const ThemeLoadingView: React.FC = () => {
  console.log('ThemeLoadingView rendered');
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#FFFFF0', // fallback background
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4338ca',
    fontWeight: '500',
  },
});

export default ThemeLoadingView;