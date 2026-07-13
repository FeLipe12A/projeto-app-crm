import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  totalAprovado: number;
  totalPendente: number;
  orcamentosRecentes: any[];
  formatarMoeda: (valor: number) => string;
}

export default function HomeProjetista({ totalAprovado, totalPendente, orcamentosRecentes, formatarMoeda }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      <Text style={styles.sectionTitle}>Visão Geral</Text>
      <View style={styles.cardsRow}>
        <View style={styles.cardGeralBranco}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#B35D33" style={styles.cardIconTop} />
          <Text style={styles.cardLabelEscuro}>Orçamentos Aprovados</Text>
          <Text style={styles.cardValorEscuro}>{formatarMoeda(totalAprovado)}</Text>
        </View>
        <View style={styles.cardGeralBranco}>
          <FontAwesome6 name="hourglass-start" size={24} color="#B35D33" style={styles.cardIconTop} />
          <Text style={styles.cardLabelEscuro}>Aguardando Aprovação</Text>
          <Text style={styles.cardValorEscuro}>{formatarMoeda(totalPendente)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.acoesContainer}>
        <TouchableOpacity style={[styles.acaoCard, { backgroundColor: '#B35D33' }]} onPress={() => router.push('/novo-orcamento')}>
          <MaterialIcons name="add-shopping-cart" size={28} color="#FFF" />
          <Text style={styles.acaoTextBranco}>Novo Orçamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.acaoCard, { backgroundColor: '#F2BD8D' }]} onPress={() => router.push('/novo-cliente')}>
          <Feather name="user-plus" size={28} color="#A85320" />
          <Text style={[styles.acaoTextBranco, { color: '#A85320' }]}>Novo Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.acaoCard, { backgroundColor: '#E0E0E0' }]}>
          <MaterialCommunityIcons name="book-open-variant-outline" size={28} color="#333" />
          <Text style={[styles.acaoTextBranco, { color: '#333' }]}>Catálogo</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.headerRecentes}>
        <Text style={styles.sectionTitle}>Atividades Recentes</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/orcamentos')}>
          <Text style={styles.linkVerTodos}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {orcamentosRecentes.map((orc) => (
        <View key={orc.id} style={styles.itemRecente}>
          <View style={styles.iconeRecenteBox}>
            <MaterialCommunityIcons name={orc.descricao.toLowerCase().includes('mesa') ? 'desk' : 'sofa-single-outline'} size={24} color="#55433B" />
          </View>
          <View style={styles.itemRecenteInfo}>
            <Text style={styles.itemRecenteNome}>{orc.clienteNome}</Text>
            <Text style={styles.itemRecenteDesc} numberOfLines={1}>{orc.nomeOrcamento || orc.descricao}</Text>
          </View>
          <View style={styles.itemRecenteValores}>
            <Text style={styles.itemRecenteValor}>{formatarMoeda(orc.valorTotal)}</Text>
            <View style={[styles.badgePequena, orc.status === 'Aprovado' ? styles.badgeAprovado : styles.badgePendente]}>
              <Text style={[styles.badgeTextoPequeno, orc.status === 'Aprovado' ? styles.textAprovado : styles.textPendente]}>{orc.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
  cardGeralBranco: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  cardIconTop: { marginBottom: 12 },
  cardLabelEscuro: { fontSize: 12, color: '#55433B', fontWeight: '500', marginBottom: 8 },
  cardValorEscuro: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  acoesContainer: { gap: 12, marginBottom: 32, paddingRight: 24 },
  acaoCard: { width: 110, height: 110, borderRadius: 16, padding: 16, justifyContent: 'space-between' },
  acaoTextBranco: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  headerRecentes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  linkVerTodos: { color: '#B35D33', fontSize: 14, fontWeight: '600' },
  itemRecente: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  iconeRecenteBox: { width: 44, height: 44, backgroundColor: '#FDECE2', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemRecenteInfo: { flex: 1, marginRight: 8 },
  itemRecenteNome: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  itemRecenteDesc: { fontSize: 13, color: '#777' },
  itemRecenteValores: { alignItems: 'flex-end' },
  itemRecenteValor: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  badgePequena: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeAprovado: { backgroundColor: '#E2FBEA' },
  badgePendente: { backgroundColor: '#FDECE2' },
  badgeTextoPequeno: { fontSize: 9, fontWeight: 'bold' },
  textAprovado: { color: '#2E7D32' },
  textPendente: { color: '#B35D33' },
});