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
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + (error.message || error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>HairStyle App</Text>
          <Text style={styles.subtitle}>Transform your hairstyle with Us</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Transformation Settings</Text>
        
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
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Choose Hairstyle:</Text>
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
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <Pressable style={styles.uploadButton} onPress={pickImage} disabled={uploading}>
          <Text style={styles.uploadButtonText}>
            {uploading ? "Processing..." : "📸 Pick & Transform Photo"}
          </Text>
        </Pressable>
        
        {uploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Applying AI magic...</Text>
          </View>
        )}
      </View>

      {/* Results Section */}
      {(image || generativeUrl || removeUrl) && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Results</Text>
          
          <View style={styles.imageGrid}>
            {/* Original Image */}
            {image && (
              <View style={styles.imageCard}>
                <Text style={styles.imageTitle}>Original</Text>
                <Image source={{ uri: image }} style={styles.resultImage} />
              </View>
            )}
            
            {/* Generative Replace Image */}
            {generativeUrl && (
              <View style={styles.imageCard}>
                <Text style={styles.imageTitle}>AI Transform</Text>
                <Image source={{ uri: generativeUrl }} style={styles.resultImage} />
                <Pressable 
                  style={styles.downloadButton}
                  onPress={() => downloadImage(generativeUrl, 'AI Transform')}
                >
                  <Text style={styles.downloadButtonText}>💾 Download</Text>
                </Pressable>
              </View>
            )}
            
            {/* Generative Remove Image */}
            {removeUrl && (
              <View style={styles.imageCard}>
                <Text style={styles.imageTitle}>AI Remove</Text>
                <Image source={{ uri: removeUrl }} style={styles.resultImage} />
                <Pressable 
                  style={styles.downloadButton}
                  onPress={() => downloadImage(removeUrl, 'AI Remove')}
                >
                  <Text style={styles.downloadButtonText}>💾 Download</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark slate background
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  headerContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    opacity: 0.9,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
  },
  inputSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#f1f5f9',
    minHeight: 50,
  },
  uploadSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 12,
  },
  resultsSection: {
    marginHorizontal: 20,
  },
  imageGrid: {
    gap: 16,
  },
  imageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  resultImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  hairstyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  hairstyleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 85,
    minHeight: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
  },
  hairstyleImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 6,
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
    fontWeight: '600',
  },
});

