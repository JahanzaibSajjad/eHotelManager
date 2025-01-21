import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const PaymentScreen = ({ navigation, route }: any) => {
  const { totalAmount, bookingDetails } = route.params || {};
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Invalid Input", "Please fill in all the fields.");
      return;
    }

    try {
      setPaymentSuccessful(true);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId,
        ...bookingDetails,
        totalAmount,
        paymentStatus: "Paid",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Booking confirmed and saved to database!");
    } catch (error) {
      console.error("Error saving booking:", error);
      Alert.alert("Error", "Failed to save booking. Please try again.");
    }
  };

  const closeModal = () => {
    setPaymentSuccessful(false);
    navigation.navigate("Home"); // Navigate to Home after successful payment
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment</Text>
      <Text style={styles.summaryText}>Total Amount: ${totalAmount}</Text>

      {/* Card Payment Form */}
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="number-pad"
        maxLength={16}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Expiry Date (MM/YY)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="number-pad"
          maxLength={3}
        />
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Confirm Payment</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={isPaymentSuccessful}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>
              Payment Successful!Your Booking has been confirmed
            </Text>
            <TouchableOpacity style={styles.successButton} onPress={closeModal}>
              <Text style={styles.successButtonText}>Go to Home</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: "center",
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  payButton: {
    backgroundColor: "#D2691E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 16,
  },
  successButton: {
    backgroundColor: "#D2691E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  successButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
