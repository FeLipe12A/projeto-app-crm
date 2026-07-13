import { router } from 'expo-router';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';
import HeaderAcao from '../../components/HeaderAcao';
import OrcamentoCard, { Orcamento } from '../../components/OrcamentoCard';

export default function Orcamentos() {
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const handleAlterarStatus = async (id: string, novoStatus: string) => {
    try {
      const orcamentoRef = doc(db, 'Orcamentos', id);
      await updateDoc(orcamentoRef, { status: novoStatus });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'Orcamentos'), orderBy('criadoEm', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista: Orcamento[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() } as Orcamento);
      });
      setOrcamentos(lista);
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  const orcamentosFiltrados = orcamentos.filter(orc => {
    if (filtroAtivo === 'Pendentes') return orc.status === 'Pendente';
    if (filtroAtivo === 'Aprovados') return orc.status === 'Aprovado';
    return true; 
  });

  const formatarMoeda = (valor: number) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp) return '';
    const data = timestamp.toDate();
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${data.getDate().toString().padStart(2, '0')} ${meses[data.getMonth()]} ${data.getFullYear()}`;
  };

  const renderOrcamento = ({ item }: { item: Orcamento }) => {
    return (
      <OrcamentoCard 
        item={item}
        handleAlterarStatus={handleAlterarStatus}
        formatarMoeda={formatarMoeda}
        formatarData={formatarData}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <HeaderAcao titulo="Orçamentos" onAddPress={() => router.push('/novo-orcamento')} />

        <View style={styles.content}>
          <View style={styles.chipsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
              {['Todos', 'Pendentes', 'Aprovados', 'Recusados'].map((filtro) => (
                <TouchableOpacity 
                  key={filtro}
                  style={[styles.chip, filtroAtivo === filtro && styles.chipAtivo]}
                  onPress={() => setFiltroAtivo(filtro)}
                >
                  <Text style={[styles.chipText, filtroAtivo === filtro && styles.chipTextAtivo]}>
                    {filtro}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {carregando ? (
            <ActivityIndicator size="large" color="#B35D33" style={{ marginTop: 40 }} />
          ) : (
            <FlatList 
              data={orcamentosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={renderOrcamento}
              contentContainerStyle={styles.listPadding}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  content: {
    flex: 1,
    paddingTop: 16
  },
  chipsWrapper: {
    marginBottom: 16
  },
  chipsContainer: {
    paddingHorizontal: 24,
    gap: 12
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4B8A9',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center'
  },
  chipAtivo: {
    backgroundColor: '#A0522D',
    borderColor: '#A0522D'
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#55433B'
  },
  chipTextAtivo: {
    color: '#FFF'
  },
  listPadding: {
    paddingHorizontal: 24,
    paddingBottom: 100
  },
});