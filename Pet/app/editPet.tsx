import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { db, doc, updateDoc, getDocs, collection } from "../firebaseConfig";

const IMGUR_CLIENT_ID = "8914f132dd10f2d"; 

export default function EditPet() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPet();
  }, []);

  // Lấy dữ liệu pet từ Firestore
  const loadPet = async () => {
    const querySnapshot = await getDocs(collection(db, "pets"));
    const petData = querySnapshot.docs.find((doc) => doc.id === id)?.data();
    if (petData) {
      setName(petData.name);
      setType(petData.type);
      setAge(petData.age.toString());
      setImageUrl(petData.imageUrl);
    }
  };

  // Hàm upload ảnh lên Imgur
  const uploadToImgur = async (uri: string) => {
    if (!uri) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
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

  const pickAndUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const uploadedUrl = await uploadToImgur(uri);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      }
    }
  };

  // Cập nhật thông tin pet vào Firestore
  const updatePet = async () => {
    await updateDoc(doc(db, "pets", String(id)), {
      name,
      type,
      age: parseInt(age),
      imageUrl,
    });
    router.push("/");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Chỉnh sửa Pet:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Tên pet"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        value={type}
        onChangeText={setType}
        placeholder="Loại"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        value={age}
        onChangeText={setAge}
        placeholder="Tuổi"
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, marginVertical: 10 }} />
      ) : null}
      <Button title="Chọn ảnh mới" onPress={pickAndUploadImage} disabled={uploading} />

      <Button title="Lưu" onPress={updatePet} />
    </View>
  );
}
