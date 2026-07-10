const Background = require("../models/Background");

// Get all backgrounds
const getBackgrounds = async (req, res) => {
  try {
    const backgrounds = await Background.find().sort({ order: 1 });
    res.json(backgrounds);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add background
const addBackground = async (req, res) => {
  try {
    const background = new Background({
      image: `/uploads/backgrounds/${req.file.filename}`,
      title: req.body.title,
      order: req.body.order || 0,
      isActive: true,
    });

    const saved = await background.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete background
const deleteBackground = async (req, res) => {
  try {
    await Background.findByIdAndDelete(req.params.id);

    res.json({
      message: "Background deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getBackgrounds,
  addBackground,
  deleteBackground,
};