import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderAcaoProps = {
    titulo: string;
    onAddPress: () => void;
}

export default function HeaderAcao({ titulo, onAddPress }: HeaderAcaoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      
      <TouchableOpacity style={styles.botaoAdd} onPress={onAddPress}>
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFCFF',
    position: 'relative', 
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1C1B',
  },
  botaoAdd: {
    position: 'absolute',
    right: 24,
    padding: 8,
    backgroundColor: '#B35D33',
    borderRadius: 12,
  }
});