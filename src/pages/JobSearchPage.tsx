import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllJobs } from '../features/jobs/jobService';
import type { IJobDocument } from '../features/jobs/jobTypes';
import { Link } from 'react-router-dom';

// Стилі
const PageContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
`;
const JobCard = styled(Link)`
  display: block;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;
const JobTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 8px;
  color: #007bff;
`;
const JobInfo = styled.p`
  margin: 4px 0;
  color: #555;
  strong { color: #000; }
`;

const JobSearchPage = () => {
    const [jobs, setJobs] = useState<IJobDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const allJobs = await getAllJobs();
                setJobs(allJobs);
            } catch (error) {
                console.error("Error fetching jobs: ", error);
                alert("Не вдалося завантажити вакансії");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []); // Пустий масив = виконати 1 раз при завантаженні

    if (isLoading) {
        return <PageContainer><h1>Завантаження вакансій...</h1></PageContainer>;
    }

    return (
        <PageContainer>
            <h1>Доступні Вакансії</h1>
            {jobs.length === 0 ? (
                <p>Наразі немає відкритих вакансій.</p>
            ) : (
                <div>
                    {jobs.map((job) => (
                        <JobCard key={job.id} to={`/job/${job.id}`}>
                            <JobTitle>{job.title}</JobTitle>
                            <JobInfo><strong>Локація:</strong> {job.location}</JobInfo>
                            <JobInfo><strong>Зарплата:</strong> ${job.salary} / місяць</JobInfo>
                        </JobCard>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default JobSearchPage;