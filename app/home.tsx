import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Image, ActivityIndicator, TextInput, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../components/cloudinary";
import { getGenerativeReplaceUrl, getGenerativeRemoveUrl } from "../components/cloudinaryGen";

export default function Home() {
  const [fromPrompt, setFromPrompt] = useState("hair");
  const [toPrompt, setToPrompt] = useState("curly hair with bangs");
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [generativeUrl, setGenerativeUrl] = useState<string | null>(null);
  const [removeUrl, setRemoveUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
    <ScrollView style={{ flex: 1, backgroundColor: '#18191a' }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome {auth.currentUser?.email}</Text>

      <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16, color: '#fff' }}>
          What object or region in the image do you want to replace?
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

      <Button title="Pick and Upload Photo" onPress={pickImage} />
      {publicId && (
        <Button title={`Apply Generative Remove (remove '${fromPrompt}')`} onPress={handleGenerativeRemove} color="#8e44ad" />
      )}
      {removeUrl && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: '#fff' }}>Generative Remove Image:</Text>
          <Image
            source={{ uri: removeUrl }}
            style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
          />
        </View>
      )}

      {uploading && <ActivityIndicator size="large" color="#00bfff" style={{ margin: 20 }} />}

      {image && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: '#fff' }}>Original Cloudinary Image:</Text>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
          />
        </View>
      )}
      {generativeUrl && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: '#fff' }}>Generative Replace Image:</Text>
          <Image
            source={{ uri: generativeUrl }}
            style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
          />
        </View>
      )}

      <Button title="Logout" onPress={logout} color="red" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: '#18191a' },
  title: { fontSize: 20, marginBottom: 20, color: '#fff' },
});

