import { Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFound() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="alert-circle" size={40} color="#FFFCFF" />
          </View>
          <Text style={styles.textTittle}>Ops! Nos perdemos no projeto</Text>
        </View>

        <Text style={styles.descricao}>
          A pagina que você está procurando não existe, foi movida ou você
          não tem permissão para acessá-la.
        </Text>
      
        <TouchableOpacity style={styles.botaoHome} onPress={() => router.push('/home')}>
            <Foundation name="home" size={24} color="#FFFCFF" />
            <Text style={styles.textoBotao}>Voltar para o início</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: '#B35D33',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textTittle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B35D33',
  },
  descricao: {
    fontSize: 16,
    lineHeight: 24,
    color: '#55433B',
    textAlign: 'center',
    marginBottom: 32,
  },
  botaoHome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 58,
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#B35D33',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#FFFFFF",
  }
});