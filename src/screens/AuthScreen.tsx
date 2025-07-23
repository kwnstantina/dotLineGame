import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signInWithEmail, signUpWithEmail, resetPassword, signInWithGoogle } from '../utils/firebase';
import { useSnackbar } from '../components/SnackbarProvider';
import { AUTH_STRINGS } from '../constants/authConstants';
import { authStyles } from '../styles/authStyles';
import { validateAuthForm } from '../utils/validation';

type AuthMode = 'login' | 'register' | 'forgot';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleAuth = async () => {
    const validation = validateAuthForm(email, password, confirmPassword, mode);
    
    if (!validation.isValid) {
      showSnackbar(validation.message!);
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      const { error } = await resetPassword(email);
      setIsLoading(false);
      
      if (error) {
        showSnackbar(error);
      } else {
        showSnackbar(AUTH_STRINGS.PASSWORD_RESET_SENT);
        setMode('login');
      }
      return;
    }

    setIsLoading(true);
    
    let result;
    if (mode === 'login') {
      result = await signInWithEmail(email, password);
    } else {
      result = await signUpWithEmail(email, password);
    }

    setIsLoading(false);

    if (result.error) {
      showSnackbar(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result.error) {
      showSnackbar(result.error);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <Text style={authStyles.title}>{AUTH_STRINGS.LOGIN_TITLE}</Text>
            <Text style={authStyles.subtitle}>{AUTH_STRINGS.LOGIN_SUBTITLE}</Text>
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.EMAIL_PLACEHOLDER}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
            
            <TouchableOpacity
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.SIGN_IN}
              </Text>
            </TouchableOpacity>

            <View style={authStyles.dividerContainer}>
              <View style={authStyles.divider} />
              <Text style={authStyles.dividerText}>{AUTH_STRINGS.OR}</Text>
              <View style={authStyles.divider} />
            </View>

            <TouchableOpacity
              style={authStyles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={authStyles.googleButtonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.GOOGLE_BUTTON}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => setMode('forgot')}
            >
              <Text style={authStyles.linkText}>{AUTH_STRINGS.FORGOT_PASSWORD}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => setMode('register')}
            >
              <Text style={authStyles.linkText}>
                {AUTH_STRINGS.DONT_HAVE_ACCOUNT}
              </Text>
            </TouchableOpacity>
          </>
        );
        
      case 'register':
        return (
          <>
            <Text style={authStyles.title}>{AUTH_STRINGS.REGISTER_TITLE}</Text>
            <Text style={authStyles.subtitle}>{AUTH_STRINGS.REGISTER_SUBTITLE}</Text>
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.EMAIL_PLACEHOLDER}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.CONFIRM_PASSWORD_PLACEHOLDER}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            
            <TouchableOpacity
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.CREATING_ACCOUNT : AUTH_STRINGS.SIGN_UP}
              </Text>
            </TouchableOpacity>

            <View style={authStyles.dividerContainer}>
              <View style={authStyles.divider} />
              <Text style={authStyles.dividerText}>{AUTH_STRINGS.OR}</Text>
              <View style={authStyles.divider} />
            </View>

            <TouchableOpacity
              style={authStyles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={authStyles.googleButtonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.GOOGLE_BUTTON}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => setMode('login')}
            >
              <Text style={authStyles.linkText}>
                {AUTH_STRINGS.ALREADY_HAVE_ACCOUNT}
              </Text>
            </TouchableOpacity>
          </>
        );
        
      case 'forgot':
        return (
          <>
            <Text style={authStyles.title}>{AUTH_STRINGS.FORGOT_TITLE}</Text>
            <Text style={authStyles.subtitle}>{AUTH_STRINGS.FORGOT_SUBTITLE}</Text>
            
            <TextInput
              style={authStyles.input}
              placeholder={AUTH_STRINGS.EMAIL_PLACEHOLDER}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TouchableOpacity
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.SENDING : AUTH_STRINGS.SEND_RESET_EMAIL}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.linkButton}
              onPress={() => setMode('login')}
            >
              <Text style={authStyles.linkText}>{AUTH_STRINGS.BACK_TO_SIGN_IN}</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <View style={authStyles.formContainer}>
          {renderForm()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;