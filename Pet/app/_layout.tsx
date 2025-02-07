import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Quản lý Pets" }} />
      <Stack.Screen name="addPet" options={{ title: "Thêm Pet" }} />
      <Stack.Screen name="editPet" options={{ title: "Chỉnh sửa Pet" }} />
    </Stack>
  );
}
