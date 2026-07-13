import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';
import HeaderAcao from '../../components/HeaderAcao';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  projetosAtivos?: number;
  inadimplente?: boolean;
}

export default function ClientesScreen() {
  const [pesquisa, setPesquisa] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);

  const coresAvatar = ['#7A5C4D', '#F2BD8D', '#A85320'];

  useEffect(() => {
    const q = query(collection(db, 'Clientes'), orderBy('nome', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista: Cliente[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() } as Cliente);
      });
      setClientes(lista);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  // Extrai as duas primeiras letras do nome (ex: Camila Rocha -> CR)
  const getIniciais = (nome: string) => {
    if (!nome) return 'CL';
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  // Filtra os clientes pela pesquisa e pelo chip selecionado
  const clientesFiltrados = clientes.filter(cliente => {
    const bateComPesquisa = cliente.nome?.toLowerCase().includes(pesquisa.toLowerCase());
    const qtdProjetos = cliente.projetosAtivos || 0;
    
    if (filtroAtivo === 'Com Projetos Ativos') {
      return bateComPesquisa && qtdProjetos > 0;
    }
    if (filtroAtivo === 'Inadimplentes') {
      return bateComPesquisa && cliente.inadimplente === true; // Exemplo de lógica futura
    }
    return bateComPesquisa; 
  });

  // Renderiza cada cartão de cliente
  const renderCliente = ({ item, index }: { item: Cliente, index: number }) => {
    const qtdProjetos = item.projetosAtivos || 0;
    const corFundoAvatar = coresAvatar[index % coresAvatar.length];

    return (
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: corFundoAvatar }]}>
          <Text style={[styles.avatarText, corFundoAvatar === '#F2BD8D' && { color: '#8A5A44' }]}>
            {getIniciais(item.nome)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.telefone}>{item.telefone}</Text>
          
          {qtdProjetos > 0 ? (
            <View style={styles.badgeProjetosAtivos}>
              <Feather name="folder" size={12} color="#8A5A44" style={{ marginRight: 4 }} />
              <Text style={styles.badgeTextAtivo}>
                {qtdProjetos} {qtdProjetos === 1 ? 'Projeto' : 'Projetos'}
              </Text>
            </View>
          ) : (
            <View style={styles.badgeProjetosInativos}>
              <Text style={styles.badgeTextInativo}>Sem projetos ativos</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.menuOpcoes}>
          <Feather name="more-vertical" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleNovoCliente = () => {
    router.push("/novo-cliente");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderAcao titulo="Clientes" onAddPress={handleNovoCliente} />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#88736A" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Pesquisar cliente ou CNPJ..." 
            placeholderTextColor="#55433B"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <View style={styles.chipsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {['Todos', 'Com Projetos Ativos', 'Inadimplentes'].map((filtro) => (
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
          <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 40 }} />
        ) : (
          <FlatList 
            data={clientesFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderCliente}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'relative',
  },
  tituloHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  botaoAdd: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#A0522D', 
    width: 40,
    height: 40,
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { 
    flex: 1 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8DCC8', 
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  searchIcon: { 
    marginRight: 12 
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: 14, 
    fontSize: 15, 
    color: '#333' 
  },
  chipsWrapper: {
    marginBottom: 16,
  },
  chipsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8DCC8',
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  chipAtivo: {
    backgroundColor: '#A0522D',
    borderColor: '#A0522D',
  },
  chipText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#666' 
  },
  chipTextAtivo: { 
    color: '#FFF' 
  },
  listPadding: { 
    paddingHorizontal: 24, 
    paddingBottom: 100 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  infoContainer: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  nome: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 4 
  },
  telefone: { 
    fontSize: 13, 
    color: '#777', 
    marginBottom: 8 
  },
  badgeProjetosAtivos: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5ECE5', 
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTextAtivo: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#8A5A44' 
  },
  badgeProjetosInativos: {
    backgroundColor: '#F0F0F0', 
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTextInativo: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#666' 
  },
  menuOpcoes: {
    padding: 8,
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#888', 
    marginTop: 40 
  }
});