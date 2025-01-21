import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const AdminDashboard = ({ navigation }: any) => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time updates from Firestore
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      },
      (error) => {
        console.error("Error fetching users:", error);
        Alert.alert("Error", "Failed to fetch users.");
      }
    );

    const unsubscribeRooms = onSnapshot(
      collection(db, "rooms"),
      (snapshot) => {
        const roomList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);
      },
      (error) => {
        console.error("Error fetching rooms:", error);
        Alert.alert("Error", "Failed to fetch rooms.");
      }
    );

    const unsubscribeBookings = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        Alert.alert("Error", "Failed to fetch bookings.");
      }
    );

    setLoading(false);

    return () => {
      unsubscribeUsers();
      unsubscribeRooms();
      unsubscribeBookings();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have successfully logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const calculatePaymentStatus = () => {
    const completedPayments = bookings.filter(
      (booking) => booking.paymentStatus === "Completed"
    ).length;
    const pendingPayments = bookings.length - completedPayments;

    return { completedPayments, pendingPayments };
  };

  const { completedPayments, pendingPayments } = calculatePaymentStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          {/* Total Rooms Section */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Total Rooms</Text>
            <Text style={styles.infoValue}>{rooms.length}</Text>
          </View>

          {/* Payment Status Section */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Payment Status</Text>
            <Text style={styles.infoValue}>
              Completed: {completedPayments} | Pending: {pendingPayments}
            </Text>
          </View>

          {/* Users List Section */}
          <Text style={styles.subHeader}>Registered Users</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userText}>
                  {item.name || "N/A"} ({item.email})
                </Text>
                <Text style={styles.userRole}>Role: {item.role || "N/A"}</Text>
              </View>
            )}
            style={styles.userList}
          />

          {/* Buttons */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateStaff")}
          >
            <Text style={styles.buttonText}>Create Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      )}
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2691E",
    marginVertical: 8,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
  },
  infoBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D2691E",
  },
  userList: {
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userRole: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminDashboard;
