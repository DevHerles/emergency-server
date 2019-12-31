const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const themeSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    theme: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
});

const Theme = mongoose.model('theme', themeSchema);

module.exports = Theme;