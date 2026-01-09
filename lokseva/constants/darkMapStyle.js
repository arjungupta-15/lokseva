export const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9aa0a6" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f1f1f" }] },

  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },

  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },

  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }],
  },
];