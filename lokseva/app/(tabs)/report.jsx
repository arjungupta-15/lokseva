import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";

export default function Report() {
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState(null);

  const [locationText, setLocationText] = useState("Detecting location...");
  const [manualMode, setManualMode] = useState(false); // 🔥 AUTO/MANUAL TOGGLE

  const [category, setCategory] = useState("Garbage");
  const [priority, setPriority] = useState("HIGH");
  const [description, setDescription] = useState("");

  const [openLocation, setOpenLocation] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);

  const manualLocations = [
    "Manapure Road",
    "Datta Mandir Road",
    "Shastri Nagar",
    "Subhash Road",
    "Nalwadi",
    "Arvi Naka",
    "Civil Lines",
    "Sawangi",
  ];

  /* ---------------- AUTO-DETECT LOCATION ---------------- */
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationText("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = loc.coords;
      setCoords({ latitude, longitude });

      // Reverse Geocoding
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const place = `${address[0].street || ""}, ${address[0].city || ""}`;
        setLocationText(place);
      } else {
        setLocationText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (err) {
      setLocationText("Unable to detect location");
    }
  };

  useEffect(() => {
    if (!manualMode) {
      getCurrentLocation();
    }
  }, [manualMode]);

  /* ---------------- OPEN CAMERA ---------------- */
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setImage({
        uri: img.uri,
        name: "issue.jpg",
        type: "image/jpeg",
      });
    }
  };

  /* ---------------- SUBMIT ISSUE ---------------- */
  const submitIssue = async () => {
    if (!description) {
      Alert.alert("Error", "Description required");
      return;
    }
    if (!coords) {
      Alert.alert("Error", "Location not available");
      return;
    }

    const formData = new FormData();

    formData.append("category", category);
    formData.append("description", description);
    formData.append("priority", priority);

    // 🔥 Location text (manual or auto)
    formData.append("location", locationText);

    // 🔥 Always send correct coordinates
    formData.append("latitude", coords.latitude.toString());
    formData.append("longitude", coords.longitude.toString());

    if (image) formData.append("image", image);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Submit Response:", data);

      Alert.alert("Success", "Issue submitted successfully!");
      setDescription("");
      setImage(null);
    } catch (err) {
      Alert.alert("Error", "Network request failed");
    }
  };

  /* ---------------- UI BELOW ---------------- */
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Report an Issue</Text>

      {/* IMAGE */}
      <TouchableOpacity style={styles.imageBox} onPress={openCamera}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
          />
        ) : (
          <>
            <Ionicons name="camera" size={40} color={COLORS.saffron} />
            <Text style={styles.imageText}>Tap to add issue photo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* CATEGORY */}
      <Text style={styles.label}>Issue Category</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpenCategory(true)}>
        <Text>{category}</Text>
      </TouchableOpacity>

      {/* DESCRIPTION */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* LOCATION */}
      <Text style={styles.label}>Location</Text>

      {/* TOGGLE AUTO / MANUAL */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setManualMode(!manualMode)}
      >
        <Text style={{ fontWeight: "bold" }}>
          {manualMode ? "Switch to Auto-Detect" : "Switch to Manual Location"}
        </Text>
      </TouchableOpacity>

      {!manualMode ? (
        /* AUTO LOCATION */
        <View style={styles.autoBox}>
          <Text style={{ color: "#555" }}>{locationText}</Text>
        </View>
      ) : (
        /* MANUAL DROPDOWN */
        <TouchableOpacity style={styles.dropdown} onPress={() => setOpenLocation(true)}>
          <Text>{locationText}</Text>
        </TouchableOpacity>
      )}

      {/* PRIORITY */}
      <Text style={styles.label}>Priority</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpenPriority(true)}>
        <Text style={{ color: "red" }}>{priority}</Text>
      </TouchableOpacity>

      {/* SUBMIT */}
      <TouchableOpacity style={styles.submitBtn} onPress={submitIssue}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>

      {/* MODALS */}
      {renderModal(openCategory, setOpenCategory, ["Garbage", "Animals", "Potholes", "Streetlight","Water Supply"], setCategory)}
      {renderModal(openPriority, setOpenPriority, ["HIGH", "MEDIUM", "LOW"], setPriority)}
      {renderModal(openLocation, setOpenLocation, manualLocations, (loc) => {
        setLocationText(loc);
        // Manual location ke liye custom coords static rakh sakte ho
        setCoords({ latitude: 20.7413, longitude: 78.5998 });
      })}
    </ScrollView>
  );
}

/* REUSABLE MODAL */
function renderModal(open, close, options, onSelect) {
  return (
    <Modal transparent visible={open} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={() => close(false)}>
        <View style={styles.modalBox}>
          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalItem}
              onPress={() => {
                onSelect(item);
                close(false);
              }}
            >
              <Text style={styles.modalText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: COLORS.navy },

  imageBox: {
    backgroundColor: "#fff",
    height: 150,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: COLORS.saffron,
  },

  imageText: {
    marginTop: 8,
    color: "#666",
  },

  label: { marginBottom: 6, fontWeight: "600", color: COLORS.text },
  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    height: 90,
    textAlignVertical: "top",
    marginBottom: 16,
  },

  toggleBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  autoBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  submitBtn: {
    backgroundColor: COLORS.saffron,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#fff", fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "#fff", width: "80%", borderRadius: 12 },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalText: { fontSize: 16 },
});
