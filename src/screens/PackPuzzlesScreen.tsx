import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { DESIGN_SYSTEM } from '../core/theme/designSystem';
import { useAppSettings } from '../contexts/AppProviders';
import { PuzzlePack, Puzzle } from '../types';
import { getPuzzleCompletions } from '../core/services/userService';
import { getReplayRecommendations } from '../core/services/packProgressionService';
import { difficultyCodes } from '../constants/codes';
import { createPackPuzzlesStyles } from '../styles/packPuzzlesStyles';
import ThemeLoadingView from '../components/ThemeLoadingView';
import { APP_STRINGS } from '../constants/strings';

interface PackPuzzlesScreenProps {
  pack: PuzzlePack;
  onPuzzleSelect: (puzzle: Puzzle) => void;
  onBack: () => void;
}

const PackPuzzlesScreen: React.FC<PackPuzzlesScreenProps> = ({ pack, onPuzzleSelect, onBack }) => {
  const [completions, setCompletions] = useState<{ [key: string]: any }>({});
  const [_loading, setLoading] = useState(true);
  const [replayRecommendations, setReplayRecommendations] = useState<any[]>([]);
  
  const { colors, isLoading: themeLoading } = useAppSettings();

  // Early return for theme loading
  if (themeLoading || Object.keys(colors).length === 0) {
    return <ThemeLoadingView />;
  }


  useEffect(() => {
    loadCompletions();
    
    // Load replay recommendations
    const loadReplayRecommendations = async () => {
      try {
        const recommendations = await getReplayRecommendations(pack.id);
        setReplayRecommendations(recommendations);
      } catch (error) {
        console.error('Error loading replay recommendations:', error);
      }
    };
    
    loadReplayRecommendations();
  }, [pack]);

  const loadCompletions = async () => {
    try {
      setLoading(true);
      const userCompletions = await getPuzzleCompletions();
      
      // Create a map of puzzle completions
      const completionMap: { [key: string]: any } = {};
      userCompletions.forEach(completion => {
        if (!completionMap[completion.puzzleId] || 
            completion.stars > completionMap[completion.puzzleId].stars) {
          completionMap[completion.puzzleId] = completion;
        }
      });
      
      setCompletions(completionMap);
    } catch (error) {
      console.error('Error loading completions:', error);
    } finally {
      setLoading(false);
    }
  };


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case difficultyCodes.easy: return colors?.feedback?.success || '#0fac78';
      case difficultyCodes.medium: return colors?.feedback?.warning || '#c4810c';
      case difficultyCodes.hard: return colors?.feedback?.error || '#9e2828';
      case difficultyCodes.expert: return colors?.interactive?.accent || '#a5b4fc';
      default: return colors?.text?.secondary || '#4338ca';
    }
  };

  const getStarDisplay = (puzzleId: string) => {
    const completion = completions[puzzleId];
    if (!completion) return '';
    
    const stars = '⭐'.repeat(completion.stars);
    const emptyStars = '☆'.repeat(3 - completion.stars);
    return stars + emptyStars;
  };

  const canImprove = (puzzleId: string): boolean => {
    const completion = completions[puzzleId];
    if (!completion) return false;
    return completion.stars < 3 || completion.efficiency < 90;
  };

  const getImprovementHint = (puzzleId: string): string => {
    const completion = completions[puzzleId];
    if (!completion) return '';
    
    if (completion.stars < 3) {
      return `${3 - completion.stars} more ⭐ possible`;
    }
    if (completion.efficiency < 90) {
      return `${90 - completion.efficiency}% efficiency gain`;
    }
    return APP_STRINGS.PERFECT_SCORE;
  };

  const screenWidth = Dimensions.get('window').width;
  const puzzleCardWidth = (screenWidth - DESIGN_SYSTEM.spacing.lg * 3) / 2;
  const styles = createPackPuzzlesStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{APP_STRINGS.GAME.BACK_BUTTON}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{pack.name}</Text>
      </View>

      <View style={styles.packInfo}>
        <Text style={styles.packIcon}>{pack.icon}</Text>
        <Text style={styles.packDescription}>{pack.description}</Text>
        <Text style={styles.puzzleCount}>{pack.puzzles.length} puzzles available</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Replay Recommendations Section */}
        {replayRecommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.recommendationsTitle}>{APP_STRINGS.RECOMMEND_REPLAY}</Text>
            <Text style={styles.recommendationsSubtitle}>
              {APP_STRINGS.RECOMMEND_REPLAY_SUBTITLE}
            </Text>
            {replayRecommendations.slice(0, 2).map((rec, index) => (
              <Text key={index} style={styles.recommendationItem}>
                • Puzzle {pack.puzzles.findIndex(p => p.id === rec.puzzleId) + 1}: {rec.potentialImprovement}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.puzzleGrid}>
          {pack.puzzles.map((puzzle, index) => {
            const isCompleted = !!completions[puzzle.id];
            const hasImprovementPotential = isCompleted && canImprove(puzzle.id);
            
            return (
              <Pressable
                key={puzzle.id}
                style={[
                  styles.puzzleCard,
                  { width: puzzleCardWidth },
                  isCompleted && styles.puzzleCardCompleted,
                  hasImprovementPotential && styles.puzzleCardImprovement
                ]}
                onPress={() => onPuzzleSelect(puzzle)}
              >
                <View style={styles.puzzleHeader}>
                  <Text style={styles.puzzleNumber}>{index + 1}</Text>
                  <View 
                    style={[
                      styles.difficultyIndicator,
                      { backgroundColor: getDifficultyColor(puzzle.difficulty) }
                    ]}
                  />
                </View>

                <Text style={styles.puzzleTitle}>
                  {puzzle.gridSize}×{puzzle.gridSize} Grid
                </Text>

                <Text style={[styles.difficulty, { color: getDifficultyColor(puzzle.difficulty) }]}>
                  {puzzle.difficulty.toUpperCase()}
                </Text>

                {isCompleted && (
                  <View style={styles.completionInfo}>
                    <Text style={styles.stars}>{getStarDisplay(puzzle.id)}</Text>
                    <Text style={styles.completionTime}>
                      {completions[puzzle.id].completionTime}s
                    </Text>
                    {hasImprovementPotential ? (
                      <Text style={styles.improvementHint}>{getImprovementHint(puzzle.id)}</Text>
                    ) : (
                      <Text style={styles.replayHint}>{APP_STRINGS.GAME.REPLAY_HINT}</Text>
                    )}
                  </View>
                )}

                {!isCompleted && (
                  <Text style={styles.playHint}>{APP_STRINGS.GAME.PLAY_HINT}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default PackPuzzlesScreen;