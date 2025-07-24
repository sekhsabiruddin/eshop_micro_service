import { atom } from "jotai";

// This defines the current active sidebar item as a string (e.g., route or identifier)
export const activeSideBarItem = atom<string>("");
