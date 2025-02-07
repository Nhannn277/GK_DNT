import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { db, collection, addDoc } from "../firebaseConfig";

export default function AddPet() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const addPet = async () => {
    if (!name || !type || !age || !imageUrl) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    await addDoc(collection(db, "pets"), {
      name,
      type,
      age: parseInt(age),
      imageUrl,
    });

    router.push("/");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Tên pet:</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10 }} />

      <Text>Loại:</Text>
      <TextInput value={type} onChangeText={setType} style={{ borderWidth: 1, padding: 10 }} />

      <Text>Tuổi:</Text>
      <TextInput value={age} onChangeText={setAge} keyboardType="numeric" style={{ borderWidth: 1, padding: 10 }} />

      <Text>URL ảnh:</Text>
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={{ borderWidth: 1, padding: 10 }} />

      <Button title="Thêm Pet" onPress={addPet} />
    </View>
  );
}
