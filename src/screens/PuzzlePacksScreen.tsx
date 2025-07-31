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
import {styles} from '../styles/puzzlePacksStyles';
import { APP_STRINGS, formatDynamicSubstitutionMessage } from '../constants/strings';

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
          <Text style={styles.backButtonText}>{APP_STRINGS.GAME.BACK_BUTTON}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{APP_STRINGS.PACKS.TITLE}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          {APP_STRINGS.PACKS.SUBTITLE}
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
              <Text style={styles.playHint}>{APP_STRINGS.GAME.PLAY_HINT}</Text>
            )}
          </Pressable>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {APP_STRINGS.PACKS.SUBTITLE}
          </Text>
          <Text style={styles.progressText}>
            {formatDynamicSubstitutionMessage(APP_STRINGS.PACKS.COMPLETED_LEVELS, 'userLevel', userLevel)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default PuzzlePacksScreen;