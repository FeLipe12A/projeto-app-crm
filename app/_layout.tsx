import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="novo-orcamento" options={{ presentation: 'modal', title: 'Novo Orçamento', headerTintColor: '#B35D33', headerTitleAlign: 'center' }} />
      <Stack.Screen name="novo-cliente" options={{ presentation: 'modal', title: 'Novo Cliente', headerTintColor: '#B35D33', headerTitleAlign: 'center' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre', headerTintColor: '#B35D33', headerTitleAlign: 'center' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada', headerTintColor: '#B35D33', headerTitleAlign: 'center' }} />
    </Stack>
  );
}
