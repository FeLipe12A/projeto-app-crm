import { db } from '@/FirebaseConfig';
import { Feather } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const perfilImage = require('../../assets/images/perfil.png');

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(true);
  
  const [alertasWhatsapp, setAlertasWhatsapp] = useState(true);
  const [mostrarContato, setMostrarContato] = useState(true);

  const auth = getAuth();
  const usuarioLogado = auth.currentUser;

  useEffect(() => {
    async function carregarDadosUsuario() {
      if (!usuarioLogado) return; // Se não tiver ninguém logado, não faz nada

      try {
        const docRef = doc(db, 'Usuarios', usuarioLogado.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(dados.nome || usuarioLogado.displayName || '');
          setCargo(dados.cargo || 'Cargo não definido');
          setEmail(dados.email || usuarioLogado.email); 
          setTelefone(dados.telefone || '');
          setEndereco(dados.endereco || '');
        } else {
          // Se for o primeiro login da pessoa e o doc não existir ainda, apenas mostra o email do Auth
          setNome(usuarioLogado.displayName || '');
          setCargo('Cargo não definido');
          setEmail(usuarioLogado.email || '');
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosUsuario();
  }, [usuarioLogado]);

  const handleSalvar = async () => {
    if (!usuarioLogado) return;

    try {
      setCarregando(true);
      const docRef = doc(db, 'Usuarios', usuarioLogado.uid);

      // setDoc com { merge: true } atualiza os dados se o documento existir, 
      // ou cria um documento novo caso seja o primeiro acesso da pessoa.
      await setDoc(docRef, {
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco,
        atualizadoEm: new Date()
      }, { merge: true });

      Alert.alert('Sucesso', 'Seus dados foram atualizados!');
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSairConta = async () => {
    try {
      await auth.signOut();
      await GoogleSignin.signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Erro', "Não foi possível sair da conta.");
    }
  };

  if (carregando) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#B35D33" />
      </View>
    );
  }

  const handleSobreApp = () => {
    router.push('/sobre');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerPerfil}>
          <View style={styles.avatarBorder}>
            <Image 
              source={perfilImage} 
              style={styles.avatarImage} 
            />
          </View>
          <Text style={styles.nomeUsuario}>{nome || 'Novo Usuário'}</Text>
          <Text style={styles.cargoUsuario}>{cargo}</Text>
        </View>

        <Text style={styles.sectionTitle}>MEUS DADOS</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput 
            style={styles.input} 
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
            style={styles.input} 
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Endereço</Text>
          <TextInput 
            style={styles.input} 
            value={endereco}
            onChangeText={setEndereco}
          />

          <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
            <Text style={styles.textoBotaoSalvar}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
        <View style={styles.card}>
          
          <View style={styles.configRow}>
            <Text style={styles.configText}>Receber alertas de{'\n'}produção no WhatsApp</Text>
            <Switch 
              trackColor={{ false: "#EAEAEA", true: "#C77D5A" }}
              thumbColor={alertasWhatsapp ? "#B35D33" : "#FFFFFF"}
              onValueChange={setAlertasWhatsapp}
              value={alertasWhatsapp}
            />
          </View>

          <TouchableOpacity 
            style={styles.configRow} 
            onPress={() => setMostrarContato(!mostrarContato)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, mostrarContato && styles.checkboxAtivo]}>
              {mostrarContato && <Feather name="check" size={14} color="#FFF" />}
            </View>
            <Text style={[styles.configText, { marginLeft: 12 }]}>
              Mostrar meu contato na lista de{'\n'}parceiros
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.botaoSobre} onPress={handleSobreApp}>
          <Feather name="info" size={18} color="#7D562D" />
          <Text style={styles.textoSobre}>Sobre o App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSair} onPress={handleSairConta}>
          <Feather name="log-out" size={18} color="#BA1A1A" />
          <Text style={styles.textoSair}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  headerPerfil: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarBorder: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  nomeUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  cargoUsuario: {
    fontSize: 16,
    color: '#55433B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#55433B',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  label: {
    fontSize: 12,
    color: '#55433B',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  botaoSalvar: {
    backgroundColor: '#B35D33',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoSalvar: {
    color: '#FFFCFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  configText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#B35D33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxAtivo: {
    backgroundColor: '#B35D33',
  },
  botaoSobre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#7D562D',
    marginBottom: 24,
    gap: 8,
  },
  textoSobre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7D562D',
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  textoSair: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BA1A1A',
  }
});