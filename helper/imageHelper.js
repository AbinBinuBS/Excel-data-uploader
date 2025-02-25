import path from "path"
import fs from "fs"


export const findImage = (itemId) => {
    const imageFolder = path.join(process.cwd(), "images", itemId.toString()); 
    if (!fs.existsSync(imageFolder)) {
        return null; 
    }
    const files = fs.readdirSync(imageFolder);
    const imageFiles = files.filter(file => 
        file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
    );
    return imageFiles.length > 0 
        ? imageFiles.map(file => `images/${itemId}/${file}`) 
        : null;
};
