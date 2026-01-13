import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

export default function EditProfile() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(false);

    // Load saved user from LocalStorage
    useEffect(() => {
        AsyncStorage.getItem("user").then((u) => {
            if (!u) return;

            let user = {};
            try {
                user = JSON.parse(u);
            } catch {
                user = {};
            }

            setName(user?.name ?? "");
            setPhone(user?.phone ?? "");
            setAddress(user?.address ?? "");
            setProfilePic(user?.profilePic ?? "");
        });
    }, []);

    const saveChanges = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone, address }),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert("Error", data.message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Update local storage properly
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            Alert.alert("Success", "Profile Updated!");
            setLoading(false);
            router.push("/(tabs)/profile");

        } catch (err) {
            setLoading(false);
            Alert.alert("Error", "Network error. Please try again.");
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (result?.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setProfilePic(uri);
            uploadProfilePic(uri);
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
            Alert.alert("Error", "Upload failed");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={26} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Edit Profile</Text>

            {profilePic ? (
                <Image
                    source={{ 
                        uri: profilePic.startsWith("http") || profilePic.startsWith("file://") 
                            ? profilePic 
                            : `${API_URL}${profilePic}` 
                    }}
                    style={styles.profileImage}
                />
            ) : null}

            <TouchableOpacity onPress={pickImage} style={styles.photoBtn}>
                <Ionicons name="camera-outline" size={24} color="black" style={{ marginRight: 8 }} />
                <Text style={styles.photoBtnText}>Upload Profile Photo</Text>
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

            <TouchableOpacity 
                style={[styles.saveBtn, loading && styles.saveBtnDisabled]} 
                onPress={saveChanges}
                disabled={loading}
            >
                <Text style={styles.saveText}>
                    {loading ? "Saving..." : "Save Changes"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
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

    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#ccc",
    },

    photoBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },

    photoBtnText: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
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

    saveBtnDisabled: {
        backgroundColor: "#ccc",
    },

    saveText: {
        fontSize: 17,
        color: "#fff",
        fontWeight: "700",
    },
});