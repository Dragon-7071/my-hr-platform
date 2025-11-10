import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import styled from 'styled-components';
import type { ILoginData } from './authTypes';
import { loginUser } from './authService';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginData>();

    const handleLogin = async (data: ILoginData) => {
        setIsLoading(true);
        setError(null);
        try {
            await loginUser(data);

            navigate('/home');
        } catch (e: any) {
            // Обробка помилок Firebase
            if (e.code === 'auth/invalid-credential') {
                setError('Неправильний email або пароль.');
            } else {
                setError('Помилка входу. Спробуйте пізніше.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit(handleLogin)}>
            <h2>Вхід</h2>
            {error && <GlobalErrorMsg>{error}</GlobalErrorMsg>}

            <Input
                placeholder="Email"
                {...register('email', { required: 'Email обов\'язковий' })}
            />
            {errors.email && <ErrorMsg>{errors.email.message as string}</ErrorMsg>}

            <Input
                type="password"
                placeholder="Пароль"
                {...register('password', { required: 'Пароль обов\'язковий' })}
            />
            {errors.password && <ErrorMsg>{errors.password.message as string}</ErrorMsg>}

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Вхід...' : 'Увійти'}
            </Button>
        </FormContainer>
    );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const GlobalErrorMsg = styled(ErrorMsg)`
  margin-top: 0;
  text-align: center;
  background: #fff0f0;
  color: #d00;
  padding: 8px;
  border-radius: 4px;
`;