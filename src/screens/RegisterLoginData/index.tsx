import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { Header } from '../../components/Header';
import {
  Container,
  Form
} from './styles';



interface FormData {
  service_name: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  service_name: Yup.string().required('Nome do serviço é obrigatório!'),
  email: Yup.string().email('Não é um email válido').required('Email é obrigatório!'),
  password: Yup.string().required('Senha é obrigatória!'),
})

export function RegisterLoginData() {
  const { navigate } = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  async function handleRegister(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    }

    const dataKey = '@savepass:logins';

    const dataRaw = await AsyncStorage.getItem(dataKey)
    const data = JSON.parse(dataRaw) as FormData[]
    data.push(newLoginData)
    await AsyncStorage.setItem(dataKey, JSON.stringify(data))

    // Save data on AsyncStorage and navigate to 'Home' screen
    navigate('Home')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Header />
      <Container>
        <Form>
          <Input
            testID="service-name-input"
            title="Nome do serviço"
            name="service_name"
            error={errors.service_name?.message}
            control={control}
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            testID="email-input"
            title="E-mail"
            name="email"
            error={errors.email?.message}
            control={control}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            testID="password-input"
            title="Senha"
            name="password"
            error={errors.password?.message}
            control={control}
            secureTextEntry
          />

          <Button
            style={{
              marginTop: RFValue(8)
            }}
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  )
}