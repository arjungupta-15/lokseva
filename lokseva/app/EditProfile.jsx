import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

export default function EditProfile() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profilePic, setProfilePic] = useState("");

    // Load saved user from LocalStorage
    useEffect(() => {
        AsyncStorage.getItem("user").then((u) => {
            if (u) {
                const user = JSON.parse(u);
                setName(user.name || "");
                setPhone(user.phone || "");
                setAddress(user.address || "");
                setProfilePic(user.profilePic || "");
            }
        });
    }, []);

    const saveChanges = async () => {
        console.log("SAVING...");
        console.log("URL:", `${API_URL}/api/auth/update`);
        try {
            const token = await AsyncStorage.getItem("token");
            console.log("TOKEN:", token);

            const res = await fetch(`${API_URL}/api/auth/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone, address }),
            });

            const data = await res.json();
            console.log("RESPONSE:", data);

            if (!data.success) {
                Alert.alert("Error", "Something went wrong");
                return;
            }

            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            Alert.alert("Success", "Profile Updated!");
        } catch (err) {
            console.log("SAVE ERROR:", err);
            Alert.alert("Error", "Failed to update");
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadProfilePic(result.assets[0].uri);
        }
    };

    const uploadProfilePic = async (imageUri) => {
        try {
            const token = await AsyncStorage.getItem("token");

            let formData = new FormData();
            formData.append("profilePic", {
                uri: imageUri,
                name: "profile.jpg",
                type: "image/jpg",
            });

            const res = await fetch(`${API_URL}/api/profile/upload-pic`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                let user = await AsyncStorage.getItem("user");
                user = JSON.parse(user);
                user.profilePic = data.profilePic;
                await AsyncStorage.setItem("user", JSON.stringify(user));

                Alert.alert("Success", "Profile photo updated!");
            } else {
                Alert.alert("Error", "Upload failed");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <View style={styles.container}>

            {/* 🔙 Back Button  */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={26} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage} style={styles.photoBtn}>
                <Text style={{ color: "white", fontWeight: "600" }}>
                    Upload Profile Photo
                </Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
                <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, // 👈 Top spacing fixed
        paddingHorizontal: 20,
        backgroundColor: "#f7f7f7",
    },

    backBtn: {
        position: "absolute",
        top: 20,
        left: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
    },

    input: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },

    saveBtn: {
        marginTop: 10,
        backgroundColor: "#ff9500",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },

    saveText: {
        fontSize: 17,
        color: "#fff",
        fontWeight: "700",
    },
});
