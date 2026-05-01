import * as Location from "expo-location";
import { Alert } from "react-native";

interface LocationData {
  setLocationName: (name: string) => void;
}

/**
 * Obtém a localização do usuário e define o nome do local.
 * @param setLocationName Função para atualizar o nome do local no estado do componente. O nome é formatado como "Cidade, Região". Se a localização não puder ser obtida, exibe um alerta para o usuário.
 * @returns void
 * @throws Erro se ocorrer um problema ao acessar a localização ou processar os dados. O erro é capturado e um alerta é exibido para o usuário.
 */
export async function handleGetLocation({ setLocationName }: LocationData) {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Aviso",
        "Precisamos de permissão para acessar sua localização.",
      );
      return;
    }
    let currentPosition = await Location.getLastKnownPositionAsync({});
    if (!currentPosition) {
      currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
        timeInterval: 10000,
      });
    }
    if (!currentPosition) {
      Alert.alert("Aviso", "Ligue o GPS do seu celular para fazer check-in.");
      return;
    }
    let address = await Location.reverseGeocodeAsync(currentPosition.coords);
    console.log("Endereço obtido:", address);
    if (address.length > 0) {
      const city = address[0].city || address[0].subregion;
      const region = address[0].region;
      setLocationName(`${city}, ${region}`);
    }
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    Alert.alert(
      "Erro",
      "Não foi possível obter a localização. Verifique se o GPS está ligado.",
    );
  }
}
