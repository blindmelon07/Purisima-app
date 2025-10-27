import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Image, ActivityIndicator, TextInput, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../components/cloudinary";
import { getGenerativeReplaceUrl, getGenerativeRemoveUrl } from "../components/cloudinaryGen";
import HairstyleSelector from "../components/HairstyleSelector";

export default function Home() {
  const [fromPrompt, setFromPrompt] = useState("hair");
  const [toPrompt, setToPrompt] = useState("curly hair with bangs");
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [generativeUrl, setGenerativeUrl] = useState<string | null>(null);
  const [removeUrl, setRemoveUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleHairstyleSelect = (from: string, to: string) => {
    setFromPrompt(from);
    setToPrompt(to);
  };

  const handleGenerativeRemove = () => {
    if (publicId) {
      const url = getGenerativeRemoveUrl(publicId, fromPrompt);
      setRemoveUrl(url);
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
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#18191a' }} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Welcome {auth.currentUser?.email}</Text>
      
      <Text style={{ color: '#888', fontSize: 14, marginBottom: 10, textAlign: 'center' }}>
        Choose a hairstyle below, then upload your photo
      </Text>

      <HairstyleSelector 
        onSelect={handleHairstyleSelect} 
        selectedStyle={toPrompt} 
      />

      <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16, color: '#fff' }}>
          Or manually type what you want to replace:
        </Text>
        <TextInput
          value={fromPrompt}
          onChangeText={setFromPrompt}
          placeholder="e.g. hairstyle, hat, shirt"
          placeholderTextColor="#aaa"
          style={{ borderWidth: 1, borderColor: '#888', borderRadius: 8, padding: 10, marginBottom: 12, width: 260, backgroundColor: '#222', color: '#fff', fontSize: 16 }}
        />
        <Text style={{ marginBottom: 8, color: '#fff' }}>To (desired replacement):</Text>
        <TextInput
          value={toPrompt}
          onChangeText={setToPrompt}
          placeholder="e.g. curly hair with bangs"
          placeholderTextColor="#aaa"
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 12, width: 220, backgroundColor: '#222', color: '#fff', fontSize: 16 }}
        />
      </View>

      <View style={{ marginVertical: 20, width: '100%', alignItems: 'center' }}>
        <Button title="Pick and Upload Photo" onPress={pickImage} />
      </View>
      
      {publicId && (
        <View style={{ marginVertical: 10, width: '100%', alignItems: 'center' }}>
          <Button title={`Apply Generative Remove (remove '${fromPrompt}')`} onPress={handleGenerativeRemove} color="#8e44ad" />
        </View>
      )}
      
      {removeUrl && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ color: '#fff' }}>Generative Remove Image:</Text>
          <Image
            source={{ uri: removeUrl }}
            style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
          />
        </View>
      )}

      {uploading && <ActivityIndicator size="large" color="#00bfff" style={{ margin: 20 }} />}

      {image && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ color: '#fff', marginBottom: 10 }}>Original Cloudinary Image:</Text>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
          />
        </View>
      )}
      {generativeUrl && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ color: '#fff', marginBottom: 10 }}>Generative Replace Image:</Text>
          <Image
            source={{ uri: generativeUrl }}
            style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
          />
        </View>
      )}

      <View style={{ marginTop: 30, marginBottom: 20, width: '100%', alignItems: 'center' }}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: '#18191a',
    paddingBottom: 40  // Add extra padding at bottom
  },
  title: { fontSize: 20, marginBottom: 20, color: '#fff' },
});

