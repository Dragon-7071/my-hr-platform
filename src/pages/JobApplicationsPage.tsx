import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { CandidateKanban } from '../features/applications/CandidateKanban';
import { getJobById } from '../features/jobs/jobService';
import type { IJobDocument } from '../features/jobs/jobTypes';

const PageContainer = styled.div`
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
`;
const Header = styled.div`
  margin-bottom: 24px;
`;
const BackLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const JobTitle = styled.h1`
  margin-top: 8px;
`;

const JobApplicationsPage = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<IJobDocument | null>(null);

    useEffect(() => {
        if (jobId) {
            getJobById(jobId).then(setJob);
        }
    }, [jobId]);

    if (!jobId) return <PageContainer><h1>Помилка: ID вакансії не знайдено</h1></PageContainer>;

    return (
        <PageContainer>
            <Header>
                <BackLink to="/home">{'<'} Назад до списку вакансій</BackLink>
                <JobTitle>
                    Заявки на вакансію: {job ? job.title : 'Завантаження...'}
                </JobTitle>
            </Header>

            <CandidateKanban jobId={jobId} />
        </PageContainer>
    );
};

export default JobApplicationsPage;