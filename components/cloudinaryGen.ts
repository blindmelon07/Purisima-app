import { Cloudinary } from "@cloudinary/url-gen";
import { generativeReplace, generativeRemove } from "@cloudinary/url-gen/actions/effect";
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";

const cld = new Cloudinary({
  cloud: {
    cloudName: "deh1tsnix", // your cloud name
  },
});

export function getGenerativeReplaceUrl(publicId: string, from: string, to: string) {
  // Very specific prompt to only change hair, preserve everything else
  const conservativePrompt = `${to}, keep same face, preserve facial features, same skin tone, same person identity, only change hair`;
  
  return cld
    .image(publicId)
    .effect(generativeReplace().from(from).to(conservativePrompt).preserveGeometry(true))
    .toURL();
}

// Generate a URL with generativeRemove effect
export function getGenerativeRemoveUrl(publicId: string, removeWhat: string) {
  return cld
    .image(publicId)
    .effect(generativeRemove().prompt(removeWhat))
    .toURL();
}