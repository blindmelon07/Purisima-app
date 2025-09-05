// Cloudinary upload helper for React Native/Expo
// Replace YOUR_CLOUD_NAME and YOUR_UNSIGNED_PRESET with your Cloudinary details

export async function uploadToCloudinary(uri: string) {
  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  data.append('upload_preset', 'purisima');

  const res = await fetch('https://api.cloudinary.com/v1_1/deh1tsnix/image/upload', {
    method: 'POST',
    body: data,
  });

  if (!res.ok) {
    throw new Error('Upload failed: ' + (await res.text()));
  }
  return res.json();
}
