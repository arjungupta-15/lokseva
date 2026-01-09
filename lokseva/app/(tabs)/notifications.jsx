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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const getIcon = (type) =>
    type === "SUCCESS" ? "checkmark-circle" : "information-circle";

  const getColor = (type) =>
    type === "SUCCESS" ? "green" : COLORS.saffron;

  const loadNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = JSON.parse(await AsyncStorage.getItem("user"));

      const res = await fetch(`${API_URL}/api/notifications/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.log("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
