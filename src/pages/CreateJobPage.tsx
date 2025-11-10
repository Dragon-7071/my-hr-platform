import styled from 'styled-components';
import { CreateJobForm } from '../features/jobs/CreateJobForm';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  background-color: #f4f7f6;
`;

const CreateJobPage = () => {
    return (
        <PageContainer>
            <CreateJobForm />
        </PageContainer>
    );
};

export default CreateJobPage;