import { Header, TextBox } from "@/components/components";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch() {
    console.log("Buscando por:", searchQuery);
  }
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <TextBox
          placeholder="O que você quer ler hoje?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          isSearch={true}
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </Header>
      <Text>Search</Text>
    </View>
  );
}
