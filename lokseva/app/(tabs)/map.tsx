import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

// Platform-specific imports
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapScreen() {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const router = useRouter();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/issues`);
      setIssues(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Map fetch error:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchIssues();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIssues();
    setRefreshing(false);
  };

  const getMarkerColor = (priority) => {
    if (priority === "HIGH") return "red";
    if (priority === "MEDIUM") return "orange";
    return "green";
  };

  const zoomToIssue = (issue) => {
    if (!mapRef.current || Platform.OS === 'web') return;
    mapRef.current.animateToRegion(
      {
        latitude: Number(issue.latitude) || issue.latitude,
        longitude: Number(issue.longitude) || issue.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600
    );
  };

  const renderMapView = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
          <Text style={{ fontSize: 16, color: '#666' }}>Map not available on web</Text>
        </View>
      );
    }

    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: issues.length ? Number(issues[0].latitude) : 18.5204,
          longitude: issues.length ? Number(issues[0].longitude) : 73.8567,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {issues.map((issue, index) => (
          <Marker
            key={issue._id || index}
            coordinate={{
              latitude: Number(issue.latitude) || 0,
              longitude: Number(issue.longitude) || 0,
            }}
            pinColor={getMarkerColor(issue.priority)}
            title={issue.category || issue.title}
            description={issue.status}
          />
        ))}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      {renderMapView()}

      <View style={styles.listContainer}>
        <Text style={styles.heading}>Reported Issues Near You</Text>

        <FlatList
          data={issues}
          keyExtractor={(item, index) => item._id || index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {loading ? "Loading issues..." : "No issues reported yet."}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/issue-details?id=${item._id}`)}
            >
              <Text style={styles.cardTitle}>
                {item.category || item.title}
              </Text>
              <Text style={styles.cardLocation}>
                {item.location || item.address || "Unknown location"}
              </Text>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.priority,
                    { color: getMarkerColor(item.priority) },
                  ]}
                >
                  {item.priority}
                </Text>

                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        item.status === "RESOLVED"
                          ? "green"
                          : item.status === "IN_PROGRESS"
                          ? "#9370DB"
                          : item.status === "ACKNOWLEDGED"
                          ? "#1e90ff"
                          : "orange",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

/* ---------- darkMapStyle (short sample) ---------- */
/* This is a compact Google-style dark map. You can replace with a full style JSON */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  map: {
    height: "50%",
    width: "100%",
  },
  listContainer: {
    flex: 1,
    padding: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.navy,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.navy,
  },
  cardLocation: {
    color: "#666",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  priority: {
    fontWeight: "700",
  },
  status: {
    fontWeight: "700",
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 12,
    color: "#999",
  },
});