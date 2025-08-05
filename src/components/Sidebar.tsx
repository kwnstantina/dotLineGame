import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { signOut } from '../core/services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useAppSettings } from '../contexts/AppProviders';
import { TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../core/theme/themeSystem';
import ThemeLoadingView from './ThemeLoadingView';
import { APP_STRINGS } from '../constants/strings';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
}) => {
  const { user } = useAuth();
  const { colors, isDarkMode, isLoading: themeLoading, toggleDarkMode, isSoundEnabled, setIsSoundEnabled } = useAppSettings();

  // Early return for theme loading
  if (themeLoading) {
    return (
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemeLoadingView />
        </View>
      </Modal>
    );
  }

  // Wrapper functions for Switch compatibility
  const handleDarkModeChange = (value: boolean): void => {
    toggleDarkMode();
  };

  const handleSoundChange = (value: boolean): void => {
    setIsSoundEnabled(value);
  };

  const createStyles = (colors: any) => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    sidebarContainer: {
      backgroundColor: colors?.background?.card || '#ffffff',
      borderTopLeftRadius: BORDER_RADIUS.xl,
      borderTopRightRadius: BORDER_RADIUS.xl,
      maxHeight: '90%',
      minHeight: '60%',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.xxl,
      paddingVertical: SPACING.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors?.border?.primary || '#E5E7EB',
    },
    title: {
      fontSize: TYPOGRAPHY.fontSizes.xxl,
      fontWeight: TYPOGRAPHY.fontWeights.bold,
      color: colors?.text?.primary || '#161618',
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.xl,
      backgroundColor: colors?.border?.subtle || '#F9FAFB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: TYPOGRAPHY.fontSizes.xl,
      color: colors?.text?.primary || '#161618',
      fontWeight: TYPOGRAPHY.fontWeights.bold,
    },
    userSection: {
      paddingHorizontal: SPACING.xxl,
      paddingVertical: SPACING.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors?.border?.primary || '#E5E7EB',
    },
    userEmail: {
      fontSize: TYPOGRAPHY.fontSizes.md,
      color: colors?.text?.muted || '#64748b',
      marginTop: 4,
    },
    section: {
      paddingHorizontal: SPACING.xxl,
      paddingVertical: SPACING.xl,
    },
    sectionTitle: {
      fontSize: TYPOGRAPHY.fontSizes.lg,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      color: colors?.text?.primary || '#161618',
      marginBottom: SPACING.lg,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
    },
    settingLabel: {
      fontSize: TYPOGRAPHY.fontSizes.md,
      color: colors?.text?.primary || '#161618',
    },
    menuItem: {
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors?.border?.subtle || '#F9FAFB',
    },
    menuItemText: {
      fontSize: TYPOGRAPHY.fontSizes.md,
      color: colors?.text?.primary || '#161618',
    },
    signOutButton: {
      marginTop: SPACING.sm,
      borderBottomWidth: 0,
    },
    signOutText: {
      color: colors?.feedback?.error || '#9e2828',
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
    },
  });

  const styles = createStyles(colors);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sidebarContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>{APP_STRINGS.SIDEBAR.TITLE}</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{APP_STRINGS.SIDEBAR.CLOSE_BUTTON}</Text>
              </Pressable>
            </View>

            {user && (
              <View style={styles.userSection}>
                <Text style={styles.sectionTitle}>{APP_STRINGS.SIDEBAR.ACCOUNT.title}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.SIDEBAR.PREFERENCES.title}</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{APP_STRINGS.SIDEBAR.PREFERENCES.DARK_MODE}</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={handleDarkModeChange}
                  trackColor={{ false: colors?.border?.primary || '#E5E7EB', true: colors?.primary?.purple || '#6366f1' }}
                  thumbColor={isDarkMode ? colors?.background?.card || '#ffffff' : colors?.text?.muted || '#64748b'}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{APP_STRINGS.SIDEBAR.PREFERENCES.SOUND_EFFECTS}</Text>
                <Switch
                  value={isSoundEnabled}
                  onValueChange={handleSoundChange}
                  trackColor={{ false: colors?.border?.primary || '#E5E7EB', true: colors?.primary?.purple || '#6366f1' }}
                  thumbColor={isSoundEnabled ? colors?.background?.card || '#ffffff' : colors?.text?.muted || '#64748b'}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.SIDEBAR.GAME_SECTION.title}</Text>
              
              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.GAME_SECTION.STATISTICS}</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.GAME_SECTION.ACHIEVEMENTS}</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.GAME_SECTION.LEADERBOARD}</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.SIDEBAR.SUPPORT.title}</Text>
              
              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.SUPPORT.HELP_TUTORIAL}</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.SUPPORT.CONTACT_US}</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.SUPPORT.PRIVACY_POLICY}</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>{APP_STRINGS.SIDEBAR.SUPPORT.TERMS_OF_SERVICE}</Text>
              </Pressable>
            </View>

            {user && (
              <View style={styles.section}>
                <Pressable
                  style={[styles.menuItem, styles.signOutButton]}
                  onPress={handleSignOut}
                >
                  <Text style={[styles.menuItemText, styles.signOutText]}>
                    {APP_STRINGS.SIDEBAR.SIGN_OUT}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default Sidebar;