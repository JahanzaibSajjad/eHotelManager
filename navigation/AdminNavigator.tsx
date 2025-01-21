import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminDashboard from "@/screens/AdminDashboard";
import CreateStaffScreen from "@/screens/CreateStaffScreen";
import LoginScreen from "@/screens/LoginScreen";

const Stack = createStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboard}
      options={{ title: "Admin Dashboard" }}
    />
    <Stack.Screen
      name="CreateStaff"
      component={CreateStaffScreen}
      options={{ title: "Create Staff" }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login Screen" }}
    />
  </Stack.Navigator>
);

export default AdminNavigator;
