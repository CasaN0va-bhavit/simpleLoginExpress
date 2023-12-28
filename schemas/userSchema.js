const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new Schema(
    {
        email: reqString,
        fname: reqString,
        lname: reqString,
        password: reqString,
        dateCreated: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("user", userSchema);