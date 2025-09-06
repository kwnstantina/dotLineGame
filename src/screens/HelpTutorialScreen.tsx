import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAppSettings } from '../contexts/AppProviders';
import { TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../core/theme/themeSystem';

interface TutorialStepProps {
  step: number;
  title: string;
  description: string;
  isActive: boolean;
  colors: any;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
  step,
  title,
  description,
  isActive,
  colors,
}) => {
  const styles = createStepStyles(colors);
  
  return (
    <View style={[styles.stepCard, isActive && styles.activeCard]}>
      <View style={[styles.stepNumber, isActive && styles.activeStepNumber]}>
        <Text style={[styles.stepText, isActive && styles.activeStepText]}>
          {step}
        </Text>
      </View>
      
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, isActive && styles.activeTitle]}>
          {title}
        </Text>
        <Text style={[styles.stepDescription, isActive && styles.activeDescription]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onPress: () => void;
  colors: any;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isExpanded,
  onPress,
  colors,
}) => {
  const styles = createFAQStyles(colors);
  
  return (
    <Pressable style={styles.faqCard} onPress={onPress}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
      </View>
      
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </Pressable>
  );
};

interface HelpTutorialScreenProps {
  onBack?: () => void;
}

const HelpTutorialScreen: React.FC<HelpTutorialScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const styles = createStyles(colors);
  
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const tutorialSteps = [
    {
      title: 'Understanding the Grid',
      description: 'Each puzzle starts with a grid containing numbered dots. Your goal is to connect these dots in sequence.',
    },
    {
      title: 'Drawing Connections',
      description: 'Tap and drag from one dot to another to create connections. Follow the numerical order.',
    },
    {
      title: 'Avoiding Obstacles',
      description: 'Some puzzles have obstacles or special rules. Read the hint before starting each puzzle.',
    },
    {
      title: 'Completing the Puzzle',
      description: 'Successfully connect all dots in the correct sequence to complete the puzzle and earn points.',
    },
  ];

  const faqItems = [
    {
      question: 'How do I unlock new puzzle packs?',
      answer: 'Complete puzzles to earn stars and coins. Use these to unlock new puzzle packs in the store.',
    },
    {
      question: 'What do the different colors mean?',
      answer: 'Blue dots are start points, red dots are endpoints, and yellow dots are checkpoints you must pass through.',
    },
    {
      question: 'Can I undo my moves?',
      answer: 'Yes! Tap the undo button or use the reset button to start the puzzle over.',
    },
    {
      question: 'How does the scoring system work?',
      answer: 'You earn more points for completing puzzles quickly and with fewer attempts. Bonus points are awarded for perfect solutions.',
    },
    {
      question: 'What happens if I get stuck?',
      answer: 'Use the hint button to get a clue, or reset the puzzle to try a different approach.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
          )}
          <Text style={styles.headerTitle}>Help & Tutorial</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Learn how to play and master the game
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          <Text style={styles.sectionSubtitle}>
            Follow these steps to master the basics
          </Text>
          
          <View style={styles.stepsContainer}>
            {tutorialSteps.map((step, index) => (
              <Pressable
                key={index}
                onPress={() => setActiveStep(index + 1)}
              >
                <TutorialStep
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  isActive={activeStep === index + 1}
                  colors={colors}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <Text style={styles.sectionSubtitle}>
            Find answers to common questions
          </Text>
          
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedFAQ === index}
              onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              colors={colors}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Still Need Help?</Text>
            <Text style={styles.supportDescription}>
              If you can't find the answer you're looking for, feel free to contact our support team.
            </Text>
            <Pressable style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background?.primary || '#F8F8FF',
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border?.primary || '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    color: colors?.text?.primary || '#161618',
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.primary || '#161618',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xxxxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    marginBottom: SPACING.xl,
  },
  stepsContainer: {
    gap: SPACING.md,
  },
  supportCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  supportTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.md,
    marginBottom: SPACING.xl,
  },
  supportButton: {
    backgroundColor: colors?.primary?.purple || '#6366f1',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  supportButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.inverse || '#FFFFF0',
  },
});

const createStepStyles = (colors: any) => StyleSheet.create({
  stepCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: colors?.primary?.purple || '#6366f1',
    shadowRadius: 12,
    elevation: 6,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors?.border?.subtle || '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  activeStepNumber: {
    backgroundColor: colors?.primary?.purple || '#6366f1',
  },
  stepText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.muted || '#64748b',
  },
  activeStepText: {
    color: colors?.text?.inverse || '#FFFFF0',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xs,
  },
  activeTitle: {
    color: colors?.primary?.purple || '#6366f1',
  },
  stepDescription: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
  },
  activeDescription: {
    color: colors?.text?.primary || '#161618',
  },
});

const createFAQStyles = (colors: any) => StyleSheet.create({
  faqCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  questionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginRight: SPACING.md,
  },
  expandIcon: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.primary?.purple || '#6366f1',
    width: 24,
    textAlign: 'center',
  },
  answerContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: colors?.border?.subtle || '#F9FAFB',
    marginTop: -SPACING.md,
    paddingTop: SPACING.lg,
  },
  answerText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
  },
});

export default HelpTutorialScreen;