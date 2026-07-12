import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderPerfilProps = {
  nome: string;
  cargo: string;
};

const perfilImage = require('../assets/images/perfil.png'); 

export default function HeaderPerfil({ nome, cargo }: HeaderPerfilProps) {
  return (
    <View style={styles.container}>
      <View style={styles.perfilContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            // Imagem padrão por enquando, depois vai ser alterado para a foto de perfil do usuário
            source={perfilImage}
            style={styles.avatarImage} 
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.saudacao}>Olá, {nome}</Text>
          <Text style={styles.cargo}>{cargo}</Text>
        </View>

      </View>

      <TouchableOpacity style={styles.botaoNotificacao}>
        <Feather name="bell" size={24} color="#55433B" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFCFF', 
  },
  perfilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#F4D7C4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 45,
    height: 45,
  },
  textContainer: {
    marginLeft: 12, 
  },
  saudacao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#94451D', 
  },
  cargo: {
    fontSize: 12,
    color: '#55433B', 
    marginTop: 2,
  },
  botaoNotificacao: {
    padding: 8,
  }
});