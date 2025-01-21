import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StaffScreen from "@/screens/staffScreen";

const Stack = createStackNavigator();

const StaffNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="StaffScreen"
      component={StaffScreen}
      options={{ title: "Staff Screen" }}
    />
  </Stack.Navigator>
);

export default StaffNavigator;
