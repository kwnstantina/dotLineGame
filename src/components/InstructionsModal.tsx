import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, DESIGN_SYSTEM} from '../core/theme/designSystem';
import { APP_STRINGS, formatDifficulty, formatInstructionsCells } from '../constants/strings';

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
    if (size <= 3) return APP_STRINGS.DIFFICULTY.BEGINNER;
    if (size <= 5) return APP_STRINGS.DIFFICULTY.INTERMEDIATE;
    if (size <= 7) return APP_STRINGS.DIFFICULTY.ADVANCED;
    return APP_STRINGS.DIFFICULTY.EXPERT;
  };

  const getDifficultyColor = (size: number) => {
    if (size <= 3) return COLORS.feedback.success;
    if (size <= 5) return COLORS.feedback.warning;
    if (size <= 7) return COLORS.feedback.error;
    return COLORS.interactive.accent;
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
            <Text style={styles.title}>{APP_STRINGS.INSTRUCTIONS.TITLE}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{APP_STRINGS.INSTRUCTIONS.CLOSE_BUTTON}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.difficultyBadge}>
              <Text style={[styles.difficultyText, {color: getDifficultyColor(gridSize)}]}>
                {formatDifficulty(getDifficultyLevel(gridSize), gridSize)}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.INSTRUCTIONS.OBJECTIVE.title}</Text>
              <Text style={styles.sectionText}>
                {APP_STRINGS.INSTRUCTIONS.OBJECTIVE.content}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.INSTRUCTIONS.HOW_TO_PLAY.title}</Text>
              <Text style={styles.sectionText}>
                {formatInstructionsCells(gridSize * gridSize).map(item => `• ${item}`).join('\n')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.INSTRUCTIONS.WINNING_RULES.title}</Text>
              <Text style={styles.sectionText}>
                {APP_STRINGS.INSTRUCTIONS.WINNING_RULES.content.map(item => `• ${item}`).join('\n')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.INSTRUCTIONS.TIPS.title}</Text>
              <Text style={styles.sectionText}>
                {APP_STRINGS.INSTRUCTIONS.TIPS.content.map(item => `• ${item}`).join('\n')}{'\n'}
                • {gridSize > 5 ? APP_STRINGS.INSTRUCTIONS.TIPS.LARGE_GRID_TIP : APP_STRINGS.INSTRUCTIONS.TIPS.SMALL_GRID_TIP}
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
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
  },
  modal: {
    backgroundColor: COLORS.background.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...DESIGN_SYSTEM.elevation.high,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingTop: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.accent,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.xl,
  },
  difficultyBadge: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    marginVertical: DESIGN_SYSTEM.spacing.lg,
  },
  difficultyText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  section: {
    marginBottom: DESIGN_SYSTEM.spacing.xl,
  },
  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Nunito-Bold',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  sectionText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: COLORS.text.secondary,
    fontFamily: 'Nunito-Regular',
    lineHeight: DESIGN_SYSTEM.typography.lineHeights.relaxed * DESIGN_SYSTEM.typography.fontSizes.md,
  },
});

export default InstructionsModal;