import { db } from "@/FirebaseConfig";
import { router } from 'expo-router';
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NovoCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !telefone) {
      Alert.alert('Atenção', 'Nome e telefone são obrigatórios.');
      return;
    }

    try {
      setSalvando(true);
      await addDoc(collection(db, 'Clientes'), {
        nome,
        email,
        telefone,
        endereco,
        projetosAtivos: 0,
        criadoEm: new Date(),
      });

      Alert.alert('Sucesso', 'Cliente cadastrado!');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o cliente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            placeholderTextColor="#DBC1B7"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="exemplo@email.com"
            placeholderTextColor="#DBC1B7"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholder="(12) 93456-7889"
            placeholderTextColor="#DBC1B7"
          />

          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Ex: Av. da Moda, 1000 - Passos, MG"
            placeholderTextColor="#DBC1B7"
          />

          <TouchableOpacity 
            style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]} 
            onPress={handleSalvar}
            disabled={salvando} 
          >
            {salvando ? (
              <ActivityIndicator size="small" color="#FFFCFF" />
            ) : (
              <Text style={styles.textoBotaoSalvar}>Salvar Cliente</Text>
            )}
          </TouchableOpacity>
        </View>
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
    flexGrow: 1, // Garante que o ScrollView ocupe a tela toda
    padding: 24,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#55433B',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DBC1B7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1B1C1B',
    marginBottom: 20,
    backgroundColor: '#FFFCFF',
  },
  botaoSalvar: {
    backgroundColor: '#B35D33',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent:  'center',
    marginTop: 8,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoSalvar: {
    color: '#FFFCFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
})