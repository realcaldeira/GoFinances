import React, { useState } from 'react';
import { Modal } from 'react-native';

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

    return(
        <Container>
            <Header>
              <Title>Cadastro</Title>  
            </Header>

            <Form>
                <Fields>
                    <Input 
                        placeholder="Nome"
                    />
                    <Input 
                        placeholder="Preço"
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
                <Button title="Enviar"/>
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