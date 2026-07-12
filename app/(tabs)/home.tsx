import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from '../../FirebaseConfig';
import HeaderPerfil from "../../components/HeaderPerfil";

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cargoUsuario, setCargoUsuario] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDadosUsuario() {
      const auth = getAuth();
      const usuarioLogado = auth.currentUser;

      if (usuarioLogado) {
        try {
          const docRef = doc(db, 'Usuarios', usuarioLogado.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().nome) {
            const dados = docSnap.data();
            setNomeUsuario(dados.nome || usuarioLogado.displayName || 'Usuário');
            setCargoUsuario(dados.cargo || 'Cargo não definido');
          } else {
            setNomeUsuario(usuarioLogado.displayName || 'Usuário');
            setCargoUsuario('Cargo não definido');
          }
        } catch (error) {
          console.error("Erro ao buscar nome na Home:", error);
        }
      }
      setCarregando(false);
    }

    buscarDadosUsuario();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B35D33" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderPerfil nome={nomeUsuario} cargo={cargoUsuario} />
      <View style={styles.container}>
        <Text>Essa é a tela de Início</Text>
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