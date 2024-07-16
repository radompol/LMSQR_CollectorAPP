import { StyleSheet, Text, View } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home_main from "./pages/home/Home_main";
import Login_Home from "./pages/login/Login_Home";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App(props) {
  const Stack = createNativeStackNavigator();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login_Home} {...props} />
          <Stack.Screen name="Home" component={Home_main} {...props} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

<div>
  <table>
    <thead></thead>
    <tbody></tbody>
  </table>
</div>;
