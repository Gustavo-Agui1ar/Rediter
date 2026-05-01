import { Alert } from "react-native";

interface AlertProps {
  title: string;
  message: string;
}

export default function CustomAlert({ title, message }: AlertProps) {
  Alert.alert(title, message);
  return null;
}
