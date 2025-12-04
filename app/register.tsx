import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/home"); // 👈 redirect after register
    } catch (error: any) {
      console.log("Register error:", error?.code, error?.message);
      alert(`${error?.code || "auth/error"}: ${error?.message || "Unknown error"}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/logo.jpg")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff", alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
    width: "100%",
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#000" },
  primaryButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    width: "100%",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
});
