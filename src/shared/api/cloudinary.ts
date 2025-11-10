const CLOUDINARY_CLOUD_NAME = 'diafvhvqj';
const CLOUDINARY_UPLOAD_PRESET = 'hr-platform-resumes';

/**
 * Завантажує файл (резюме) на Cloudinary
 * @param file - Файл, обраний користувачем (з input)
 * @returns Повертає URL завантаженого файлу
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Could not upload file');
        }

        const data = await response.json();
        return data.secure_url; // Повертаємо безпечне URL файлу
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};