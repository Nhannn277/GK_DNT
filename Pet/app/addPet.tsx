import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const IMGUR_CLIENT_ID = "8914f132dd10f2d";

export default function AddPet() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload ảnh lên Imgur
  const uploadToImgur = async () => {
    if (!imageUri) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: `pet_${Date.now()}.jpg`,
      } as any);

      const response = await axios.post("https://api.imgur.com/3/image", formData, {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploading(false);
      return response.data.data.link;
    } catch (error) {
      console.error("Lỗi upload:", error);
      setUploading(false);
      Alert.alert("Lỗi", "Không thể upload ảnh lên Imgur.");
      return null;
    }
  };

  const addPet = async () => {
    if (!name || !type || !age || !imageUri) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin!");
      return;
    }

    const imageUrl = await uploadToImgur();
    if (!imageUrl) {
      Alert.alert("Lỗi", "Upload ảnh thất bại!");
      return;
    }

    try {
      await addDoc(collection(db, "pets"), {
        name,
        type,
        age: parseInt(age),
        imageUrl,
      });
      Alert.alert("Thành công", "Thêm pet thành công!", [
        {
          text: "OK",
          onPress: () => {
            router.push("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Lỗi lưu vào Firestore:", error);
      Alert.alert("Lỗi", "Không thể lưu thông tin pet.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Tên pet:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Loại:</Text>
      <TextInput
        value={type}
        onChangeText={setType}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Tuổi:</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Chọn ảnh" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button
        title={uploading ? "Đang tải lên..." : "Thêm Pet"}
        onPress={addPet}
        disabled={uploading}
      />
    </View>
  );
}
