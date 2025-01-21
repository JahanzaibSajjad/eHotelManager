import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const BookingInformationScreen = ({ navigation, route }: any) => {
  const { selectedRooms } = route.params || [];

  // State for form inputs
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [extraInfo, setExtraInfo] = useState("");

  // Date picker visibility flags
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  // Calculate Total Amount
  const calculateTotalCost = () => {
    // Ensure selectedRooms is an array and has at least one room
    if (!Array.isArray(selectedRooms) || selectedRooms.length === 0) {
      return 0; // No rooms selected
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate number of days (minimum 1 day)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

    // Calculate total cost
    const roomTotal = selectedRooms.reduce((total, room) => {
      const roomPrice = parseFloat(room.price); // Ensure price is numeric
      return total + (roomPrice || 0) * diffDays;
    }, 0);

    return roomTotal.toFixed(2);
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    if (!guestName || !phoneNumber) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }
    navigation.navigate("PaymentScreen", {
      totalAmount: calculateTotalCost(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>Booking Information</Text>

      <View style={styles.form}>
        {/* Guest Name */}
        <TextInput
          style={styles.input}
          placeholder="Booking Name"
          value={guestName}
          onChangeText={setGuestName}
        />

        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Check-In Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCheckInPicker(true)}
        >
          <Text style={styles.dateText}>
            {checkInDate.toDateString() || "Select Check-In Date"}
          </Text>
        </TouchableOpacity>
        {showCheckInPicker && (
          <DateTimePicker
            value={checkInDate}
            mode="date"
            display="default"
            minimumDate={new Date()} // Check-in date cannot be in the past
            onChange={(event, selectedDate) => {
              setShowCheckInPicker(false);
              if (selectedDate) setCheckInDate(selectedDate);
            }}
          />
        )}

        {/* Check-Out Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCheckOutPicker(true)}
        >
          <Text style={styles.dateText}>
            {checkOutDate.toDateString() || "Select Check-Out Date"}
          </Text>
        </TouchableOpacity>
        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutDate}
            mode="date"
            display="default"
            minimumDate={checkInDate} // Check-out date cannot be before check-in date
            onChange={(event, selectedDate) => {
              setShowCheckOutPicker(false);
              if (selectedDate) setCheckOutDate(selectedDate);
            }}
          />
        )}

        {/* Extra Information */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Additional Instructions"
          value={extraInfo}
          onChangeText={setExtraInfo}
          multiline
        />
      </View>

      {/* Total Amount & Proceed Button */}
      <View style={styles.footer}>
        <Text style={styles.totalCost}>
          Total Cost: £{calculateTotalCost()}
        </Text>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAF5F0",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FFF",
    color: "#000",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalCost: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2691E",
    marginBottom: 16,
  },
  proceedButton: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  proceedButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingInformationScreen;
