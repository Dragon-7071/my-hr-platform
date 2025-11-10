import { RegisterForm } from '../features/auth/RegisterForm';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <PageContainer>
            <RegisterForm />
            <StyledLink to="/login">Вже маєте акаунт? Увійти</StyledLink>
        </PageContainer>
    );
};

export default RegisterPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f7f6;
`;

const StyledLink = styled(Link)`
  margin-top: 16px;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;