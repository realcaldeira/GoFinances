import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver} from '@hookform/resolvers/yup';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { InputForm } from '../../components/Forms/InputForm';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

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

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string().required('Nome é obrigatório'),
    amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

export function Register(){

    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const dataKey = '@gofinance:transactions';

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const navigation = useNavigation();

    const { 
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
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

    async function handleRegister(form: FormData){
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação');
        if(category.key  === 'category')
            return Alert.alert('Selecione a categoria')

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
            }
            try {
                const data = await AsyncStorage.getItem(dataKey);
                const currentData = data ? JSON.parse(data) : [];

                const dataFormatted = [
                    ...currentData,
                    newTransaction
                ]

                 await AsyncStorage.setItem(dataKey, JSON.stringify(data));
                 reset();
                 setTransactionType('');
                 setCategory({
                    key: 'category',
                    name: 'Categoria',
                });
                
                 navigation.navigate('Listagem');

            }catch (error) {
                console.log(error);
                Alert.alert('Não foi possível salvar');
            }
        }

        useEffect(()=>{
            async function loadData(){
                await AsyncStorage.getItem(dataKey);
            }
            loadData();
        },[])
       

    return(
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                <Title>Cadastro</Title>  
                </Header>

                <Form>
                    <Fields>
                        <InputForm 
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm 
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
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
                        onPress={handleSubmit(handleRegister)}
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