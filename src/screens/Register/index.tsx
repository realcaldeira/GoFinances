import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactinTypeButton } from '../../components/Forms/TransactinTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import  { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionType
 } from './styles';

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const dataKey = '@gofinance:transactions';

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    function handleTransactionType(type: 'up' | 'down'){
        setTransactionType(type);
    }
    
    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(){
        if(name === ``)
            return Alert.alert('Digite um nome.');
        
        if(amount === ``)
            return Alert.alert('Digite um valor.');

        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação.');

        if(category.key === 'category')
            return Alert.alert('Selecione a categoria.');



        const newTransaction = {
            name,
            amount,
            transactionType,
            category: category.key
        }
        try{
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

        } catch (error){
            console.log(error);
            Alert.alert('Não foi possível salvar');
        }
    }

    useEffect(()=> {
        async function loadData(){
            const data =  await AsyncStorage.getItem(dataKey);
              console.log(JSON.parse(data!));
          }
          loadData();
  
    },[]);

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                <Title>Cadastro</Title>  
                </Header>

                <Form>
                    <Fields>
                        <Input 
                            placeholder="Nome"
                            onChangeText={setName}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                        />
                        <Input 
                            placeholder="Preço"
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <TransactionType>
                            <TransactinTypeButton 
                                type="up"
                                title="Income"
                                onPress={()=> handleTransactionType('up')}
                                isActive={transactionType === 'up'} 
                            />
                            <TransactinTypeButton 
                                type="down"
                                title="Outcome"
                                onPress={()=> handleTransactionType('down')}
                                isActive={transactionType === 'down'}
                            />
                        </TransactionType>
                        <CategorySelectButton 
                            title={category.name} 
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button 
                        title="Enviar"
                        onPress={handleRegister}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}