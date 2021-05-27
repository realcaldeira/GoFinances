import React, { useState } from 'react';

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactinTypeButton } from '../../components/Forms/TransactinTypeButton';
import { CategorySelect } from '../../components/Forms/CategorySelect';

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
    
    function handleTransactionType(type: 'up' | 'down'){
        setTransactionType(type);
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
                    <CategorySelect title="Categoria" />
                </Fields>
                <Button title="Enviar"/>
            </Form>

        </Container>
    )
}