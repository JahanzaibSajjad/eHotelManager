import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const CreateStaffScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleCreateStaff = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Store admin's credentials temporarily
    const adminEmail = auth.currentUser?.email;
    const adminPassword = "your-admin-password"; // Replace with your admin password

    try {
      // Create the staff account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Save staff data to Firestore
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        role: "staff",
      });

      // Log out the newly created staff user
      await signOut(auth);

      // Log the admin back in
      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      Alert.alert("Success", "Staff account created successfully!");
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to Admin Dashboard
      navigation.navigate("AdminDashboard");
    } catch (error) {
      console.error("Error creating staff:", error);
      Alert.alert("Error", "Failed to create staff account.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Staff</Text>

      <TextInput
        style={styles.input}
        placeholder="Staff Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Staff Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateStaff}>
        <Text style={styles.buttonText}>Create Staff</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF5F0",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 24,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateStaffScreen;
