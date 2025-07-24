import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signInWithEmail, signUpWithEmail, resetPassword, signInWithGoogle } from '../utils/firebase';
import { useSnackbar } from '../components/SnackbarProvider';
import { AUTH_CODES, AUTH_STRINGS, AuthMode } from '../constants/authConstants';
import { authStyles } from '../styles/authStyles';
import { validateAuthForm } from '../utils/validation';


const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AUTH_CODES.LOGIN);
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

    if (mode === AUTH_CODES.FORGOT) {
      setIsLoading(true);
      const { error } = await resetPassword(email);
      setIsLoading(false);
      
      if (error) {
        showSnackbar(error);
      } else {
        showSnackbar(AUTH_STRINGS.PASSWORD_RESET_SENT);
        setMode(AUTH_CODES.LOGIN);
      }
      return;
    }

    setIsLoading(true);
    
    let result;
    if (mode === AUTH_CODES.LOGIN) {
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
      case AUTH_CODES.LOGIN:
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
            
            <Pressable
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.SIGN_IN}
              </Text>
            </Pressable>

            <View style={authStyles.dividerContainer}>
              <View style={authStyles.divider} />
              <Text style={authStyles.dividerText}>{AUTH_STRINGS.OR}</Text>
              <View style={authStyles.divider} />
            </View>

            <Pressable
              style={authStyles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={authStyles.googleButtonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.GOOGLE_BUTTON}
              </Text>
            </Pressable>
            
            <Pressable
              style={authStyles.linkButton}
              onPress={() => setMode(AUTH_CODES.FORGOT)}
            >
              <Text style={authStyles.linkText}>{AUTH_STRINGS.FORGOT_PASSWORD}</Text>
            </Pressable>
            
            <Pressable
              style={authStyles.linkButton}
              onPress={() => setMode(AUTH_CODES.REGISTER)}
            >
              <Text style={authStyles.linkText}>
                {AUTH_STRINGS.DONT_HAVE_ACCOUNT}
              </Text>
            </Pressable>
          </>
        );
        
      case AUTH_CODES.REGISTER:
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
            
            <Pressable
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.CREATING_ACCOUNT : AUTH_STRINGS.SIGN_UP}
              </Text>
            </Pressable>

            <View style={authStyles.dividerContainer}>
              <View style={authStyles.divider} />
              <Text style={authStyles.dividerText}>{AUTH_STRINGS.OR}</Text>
              <View style={authStyles.divider} />
            </View>

            <Pressable
              style={authStyles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={authStyles.googleButtonText}>
                {isLoading ? AUTH_STRINGS.SIGNING_IN : AUTH_STRINGS.GOOGLE_BUTTON}
              </Text>
            </Pressable>
            
            <Pressable
              style={authStyles.linkButton}
              onPress={() => setMode(AUTH_CODES.LOGIN)}
            >
              <Text style={authStyles.linkText}>
                {AUTH_STRINGS.ALREADY_HAVE_ACCOUNT}
              </Text>
            </Pressable>
          </>
        );
        
      case AUTH_CODES.FORGOT:
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
            
            <Pressable
              style={authStyles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={authStyles.buttonText}>
                {isLoading ? AUTH_STRINGS.SENDING : AUTH_STRINGS.SEND_RESET_EMAIL}
              </Text>
            </Pressable>
            
            <Pressable
              style={authStyles.linkButton}
              onPress={() => setMode(AUTH_CODES.LOGIN)}
            >
              <Text style={authStyles.linkText}>{AUTH_STRINGS.BACK_TO_SIGN_IN}</Text>
            </Pressable>
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