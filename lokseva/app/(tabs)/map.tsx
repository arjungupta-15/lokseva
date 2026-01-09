// app/(tabs)/map.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

export default function MapScreen() {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/issues`);
      // expecting res.data = array of issues
      setIssues(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Map fetch error:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // refresh when screen focused (so after submit it will re-fetch)
  useEffect(() => {
    if (isFocused) fetchIssues();
  }, [isFocused, fetchIssues]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchIssues();
    setRefreshing(false);
  }, [fetchIssues]);

  const getMarkerColor = (p) =>
    p === "HIGH" ? "red" : p === "MEDIUM" ? "orange" : "green";

  const zoomToIssue = (issue) => {
    if (!mapRef.current) return;
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

  const renderMarker = (i) => (
    <Marker
      key={i._id ?? i.id}
      coordinate={{
        latitude: Number(i.latitude) || 0,
        longitude: Number(i.longitude) || 0,
      }}
      pinColor={getMarkerColor(i.priority)}
      title={i.category || i.title}
      description={i.status}
    />
  );

  return (
    <View style={styles.container}>
      {/* MAP */}
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
        customMapStyle={darkMapStyle} // dark style applied
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {issues.map(renderMarker)}
      </MapView>

      {/* LIST */}
      <View style={styles.listContainer}>
        <Text style={styles.heading}>Reported Issues Near You</Text>

        <FlatList
          data={issues}
          keyExtractor={(item) => item._id ?? item.id}
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
              onPress={() => zoomToIssue(item)}
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
                          : item.status === "IN_REVIEW"
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
