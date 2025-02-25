import XLSX from "xlsx"
import fs from "fs"
import Item from '../model/itemModel.js'
import { findImage } from "../helper/imageHelper.js"

export const UploadService = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        for (const row of data) {
            const itemId = row.ITEMID ? row.ITEMID.toString() : null;
            if (!itemId) continue; 
            const imagePaths = findImage(itemId); 
            let existingItem = await Item.findOne({ name: row.NAME });
            if (existingItem) {
                let variantIndex = existingItem.variants.findIndex(variant => variant.itemId.toString() === itemId.toString());
                if (variantIndex !== -1) {
                    existingItem.variants[variantIndex].itemName = row["ITEM NAME"] || existingItem.variants[variantIndex].itemName;
                    existingItem.variants[variantIndex].quantity = Number(row["QUANTITY"]) || existingItem.variants[variantIndex].quantity;
                    existingItem.variants[variantIndex].images = imagePaths && imagePaths.length > 0 ? imagePaths : existingItem.variants[variantIndex].images;
                    existingItem.variants[variantIndex].hsnCode = row["HSN CODE"] || existingItem.variants[variantIndex].hsnCode;
                } else {
                    existingItem.variants.push({
                        itemId,
                        itemName: row["ITEM NAME"] || "",
                        quantity: Number(row["QUANTITY"]) || 0,
                        images: imagePaths && imagePaths.length > 0 ? imagePaths : ["bit.ly/3Pb7wpV"],
                        hsnCode: row["HSN CODE"] || ""
                    });
                }
                await existingItem.save();
            } else {
                const newItem = new Item({
                    name: row.NAME,
                    description: row.DESCRIPTION || "",
                    itemType: row["ITEM TYPE"] || "",
                    shelfLife: Number(row["SHELF LIFE"]) || null,
                    manufacturer: row.MANUFACTURER || "",
                    brand: row.BRAND || "",
                    tags: row.TAGS ? row.TAGS.split(",").map(tag => tag.trim()) : [],
                    variants: [
                        {
                            itemId,
                            itemName: row["ITEM NAME"] || "",
                            quantity: Number(row["QUANTITY"]) || 0,
                            images: imagePaths && imagePaths.length > 0 ? imagePaths : ["bit.ly/3Pb7wpV"],
                            hsnCode: row["HSN CODE"] || ""
                        }
                    ]
                });
                await newItem.save();
            }
        }
        fs.unlinkSync(req.file.path);
        res.json({ message: "File uploaded and processed successfully" });
    } catch (error) {
        console.log("Error while uploading service:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
