import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface InstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  gridSize: number;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  visible,
  onClose,
  gridSize,
}) => {
  const getDifficultyLevel = (size: number) => {
    if (size <= 3) return 'Beginner';
    if (size <= 5) return 'Intermediate';
    if (size <= 7) return 'Advanced';
    return 'Expert';
  };

  const getDifficultyColor = (size: number) => {
    if (size <= 3) return colors.feedback.success;
    if (size <= 5) return colors.feedback.warning;
    if (size <= 7) return colors.feedback.error;
    return colors.interactive.accent;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>How to Play</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.difficultyBadge}>
              <Text style={[styles.difficultyText, {color: getDifficultyColor(gridSize)}]}>
                {getDifficultyLevel(gridSize)} • {gridSize}×{gridSize} Grid
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Objective</Text>
              <Text style={styles.sectionText}>
                Connect all numbered dots in order (1→2→3→4→5) while filling every cell in the grid.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎮 How to Play</Text>
              <Text style={styles.sectionText}>
                • Tap and drag to draw your path{'\n'}
                • Start from any numbered cell{'\n'}
                • Connect numbers in sequential order{'\n'}
                • Fill all {gridSize * gridSize} cells in the grid{'\n'}
                • Keep your line continuous
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✅ Winning Rules</Text>
              <Text style={styles.sectionText}>
                • Visit all numbered cells in order{'\n'}
                • Fill every cell exactly once{'\n'}
                • Maintain a continuous path{'\n'}
                • No jumping or gaps allowed
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Tips</Text>
              <Text style={styles.sectionText}>
                • Plan your route before drawing{'\n'}
                • Use the reset button to start over{'\n'}
                • Watch the progress bar to track completion{'\n'}
                • {gridSize > 5 ? 'Take your time - larger grids require strategy!' : 'Start simple and work your way up!'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
  },
  modal: {
    backgroundColor: colors.background.primary,
    borderRadius: designTokens.borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...designTokens.elevation.high,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.accent,
  },
  title: {
    fontSize: designTokens.typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.xl,
  },
  difficultyBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
    marginVertical: designTokens.spacing.lg,
  },
  difficultyText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  section: {
    marginBottom: designTokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
    marginBottom: designTokens.spacing.md,
  },
  sectionText: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Nunito-Regular',
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.md,
  },
});

export default InstructionsModal;