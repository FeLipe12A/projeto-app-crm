import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPerfil from "../../components/HeaderPerfil";

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderPerfil nome="Camila" cargo="Arquiteta" />
      <View style={styles.container}>
        <Text>Essa é a tela de Início</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})