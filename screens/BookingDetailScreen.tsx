import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Platform,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";

const rooms = [
  {
    id: "1",
    name: "Standard Room",
    price: "$120/night",
    capacity: "Max: 3 adults",
    size: "25m²",
    bedType: "2 twin or 1 queen or 1 king",
    amenities: ["Wi-Fi", "Tea Maker", "Mini Fridge"],
    image: require("../assets/images/bedroom-1.jpg"),
  },
  {
    id: "2",
    name: "Deluxe Room",
    price: "$180/night",
    capacity: "Max: 4 adults",
    size: "35m²",
    bedType: "2 queen beds",
    amenities: ["Wi-Fi", "Coffee Maker", "Room Service"],
    image: require("../assets/images/bedroom-2.jpg"),
  },
  {
    id: "3",
    name: "Family Room",
    price: "$300/night",
    capacity: "Max: 4 adults,2 childs",
    size: "55m²",
    bedType: "2 queen beds,2 single beds",
    amenities: ["Wi-Fi", "Coffee Maker", "Room Service"],
    image: require("../assets/images/bedroom-3.jpg"),
  },
];

const BookingDetailScreen = ({ navigation }: any) => {
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [isCheckInPickerVisible, setCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setCheckOutPickerVisible] = useState(false);
  const formatDate = (date: any) => {
    return date
      ? date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      : "";
  };
  const handleViewAllRooms = () => {
    navigation.navigate("RoomSelection");
  };

  const renderRoom = ({ item }: { item: any }) => (
    <View style={styles.roomCard}>
      <Image source={item.image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomPrice}>{item.price}</Text>
        <Text style={styles.roomDetails}>
          {item.capacity} | {item.size} | {item.bedType}
        </Text>
        <View style={styles.amenities}>
          {item.amenities.map((amenity: string, index: number) => (
            <Text key={index} style={styles.amenity}>
              {amenity}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate("RoomDetails", { roomId: item.id })
          }
        >
          <Text style={styles.viewButtonText}>View Room Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const isFormValid = () => {
    // return checkIn && checkOut && (adults || children);
    return adults || children;
  };
  const handleSearch = () => {
    Alert.alert("Search Successful", "Fetching available rooms...");
    // Add navigation or API call logic here

    navigation.navigate("RoomSelection", {
      checkIn,
      checkOut,
      adults,
      children,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Bookings")}>
          <Text style={styles.navItem}>My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navItem}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Header */}
      <Text style={styles.header}>Find Your Perfect Stay</Text>

      {/* Room List Section */}
      <View style={styles.roomListSection}>
        <Text style={styles.sectionHeader}>Available Rooms</Text>
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.roomList}
        />
      </View>
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
});

export default BookingDetailScreen;
