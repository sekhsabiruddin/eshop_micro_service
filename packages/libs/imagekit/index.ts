import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_SECRET_KEY!,
  urlEndpoint: "https://ik.imagekit.io/sekhsabiruddin", // Your ImageKit URL endpoint
});
