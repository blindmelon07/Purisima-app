import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig"; // ✅ use your config

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("home"); // 👈 go to home screen after login
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/logo.jpg")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate("register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 30 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8, width: "100%" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
