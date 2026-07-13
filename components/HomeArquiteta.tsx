import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BarraProgressoAnimada = ({ porcentagem }: { porcentagem: number }) => {
  const animacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animacao, {
      toValue: porcentagem,
      duration: 1500, 
      useNativeDriver: false, 
    }).start();
  }, [porcentagem]);

  const widthAnimado = animacao.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.barraFundo}>
      <Animated.View style={[styles.barraPreenchida, { width: widthAnimado }]} />
    </View>
  );
};

interface Props {
    projetosAtivos: any[];
}

export default function HomeArquiteta({ projetosAtivos }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      <Text style={styles.sectionTitle}>Visão Geral</Text>
      <View style={styles.cardsRow}>
        <View style={styles.cardGeralBranco}>
          <View style={styles.cardTopRow}>
            <MaterialCommunityIcons name="robot-industrial" size={24} color="#B35D33" />
            <View style={styles.badgeAtivo}><Text style={styles.badgeAtivoText}>Ativo</Text></View>
          </View>
          <Text style={styles.cardNumeroGrande}>{projetosAtivos.length} projetos</Text>
          <Text style={styles.cardLabelCinza}>Em Produção</Text>
        </View>
        <View style={styles.cardGeralBranco}>
          <View style={styles.cardTopRow}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#B35D33" />
          </View>
          <Text style={styles.cardNumeroGrande}>1 projeto</Text>
          <Text style={styles.cardLabelCinza}>Orçamento</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botaoLargoMarrom}>
        <Feather name="plus-circle" size={20} color="#FFF" />
        <Text style={styles.botaoLargoTexto}>Novo Projeto / Renders</Text>
      </TouchableOpacity>

      <View style={styles.headerRecentes}>
        <Text style={styles.sectionTitle}>Meus Projetos na Fábrica</Text>
        <TouchableOpacity><Text style={styles.linkVerTodos}>Ver tudo</Text></TouchableOpacity>
      </View>

      {projetosAtivos.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          Nenhum projeto em produção no momento.
        </Text>
      ) : (
        projetosAtivos.map((projeto) => {
          const progresso = projeto.progresso || 15;
          const etapa = projeto.etapa || 'Em Separação';
          const materialBase = projeto.material || 'MDF Padrão';
          const dataEstimada = projeto.estimativa || 'A definir';

          return (
            <View key={projeto.id} style={styles.cardFabrica}>
              <View style={styles.fabricaTopo}>
                <Text style={styles.fabricaTitulo} numberOfLines={1}>{projeto.nomeOrcamento || projeto.descricao}</Text>
                <View style={styles.badgeMaterial}>
                  <Text style={styles.badgeMaterialText}>{materialBase}</Text>
                </View>
              </View>
              <Text style={styles.fabricaCliente}>Cliente: {projeto.clienteNome}</Text>
              
              <View style={styles.progressoHeader}>
                <Text style={styles.progressoTexto}>{progresso}% - {etapa}</Text>
                <Text style={styles.progressoData}>Estimativa: {dataEstimada}</Text>
              </View>
              
              <BarraProgressoAnimada porcentagem={progresso} />

              <View style={styles.fabricaFooter}>
                <TouchableOpacity style={styles.fabricaAcao}>
                  <Feather name="image" size={16} color="#666" />
                  <Text style={styles.fabricaAcaoText}>0 Fotos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fabricaAcao}>
                  <Feather name="message-square" size={16} color="#666" />
                  <Text style={styles.fabricaAcaoText}>Suporte</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
  cardGeralBranco: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeAtivo: { backgroundColor: '#FDECE2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeAtivoText: { color: '#B35D33', fontSize: 10, fontWeight: 'bold' },
  cardNumeroGrande: { fontSize: 18, fontWeight: 'bold', color: '#B35D33', marginBottom: 4 },
  cardLabelCinza: { fontSize: 13, color: '#888' },
  botaoLargoMarrom: { backgroundColor: '#B35D33', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 12, marginBottom: 32, gap: 10 },
  botaoLargoTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  headerRecentes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  linkVerTodos: { color: '#B35D33', fontSize: 14, fontWeight: '600' },
  cardFabrica: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 16 },
  fabricaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  fabricaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  badgeMaterial: { backgroundColor: '#FDECE2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeMaterialText: { color: '#B35D33', fontSize: 11, fontWeight: 'bold' },
  fabricaCliente: { fontSize: 13, color: '#777', marginBottom: 16 },
  progressoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressoTexto: { fontSize: 12, fontWeight: 'bold', color: '#B35D33' },
  progressoData: { fontSize: 12, color: '#888' },
  barraFundo: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  barraPreenchida: { height: '100%', backgroundColor: '#B35D33', borderRadius: 4 },
  fabricaFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, gap: 16 },
  fabricaAcao: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fabricaAcaoText: { fontSize: 13, color: '#666', fontWeight: '500' }
});