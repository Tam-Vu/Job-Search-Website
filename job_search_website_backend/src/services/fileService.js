import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from "../config/firebaseConfig";

// Khởi tạo Firebase
const app = initializeApp(config.firebaseConfig);
const storage = getStorage();

class FileService {
    uploadFile = async (file) => {
        if (file == null) {
            return {
                EC: 1,
                EM: "File is empty",
                DT: null,
            };
        }

        try {
            console.log("Starting file upload...");
            const storageRef = ref(storage, `${file.originalname}`);
            const metadata = {
                contentType: file.mimetype,
            };
            const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    console.error("Upload error:", error);
                    throw error; // Quăng lỗi để xử lý ở catch bên dưới
                }
            );
            await uploadTask;
            console.log("File uploaded successfully. Getting download URL...");
            const url = await getDownloadURL(storageRef);
            return {
                EC: 0,
                EM: "Upload file successfully",
                DT: url,
            };
        } 
        catch (error) {
            console.error("Error during file upload:", error);

            return {
                EC: 1, // Đặt mã lỗi là 1 để chỉ ra có lỗi
                EM: error.message,
                DT: null,
            };
        }
    };
}

module.exports = new FileService();