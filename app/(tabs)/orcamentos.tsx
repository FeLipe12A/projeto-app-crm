import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderAcao from "../../components/HeaderAcao";

export default function Orcamentos() {
  const handleNovoOrcamento = () => {
    router.push("/novo-orcamento");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderAcao titulo="Orçamentos" onAddPress={handleNovoOrcamento} />
      <View style={styles.container}>
        <Text>Essa é a tela de Orçamentos</Text>
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