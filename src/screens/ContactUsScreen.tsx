import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useAppSettings } from '../contexts/AppProviders';
import { TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../core/theme/themeSystem';

interface ContactMethodProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: any;
}

const ContactMethod: React.FC<ContactMethodProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  colors,
}) => {
  const styles = createMethodStyles(colors);
  
  return (
    <Pressable style={styles.methodCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.methodTitle}>{title}</Text>
        <Text style={styles.methodSubtitle}>{subtitle}</Text>
      </View>
      
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
};

interface ContactUsScreenProps {
  onBack?: () => void;
}

const ContactUsScreen: React.FC<ContactUsScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const styles = createStyles(colors);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    Alert.alert(
      'Message Sent!',
      'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => {
        setFormData({ name: '', email: '', subject: '', message: '' });
      }}]
    );
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      subtitle: 'support@dotlinegame.com',
      onPress: () => Alert.alert('Email', 'Opening email app...'),
    },
    {
      icon: '💬',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      onPress: () => Alert.alert('Chat', 'Live chat coming soon!'),
    },
    {
      icon: '📱',
      title: 'Social Media',
      subtitle: 'Follow us for updates',
      onPress: () => Alert.alert('Social', 'Opening social media...'),
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
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          We'd love to hear from you
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your preferred way to contact us
          </Text>
          
          {contactMethods.map((method, index) => (
            <ContactMethod
              key={index}
              icon={method.icon}
              title={method.title}
              subtitle={method.subtitle}
              onPress={method.onPress}
              colors={colors}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <Text style={styles.sectionSubtitle}>
            Fill out the form below and we'll respond quickly
          </Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Your full name"
                placeholderTextColor={colors?.text?.muted || '#64748b'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="your.email@example.com"
                placeholderTextColor={colors?.text?.muted || '#64748b'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholder="What is this about?"
                placeholderTextColor={colors?.text?.muted || '#64748b'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                placeholder="Tell us how we can help..."
                placeholderTextColor={colors?.text?.muted || '#64748b'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Response Time</Text>
            <Text style={styles.infoDescription}>
              We typically respond to all inquiries within 24 hours during business days.
              For urgent issues, please use our live chat feature.
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
  formContainer: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors?.border?.primary || '#E5E7EB',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.primary || '#161618',
    backgroundColor: colors?.background?.card || '#ffffff',
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.lg,
  },
  submitButton: {
    backgroundColor: colors?.primary?.purple || '#6366f1',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.inverse || '#FFFFF0',
  },
  infoCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.md,
  },
  infoDescription: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.md,
  },
});

const createMethodStyles = (colors: any) => StyleSheet.create({
  methodCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xs,
  },
  methodSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
  },
  arrow: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    color: colors?.primary?.purple || '#6366f1',
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
});

export default ContactUsScreen;