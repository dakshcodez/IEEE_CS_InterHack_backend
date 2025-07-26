const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const wardrobeRoutes = require("./routes/wardrobeRoutes");
const stylistRoutes = require('./routes/stylistRoutes');
const suggestOutfitRoutes = require('./routes/suggestOutfitRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/wardrobe", wardrobeRoutes);
app.use('/stylist', stylistRoutes);
app.use('/suggest-outfit', suggestOutfitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});