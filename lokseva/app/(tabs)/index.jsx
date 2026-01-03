import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

const dummyComplaints = [
  {
    id: "1",
    title: "Street light not working",
    status: "Raised",
    area: "Ward 12"
  },
  {
    id: "2",
    title: "Garbage overflow",
    status: "In Progress",
    area: "Ward 5"
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        LokSeva
      </Text>
      <Text style={{ color: "#555", marginBottom: 16 }}>
        Aapki gali, aapki awaaz
      </Text>

      {/* Report Button */}
      <TouchableOpacity
        onPress={() => router.push("/report")}
        style={{
          backgroundColor: "#1E40AF",
          padding: 16,
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          Samasya Report Kare
        </Text>
      </TouchableOpacity>

      {/* Complaint List */}
      <FlatList
        data={dummyComplaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderRadius: 8,
              backgroundColor: "#F3F4F6",
              marginBottom: 10
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>Status: {item.status}</Text>
            <Text>{item.area}</Text>
          </View>
        )}
      />
    </View>
  );
}
