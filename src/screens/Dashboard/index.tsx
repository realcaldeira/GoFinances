import React, { useCallback, useEffect, useState } from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transaction,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HightLightProps {
    amount: string;
}

interface HightLightData {
    entries: HightLightProps;
    expensives: HightLightProps;
    total: HightLightProps;
}

export function Dashboard(){ 
   const [isLoading, setIsLoading] = useState(true);
   const [transactions, setTransactions] = useState<DataListProps[]>([]);
   const [hightLightData, setHightLightData] = useState<HightLightData>({} as HightLightData);

   const theme = useTheme();

    async function loadTransactions(){
        const dataKey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
            
            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }
            
            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });
        
        setTransactions(transactionsFormatted);

        const total = entriesTotal - expensiveTotal;
        setHightLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        });
        
        setIsLoading(false);
    }

   useEffect(()=>{
    loadTransactions();
    
   },[]);

   useFocusEffect(useCallback(()=>{
    loadTransactions();
   },[]))

    return(
        <Container>
            
            {  
                isLoading ?
                 <LoadContainer>
                     <ActivityIndicator 
                        color={theme.colors.primary}  
                        size="large"
                    />
                 </LoadContainer> :
            <>
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo 
                                source={{ uri: 'https://avatars.githubusercontent.com/u/58578924?v=4'}}/>
                            <User>
                                <UserGreeting>Olá, </UserGreeting>
                                <UserName>Lucas</UserName>
                            </User>
                        </UserInfo>
                        
                        <LogoutButton onPress={()=> {}}>
                            <Icon name="power"/>
                        </LogoutButton>

                    </UserWrapper>

                </Header>
                <HighlightCards>
                    <HighlightCard 
                        type="up"
                        title="Entradas" 
                        amount={hightLightData.entries.amount}
                        lastTransaction="Última entrada dia 12 de junho"
                    />
                    
                    <HighlightCard
                        type="down" 
                        title="Saídas" 
                        amount={hightLightData.expensives.amount}
                        lastTransaction="Última saída dia 16 de junho"
                    />
                    
                    <HighlightCard 
                        type="total"
                        title="Total" 
                        amount={hightLightData.total.amount}
                        lastTransaction="01 à 16 de junho"
                    />
                    
                </HighlightCards>
            <Transaction>
                <Title>Listagem</Title>
                <TransactionList 
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={ item } /> }
        
                />   
            </Transaction>
        </> }
        </Container>
    )
}

