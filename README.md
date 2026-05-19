# 👁️✨ Drishti AI - Advanced Ocular Health & AR Platform

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-00B2A0?style=for-the-badge&logo=google&logoColor=white)](https://mediapipe.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**Bridging the gap between preventative digital healthcare and consumer utility.**

<br />

[![Live Demo](https://img.shields.io/badge/View_Live_Project-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://drishti-live-129481.web.app)

*(Replace `https://drishti-live-129481.web.app` with your actual deployed link)*

</div>

<br />

![Drishti Hero Image](docs/assets/hero_banner.png) 

---

## 📖 Table of Contents
- [The Vision](#-the-vision)
- [Core Features](#-core-features)
- [Gallery & UI](#-gallery--ui)
- [Privacy-First Architecture](#-privacy-first-architecture)
- [Technology Stack](#-technology-stack)
- [Quick Start Guide](#-quick-start-guide)

---

## 🎯 The Vision

With global screen time reaching unprecedented highs, **Computer Vision Syndrome (CVS)** and digital eye strain have become modern epidemics. 

**Drishti** is a premium, real-time digital wellness application designed to combat CVS directly in the browser. By combining advanced computer vision, facial mapping, and AR integrations, Drishti acts as a persistent co-pilot for your ocular health. It monitors visual ergonomics, tracks biometric metrics via rPPG, offers interactive eyewear fittings, and routes users to hyper-local medical professionals when intervention is needed.

---

## ⚡ Core Features

### 👁️ Zero-Latency Biometric Tracking (MediaPipe)
- Utilizes Google's **MediaPipe FaceMesh** to track Eye Aspect Ratio (EAR) at 30+ FPS.
- Calculates real-time distance from the screen to enforce ergonomic compliance.
- Automatically flags fatigue when blink frequencies drop below healthy clinical thresholds.

### 👓 AR Virtual Specs Mirror (Frame Fit)
- Seamless Augmented Reality try-on experience for eyewear.
- Features real-time **Pupillary Distance (PD) estimation** and dynamic 2D canvas overlays that map perfectly to the user's facial topography.

### 💓 rPPG Simulation & Health Dashboard
- Simulated remote photoplethysmography (rPPG) metrics estimating pulse rate dynamically.
- Hourly screen time versus break metrics graphed in an intuitive, dark-mode clinical dashboard.
- Global dashboard clock synchronization for automated 20-20-20 rule reminders.

### 🏥 Hyper-Local Healthcare Integration
- Geolocation-powered routing to nearby Eye Care Centers and hospitals.
- Visualizes clinics within a 10km radius, displaying real-time operational status (Open/Closed) and direct navigation links.

### 🌐 Global Accessibility (i18n)
- Seamless, real-time translation toggling between **English** and **Hindi**, ensuring accessibility for rural and diverse user bases.

---

## 🖼️ Gallery & UI

*(Replace the paths below with screenshots of your actual application)*

<div align="center">
  <img src="docs/assets/dashboard.png" alt="Clinical Dashboard" width="800"/>
  <p><i>Real-time ocular metrics tracking, fatigue charts, and rPPG heart rate index.</i></p>

  <br />

  <img src="docs/assets/virtual_mirror.png" alt="AR Virtual Mirror" width="800"/>
  <p><i>AR-powered specs try-on overlay with automatic tracking and scaling.</i></p>
</div>

---

## 🔒 Privacy-First Architecture

> **Your face is your data.** Drishti is built with a strict adherence to privacy. 

All raw camera streams and FaceMesh calculations are processed **100% locally within the client's browser**. No video data, facial images, or identifying frames are ever transmitted to or stored on external servers. Only anonymous aggregate metrics (e.g., session length, average distance) are securely synced.

---

## 💻 Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React.js, Vite |
| **Styling & UI** | Tailwind CSS, Framer Motion, Glassmorphism UI |
| **Computer Vision** | Google MediaPipe (FaceMesh API), HTML5 Canvas |
| **Backend & Auth** | Firebase (Hosting, Firestore, Authentication) |
| **Internationalization** | `react-i18next` (en/hi) |

---

## 🚀 Quick Start Guide

Follow these steps to set up and run Drishti locally on your machine.

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- A functional web camera 

### 1. Clone the Repository
```bash
git clone [https://github.com/arooshdatta/DRISHTI.git](https://github.com/arooshdatta/DRISHTI.git)
cd Drishti/frontend
```

### 2. Environment Configuration
Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Populate it with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=drishti-live-129481
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to initialize the tracking engine.