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
import { signOut } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  isSoundEnabled,
  onToggleSound,
}) => {
  const { user } = useAuth();

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
              <Text style={styles.title}>Settings</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {user && (
              <View style={styles.userSection}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={onToggleDarkMode}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={isDarkMode ? theme.colors.surface : theme.colors.textSecondary}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Switch
                  value={isSoundEnabled}
                  onValueChange={onToggleSound}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={isSoundEnabled ? theme.colors.surface : theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game</Text>
              
              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Statistics</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Achievements</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Leaderboard</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>
              
              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Help & Tutorial</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Contact Us</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </Pressable>
            </View>

            {user && (
              <View style={styles.section}>
                <Pressable
                  style={[styles.menuItem, styles.signOutButton]}
                  onPress={handleSignOut}
                >
                  <Text style={[styles.menuItemText, styles.signOutText]}>
                    Sign Out
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sidebarContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  userSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  signOutButton: {
    marginTop: 8,
    borderBottomWidth: 0,
  },
  signOutText: {
    color: theme.colors.error,
    fontWeight: '600',
  },
});

export default Sidebar;