import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getJobById } from '../features/jobs/jobService';
import type { IJobDocument } from '../features/jobs/jobTypes';
import { ApplyForm } from '../features/applications/ApplyForm';

const PageContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
`;
const Header = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;
const JobTitle = styled.h1`
  margin: 0;
`;
const JobInfo = styled.p`
  font-size: 18px;
  color: #555;
  margin: 8px 0;
  strong { color: #000; }
`;
const Description = styled.div`
  line-height: 1.6;
  white-space: pre-wrap; // Зберігає форматування тексту (абзаци)
`;

const JobDetailsPage = () => {
    const { jobId } = useParams<{ jobId: string }>(); // Отримуємо ID з URL
    const [job, setJob] = useState<IJobDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!jobId) return;

        const fetchJob = async () => {
            try {
                const jobData = await getJobById(jobId);
                setJob(jobData);
            } catch (error) {
                console.error('Error fetching job details:', error);
                alert('Не вдалося завантажити вакансію');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    if (isLoading) {
        return <PageContainer><h1>Завантаження...</h1></PageContainer>;
    }

    if (!job) {
        return <PageContainer><h1>Вакансію не знайдено</h1></PageContainer>;
    }

    return (
        <PageContainer>
            <Header>
                <JobTitle>{job.title}</JobTitle>
                <JobInfo><strong>Локація:</strong> {job.location}</JobInfo>
                <JobInfo><strong>Зарплата:</strong> ${job.salary} / місяць</JobInfo>
            </Header>

            <Description>{job.description}</Description>

            {/* Форма подачі заявки */}
            <ApplyForm job={job} />
        </PageContainer>
    );
};

export default JobDetailsPage;