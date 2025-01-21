import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "@/screens/HomeScreen";
import ConfirmBookingScreen from "@/screens/ConfirmBookingScreen";
import RoomSelectionScreen from "@/screens/RoomSelectionScreen";
import PaymentScreen from "@/screens/PaymentScreen";
import AdminDashboard from "@/screens/AdminDashboard";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import CreateStaffScreen from "@/screens/CreateStaffScreen";
import StaffScreen from "@/screens/staffScreen";
import MyBookingsScreen from "@/screens/MyBookingsScreen";
const Stack = createStackNavigator();

const UserNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ConfirmBooking"
      component={ConfirmBookingScreen}
      options={{ title: "Confirm Booking" }}
    />
    <Stack.Screen
      name="RoomSelection"
      component={RoomSelectionScreen}
      options={{ title: "Room Selection Screen" }}
    />
    <Stack.Screen
      name="PaymentScreen"
      component={PaymentScreen}
      options={{ title: "Payment Screen" }}
    />
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboard}
      options={{ title: "Admin Dashboard" }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Register" }}
    />
    <Stack.Screen
      name="CreateStaff"
      component={CreateStaffScreen}
      options={{ title: "Create Staff" }}
    />
    <Stack.Screen
      name="StaffScreen"
      component={StaffScreen}
      options={{ title: "Staff Screen" }}
    />
    <Stack.Screen
      name="MyBookingsScreen"
      component={MyBookingsScreen}
      options={{ title: "My Bookings Screen" }}
    />
  </Stack.Navigator>
);

export default UserNavigator;
