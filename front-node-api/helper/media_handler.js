const multer = require("multer");
const cloudinary = require('../config/cloud_image');

module.exports = {
    upload: multer({ storage: multer.memoryStorage() }),

    uploadMedia: async (folderName, file, resourceType) => {
        // console.log("FolderName : ", folderName, " File : ", file, " ResourceType : ", resourceType);
        try {
            const uploadedMedia = await cloudinary.uploader.upload(
                file,
                {
                    folder: `uploads/${folderName}`,
                    chunk_size: 20000000, // 20MB chunks
                    resource_type: resourceType ?? "auto",
                    quality: "auto:low",
                    eager: [
                        {
                            quality: "auto:low",
                        },
                    ],
                    eager_async: true,
                }
            );
            return uploadedMedia;
        } catch (error) {
            throw error;
        }
    },
}