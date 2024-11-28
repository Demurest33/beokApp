import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import UserCard from "@/components/admin/UserCard";
import { User as UserType } from "@/types/User";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/users";

export default function UsersScreen() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const users = await getAllUsers();
      setUsers(users);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.stepContainer}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => <UserCard {...item} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
