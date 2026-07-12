import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Sobre() {
  const abrirGitHub = () => Linking.openURL('https://github.com/FeLipe12A');
  const abrirLinkedIn = () => Linking.openURL('https://linkedin.com/in/felipe-augusto-397043332');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="hand-saw" size={40} color="#FFFCFF" />
          </View>
          <Text style={styles.appName}>CRM Omarceneiro</Text>
          <Text style={styles.appVersion}>Versão 1.0.0 (Beta)</Text>
        </View>

        <Text style={styles.descricao}>
          Aplicativo de gestão de clientes e orçamentos desenvolvido como 
          requisito final para avaliação acadêmica.
        </Text>

        <View style={styles.cardDesenvolvedor}>
          <Text style={styles.labelDev}>DESENVOLVEDOR</Text>
          <Text style={styles.nomeDev}>Felipe Augusto Felicio Ignacio</Text>
          <Text style={styles.cursoDev}>Bacharelado em Ciência da Computação</Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={[styles.botaoSocial, styles.bgPrimario]} onPress={abrirGitHub}>
            <Feather name="code" size={18} color="#FFFCFF" />
            <Text style={[styles.textoBotaoSocial, styles.textoBranco]}>GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botaoSocial, styles.bgContorno]} onPress={abrirLinkedIn}>
            <Feather name="link-2" size={18} color="#B35D33" />
            <Text style={[styles.textoBotaoSocial, styles.textoAmadeirado]}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Desenvolvido em Passos, MG - 2026</Text>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#B35D33',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#B35D33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B35D33',
  },
  appVersion: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardDesenvolvedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 32,
  },
  labelDev: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nomeDev: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cursoDev: {
    fontSize: 14,
    color: '#666666',
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 16, 
  },
  botaoSocial: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8, 
  },
  bgPrimario: {
    backgroundColor: '#B35D33',
  },
  bgContorno: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#B35D33',
  },
  textoBotaoSocial: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoBranco: {
    color: '#FFFFFF',
  },
  textoAmadeirado: {
    color: '#B35D33',
  },
  rodape: {
    marginTop: 'auto', 
    paddingBottom: 24,
    alignItems: 'center',
  },
  textoRodape: {
    fontSize: 12,
    color: '#55433B',
  }
});