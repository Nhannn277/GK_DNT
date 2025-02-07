import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.replace("/petList"); // Nếu đã đăng nhập, chuyển đến danh sách pet
      } else {
        router.replace("/login"); // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đang kiểm tra trạng thái đăng nhập...</Text>
    </View>
  );
}
