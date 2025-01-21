import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const StaffScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    fetchComplaints();
  }, []);

  // Fetch rooms from Firestore
  const fetchRooms = async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, "rooms"));
      const roomsData = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      Alert.alert("Error", "Failed to fetch rooms.");
    }
  };

  // Fetch complaints from Firestore
  const fetchComplaints = async () => {
    try {
      const complaintsSnapshot = await getDocs(collection(db, "complaints"));
      const complaintsData = complaintsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Alert.alert("Error", "Failed to fetch complaints.");
    }
  };

  // Handle status update for a room
  const updateRoomStatus = async (roomId, newStatus) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, { status: newStatus });
      Alert.alert("Success", "Room status updated.");
      fetchRooms(); // Refresh the room list
    } catch (error) {
      console.error("Error updating room status:", error);
      Alert.alert("Error", "Failed to update room status.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.roomStatus}>Status: {item.status}</Text>
      <Picker
        selectedValue={item.status}
        style={styles.statusPicker}
        onValueChange={(value) => updateRoomStatus(item.id, value)}
      >
        <Picker.Item label="available" value="available" />
        <Picker.Item label="Reserved" value="Reserved" />
        <Picker.Item label="Cleaning" value="Cleaning" />
        <Picker.Item label="Do Not Disturb" value="Do Not Disturb" />
      </Picker>
    </View>
  );

  const renderComplaint = ({ item }) => (
    <View style={styles.complaintCard}>
      <Text style={styles.complaintText}>
        <Text style={styles.bold}>User:</Text> {item.user}
      </Text>
      <Text style={styles.complaintText}>
        <Text style={styles.bold}>Complaint:</Text> {item.complaint}
      </Text>
      <Text style={styles.complaintText}>
        <Text style={styles.bold}>Submitted On:</Text> {item.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Dashboard</Text>

      {/* Room Status Section */}
      <Text style={styles.sectionHeader}>Rooms</Text>
      {loading ? (
        <Text>Loading rooms...</Text>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Complaints Section */}
      <Text style={styles.sectionHeader}>Complaints</Text>
      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item.id}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5F0",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  roomCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  roomStatus: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  statusPicker: {
    height: 40,
    marginBottom: 8,
  },
  complaintCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  complaintText: {
    fontSize: 14,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StaffScreen;
