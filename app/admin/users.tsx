import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import UserCard from "@/components/admin/UserCard";
import { UserWithOrderCounts } from "@/types/User";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/users";

export default function UsersScreen() {
  const [users, setUsers] = useState<UserWithOrderCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState<UserWithOrderCounts | null>(
    null
  );

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

  function searchUser(phone: string) {
    const searchedUser = users.find((user) => user.phone === phone);

    if (searchedUser) {
      setSearchedUser(searchedUser);
    }
  }

  return (
    <View style={styles.stepContainer}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <TextInput
            keyboardType="phone-pad"
            style={styles.input}
            onChange={(event) => {
              if (event.nativeEvent.text === "") {
                setSearchedUser(null);
              }
            }}
            placeholder="Buscar por número de teléfono"
            onEndEditing={(event) => {
              searchUser(event.nativeEvent.text);
            }}
          />

          <FlatList
            data={searchedUser ? [searchedUser] : users}
            keyExtractor={(user) => user.id}
            renderItem={({ item }) => (
              <UserCard user={item} fetchUsers={fetchUsers} />
            )}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
            }
          />
        </>
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
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
});
