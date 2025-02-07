import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import { auth, db, collection, getDocs, deleteDoc, doc } from "../firebaseConfig";
import { signOut } from "firebase/auth";

interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  imageUrl: string;
}

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const querySnapshot = await getDocs(collection(db, "pets"));
    const petList: Pet[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pet));
    setPets(petList);
  };

  const deletePet = async (id: string) => {
    await deleteDoc(doc(db, "pets", id));
    fetchPets();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Thêm Pet" onPress={() => router.push("./addPet")} />
      <Button title="Đăng xuất" onPress={handleLogout} color="red" />

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <Text>Tên: {item.name}</Text>
            <Text>Loại: {item.type}</Text>
            <Text>Tuổi: {item.age}</Text>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => router.push(`./editPet?id=${item.id}`)}
                style={{ backgroundColor: "blue", padding: 5, marginRight: 5 }}
              >
                <Text style={{ color: "white" }}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deletePet(item.id)} style={{ backgroundColor: "red", padding: 5 }}>
                <Text style={{ color: "white" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
