import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { addDoc, collection, doc, getDocs, increment, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../FirebaseConfig';

interface Cliente {
  id: string;
  nome: string;
}

export default function NovoOrcamento() {
  const [descricao, setDescricao] = useState('');
  const [material, setMaterial] = useState('');
  const [ferragens, setFerragens] = useState('');
  const [valor, setValor] = useState('');
  const [taxaMontagem, setTaxaMontagem] = useState(true);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function buscarClientes() {
      try {
        const q = query(collection(db, 'Clientes'), orderBy('nome', 'asc'));
        const querySnapshot = await getDocs(q);
        const lista: Cliente[] = [];
        querySnapshot.forEach((doc) => lista.push({ id: doc.id, nome: doc.data().nome }));
        setClientes(lista);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }
    buscarClientes();
  }, []);

  const handleSalvar = async () => {
    if (!clienteSelecionado) return Alert.alert('Atenção', 'Selecione um cliente.');
    if (!descricao || !valor) return Alert.alert('Atenção', 'Preencha a descrição e o valor.');

    try {
      setSalvando(true);

      const valorNumerico = parseFloat(valor.replace(',', '.'));
      await addDoc(collection(db, 'Orcamentos'), {
        clienteId: clienteSelecionado.id,
        clienteNome: clienteSelecionado.nome,
        descricao,
        material,
        ferragens,
        incluirTaxaMontagem: taxaMontagem,
        valorTotal: isNaN(valorNumerico) ? 0 : valorNumerico,
        status: 'Pendente',
        criadoEm: new Date(),
      });

      const clienteRef = doc(db, 'Clientes', clienteSelecionado.id);
      await updateDoc(clienteRef, {
        projetosAtivos: increment(1)
      })

      Alert.alert('Sucesso', 'Orçamento gerado!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisivel(true)} disabled={carregando}>
          {carregando ? <ActivityIndicator size="small" color="#B35D33" /> : (
            <>
              <Text style={[styles.inputText, !clienteSelecionado && { color: '#999' }]}>
                {clienteSelecionado ? clienteSelecionado.nome : 'Selecione o Cliente'}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.helperText}>Ex: Fernanda Costa</Text>

        <Text style={styles.sectionTitle}>Descrição do Projeto</Text>
        <TextInput
          style={[styles.inputBox, styles.textArea]}
          placeholder="Ex: Armário aéreo para cozinha com portas de correr e nicho para micro-ondas."
          placeholderTextColor="#D4B8A9"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
        <View style={styles.inputBoxWithIcon}>
          <TextInput style={styles.inputFlex} placeholder="Material Principal" placeholderTextColor="#1B1C1B" value={material} onChangeText={setMaterial} />
          <MaterialCommunityIcons name="compass-outline" size={20} color="#666" />
        </View>

        <View style={styles.inputBoxWithIcon}>
          <TextInput style={styles.inputFlex} placeholder="Ferragens" placeholderTextColor="#1B1C1B" value={ferragens} onChangeText={setFerragens} />
          <MaterialCommunityIcons name="hammer-wrench" size={20} color="#666" />
        </View>

        <Text style={styles.sectionTitle}>Valores</Text>
        <View style={styles.inputBoxWithIcon}>
          <Text style={styles.moedaPrefix}>R$</Text>
          <TextInput style={styles.inputFlex} placeholder="0,00" placeholderTextColor="#6B7280" value={valor} onChangeText={setValor} keyboardType="numeric" />
        </View>

        <View style={styles.switchBox}>
          <View>
            <Text style={styles.switchTitle}>Incluir taxa de montagem</Text>
            <Text style={styles.switchSubtitle}>Realizada no local da obra</Text>
          </View>
          <Switch
            trackColor={{ false: "#E8DCC8", true: "#D4B8A9" }}
            thumbColor={taxaMontagem ? "#B35D33" : "#FFF"}
            onValueChange={setTaxaMontagem}
            value={taxaMontagem}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#FFF" /> : (
            <>
              <MaterialCommunityIcons name="file-pdf-box" size={24} color="#FFF" />
              <Text style={styles.textoBotao}>Salvar e Gerar PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de Clientes */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecione o Cliente</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
            </View>
            <FlatList
              data={clientes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { setClienteSelecionado(item); setModalVisivel(false); }}>
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 100
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#55433B',
    marginTop: 24,
    marginBottom: 12
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DCC8',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFF'
  },
  inputBoxWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DCC8',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
    marginBottom: 16,
    height: 50
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  },
  inputText: {
    fontSize: 15,
    color: '#333'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  moedaPrefix: {
    fontSize: 16,
    color: '#888',
    marginRight: 8
  },
  switchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 8
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333'
  },
  switchSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2
  },
  footer: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  botaoSalvar: {
    flexDirection: 'row',
    backgroundColor: '#B35D33',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalConteudo: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  modalItemText: {
    fontSize: 16
  }
});