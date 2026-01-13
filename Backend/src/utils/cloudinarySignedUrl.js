import { v2 as cloudinary } from "cloudinary";

export const getSignedPdfUrl = (publicId) => {
  const pdfUrl = cloudinary.url(publicId, {
    resource_type: "raw",
    sign_url: true,
    flags: "attachment:notes.pdf",
  });

  console.log("p", pdfUrl);
  return pdfUrl;
};
