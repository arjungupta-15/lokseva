import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/image.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>LokSeva</Text>
      <Text style={styles.subtitle}>
        Crowdsourced Civic Issue Reporting
      </Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push("/report")}
      >
        <Text style={styles.btnText}>➕ Report an Issue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.secondaryText}>🗺 View City Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.navy,
  },
  subtitle: {
    color: COLORS.text,
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: COLORS.saffron,
    padding: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: COLORS.green,
    padding: 14,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  secondaryText: {
    color: COLORS.green,
    fontWeight: "700",
  },
});
