import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, doc, updateDoc, getDocs, collection } from "../firebaseConfig";

export default function EditPet() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadPet();
  }, []);

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
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10 }} />
      <TextInput value={type} onChangeText={setType} style={{ borderWidth: 1, padding: 10 }} />
      <TextInput value={age} onChangeText={setAge} keyboardType="numeric" style={{ borderWidth: 1, padding: 10 }} />
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={{ borderWidth: 1, padding: 10 }} />

      <Button title="Lưu" onPress={updatePet} />
    </View>
  );
}
