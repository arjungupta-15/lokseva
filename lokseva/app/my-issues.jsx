import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { useFocusEffect } from "@react-navigation/native";

export default function MyIssues() {
  const router = useRouter();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/issues/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyIssues(res.data);
    } catch (err) {
      console.log("Error loading issues", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(() => {
    fetchMyIssues();
  });

  const getStatusColor = (status) => {
    if (status === "RESOLVED") return "green";
    if (status === "IN_REVIEW") return "#1e90ff";
    return "orange";
  };

  const getPriorityColor = (priority) => {
    if (priority === "HIGH") return "red";
    if (priority === "MEDIUM") return "orange";
    return "green";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Reported Issues</Text>
      </View>

      <FlatList
        data={myIssues}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/issue-details?id=${item._id}`)}
          >
            <Text style={styles.title}>{item.category}</Text>
            <Text style={styles.location}>{item.location}</Text>

            <View style={styles.row}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>

              <Text
                style={[
                  styles.priority,
                  { color: getPriorityColor(item.priority) },
                ]}
              >
                {item.priority}
              </Text>
            </View>

            {/* Show if feedback needed */}
            {item.status === "RESOLVED" && !item.feedback && (
              <View style={styles.feedbackPrompt}>
                <Ionicons name="star-outline" size={16} color="#FFD700" />
                <Text style={styles.feedbackText}>Tap to rate resolution</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "Loading..." : "You have not reported any issues yet."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + 16
        : 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: COLORS.navy,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.navy,
  },

  location: {
    color: "#666",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  priority: {
    fontWeight: "700",
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },

  feedbackPrompt: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  feedbackText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
});