import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export default function IssueDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const issueId = params.id;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchIssueDetails();
  }, []);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/issues/${issueId}`);
      setIssue(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/issues/${issueId}/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Thank you for your feedback!");
      setShowFeedback(false);
      fetchIssueDetails();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to submit feedback");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "#FFA500";
      case "ACKNOWLEDGED":
        return "#1E90FF";
      case "IN_PROGRESS":
        return "#9370DB";
      case "RESOLVED":
        return "#32CD32";
      case "REJECTED":
        return "#FF4500";
      default:
        return "#999";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "paper-plane";
      case "ACKNOWLEDGED":
        return "checkmark-circle";
      case "IN_PROGRESS":
        return "construct";
      case "RESOLVED":
        return "checkmark-done-circle";
      case "REJECTED":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Issue not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Issue Info Card */}
        <View style={styles.card}>
          <View style={styles.statusBadge}>
            <Ionicons
              name={getStatusIcon(issue.status)}
              size={20}
              color={getStatusColor(issue.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
              {issue.status}
            </Text>
          </View>

          <Text style={styles.category}>{issue.category}</Text>
          <Text style={styles.description}>{issue.description}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.infoText}>{issue.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="flag" size={16} color="#666" />
            <Text style={styles.infoText}>Priority: {issue.priority}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>
              Reported: {new Date(issue.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Before Photo */}
        {issue.image && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reported Issue Photo</Text>
            <Image
              source={{ uri: `${API_URL}/uploads/${issue.image}` }}
              style={styles.issueImage}
            />
          </View>
        )}

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress Timeline</Text>
          {issue.timeline && issue.timeline.length > 0 ? (
            issue.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: getStatusColor(item.stage) },
                  ]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStage}>{item.stage}</Text>
                  <Text style={styles.timelineNote}>{item.note}</Text>
                  <Text style={styles.timelineDate}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No timeline updates yet</Text>
          )}
        </View>

        {/* Resolution Proof */}
        {issue.status === "RESOLVED" && issue.resolvedImage && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resolution Proof (After Photo)</Text>
            <Image
              source={{ uri: `${API_URL}/uploads/${issue.resolvedImage}` }}
              style={styles.issueImage}
            />
            {issue.resolvedNote && (
              <Text style={styles.resolvedNote}>{issue.resolvedNote}</Text>
            )}
          </View>
        )}

        {/* Feedback Section */}
        {issue.status === "RESOLVED" && !issue.feedback && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rate This Resolution</Text>
            <Text style={styles.feedbackPrompt}>
              How satisfied are you with the resolution?
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={40}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Additional Comments (Optional)</Text>
            <View style={styles.textAreaContainer}>
              <Text
                style={styles.textArea}
                onPress={() => {
                  Alert.prompt(
                    "Feedback Comment",
                    "Enter your feedback",
                    (text) => setComment(text),
                    "plain-text",
                    comment
                  );
                }}
              >
                {comment || "Tap to add comments..."}
              </Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback}>
              <Text style={styles.submitBtnText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show Existing Feedback */}
        {issue.feedback && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Feedback</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= issue.feedback.rating ? "star" : "star-outline"}
                  size={30}
                  color="#FFD700"
                />
              ))}
            </View>
            {issue.feedback.comment && (
              <Text style={styles.feedbackComment}>{issue.feedback.comment}</Text>
            )}
            <Text style={styles.feedbackDate}>
              Submitted: {new Date(issue.feedback.submittedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: COLORS.navy,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },

  statusText: {
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 14,
  },

  category: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    lineHeight: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 12,
  },

  issueImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },

  timelineContent: {
    flex: 1,
  },

  timelineStage: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 4,
  },

  timelineNote: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },

  timelineDate: {
    fontSize: 12,
    color: "#999",
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },

  resolvedNote: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },

  feedbackPrompt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 8,
  },

  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    marginBottom: 16,
  },

  textArea: {
    fontSize: 14,
    color: "#333",
  },

  submitBtn: {
    backgroundColor: COLORS.navy,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  feedbackComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    fontStyle: "italic",
  },

  feedbackDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});