import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const roomDetails = {
  id: "1",
  name: "Deluxe Room",
  price: "$180/night",
  description:
    "The Deluxe Room offers unparalleled comfort with modern furnishings, spacious layout, and stunning views. Perfect for families or couples seeking a luxurious retreat.",
  capacity: "Max: 4 adults",
  size: "35m²",
  bedType: "2 queen beds",
  amenities: [
    "Free Wi-Fi",
    "Air Conditioning",
    "Mini Fridge",
    "Room Service",
    "Coffee Maker",
  ],
  images: [
    require("../assets/images/bedroom-1.jpg"),
    require("../assets/images/bedroom-2.jpg"),
  ],
};

const RoomDetailsScreen = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState(roomDetails.images[0]);

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.mainImage} />
        <FlatList
          horizontal
          data={roomDetails.images}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image source={item} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.thumbnailList}
        />
      </View>

      {/* Room Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.roomName}>{roomDetails.name}</Text>
        <Text style={styles.roomPrice}>{roomDetails.price}</Text>
        <Text style={styles.roomDescription}>{roomDetails.description}</Text>
        <Text style={styles.roomInfo}>
          <Text style={styles.bold}>Capacity:</Text> {roomDetails.capacity}
        </Text>
        <Text style={styles.roomInfo}>
          <Text style={styles.bold}>Size:</Text> {roomDetails.size}
        </Text>
        <Text style={styles.roomInfo}>
          <Text style={styles.bold}>Bed Type:</Text> {roomDetails.bedType}
        </Text>

        {/* Amenities */}
        <Text style={styles.amenitiesHeader}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {roomDetails.amenities.map((amenity, index) => (
            <Text key={index} style={styles.amenity}>
              • {amenity}
            </Text>
          ))}
        </View>

        {/* Book Now Button */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate("ConfirmBooking", {
              roomId: roomDetails.id,
            })
          }
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5F0",
  },
  imageContainer: {
    marginBottom: 16,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
  },
  thumbnailList: {
    marginTop: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D2691E",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  roomName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 8,
  },
  roomPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 16,
  },
  roomDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    lineHeight: 20,
  },
  roomInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  amenitiesHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2691E",
    marginTop: 16,
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
  bookButton: {
    backgroundColor: "#D2691E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RoomDetailsScreen;
