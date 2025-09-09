
# Rescue365 - README

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
**Rescue365** is a mobile and web application designed to connect bystanders, rescuers, veterinarians, and other volunteers to assist animals in need. The goal is to facilitate a streamlined, community-based approach to animal rescue by providing real-time notifications, donation capabilities, and progress tracking for each case.

## Features
- **User Registration and Authentication**: Allows users to register and log in securely.
- **Rescue Case Reporting**: Users can report animals in need, including location and condition.
- **Real-Time Updates**: Track rescue progress with real-time notifications.
- **Donation System**: Integrated payment system to fund rescue cases.
- **Multi-User Roles**: Support for various user roles, such as rescuers, veterinarians, and bystanders.

## Technologies Used
### Frontend
- **React Native** (for iOS and Android)
- **Expo Router** (for navigation)
- **Redux** (for state management)
- **React Native Paper** (for UI components)

### Backend
- **Firebase** (Firestore, Authentication, Cloud Functions, Storage)
- **Stripe Connect** (for handling donations)
- **Google Maps API** (for location services)

### DevOps
- **GitHub Actions** (for CI/CD)

### Testing
- **Jest** (unit testing)
- **Detox** (end-to-end testing)

## Getting Started
Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js** (version 14 or above)
- **Expo CLI**: Install Expo CLI globally by running:
  ```bash
  npm install -g expo-cli
  ```

### Installation

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/YourUsername/Rescue365.git](https://github.com/SantosZu/EC463SeniorDesign_Rescue365.git)
   cd Rescue365
   ```

2. **Navigate to the Frontend Directory**
   ```bash
   cd Frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Expo Development Server**
   ```bash
   npx expo start
   ```

### Running on Mobile
- Download **Expo Go** on your mobile device.
- Scan the QR code shown in the terminal after running `npx expo start` to load the app.

## Folder Structure
```plaintext
Rescue365
├── Frontend
│   ├── app
│   │   ├── index.js           # Home screen
│   │   ├── login.js           # Login screen
│   │   └── _layout.tsx        # Layout for expo-router
│   ├── assets                 # Images, icons, etc.
│   ├── redux                  # Redux state management setup
│   ├── components             # Reusable UI components
│   └── screens                # Additional screens for the app
├── Backend                    # Future backend setup for Firebase functions
└── README.md
```

## Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
   ```bash
   git checkout -b feature-name
   ```
3. Commit and push your changes.
   ```bash
   git commit -m "Add new feature"
   git push origin feature-name
   ```
4. Open a pull request.

## License
This project is licensed under the MIT License.
