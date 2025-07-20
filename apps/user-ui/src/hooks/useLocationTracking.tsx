"use client";
import { useEffect, useState } from "react";

// Constants
const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

// Helper to retrieve location from localStorage
const getStoredLocation = () => {
  const storedData = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!storedData) return null;

  const parsedData = JSON.parse(storedData);
  const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 20 days
  const isExpired = Date.now() - parsedData.timestamp > expiryTime;

  return isExpired ? null : parsedData;
};

// Custom hook to track user location
const useLocationTracking = () => {
  const [location, setLocation] = useState<{
    country: string;
    city: string;
  } | null>(getStoredLocation());

  useEffect(() => {
    if (location) return;

    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((data) => {
        const newLocation = {
          country: data?.country,
          city: data.city,
          timestamp: Date.now(),
        };

        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
        setLocation({ country: newLocation.country, city: newLocation.city });
      });
  }, []);

  return location;
};
export default useLocationTracking;
