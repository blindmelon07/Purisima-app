import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { uploadToCloudinary } from "../components/cloudinary";
import { getGenerativeRemoveUrl, getGenerativeReplaceUrl } from "../components/cloudinaryGen";
import { auth } from "../firebaseConfig";

export default function Home() {
  const [fromPrompt, setFromPrompt] = useState("hair");
  const [toPrompt, setToPrompt] = useState("curly hair with bangs");
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [generativeUrl, setGenerativeUrl] = useState<string | null>(null);
  const [removeUrl, setRemoveUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [totalTransformations, setTotalTransformations] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Predefined hairstyle options
  const hairstyleOptions = [
    { label: "Long Hair", value: "long hair", image: require("../assets/hairstyles/long hair.png") },
    { label: "Short Hair", value: "short hair", image: require("../assets/hairstyles/short hair.png") },
    { label: "Curly Hair", value: "curly hair with bangs", image: require("../assets/hairstyles/curly hair.png") },
    { label: "Straight Hair", value: "straight long hair", image: require("../assets/hairstyles/straighthair.png") },
    { label: "Bob Cut", value: "bob haircut", image: require("../assets/hairstyles/bob cat.png") },
    { label: "Pixie Cut", value: "pixie cut short hair", image: require("../assets/hairstyles/pixie cut.png") },
    { label: "Afro Hair", value: "afro hairstyle", image: require("../assets/hairstyles/alfro.png") },
    { label: "Braided Hair", value: "braided hairstyle", image: require("../assets/hairstyles/braided.png") },
    { label: "Wavy Hair", value: "wavy hair", image: require("../assets/hairstyles/wavyhair.png") },
    { label: "Ponytail", value: "high ponytail", image: require("../assets/hairstyles/ponytail.png") },
    { label: "Bangs", value: "hair with bangs", image: require("../assets/hairstyles/bangs.png") },
    { label: "Bald", value: "bald head", image: require("../assets/hairstyles/bald.png") },
  ];

  const handleGenerativeRemove = () => {
    if (publicId) {
      const url = getGenerativeRemoveUrl(publicId, fromPrompt);
      setRemoveUrl(url);
    }
  };

  const downloadImage = async (imageUri: string, imageName: string) => {
    try {
      // Open the image URL in the browser for download
      const supported = await Linking.canOpenURL(imageUri);
      if (supported) {
        await Linking.openURL(imageUri);
        Alert.alert('Download', `Opening ${imageName} in browser for download.`);
      } else {
        Alert.alert('Error', 'Cannot open image URL.');
      }
    } catch (error) {
      console.error('Error opening image:', error);
      Alert.alert('Error', 'Failed to open image for download.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      setGenerativeUrl(null);
      setRemoveUrl(null);
      // Upload to Cloudinary
      const uploadRes = await uploadToCloudinary(uri);
      setImage(uploadRes.secure_url);
      // Save publicId for later use
      const publicId = uploadRes.public_id;
      setPublicId(publicId);
      // Apply generative replace effect with user prompts
      const genUrl = getGenerativeReplaceUrl(publicId, fromPrompt, toPrompt);
      setGenerativeUrl(genUrl);
      // Increment transformation count
      setTotalTransformations(prev => prev + 1);
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + (error.message || error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with Gradient */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>💇 PuriStyle</Text>
            <Text style={styles.subtitle}>AI-Powered Hair Transformation</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </Pressable>
        </View>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.dashboardSection}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>👋 Welcome back!</Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        </View>

        {/* Stats Cards Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statNumber}>{totalTransformations}</Text>
            <Text style={styles.statLabel}>Transformations</Text>
            <Text style={styles.statIcon}>✨</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={styles.statNumber}>{hairstyleOptions.length}</Text>
            <Text style={styles.statLabel}>Hairstyles</Text>
            <Text style={styles.statIcon}>💈</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statNumber}>AI</Text>
            <Text style={styles.statLabel}>Powered</Text>
            <Text style={styles.statIcon}>🤖</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <Pressable 
            style={styles.quickActionCard} 
            onPress={pickImage}
            disabled={uploading}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📸</Text>
            </View>
            <Text style={styles.quickActionText}>Upload Photo</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickActionCard}
            onPress={() => setShowSettings(!showSettings)}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>⚙️</Text>
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickActionCard}
            onPress={handleGenerativeRemove}
            disabled={!publicId}
          >
            <View style={[styles.quickActionIcon, !publicId && styles.disabledAction]}>
              <Text style={styles.quickActionEmoji}>🗑️</Text>
            </View>
            <Text style={styles.quickActionText}>Remove Hair</Text>
          </Pressable>
        </View>
      </View>

      {/* Transformation Settings - Collapsible */}
      {showSettings && (
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>🎨 Transformation Settings</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>What to replace:</Text>
            <TextInput
              value={fromPrompt}
              onChangeText={setFromPrompt}
              placeholder="e.g. hairstyle, hat, shirt"
              placeholderTextColor="#94a3b8"
              style={styles.textInput}
            />
          </View>
        </View>
      )}

      {/* Hairstyle Selection */}
      <View style={styles.hairstyleSection}>
        <Text style={styles.sectionTitle}>💇‍♀️ Choose Your Style</Text>
        <View style={styles.hairstyleGrid}>
          {hairstyleOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.hairstyleCard,
                toPrompt === option.value && styles.selectedCard
              ]}
              onPress={() => setToPrompt(option.value)}
            >
              <Image source={option.image} style={styles.hairstyleImage} />
              <Text style={[
                styles.cardLabel,
                toPrompt === option.value && styles.selectedCardLabel
              ]}>{option.label}</Text>
              {toPrompt === option.value && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Upload Section */}
      {uploading && (
        <View style={styles.uploadingCard}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>✨ Applying AI magic...</Text>
          <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
        </View>
      )}

      {/* Results Section */}
      {(image || generativeUrl || removeUrl) && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>🎉 Your Results</Text>
          
          <View style={styles.imageGrid}>
            {/* Original Image */}
            {image && (
              <View style={styles.imageCard}>
                <View style={styles.imageHeader}>
                  <Text style={styles.imageTitle}>Original</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Before</Text>
                  </View>
                </View>
                <Image source={{ uri: image }} style={styles.resultImage} />
              </View>
            )}
            
            {/* Generative Replace Image */}
            {generativeUrl && (
              <View style={[styles.imageCard, styles.featuredCard]}>
                <View style={styles.imageHeader}>
                  <Text style={styles.imageTitle}>AI Transform</Text>
                  <View style={[styles.badge, styles.badgeSuccess]}>
                    <Text style={styles.badgeText}>After ✨</Text>
                  </View>
                </View>
                <Image source={{ uri: generativeUrl }} style={styles.resultImage} />
                <Pressable 
                  style={styles.downloadButton}
                  onPress={() => downloadImage(generativeUrl, 'AI Transform')}
                >
                  <Text style={styles.downloadButtonText}>💾 Download Result</Text>
                </Pressable>
              </View>
            )}
            
            {/* Generative Remove Image */}
            {removeUrl && (
              <View style={styles.imageCard}>
                <View style={styles.imageHeader}>
                  <Text style={styles.imageTitle}>AI Remove</Text>
                  <View style={[styles.badge, styles.badgeWarning]}>
                    <Text style={styles.badgeText}>Removed</Text>
                  </View>
                </View>
                <Image source={{ uri: removeUrl }} style={styles.resultImage} />
                <Pressable 
                  style={[styles.downloadButton, styles.downloadButtonAlt]}
                  onPress={() => downloadImage(removeUrl, 'AI Remove')}
                >
                  <Text style={styles.downloadButtonText}>💾 Download</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Empty State */}
      {!image && !uploading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📷</Text>
          <Text style={styles.emptyStateTitle}>Ready to Transform?</Text>
          <Text style={styles.emptyStateText}>
            Upload a photo and select a hairstyle to see the magic happen!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerGradient: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    opacity: 0.9,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '600',
  },
  dashboardSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  welcomeCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statCardPurple: {
    borderTopWidth: 3,
    borderTopColor: '#a855f7',
  },
  statCardBlue: {
    borderTopWidth: 3,
    borderTopColor: '#3b82f6',
  },
  statCardGreen: {
    borderTopWidth: 3,
    borderTopColor: '#10b981',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  statIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 20,
    opacity: 0.3,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  disabledAction: {
    opacity: 0.4,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  hairstyleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#f1f5f9',
    minHeight: 50,
  },
  hairstyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hairstyleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 85,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    transform: [{ scale: 1.05 }],
  },
  hairstyleImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedCardLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadingCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
  },
  loadingText: {
    color: '#f1f5f9',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  imageGrid: {
    gap: 20,
  },
  imageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#10b981',
  },
  badgeWarning: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  resultImage: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadButtonAlt: {
    backgroundColor: '#10b981',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 40,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

