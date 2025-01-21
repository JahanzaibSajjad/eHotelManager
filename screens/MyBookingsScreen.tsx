import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [isComplaintModalVisible, setComplaintModalVisible] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You need to log in to view your bookings.");
        return;
      }

      // Query Firestore for bookings associated with the logged-in user
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(bookingsQuery);

      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to fetch bookings. Please try again.");
    }
  };

  const openComplaintModal = (booking: any) => {
    setSelectedBooking(booking);
    setComplaintModalVisible(true);
  };

  const closeComplaintModal = () => {
    setSelectedBooking(null);
    setComplaintText("");
    setComplaintModalVisible(false);
  };

  const handleSubmitComplaint = async () => {
    if (!complaintText) {
      Alert.alert("Error", "Please enter a complaint.");
      return;
    }

    try {
      // Save the complaint to Firestore
      await addDoc(collection(db, "complaints"), {
        bookingId: selectedBooking.id,
        roomName: selectedBooking.roomName,
        complaint: complaintText,
        userId: auth.currentUser.uid, // Save the userId for reference
        timestamp: new Date().toISOString(), // Add timestamp for sorting
      });

      Alert.alert("Complaint Submitted", "Your complaint has been recorded.");
      closeComplaintModal();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert(
        "Error",
        "Failed to submit your complaint. Please try again."
      );
    }
  };

  const renderBooking = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.roomName}>{item.roomName}</Text>
      <Text style={styles.details}>
        Check-in: {item.checkIn} | Check-out: {item.checkOut}
      </Text>
      <Text style={styles.details}>Amount: ${item.totalAmount}</Text>
      <TouchableOpacity
        style={styles.complaintButton}
        onPress={() => openComplaintModal(item)}
      >
        <Text style={styles.complaintButtonText}>Raise a Complaint</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No bookings found.</Text>}
      />

      {/* Complaint Modal */}
      <Modal
        visible={isComplaintModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeComplaintModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Raise a Complaint</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your complaint here..."
              value={complaintText}
              onChangeText={setComplaintText}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeComplaintModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitComplaint}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  bookingCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  complaintButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  complaintButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 16,
    textAlign: "center",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#FFF",
    height: 100,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#CCC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MyBookingsScreen;
