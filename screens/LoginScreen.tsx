import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Enable web browser for authentication flow
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation, route }: any) => {
  const { redirectTo, selectedRooms } = route.params || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Google Auth Session
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with your Google Client ID
    // expoClientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Optional for Expo Go
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      Alert.alert("Success", "Logged in with Google!");

      // Redirect after successful login
      if (redirectTo) {
        navigation.navigate(redirectTo, { selectedRooms });
      } else {
        navigation.navigate("Home");
      }
    }
  }, [response]);

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    // Validate inputs
    if (!email || !password) {
      if (!email) setEmailError("Email is required.");
      if (!password) setPasswordError("Password is required.");
      return;
    }

    console.log("Email entered:", email); // Debugging
    console.log("Password entered:", password); // Debugging

    if (email === "admin@gmail.com" && password === "admin123") {
      Alert.alert("Success", "Welcome, Admin!");
      setTimeout(() => {
        navigation.navigate("AdminDashboard");
      }, 500); // Delay navigation slightly after the alert
      return;
    }

    // Handle normal user login
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user.email); // Debugging

      Alert.alert("Success", "You have successfully logged in!");

      // Redirect after successful login
      if (redirectTo) {
        console.log("Redirecting to:", redirectTo); // Debugging
        navigation.navigate(redirectTo, { selectedRooms });
      } else {
        console.log("Redirecting to Home"); // Debugging
        navigation.navigate("Home");
      }
    } catch (error: any) {
      console.error("Error during login:", error); // Detailed error logging

      // Check error codes for specific messages
      if (error.code === "auth/wrong-password") {
        setPasswordError("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setEmailError("No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Invalid email format.");
      } else {
        Alert.alert("Login Failed", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError(""); // Clear error on typing
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError(""); // Clear error on typing
        }}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        style={[styles.loginButton, styles.googleButton]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <View style={styles.googleButtonContent}>
          <Image
            source={require("../assets/images/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5F0",
    padding: 16,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: "#FF0000", // Red border for error
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    marginTop: 16,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

export default LoginScreen;
