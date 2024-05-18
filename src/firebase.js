import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import env from "./env";

const firebaseConfig = {
  apiKey: "AIzaSyBl34opQyIA0DwpajWKnNAkZu4mRY9Sj7s",
  authDomain: "ruxi-cc7de.firebaseapp.com",
  projectId: "ruxi-cc7de",
  storageBucket: "ruxi-cc7de.appspot.com",
  messagingSenderId: "137292489911",
  appId: "1:137292489911:web:21bb0bd37a71f4eea59932",
  measurementId: "G-V0DG7V5M8N",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const uploadImageToAuctionItem = async (auctionItemId, file) => {
  const auctionItemRef = ref(
    storage,
    `${env.auctionCreatorAddress}/${auctionItemId}/${file.name}`
  );
  await uploadBytes(auctionItemRef, file);
  const uploadedFileRef = ref(storage, auctionItemRef.fullPath);
  return getDownloadURL(uploadedFileRef);
};
