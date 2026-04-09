import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dxnyjz5sh",
  api_key: "132718588123699",
  api_secret: "cPsmiZOTjAbrHfqoBH1SfcUxNcU",
});

console.log("Cloudinary Config Loaded:", cloudinary.config());

export default cloudinary;