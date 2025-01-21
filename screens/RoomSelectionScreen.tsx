import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

const RoomSelectionScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  // Local images array
  const images = [
    require("../assets/images/bedroom-1.jpg"),
    require("../assets/images/bedroom-2.jpg"),
    require("../assets/images/bedroom-3.jpg"),
    require("../assets/images/bedroom-4.jpg"),
    require("../assets/images/bedroom-5.jpg"),
  ];

  // Fetch room data from Firestore
  // Fetch room data from Firestore and filter available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = roomsSnapshot.docs
          .map((doc, index) => ({
            id: doc.id,
            ...doc.data(),
            image: images[index % images.length], // Assign local image based on index
          }))
          .filter((room) => room.status === "available"); // Filter only available rooms
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Alert.alert("Error", "Failed to fetch rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Toggle room selection
  const toggleRoomSelection = (room) => {
    if (selectedRooms.includes(room.id)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room.id]);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedRoom(null);
    setModalVisible(false);
  };

  // Proceed to booking
  const handleProceed = () => {
    if (!user) {
      navigation.navigate("Login", {
        redirectTo: "ConfirmBooking",
        selectedRooms: selectedRooms.map((roomId) =>
          rooms.find((room) => room.id === roomId)
        ),
      });
    } else {
      navigation.navigate("ConfirmBooking", {
        selectedRooms: selectedRooms.map((roomId) =>
          rooms.find((room) => room.id === roomId)
        ),
      });
    }
  };

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <Image source={item.image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomCapacity}>
          Capacity: {item.capacity} guests
        </Text>
        <Text style={styles.roomPrice}>${item.price}/night</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setSelectedRoom(item);
            }}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          <Switch
            value={selectedRooms.includes(item.id)}
            onValueChange={() => toggleRoomSelection(item)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Rooms</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading rooms...</Text>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Proceed Button */}
      <TouchableOpacity
        style={[
          styles.proceedButton,
          selectedRooms.length === 0 && styles.disabledProceedButton,
        ]}
        onPress={handleProceed}
        disabled={selectedRooms.length === 0}
      >
        <Text style={styles.proceedButtonText}>Proceed to Booking</Text>
      </TouchableOpacity>

      {/* Modal for Room Details */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {selectedRoom && (
              <ScrollView>
                <Image source={selectedRoom.image} style={styles.modalImage} />
                <Text style={styles.modalRoomName}>{selectedRoom.name}</Text>
                <Text style={styles.modalRoomPrice}>${selectedRoom.price}</Text>
                <Text style={styles.modalRoomDescription}>
                  {selectedRoom.description}
                </Text>
                <Text style={styles.modalAmenitiesHeader}>Amenities</Text>
                <View style={styles.amenitiesContainer}>
                  {selectedRoom.amenities.map((amenity, index) => (
                    <Text key={index} style={styles.amenity}>
                      • {amenity}
                    </Text>
                  ))}
                </View>
              </ScrollView>
            )}
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
  roomCard: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    flexDirection: "row",
  },
  roomImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roomCapacity: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 14,
    color: "#D2691E",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsButton: {
    backgroundColor: "#D2691E",
    padding: 8,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  trackerContainer: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
  },
  trackerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  proceedButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledProceedButton: {
    backgroundColor: "#CCC",
  },
  proceedButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#D2691E",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalRoomName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 8,
  },
  modalRoomPrice: {
    fontSize: 16,
    color: "#D2691E",
    marginBottom: 16,
  },
  modalRoomDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  modalAmenitiesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 8,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenity: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});

export default RoomSelectionScreen;
