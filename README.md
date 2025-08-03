# Style Me - AI Wardrobe Stylist

Style Me is a full-stack web application that helps users manage their wardrobe, get AI-powered outfit suggestions, chat with a virtual stylist, and analyze clothing images using generative AI.

## Features

- **Wardrobe Management:** Add, edit, delete, and filter clothing items.
- **AI Stylist Chat:** Ask fashion questions and get personalized advice.
- **Outfit Suggestions:** Receive AI-generated outfit ideas for any occasion.
- **Image Analysis:** Upload clothing images and ask questions about them.
- **Modern UI:** Responsive frontend built with React and Tailwind CSS.

## Project Structure

```
backend/
  index.js
  controllers/
  models/
  routes/
  config/
  serviceAccountKey.json
  .env
  package.json
frontend/
  wardrobe-stylist-frontend/
    src/
    public/
    package.json
    README.md
    tailwind.config.js
    postcss.config.js
new-frontend/
  index.html
  landing.html
```

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment:**
   - Add your Google Gemini API key to `.env` as `GEMINI_API_KEY`.
   - Add Firebase service account credentials to `serviceAccountKey.json`.
3. **Run the server:**
   ```sh
   node index.js
   ```
   The backend runs on `http://localhost:3000`.

### Frontend

1. **Navigate to frontend directory:**
   ```sh
   cd wardrobe-stylist-frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   The frontend runs on `http://localhost:3000` by default.

## API Endpoints

- `GET /wardrobe/:uid` - Get user's wardrobe
- `POST /wardrobe/:uid/add` - Add item to wardrobe
- `DELETE /wardrobe/:uid/removeItem/:itemId` - Remove item
- `PUT /wardrobe/:uid/updateItem/:itemId` - Update item
- `POST /stylist/:uid` - Chat with AI stylist
- `POST /suggest-outfit/:uid` - Get outfit suggestion
- `POST /vision/image` - Analyze uploaded image

## Technologies Used

- **Backend:** Node.js, Express, Firebase Firestore, Google Generative AI (Gemini)
- **Frontend:** React, Tailwind CSS, Lucide Icons

## License

This project is licensed under the ISC License.

## Author

- [dakshcodez](https://github.com/dakshcodez)

---

For more details, see the code in [index.js](index.js), [wardrobeController.js](controllers/wardrobeController.js), and

