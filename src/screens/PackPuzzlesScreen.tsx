import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors, designTokens } from '../theme/colors';
import { PuzzlePack, Puzzle } from '../types';
import { getPuzzleCompletions } from '../utils/firebase';
import { getReplayRecommendations } from '../utils/packProgression';

interface PackPuzzlesScreenProps {
  pack: PuzzlePack;
  onPuzzleSelect: (puzzle: Puzzle) => void;
  onBack: () => void;
}

const PackPuzzlesScreen: React.FC<PackPuzzlesScreenProps> = ({ pack, onPuzzleSelect, onBack }) => {
  const [completions, setCompletions] = useState<{ [key: string]: any }>({});
  const [_loading, setLoading] = useState(true);
  const [replayRecommendations, setReplayRecommendations] = useState<any[]>([]);

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
      case 'easy': return colors.feedback.success;
      case 'medium': return colors.feedback.warning;
      case 'hard': return colors.feedback.error;
      case 'expert': return colors.interactive.accent;
      default: return colors.text.secondary;
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
    return 'Perfect score!';
  };

  const screenWidth = Dimensions.get('window').width;
  const puzzleCardWidth = (screenWidth - designTokens.spacing.lg * 3) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
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
            <Text style={styles.recommendationsTitle}>💡 Recommended Replays</Text>
            <Text style={styles.recommendationsSubtitle}>
              Improve your scores on these puzzles:
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
                      <Text style={styles.replayHint}>Tap to replay</Text>
                    )}
                  </View>
                )}

                {!isCompleted && (
                  <Text style={styles.playHint}>Tap to play</Text>
                )}
              </Pressable>
            );
          })}
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
  packInfo: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  packIcon: {
    fontSize: 48,
    marginBottom: designTokens.spacing.sm,
  },
  packDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  puzzleCount: {
    fontSize: 14,
    color: colors.text.muted,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.lg,
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  puzzleCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    ...designTokens.elevation.low,
  },
  puzzleCardCompleted: {
    borderWidth: 2,
    borderColor: colors.feedback.success,
  },
  puzzleCardImprovement: {
    borderWidth: 2,
    borderColor: colors.feedback.warning,
    backgroundColor: colors.background.surface,
  },
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  puzzleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: designTokens.spacing.sm,
  },
  completionInfo: {
    alignItems: 'center',
  },
  stars: {
    fontSize: 16,
    marginBottom: 4,
  },
  completionTime: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  playHint: {
    fontSize: 12,
    color: colors.interactive.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  replayHint: {
    fontSize: 11,
    color: colors.interactive.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  improvementHint: {
    fontSize: 10,
    color: colors.feedback.warning,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  recommendationsSection: {
    backgroundColor: colors.background.surface,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.feedback.warning,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: designTokens.spacing.xs,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: designTokens.spacing.sm,
  },
  recommendationItem: {
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: 4,
    paddingLeft: designTokens.spacing.sm,
  },
});

export default PackPuzzlesScreen;