router.get("/:userId", async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load notifications" });
  }
});
