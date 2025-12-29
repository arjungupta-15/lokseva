import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from "react";

export default function Report() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        LokSeva – Samasya Report
      </Text>

      <TouchableOpacity onPress={takePhoto} style={{ marginTop: 20 }}>
        <Text>📷 Photo Capture</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={getLocation} style={{ marginTop: 20 }}>
        <Text>📍 Get Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Alert.alert("Submitted", "Complaint submitted (dummy)")}
        style={{
          backgroundColor: "#1E40AF",
          padding: 16,
          borderRadius: 8,
          marginTop: 40
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Submit Complaint
        </Text>
      </TouchableOpacity>
    </View>
  );
}