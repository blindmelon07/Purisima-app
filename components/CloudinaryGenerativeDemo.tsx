import React, { useState } from "react";
import { View, Button, Image, ActivityIndicator, Text, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "./cloudinary";
import { getGenerativeReplaceUrl } from "./cloudinaryGen";

export default function CloudinaryGenerativeDemo() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [generativeUrl, setGenerativeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromPrompt, setFromPrompt] = useState("hair");
  const [toPrompt, setToPrompt] = useState("curly hair with bangs");

  const pickImageAndUpload = async () => {
    setError(null);
    setGenerativeUrl(null);
    setCloudinaryUrl(null);
    setImageUri(null);
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        // Upload to Cloudinary
        const uploadRes = await uploadToCloudinary(uri);
        setCloudinaryUrl(uploadRes.secure_url);
        // Apply generative replace effect with user prompts
        const publicId = uploadRes.public_id;
        const genUrl = getGenerativeReplaceUrl(publicId, fromPrompt, toPrompt);
        setGenerativeUrl(genUrl);
      }
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f4f6fb" }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 18, padding: 24, width: 340, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginBottom: 24 }}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 18, color: '#2d3436', textAlign: 'center' }}>
          AI Hairstyle Changer
        </Text>
        <Text style={{ marginBottom: 8, fontWeight: '600', fontSize: 15, color: '#636e72' }}>
          What object or region in the image do you want to replace?
        </Text>
        <TextInput
          value={fromPrompt}
          onChangeText={setFromPrompt}
          placeholder="e.g. hairstyle, hat, shirt"
          style={{ borderWidth: 1, borderColor: '#b2bec3', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%', backgroundColor: '#f9fafb', fontSize: 16 }}
        />
        <Text style={{ marginBottom: 8, fontWeight: '600', fontSize: 15, color: '#636e72' }}>To (desired hairstyle):</Text>
        <TextInput
          value={toPrompt}
          onChangeText={setToPrompt}
          placeholder="e.g. curly hair with bangs"
          style={{ borderWidth: 1, borderColor: '#b2bec3', borderRadius: 8, padding: 12, marginBottom: 18, width: '100%', backgroundColor: '#f9fafb', fontSize: 16 }}
        />
        <Button title="Pick and Upload Photo" color="#0984e3" onPress={pickImageAndUpload} />
        {loading && <ActivityIndicator size="large" color="#0984e3" style={{ margin: 20 }} />}
        {error && <Text style={{ color: "#d63031", margin: 10, textAlign: 'center' }}>{error}</Text>}
      </View>
      {imageUri && (
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontWeight: '600', color: '#636e72', marginBottom: 6 }}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={{ width: 180, height: 180, margin: 6, borderRadius: 16, borderWidth: 2, borderColor: '#dfe6e9' }} />
        </View>
      )}
      {cloudinaryUrl && (
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontWeight: '600', color: '#636e72', marginBottom: 6 }}>Original Cloudinary Image:</Text>
          <Image source={{ uri: cloudinaryUrl }} style={{ width: 180, height: 180, margin: 6, borderRadius: 16, borderWidth: 2, borderColor: '#b2bec3' }} />
        </View>
      )}
      {generativeUrl && (
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontWeight: '600', color: '#636e72', marginBottom: 6 }}>AI Generated Image:</Text>
          <Image source={{ uri: generativeUrl }} style={{ width: 180, height: 180, margin: 6, borderRadius: 16, borderWidth: 2, borderColor: '#00b894' }} />
        </View>
      )}
    </View>
  );
}
