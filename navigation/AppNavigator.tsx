import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminNavigator from "./AdminNavigator";
import UserNavigator from "./UserNavigator";
import StaffNavigator from "./StaffNavigator";
import { View, ActivityIndicator } from "react-native";

const AppNavigator = () => {
  const { role, loading } = useAuth();

  console.log("AppNavigator Role:", role); // Debug role
  console.log("AppNavigator Loading:", loading); // Debug loading state

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#D2691E" />
      </View>
    );
  }

  if (role === "admin") {
    console.log("Navigating to AdminNavigator");
    return <AdminNavigator />;
  }

  if (role === "staff") {
    console.log("Navigating to StaffNavigator");
    return <StaffNavigator />;
  }

  console.log("Navigating to UserNavigator");
  return <UserNavigator />;
};

export default AppNavigator;
