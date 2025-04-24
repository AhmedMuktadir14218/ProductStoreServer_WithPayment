import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dt8zif4if',
  api_key: '697438756667247',
  api_secret: 'EEwDxG2m6_BXyRnmnnTnu1NpJT8',
});

// Function to upload image to Cloudinary
export const uploadImage = (imageBase64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imageBase64, (result) => {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.secure_url);  // Return the Cloudinary URL
      }
    });
  });
};
