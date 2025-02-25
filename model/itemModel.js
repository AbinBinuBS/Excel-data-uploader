import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    itemType: {
        type: String,
        required: false,
        trim: true
    },
    shelfLife: {
        type: Number,
        required: false,
        trim: true,
        comment: "in days"
    },
    manufacturer: {
        type: String,
        required: false,
        trim: true
    },
    brand: {
        type: String,
        required: false,
        trim: true,
        uppercase: true
    },
    tags: [
        {
            type: String,
            required: false,
            trim: true
        }
    ],
    variants: [
        {
            itemId: {
                type: Number,
                required: true,
                trim: true
            },
            itemName: {
                type: String,
                required: false,
                trim: true
            },
            quantity: {
                type: Number,
                required: false,
                trim: true
            },
            images: [
                {
                    type: String,
                    required: false,
                    default: "bit.ly/3Pb7wpV",
                    trim: true
                }
            ],
            hsnCode: {
                type: String,
                default: "",
                trim: true
            }
        }
    ]
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
