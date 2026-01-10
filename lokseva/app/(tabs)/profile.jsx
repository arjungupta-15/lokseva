import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../constants/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  // Load user info from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const u = await AsyncStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
      };
      loadUser();
    }, [])
  );


  // Fetch stats when screen opens
  const loadStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/issues/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const total = data.length;
      const resolved = data.filter((i) => i.status === "RESOLVED").length;
      const pending = data.filter((i) => i.status !== "RESOLVED").length;

      setStats({ total, resolved, pending });
    } catch (err) {
      console.log("STATS ERROR:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={
            user.profilePic
              ? { uri: user.profilePic.startsWith("http") ? user.profilePic : `${API_URL}${user.profilePic}` }
              : require("../../assets/images/defaultAvatar.png")
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.name || "Citizen User"}</Text>
        <Text style={styles.email}>{user.email || "user@lokseva.in"}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: "green" }]}>
            {stats.resolved}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: "orange" }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/my-issues")}
        >
          <Ionicons name="document-text-outline" size={20} color={COLORS.navy} />
          <Text style={styles.actionText}>My Reported Issues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/EditProfile")}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.navy} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.logoutBtn]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={[styles.actionText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 50,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.navy,
  },

  email: {
    color: "#777",
    marginTop: 4,
  },

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24,
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.saffron,
  },

  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#eee",
  },

  actions: {
    gap: 12,
  },

  actionBtn: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.navy,
  },

  logoutBtn: {
    borderWidth: 1,
    borderColor: "#ffe5e5",
  },
});