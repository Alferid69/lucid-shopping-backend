const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dboboadol",
    api_key: "981294169774582",
    api_secret: "kzpwEO7PXd_GQvHlrT0QUM6mMIA"
})

module.exports = cloudinary;