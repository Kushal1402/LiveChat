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

    removeMedia: async (folderName, file, resourceType) => {
        try {
            const mediaParts = file.split("/");
            // console.log("Media Parts : ", mediaParts);

            const publicId = mediaParts[mediaParts.length - 1].split(".")[0];
            // console.log("Public Id : ", publicId, " --- ", typeof publicId);

            const StructuredPublicId = `${folderName}/${publicId}`;

            const removeMedia = await cloudinary.uploader.destroy(StructuredPublicId, { resource_type: resourceType?.toString(), invalidate: true });
            // console.log("Media Removed : ", removeMedia);

            return removeMedia;
        } catch (error) {
            throw error;
        }
    },
}