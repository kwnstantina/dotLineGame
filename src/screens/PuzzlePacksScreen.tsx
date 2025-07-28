import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import { colors, designTokens } from '../theme/colors';
import { PuzzlePack } from '../types';
import { createPuzzlePacks } from '../utils/puzzleUtils';
import { savePuzzlePack } from '../utils/firebase';
import { getUserProgress } from '../utils/firebase';
import { getPackUnlockStatus } from '../utils/packProgression';
import LoadingView from '../components/LoadingView';

interface PuzzlePacksScreenProps {
  onPackSelect: (pack: PuzzlePack) => void;
  onBackToMain: () => void;
}

const PuzzlePacksScreen: React.FC<PuzzlePacksScreenProps> = ({ onPackSelect, onBackToMain }) => {
  const [puzzlePacks, setPuzzlePacks] = useState<PuzzlePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(0);

  useEffect(() => {
    loadPuzzlePacks();
    loadUserProgress();
  }, []);

  const loadPuzzlePacks = async () => {
    try {
      setLoading(true);
      
      // Use the enhanced pack unlock status function
      const { packs, userLevel: currentUserLevel, unlockedPackIds } = await getPackUnlockStatus();
      
      // If no packs exist, create and save default packs
      if (packs.length === 0) {
        const defaultPacks = createPuzzlePacks();
        
        // Save each pack to Firebase
        for (const pack of defaultPacks) {
          await savePuzzlePack(pack);
        }
        
        // Re-check unlock status after saving
        const { packs: updatedPacks, userLevel: updatedUserLevel } = await getPackUnlockStatus();
        setPuzzlePacks(updatedPacks);
        setUserLevel(updatedUserLevel);
      } else {
        setPuzzlePacks(packs);
        setUserLevel(currentUserLevel);
      }
      
      console.log('📦 Pack unlock status:', {
        totalPacks: packs.length,
        unlockedPacks: unlockedPackIds.length,
        userLevel: currentUserLevel
      });
    } catch (error) {
      console.error('Error loading puzzle packs:', error);
      // Fallback to local packs
      const localPacks = createPuzzlePacks();
      setPuzzlePacks(localPacks);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progress = await getUserProgress();
      setUserLevel(progress?.totalLevelsCompleted || 0);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handlePackPress = (pack: PuzzlePack) => {
    if (!pack.isUnlocked) {
      const requiredLevel = pack.requiredLevel || 0;
      Alert.alert(
        'Pack Locked',
        `Complete ${requiredLevel} levels to unlock this pack. You have completed ${userLevel} levels.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    onPackSelect(pack);
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'green': return colors.feedback.success;
      case 'orange': return colors.feedback.warning;
      case 'purple': return colors.interactive.accent;
      default: return colors.text.secondary;
    }
  };

  if (loading) {
    return <LoadingView fadeAnim={new Animated.Value(1)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBackToMain}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Puzzle Packs</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Choose from various puzzle collections with different themes and difficulties
        </Text>

        {puzzlePacks.map((pack) => (
          <Pressable
            key={pack.id}
            style={[
              styles.packCard,
              !pack.isUnlocked && styles.packCardLocked,
              { borderLeftColor: getThemeColor(pack.theme) }
            ]}
            onPress={() => handlePackPress(pack)}
          >
            <View style={styles.packHeader}>
              <Text style={styles.packIcon}>{pack.icon}</Text>
              <View style={styles.packInfo}>
                <Text style={[styles.packName, !pack.isUnlocked && styles.textLocked]}>
                  {pack.name}
                </Text>
                <Text style={[styles.packDescription, !pack.isUnlocked && styles.textLocked]}>
                  {pack.description}
                </Text>
              </View>
              {!pack.isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
            </View>

            <View style={styles.packDetails}>
              <Text style={[styles.packCount, !pack.isUnlocked && styles.textLocked]}>
                {pack.puzzles.length} puzzles
              </Text>
              {pack.requiredLevel && (
                <Text style={[styles.requirement, !pack.isUnlocked && styles.textLocked]}>
                  Requires {pack.requiredLevel} levels completed
                </Text>
              )}
            </View>

            {pack.isUnlocked && (
              <Text style={styles.playHint}>Tap to play →</Text>
            )}
          </Pressable>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Complete more levels to unlock additional puzzle packs!
          </Text>
          <Text style={styles.progressText}>
            Your progress: {userLevel} levels completed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  backButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingRight: designTokens.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: designTokens.spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  packCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderLeftWidth: 4,
    ...designTokens.elevation.medium,
  },
  packCardLocked: {
    opacity: 0.6,
    backgroundColor: colors.background.surface,
  },
  packHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  packIcon: {
    fontSize: 32,
    marginRight: designTokens.spacing.md,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  lockIcon: {
    fontSize: 24,
  },
  packDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  packCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  requirement: {
    fontSize: 12,
    color: colors.feedback.warning,
    fontStyle: 'italic',
  },
  playHint: {
    fontSize: 14,
    color: colors.interactive.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  textLocked: {
    color: colors.text.muted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
    marginTop: designTokens.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  progressText: {
    fontSize: 16,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
});

export default PuzzlePacksScreen;