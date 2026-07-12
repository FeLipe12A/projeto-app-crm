import { TabBar } from '@/components/TabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }} >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
      <Tabs.Screen name="orcamentos" options={{ title: 'Orçamentos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}