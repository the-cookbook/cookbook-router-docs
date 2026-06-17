import path from "node:path";
import sharp from "sharp";

const source = path.resolve("src/assets/harpy-docs.png");
const destination = path.resolve("src/app/icon.png");
const appleDestination = path.resolve("src/app/apple-icon.png");

async function createFavicon() {
  await sharp(source)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(destination);

  await sharp(source)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(appleDestination);

  console.log(`Created ${destination}`);
  console.log(`Created ${appleDestination}`);
}

createFavicon().catch((error) => {
  console.error("Failed to create favicon:", error);
  process.exitCode = 1;
});
