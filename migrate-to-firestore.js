// scripts/migrate-navigation.js
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBqRTkZ3gCslH4eStIsLoObIQAn6jrIbEs",
  authDomain: "reactmalaysia-6b2a1.firebaseapp.com",
  projectId: "reactmalaysia-6b2a1",
  storageBucket: "reactmalaysia-6b2a1.appspot.com",
  messagingSenderId: "864760495911",
  appId: "1:864760495911:web:66f65f4ac87b2fe0a3b302",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultNavigation = {
  logo: "/logo.png", // will be replaced via CMS upload

  navigationLinks: [
    { label: "Home", href: "/", visible: true },
    { label: "About", href: "/AboutUs", visible: true },
    { label: "Projects", href: "/services", visible: true },
    { label: "News & Blogs", href: "/blogs", visible: true },
    { label: "Contact", href: "/ContactUs", visible: true },
  ],

  footerQuickLinks: [
    { label: "Home", href: "/", visible: true },
    { label: "Projects", href: "/services", visible: true },
    { label: "FAQ's", href: "/FAQs", visible: true },
  ],

  footerSupportLinks: [
    { label: "Blogs", href: "/Blogs", visible: true },
    { label: "About Us", href: "/AboutUs", visible: true },
    { label: "Contact Us", href: "/ContactUs", visible: true },
  ],

  footerBottomLinks: [
    { label: "Privacy Policy", href: "/privacy", visible: true },
    { label: "Contact", href: "/ContactUs", visible: true },
  ],

  copyright: `© ${new Date().getFullYear()} ReAct. All rights reserved`,
};

async function migrateNavigation() {
  try {
    await setDoc(doc(db, "cms", "navigation"), defaultNavigation);
    console.log("✅ Navigation & Footer content migrated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

migrateNavigation();
