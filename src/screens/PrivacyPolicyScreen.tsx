import React from 'react';
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

interface SectionProps {
  title: string;
  content: string;
  colors: any;
}

const PolicySection: React.FC<SectionProps> = ({ title, content, colors }) => {
  const styles = createSectionStyles(colors);
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
};

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const styles = createStyles(colors);

  const lastUpdated = 'December 1, 2024';

  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, play our games, or contact us for support. This may include your name, email address, and game progress data. We also automatically collect certain information about your device and how you use our app.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, including to process transactions, send you technical notices and support messages, and communicate with you about products and services. We may also use your information to personalize your gaming experience.',
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information in certain limited circumstances, such as with service providers who help us operate our app, or when required by law.',
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
    },
    {
      title: '5. Data Retention',
      content: 'We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. Game progress and account information are retained until you delete your account.',
    },
    {
      title: '6. Children\'s Privacy',
      content: 'Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.',
    },
    {
      title: '7. Analytics and Advertising',
      content: 'We may use third-party analytics services to help us understand how our app is used. These services may collect information about your use of our app and other apps. We do not display third-party advertisements in our app.',
    },
    {
      title: '8. Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. If you wish to exercise these rights, please contact us through the support channels in the app.',
    },
    {
      title: '9. Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date. You are advised to review this policy periodically.',
    },
    {
      title: '10. Contact Us',
      content: 'If you have any questions about this privacy policy, please contact us at support@dotlinegame.com or through the contact form in the app.',
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Last updated: {lastUpdated}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Your privacy is important to us. This privacy policy explains how Dot Line Game 
            collects, uses, and protects your information when you use our mobile application.
          </Text>
        </View>

        {sections.map((section, index) => (
          <PolicySection
            key={index}
            title={section.title}
            content={section.content}
            colors={colors}
          />
        ))}

        <View style={styles.footerSection}>
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Questions or Concerns?</Text>
            <Text style={styles.footerText}>
              If you have any questions about this privacy policy or our data practices, 
              please don't hesitate to contact our support team. We're here to help.
            </Text>
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
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
  },
  introSection: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  introText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.primary || '#161618',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.md,
    textAlign: 'center',
  },
  footerSection: {
    marginTop: SPACING.xl,
  },
  footerCard: {
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    textAlign: 'center',
  },
});

const createSectionStyles = (colors: any) => StyleSheet.create({
  sectionContainer: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    marginBottom: SPACING.lg,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.primary?.purple || '#6366f1',
    marginBottom: SPACING.md,
  },
  sectionContent: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.primary || '#161618',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
  },
});

export default PrivacyPolicyScreen;