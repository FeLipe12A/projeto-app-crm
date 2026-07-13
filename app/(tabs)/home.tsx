import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from '../../FirebaseConfig';
import HeaderPerfil from '../../components/HeaderPerfil';
import HomeArquiteta from '../../components/HomeArquiteta';
import HomeProjetista from '../../components/HomeProjetista';

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cargoUsuario, setCargoUsuario] = useState('Projetista');
  const [totalAprovado, setTotalAprovado] = useState(0);
  const [totalPendente, setTotalPendente] = useState(0);
  const [orcamentosRecentes, setOrcamentosRecentes] = useState<any[]>([]);
  const [projetosAtivos, setProjetosAtivos] = useState<any[]>([]);
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
            setNomeUsuario(usuarioLogado.displayName || 'Projetista');
            setCargoUsuario('Cargo não definido');
          }
        } catch (error) {
          console.error("Erro ao buscar nome na Home:", error);
        }
      }
    }

    buscarDadosUsuario();

    const q = query(collection(db, 'Orcamentos'), orderBy('criadoEm', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let somaAprovados = 0;
      let somaPendentes = 0;
      const recentes: any[] = [];
      const ativos: any[] = [];

      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        
        if (dados.status === 'Aprovado') {
          somaAprovados += dados.valorTotal || 0;
          ativos.push({ id: doc.id, ...dados });
        } else if (dados.status === 'Pendente') {
          somaPendentes += dados.valorTotal || 0;
        }
        if (recentes.length < 3) {
          recentes.push({ id: doc.id, ...dados });
        }
      });

      setTotalAprovado(somaAprovados);
      setTotalPendente(somaPendentes);
      setOrcamentosRecentes(recentes);
      setProjetosAtivos(ativos);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const formatarMoeda = (valor: number) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
      
      {cargoUsuario === 'Arquiteta' || cargoUsuario === 'Arquiteto' ? (
        <HomeArquiteta projetosAtivos={projetosAtivos} />
      ) : (
        <HomeProjetista 
          totalAprovado={totalAprovado}
          totalPendente={totalPendente}
          orcamentosRecentes={orcamentosRecentes}
          formatarMoeda={formatarMoeda}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  }
});