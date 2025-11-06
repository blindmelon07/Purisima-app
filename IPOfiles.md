# HairStyle App 💇‍♀️

A React Native mobile application that uses AI to transform hairstyles in photos. Built with Expo, Firebase Authentication, and Cloudinary AI services.

## 🌟 Features

- **AI-Powered Transformations**: Replace and remove elements in photos using Cloudinary's generative AI
- **Real-time Processing**: Upload and transform images instantly
- **User Authentication**: Secure login/logout with Firebase Auth
- **Download Functionality**: Save transformed images to device
- **Modern UI**: Dark theme with gradient design and smooth animations

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React Native with Expo SDK 54
- **Authentication**: Firebase Auth
- **Image Processing**: Cloudinary AI APIs
- **State Management**: React Hooks (useState)
- **Navigation**: Expo Router
- **Image Picker**: Expo ImagePicker

## 📊 IPO Analysis

### **INPUT**
- User credentials (email/password)
- Images from device gallery
- AI transformation prompts
- User interactions (buttons, text input)
- Device permissions

### **PROCESS**
- Firebase authentication
- Image upload to Cloudinary
- AI transformation processing
- State management
- URL generation for downloads

### **OUTPUT**
- Authenticated user sessions
- Original and transformed images
- Download capabilities
- User feedback (alerts, loading states)
- Navigation between screens

## 🔄 System Flow Diagrams

### 1. Main Application Flow

```mermaid
flowchart TD
    A[User Login] --> B{Authentication}
    B -->|Success| C[Home Screen]
    B -->|Failure| A
    
    C --> D[Pick Image]
    D --> E{Permission Check}
    E -->|Denied| F[Permission Alert]
    E -->|Granted| G[Image Picker]
    
    G --> H[Image Selected]
    H --> I[Upload to Cloudinary]
    I --> J{Upload Success?}
    J -->|No| K[Upload Error Alert]
    J -->|Yes| L[Store Public ID]
    
    L --> M[Apply AI Transform]
    M --> N[Generate Replace URL]
    N --> O[Display Results]
    
    O --> P[Download Original]
    O --> Q[Download AI Transform] 
    O --> R[Download AI Remove]
    
    P --> S[Open in Browser]
    Q --> S
    R --> S
    
    C --> T[Logout]
    T --> U[Sign Out Firebase]
    U --> A
```

### 2. Component State Management

```mermaid
stateDiagram-v2
    [*] --> Initial
    Initial --> Loading : pickImage()
    Loading --> ImageUploaded : uploadSuccess
    Loading --> Error : uploadFailed
    
    ImageUploaded --> Processing : generateAI()
    Processing --> ResultsReady : transformComplete
    
    ResultsReady --> Downloading : downloadImage()
    Downloading --> ResultsReady : downloadComplete
    
    Error --> Initial : retry
    ResultsReady --> Initial : newImage
    
    Initial --> LoggedOut : logout()
    LoggedOut --> [*]
```

### 3. Data Flow Architecture

```mermaid
graph LR
    subgraph "Input Layer"
        UI[User Input]
        IMG[Image Selection]
        PERM[Permissions]
        PROMPTS[AI Prompts]
    end
    
    subgraph "Processing Layer"
        FB[Firebase Auth]
        CLD[Cloudinary Upload]
        AI[AI Processing]
        STATE[React State]
    end
    
    subgraph "Output Layer"
        DISPLAY[Image Display]
        DOWN[Download Links]
        ALERTS[User Alerts]
        NAV[Navigation]
    end
    
    UI --> FB
    IMG --> CLD
    PERM --> CLD
    PROMPTS --> AI
    
    FB --> STATE
    CLD --> AI
    CLD --> STATE
    AI --> STATE
    
    STATE --> DISPLAY
    STATE --> DOWN
    STATE --> ALERTS
    FB --> NAV
```

### 4. User Journey Map

```mermaid
journey
    title HairStyle App User Journey
    section Authentication
      Login with Email: 5: User
      Firebase Verification: 3: System
      Navigate to Home: 5: User
    
    section Image Upload
      Grant Permissions: 4: User
      Select Photo: 5: User
      Upload Processing: 2: System
      Cloudinary Storage: 3: System
    
    section AI Transformation
      Set Prompts: 4: User
      AI Processing: 2: System
      Generate Results: 4: System
      Display Images: 5: User
    
    section Download
      Choose Image: 5: User
      Open Browser: 4: System
      Save to Device: 5: User
```

### 5. Detailed Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Home Component
    participant FB as Firebase Auth
    participant IP as ImagePicker
    participant CL as Cloudinary
    participant AI as AI Service
    participant BR as Browser
    
    U->>UI: Launch App
    UI->>FB: Check Auth Status
    FB-->>UI: User Authenticated
    
    U->>UI: Tap Pick Image
    UI->>IP: Request Permission
    IP-->>UI: Permission Granted
    UI->>IP: Launch Image Library
    IP-->>UI: Image Selected
    
    UI->>CL: Upload Image
    CL-->>UI: Return Public ID & URL
    
    UI->>AI: Generate Transform (publicId + prompts)
    AI-->>UI: Return Transform URL
    
    UI->>U: Display Results
    
    U->>UI: Tap Download
    UI->>BR: Open Image URL
    BR-->>U: Download Image
    
    U->>UI: Tap Logout
    UI->>FB: Sign Out
    FB-->>UI: Logout Success
    UI->>U: Navigate to Login
