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

const TermsSection: React.FC<SectionProps> = ({ title, content, colors }) => {
  const styles = createSectionStyles(colors);
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
};

interface TermsOfServiceScreenProps {
  onBack?: () => void;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const styles = createStyles(colors);

  const lastUpdated = 'December 1, 2024';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By downloading, installing, or using Dot Line Game, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our app.',
    },
    {
      title: '2. Description of Service',
      content: 'Dot Line Game is a puzzle mobile application that provides entertainment through various puzzle challenges. We reserve the right to modify, suspend, or discontinue the service at any time.',
    },
    {
      title: '3. User Accounts',
      content: 'You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
    },
    {
      title: '4. Acceptable Use',
      content: 'You agree to use the service only for lawful purposes and in accordance with these terms. You may not use the service to transmit harmful, offensive, or illegal content, or to interfere with other users\' enjoyment of the service.',
    },
    {
      title: '5. Intellectual Property',
      content: 'The service and its original content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.',
    },
    {
      title: '6. In-App Purchases',
      content: 'Our app may offer in-app purchases for additional content or features. All purchases are final and non-refundable unless required by applicable law. Prices are subject to change without notice.',
    },
    {
      title: '7. Privacy',
      content: 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.',
    },
    {
      title: '8. Disclaimers',
      content: 'The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Your use of the service is at your own risk.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.',
    },
    {
      title: '10. Termination',
      content: 'We may terminate or suspend your account and access to the service at any time, with or without cause or notice, for conduct that we believe violates these terms or is otherwise harmful to the service or other users.',
    },
    {
      title: '11. Governing Law',
      content: 'These terms shall be governed by and construed in accordance with the laws of the jurisdiction where our company is located, without regard to conflict of law principles.',
    },
    {
      title: '12. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after changes constitutes acceptance of the new terms.',
    },
    {
      title: '13. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us at support@dotlinegame.com or through the contact form in the app.',
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Last updated: {lastUpdated}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Welcome to Dot Line Game. These terms and conditions outline the rules and 
            regulations for the use of our mobile application and services.
          </Text>
        </View>

        {sections.map((section, index) => (
          <TermsSection
            key={index}
            title={section.title}
            content={section.content}
            colors={colors}
          />
        ))}

        <View style={styles.footerSection}>
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Agreement</Text>
            <Text style={styles.footerText}>
              By continuing to use Dot Line Game, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service.
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
    backgroundColor: colors?.primary?.purple || '#6366f1',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.inverse || '#FFFFF0',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.inverse || '#FFFFF0',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    textAlign: 'center',
    opacity: 0.9,
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

export default TermsOfServiceScreen;