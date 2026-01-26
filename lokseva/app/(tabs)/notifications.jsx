import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useState } from "react";

export default function Notifications() {
  // 🟢 DUMMY DATA
  const [notifications, setNotifications] = useState([
    {
      _id: "1",
      type: "SUCCESS",
      message: "Your reported pothole issue has been resolved!",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      type: "INFO",
      message: "Admin requested more details on your report.",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      _id: "3",
      type: "SUCCESS",
      message: "Profile updated successfully.",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      _id: "4",
      type: "INFO",
      message: "Welcome to LokSeva app! We are here to help.",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ]);

  const getIcon = (type) =>
    type === "SUCCESS" ? "checkmark-circle" : "information-circle";

  const getColor = (type) =>
    type === "SUCCESS" ? "green" : COLORS.saffron;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons
              name={getIcon(item.type)}
              size={26}
              color={getColor(item.type)}
              style={{ marginRight: 12 }}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + 10
        : 40,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.navy,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  message: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
  },

  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
