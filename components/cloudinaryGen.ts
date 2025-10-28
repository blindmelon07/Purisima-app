import { Cloudinary } from "@cloudinary/url-gen";
import { generativeReplace, generativeRemove } from "@cloudinary/url-gen/actions/effect";
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";

const cld = new Cloudinary({
  cloud: {
    cloudName: "deh1tsnix", // your cloud name
  },
});

export function getGenerativeReplaceUrl(publicId: string, from: string, to: string) {
  // More conservative approach - only replace hair while preserving face
  const improvedToPrompt = to.includes('same person') ? to : `${to}, keep same person, preserve face`;
  
  return cld
    .image(publicId)
    .effect(generativeReplace().from(from).to(improvedToPrompt).preserveGeometry(true))
    .toURL();
}

// Generate a URL with generativeRemove effect
export function getGenerativeRemoveUrl(publicId: string, removeWhat: string) {
  return cld
    .image(publicId)
    .effect(generativeRemove().prompt(removeWhat))
    .toURL();
}