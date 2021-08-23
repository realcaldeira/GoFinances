import React, { useState, } from 'react';
import { 
    Modal, 
    
} from 'react-native';
import { useForm } from 'react-hook-form';

import { InputForm } from '../../components/Forms/InputForm';
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

interface FormData {
    name: string;
    amount: string;
}

export function Register(){

    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const dataKey = '@gofinance:transactions';

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const { 
        control,
        handleSubmit
    } = useForm();

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
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
            }
            console.log(data);
        }
       

    return(
       
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
                        />
                        <InputForm 
                            name="amount"
                            control={control}
                            placeholder="Preço"
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
        
    )
}