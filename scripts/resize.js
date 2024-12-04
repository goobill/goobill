import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

// Maximum width and height for resized images
const MAX_SIZE = 700;

async function resizeImages(directory) {
    try {
        const files = await fs.readdir(directory);

        for (const file of files) {
            const inputFile = join(directory, file);

            // Check if the file is an image
            if (/\.(jpg|jpeg|png|webp|gif|tiff)$/i.test(file)) {
                console.log(`Processing ${file}...`);

                // Resize and overwrite the image
                const buffer = await sharp(inputFile)
                    .resize({
                        width: MAX_SIZE,
                        height: MAX_SIZE,
                        fit: 'inside',
                        withoutEnlargement: true // Prevent enlarging smaller images
                    })
                    .toBuffer();
                sharp(buffer).toFile(inputFile);

                console.log(`Resized and overwrote ${file}`);
            } else {
                console.log(`${file} is not an image. Skipping.`);
            }
        }
    } catch (err) {
        console.error('Error processing images:', err);
    }
}

resizeImages("docs/assets");
