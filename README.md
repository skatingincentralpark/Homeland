# Homeland

A social media web app made using the MERN stack, with SocketIO & Cloudinary integration ✨

## Technologies

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node](https://nodejs.org/en/)
- [Redux](https://redux.js.org/)
- [SocketIO](https://socket.io/)
- [Cloudinary](https://www.cloudinary.com/)

## Features

- App wide state management with Redux + Toolkit
- SocketIO for real-time updates between users
- Full CRUD with MongoDB – users, profiles, posts, comments, likes, messages
- Cloudinary to handle image uploads, storage and optimized delivery
- Skeleton Loading and Vanilla CSS

## Demo

[https://dry-caverns-40340.herokuapp.com/](https://dry-caverns-40340.herokuapp.com/)

## Project Setup

1. Create a default.json and production.json file in the root of your project. Both files should contain:

   ```json
   {
     "mongoURI": YOUR_MONGO_URI,
     "jwtSecret": YOUR_SECRET_TOKEN,
     "cloudName": YOUR_CLOUD_NAME,
     "apiKey": YOUR_API_SECRET,
     "apiSecret": YOUR_API_SECRET
   }
   ```

2. Install all required dependencies.

   ```
   npm install
   ```

3. Start the application.

   ```
   npm run dev
   ```
