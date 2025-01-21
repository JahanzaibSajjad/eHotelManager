import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user state
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View>
      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.profileButtonText}>
          {user ? user.displayName || user.email.split("@")[0] : "Profile"}
        </Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setDropdownVisible(false);
              navigation.navigate("MyBookings");
            }}
          >
            <Text style={styles.dropdownText}>View My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setDropdownVisible(false);
              navigation.navigate("Settings");
            }}
          >
            <Text style={styles.dropdownText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={[styles.dropdownText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#D2691E",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 16,
  },
  profileButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 1000,
    width: 200,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
