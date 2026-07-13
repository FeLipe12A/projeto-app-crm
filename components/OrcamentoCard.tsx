import { Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export interface Orcamento {
  id: string;
  clienteNome: string;
  descricao: string;
  valorTotal: number;
  status: string;
  criadoEm: any;
}

interface OrcamentoCardProps {
    item: Orcamento;
    handleAlterarStatus: (id: string, status: string) => void;
    formatarMoeda: (valor: number) => string;
    formatarData: (timestamp: any) => string;
}

const OrcamentoCard = ({ item, handleAlterarStatus, formatarMoeda, formatarData }: OrcamentoCardProps) => {
    const swipeableRef = useRef<Swipeable>(null);
    const isAprovado = item.status === 'Aprovado';

    const confirmarAcao = (novoStatus: string) => {
        Alert.alert(
            'Confirmação',
            `Você tem certeza que deseja ${novoStatus === 'Aprovado' ? 'APROVAR' : 'RECUSAR'} este orçamento?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => {
                        // Se cancelar, desliza o cartão de volta para a posição original!
                        swipeableRef.current?.close();
                    }
                },
                {
                    text: 'Sim, confirmar',
                    style: novoStatus === 'Aprovado' ? 'default' : 'destructive',
                    onPress: () => {
                        handleAlterarStatus(item.id, novoStatus);
                        swipeableRef.current?.close(); // Fecha após confirmar também
                    }
                }
            ]
        );
    };

    const renderAprovar = () => (
        <View style={styles.swipeAprovar}>
            <Feather name="check" size={28} color="#FFF" />
            <Text style={styles.swipeText}>Aprovar</Text>
        </View>
    );

    const renderRecusar = () => (
        <View style={styles.swipeRecusar}>
            <Text style={styles.swipeText}>Recusar</Text>
            <Feather name="x" size={28} color="#FFF" />
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderAprovar}
            renderRightActions={renderRecusar}
            onSwipeableLeftOpen={() => confirmarAcao('Aprovado')}
            onSwipeableRightOpen={() => confirmarAcao('Recusado')}
        >
            <View style={styles.card}>
                <View style={styles.cardTopo}>
                    <Text style={styles.nome}>{item.clienteNome}</Text>
                    <View style={[styles.badgeStatus, isAprovado ? styles.badgeAprovado : styles.badgePendente]}>
                        <Text style={[styles.badgeText, isAprovado ? styles.textAprovado : styles.textPendente]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <Text style={styles.data}>{formatarData(item.criadoEm)}</Text>
                <Text style={styles.tituloProjeto} numberOfLines={1}>{item.descricao}</Text>

                <View style={styles.cardBase}>
                    <Text style={styles.labelValor}>Valor Total</Text>
                    <Text style={styles.valor}>{formatarMoeda(item.valorTotal)}</Text>
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    cardTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    badgeStatus: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    badgePendente: {
        backgroundColor: '#FDECE2'
    },
    badgeText: {
        color: '#B35D33',
        fontSize: 11,
        fontWeight: 'bold'
    },
    textPendente: {
        color: '#B35D33',
        fontSize: 11,
        fontWeight: 'bold'
    },
    badgeAprovado: {
        backgroundColor: '#E2FBEA'
    },
    textAprovado: {
        color: '#2E7D32',
        fontSize: 11,
        fontWeight: 'bold'
    },
    data: {
        fontSize: 13,
        color: '#888',
        marginBottom: 16
    },
    tituloProjeto: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#B35D33',
        marginBottom: 16
    },
    cardBase: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    labelValor: {
        fontSize: 14,
        color: '#888'
    },
    valor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222'
    },
    swipeAprovar: {
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 24,
        borderRadius: 12,
        marginBottom: 16,
        flex: 1,
    },
    swipeRecusar: {
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 24,
        borderRadius: 12,
        marginBottom: 16,
        flex: 1,
    },
    swipeText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginTop: 4,
    },
});

export default OrcamentoCard;