```

### 6. Component Architecture

```mermaid
graph TB
    subgraph "Home Component"
        STATE[React State Management]
        HOOKS[useState Hooks]
        HANDLERS[Event Handlers]
    end
    
    subgraph "External Services"
        FB[Firebase Auth]
        CLD[Cloudinary API]
        IP[Expo ImagePicker]
        LNK[React Native Linking]
    end
    
    subgraph "UI Elements"
        HEADER[Header Section]
        WELCOME[Welcome Card]
        INPUTS[Input Section]
        UPLOAD[Upload Button]
        RESULTS[Results Grid]
        DOWNLOAD[Download Buttons]
    end
    
    STATE --> HOOKS
    HOOKS --> HANDLERS
    
    HANDLERS --> FB
    HANDLERS --> CLD
    HANDLERS --> IP
    HANDLERS --> LNK
    
    STATE --> HEADER
    STATE --> WELCOME
    STATE --> INPUTS
    STATE --> UPLOAD
    STATE --> RESULTS
    STATE --> DOWNLOAD
```

### 7. Error Handling Flow

```mermaid
flowchart TD
    START[User Action] --> CHECK{Validation}
    CHECK -->|Valid| PROCESS[Process Request]
    CHECK -->|Invalid| ERROR1[Show Validation Error]
    
    PROCESS --> NET{Network Available?}
    NET -->|No| ERROR2[Network Error Alert]
    NET -->|Yes| API[API Call]
    
    API --> RESP{API Response}
    RESP -->|Success| SUCCESS[Update UI State]
    RESP -->|Error| ERROR3[API Error Alert]
    
    ERROR1 --> RETRY[Allow Retry]
    ERROR2 --> RETRY
    ERROR3 --> RETRY
    
    RETRY --> START
    SUCCESS --> END[Complete]
```

### 8. State Variables Management

```mermaid
graph LR
    subgraph "State Variables"
        IMG[image: string]
        GEN[generativeUrl: string]
        REM[removeUrl: string]
        PID[publicId: string]
        UPL[uploading: boolean]
        FROM[fromPrompt: string]
        TO[toPrompt: string]
    end
    
    subgraph "User Actions"
        PICK[Pick Image]
        UPLOAD[Upload Process]
        TRANSFORM[AI Transform]
        REMOVE[AI Remove]
        DOWN[Download]
    end
    
    PICK --> UPL
    UPLOAD --> IMG
    UPLOAD --> PID
    TRANSFORM --> GEN
    REMOVE --> REM
    
    FROM --> TRANSFORM
    TO --> TRANSFORM
    FROM --> REMOVE
    
    IMG --> DOWN
    GEN --> DOWN
    REM --> DOWN
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Expo Go app on your mobile device
- Firebase project setup
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HairStyleApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Set up Firebase configuration in `firebaseConfig.js`
   - Configure Cloudinary credentials in `components/cloudinary.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device**
   - Scan QR code with Expo Go app
   - Or use `npm run android` / `npm run ios`

## 📱 App Structure

```
HairStyleApp/
├── app/
│   ├── home.tsx          # Main app screen
│   ├── index.tsx         # Login screen
│   └── _layout.tsx       # App layout
├── components/
│   ├── cloudinary.js     # Cloudinary upload
│   └── cloudinaryGen.js  # AI transformations
├── firebaseConfig.js     # Firebase setup
└── package.json          # Dependencies
```

## 🎨 UI Components

### Home Screen Features
- **Header**: App title, subtitle, logout button
- **Welcome Card**: User greeting with email
- **Input Section**: AI transformation prompts
- **Upload Button**: Image selection with loading states
- **Results Grid**: Original and transformed images
- **Download Buttons**: Individual download for each image

### Styling
- **Dark Theme**: Modern dark slate background
- **Gradient Headers**: Blue to purple gradient
- **Card Design**: Elevated cards with shadows
- **Responsive Layout**: Adapts to different screen sizes

## 🔧 Configuration

### Firebase Setup
```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase configuration
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Cloudinary Setup
```javascript
// components/cloudinary.js
const CLOUDINARY_URL = 'your-cloudinary-url';
const UPLOAD_PRESET = 'your-upload-preset';
```

## 🛠️ Key Dependencies

- **expo**: ~54.0.0
- **react-native**: 0.76.3
- **firebase**: ^11.0.2
- **expo-image-picker**: ~16.0.2
- **expo-router**: ~4.0.9
- **react-native-reanimated**: ~4.1.1
- **react-native-worklets**: 0.5.1

## 📖 API Reference

### Main Functions

#### `pickImage()`
- Requests camera roll permissions
- Launches image library
- Handles image selection and upload

#### `uploadImage(uri: string)`
- Uploads image to Cloudinary
- Stores public ID for transformations
- Generates AI-transformed images

#### `downloadImage(imageUri: string, imageName: string)`
- Opens image URL in browser
- Enables image download/save

#### `logout()`
- Signs out from Firebase
- Navigates back to login screen

## 🔒 Security Features

- **Firebase Authentication**: Secure user login/logout
- **Cloudinary Secure URLs**: Protected image storage
- **Permission Handling**: Proper camera roll access
- **Error Handling**: Comprehensive error management

## 🎯 Future Enhancements

- [ ] Multiple image transformations
- [ ] Social sharing capabilities
- [ ] User profile management
- [ ] Image history and favorites
- [ ] Offline mode support
- [ ] Push notifications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact:
- Email: support@hairstyleapp.com
- GitHub Issues: [Create an issue](../../issues)

---

**Built with ❤️ using React Native and Expo**