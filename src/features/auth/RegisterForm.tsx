import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import styled from 'styled-components';
import type { IRegisterData } from './authTypes';
import { registerUser } from './authService';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Для перенаправлення

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IRegisterData>(); // Вказуємо тип для useForm

    // Функція, яка викликається при сабміті
    const handleRegister = async (data: IRegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerUser(data);
            // Якщо реєстрація успішна, перенаправляємо на головну
            navigate('/home');
        } catch (e: any) {
            // Обробка помилок Firebase
            if (e.code === 'auth/email-already-in-use') {
                setError('Цей email вже зареєстрований.');
            } else {
                setError('Помилка реєстрації. Спробуйте пізніше.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit(handleRegister)}>
            <h2>Реєстрація</h2>
            {error && <GlobalErrorMsg>{error}</GlobalErrorMsg>}

            <Input
                placeholder="Email"
                {...register('email', { required: 'Email обов\'язковий' })}
            />
            {errors.email && <ErrorMsg>{errors.email.message as string}</ErrorMsg>}

            <Input
                type="password"
                placeholder="Пароль"
                {...register('password', {
                    required: 'Пароль обов\'язковий',
                    minLength: { value: 6, message: 'Пароль має бути мін. 6 символів' },
                })}
            />
            {errors.password && <ErrorMsg>{errors.password.message as string}</ErrorMsg>}

            <Select {...register('role', { required: 'Оберіть роль' })}>
                <option value="">Я...</option>
                <option value="candidate">Кандидат (шукаю роботу)</option>
                <option value="recruiter">Рекрутер (шукаю людей)</option>
            </Select>
            {errors.role && <ErrorMsg>{errors.role.message as string}</ErrorMsg>}

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
`;