# Finnish Study Cards

A Finnish learning tool built with React, TypeScript, Vite, Tailwind CSS, and Firebase Firestore.

## Features

- 📇 Flash cards with Finnish words on one side and English translations on the other
- 🔄 Flip animation on click/touch
- ➕ Add new cards with a modal form
- ✏️ Edit and delete existing cards
- 🏷️ Organize cards by categories
- 🔍 Autocomplete category selection
- 💾 Data persistence with Firebase Firestore

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Create a Firestore database
   - Copy your Firebase configuration
   - Create a `.env` file based on `.env.example` and add your Firebase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Models

### Card
- `id`: string (auto-generated)
- `finnishWord`: string
- `englishWord`: string
- `categoryId`: string
- `categoryName`: string (denormalized)
- `createdAt`: Date

### Category
- `id`: string (auto-generated)
- `name`: string

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Database

