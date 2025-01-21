import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
// const rooms = [
//   {
//     id: "1",
//     name: "Standard Room",
//     price: "120",
//     capacity: "Max: 3 adults",
//     size: "25m²",
//     bedType: "2 twin or 1 queen or 1 king",
//     amenities: ["Wi-Fi", "Tea Maker", "Mini Fridge"],
//     image: require("../assets/images/bedroom-1.jpg"),
//     policies: "Check-in after 2 PM. No pets allowed.",
//   },
//   {
//     id: "2",
//     name: "Deluxe Room",
//     price: "180",
//     capacity: "Max: 4 adults",
//     size: "35m²",
//     bedType: "2 queen beds",
//     amenities: ["Wi-Fi", "Coffee Maker", "Room Service"],
//     image: require("../assets/images/bedroom-2.jpg"),
//     policies: "Early check-in available. Smoking prohibited.",
//   },
//   {
//     id: "3",
//     name: "Family Room",
//     price: "300",
//     capacity: "Max: 4 adults, 2 children",
//     size: "55m²",
//     bedType: "2 queen beds, 2 single beds",
//     amenities: ["Wi-Fi", "Coffee Maker", "Room Service"],
//     image: require("../assets/images/bedroom-3.jpg"),
//     policies: "Free cancellation within 24 hours.",
//   },
// ];

