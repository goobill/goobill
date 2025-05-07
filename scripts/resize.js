import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join, extname, basename } from 'path';

const SIZES = [
    { suffix: 'small', width: 640 },
    { suffix: 'medium', width: 1920 },
    { suffix: 'large', width: 2400 },
];

async function resizeImages(directory) {
    try {
        const files = await fs.readdir(directory);

        for (const file of files) {
            const inputFile = join(directory, file);

            // Check if the file is an image
            if (/\.(jpg|jpeg|png)$/i.test(file)) {
                console.log(`Processing ${file}...`);
                const ext = extname(file);
                const name = basename(file, ext);

                for (const size of SIZES) {
                    const outputFile = join(directory, `${name}_${size.suffix}${ext}`);
                    await sharp(inputFile)
                        .resize({
                            width: size.width,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .toFile(outputFile);
                    console.log(`Created ${outputFile}`);
                }
            } else {
                console.log(`${file} is not an image. Skipping.`);
            }
        }
    } catch (err) {
        console.error('Error processing images:', err);
    }
}

resizeImages('docs/assets');
