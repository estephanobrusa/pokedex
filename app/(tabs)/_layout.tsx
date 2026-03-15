import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#e53e3e",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="who-is-that-pokemon"
        options={{
          title: "Who?",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