const HomeScreen = ({ navigation }: any) => {
  const [roomType, setRoomType] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const images = [
    require("../assets/images/bedroom-1.jpg"),
    require("../assets/images/bedroom-2.jpg"),
    require("../assets/images/bedroom-3.jpg"),
    require("../assets/images/bedroom-4.jpg"),
    require("../assets/images/bedroom-5.jpg"),
  ];
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const allRooms = roomsSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          image: images[index % images.length],
        }));

        // Randomly select 3 rooms
        const randomRooms: any = allRooms
          .sort(() => 0.5 - Math.random())
          .slice(0, 3); // Take the first 3 after shuffle
        setRooms(randomRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Alert.alert("Error", "Failed to fetch rooms. Please try again.");
      }
    };

    fetchRooms();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user state
      setDropdownVisible(false); // Close dropdown
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const renderRoom = ({ item }: { item: any }) => (
    <View style={styles.roomCard}>
      <Image source={item.image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomPrice}>${item.price}/night</Text>
        <Text style={styles.roomDetails}>
          Total Bed Capacity- {item.capacity}
        </Text>
        <View style={styles.amenities}>
          {item.amenities?.map((amenity: string, index: number) => (
            <Text key={index} style={styles.amenity}>
              {amenity}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewRoomDetails(item)}
        >
          <Text style={styles.viewButtonText}>View Room Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleSearch = () => {
    const totalGuests = adults + children;

    if (totalGuests === 0) {
      Alert.alert("Invalid Input", "Please add at least one guest.");
      return;
    }

    navigation.navigate("RoomSelection", {
      totalGuests,
    });
  };
  const handleViewRoomDetails = (room: any) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setSelectedRoom(null);
    setModalVisible(false);
  };

  const handleBookNow = () => {
    if (selectedRoom) {
      setModalVisible(false);

      if (!user) {
        navigation.navigate("Login", {
          redirectTo: "ConfirmBooking",
          selectedRooms: selectedRoom ? [selectedRoom] : [],
        });
      } else {
        navigation.navigate("ConfirmBooking", {
          selectedRooms: selectedRoom ? [selectedRoom] : [],
        });
      }
    }
  };
  const handleViewAllRooms = () => {
    navigation.navigate("RoomSelection");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        {/* Home Navigation */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        {/* My Bookings Navigation */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MyBookingsScreen")}
        >
          <Text style={styles.navItem}>My Bookings</Text>
        </TouchableOpacity>

        {/* Profile Dropdown */}
        {user ? (
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setDropdownVisible(!isDropdownVisible)}
            >
              <Text style={styles.profileText}>
                {user.displayName || user.email.split("@")[0]}
              </Text>
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {isDropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDropdownVisible(false);
                    navigation.navigate("MyBookingsScreen");
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
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogout}
                >
                  <Text style={[styles.dropdownText, styles.logoutText]}>
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.navItem}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Header */}
      <Text style={styles.header}>Find Your Perfect Stay</Text>
      {/* Input Fields */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.fullWidthInput}
          placeholder="Room Type"
          value={roomType}
          onChangeText={setRoomType}
        />
        <View style={styles.row}>
          <View style={styles.counter}>
            <Text style={styles.counterLabel}>Adults</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setAdults(adults > 0 ? adults - 1 : 0)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{adults}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setAdults(adults + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.counter}>
            <Text style={styles.counterLabel}>Children</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setChildren(children > 0 ? children - 1 : 0)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{children}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setChildren(children + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.searchButton,
            adults + children === 0 && styles.disabledButton, // Disable style
          ]}
          onPress={handleSearch}
          disabled={adults + children === 0} // Disable logic
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Room List Section */}
      <View style={styles.roomListSection}>
        <Text style={styles.sectionHeader}>Most Popular Rooms</Text>
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          style={styles.roomList}
        />
      </View>
      {/* Room Details Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedRoom && (
              <ScrollView>
                {/* Static Image */}
                <Image source={selectedRoom.image} style={styles.modalImage} />

                {/* Room Details */}
                <Text style={styles.modalRoomName}>{selectedRoom.name}</Text>
                <Text style={styles.modalRoomPrice}>
                  ${selectedRoom.price}/night
                </Text>
                <Text style={styles.modalRoomDetails}>
                  Total Bed Capacity {selectedRoom.capacity}
                </Text>

                {/* Amenities */}
                <Text style={styles.modalAmenitiesHeader}>Amenities</Text>
                <View style={styles.amenitiesContainer}>
                  {selectedRoom?.amenities?.map((amenity, index) => (
                    <Text key={index} style={styles.modalAmenity}>
                      {amenity}
                    </Text>
                  ))}
                </View>

                {/* Policies */}
                <Text style={styles.policiesHeader}>Description</Text>
                <Text style={styles.policiesText}>
                  {selectedRoom.description}
                </Text>

                {/* Book Now Button */}
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={handleBookNow}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* View All Rooms Button */}
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={handleViewAllRooms}
      >
        <Text style={styles.viewAllButtonText}>View All Available Rooms</Text>
      </TouchableOpacity>
      {/* Login/Register Section */}
      <View style={styles.authSection}>
        <Text style={styles.authText}>
          Ready to book with us? Register now!
        </Text>
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.authButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutHeader}>About Us</Text>
        <Text style={styles.aboutText}>
          Welcome to eHotelManager! We offer a luxurious experience with
          top-notch facilities to make your stay unforgettable.
        </Text>
        <View style={styles.facilitiesContainer}>
          <View style={styles.facility}>
            <Image
              source={require("../assets/images/massage.png")}
              style={styles.facilityIcon}
            />
            <Text style={styles.facilityText}>Spa</Text>
          </View>
          <View style={styles.facility}>
            <Image
              source={require("../assets/images/swimming.png")}
              style={styles.facilityIcon}
            />
            <Text style={styles.facilityText}>Swimming Pool</Text>
          </View>
          <View style={styles.facility}>
            <Image
              source={require("../assets/images/wifi-signal.png")}
              style={styles.facilityIcon}
            />
            <Text style={styles.facilityText}>Free Wi-Fi</Text>
          </View>
          <View style={styles.facility}>
            <Image
              source={require("../assets/images/laundry.png")}
              style={styles.facilityIcon}
            />
            <Text style={styles.facilityText}>Laundry Service</Text>
          </View>
          <View style={styles.facility}>
            <Image
              source={require("../assets/images/staff.png")}
              style={styles.facilityIcon}
            />
            <Text style={styles.facilityText}>World-Class Staff</Text>
          </View>
        </View>
        <Image
          source={require("../assets/images/hotel-2.jpg")}
          style={styles.aboutImage}
        />
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 eHotelManager. All Rights Reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#D2691E",
  },
  viewAllButton: {
    backgroundColor: "#D2691E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  viewAllButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#D2691E",
  },
  navItem: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginVertical: 20,
  },

  roomListSection: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
  },
  roomImage: {
    width: "100%",
    height: 150,
  },
  roomInfo: {
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  roomPrice: {
    fontSize: 16,
    color: "#D2691E",
    marginBottom: 8,
  },
  roomDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  amenity: {
    fontSize: 12,
    color: "#555",
    marginRight: 8,
  },
  viewButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  viewButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  authSection: {
    margin: 16,
    alignItems: "center",
  },
  authText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  authButton: {
    backgroundColor: "#D2691E",
    padding: 10,
    borderRadius: 8,
  },
  authButtonText: {
    color: "#FFF",
    fontSize: 14,
  },

  footer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#D2691E",
  },
  footerText: {
    color: "#FFF",
    fontSize: 12,
  },
  aboutSection: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 12,
    textAlign: "center",
  },
  aboutText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  facility: {
    alignItems: "center",
    width: "30%",
    marginBottom: 16,
  },
  facilityIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  aboutImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 16,
  },
  inputSection: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    elevation: 8,
  },

  placeholderText: {
    color: "#999",
  },

  halfInput: {
    width: "48%",
  },
  counter: {
    flex: 1,
    alignItems: "center",
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  policiesHeader: {
    fontWeight: "bold",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: "#D2691E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  counterButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  counterValue: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  searchButton: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
  },
  fullWidthInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: "#CCC",
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    marginBottom: 16,
  },
  halfWidthInput: {
    width: "48%",
  },
  text: {
    marginLeft: 8,
    color: "#333",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  modalRoomName: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  modalRoomPrice: {
    fontSize: 16,
    color: "#D2691E",
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#D2691E",
    paddingVertical: 10,
  },
  navItem: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  profileText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#D2691E",
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 1000,
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

export default HomeScreen;
