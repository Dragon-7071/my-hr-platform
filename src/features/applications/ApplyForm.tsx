import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button } from '../../shared/ui/Button';
import type { IJobDocument } from '../jobs/jobTypes';
import type { IApplicationData } from './applicationTypes';
import { submitApplication } from './applicationService';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.form`
  margin-top: 32px;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;
const QuestionLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`;
const QuestionBlock = styled.div`
  margin-bottom: 20px;
`;
const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;
const FileInputLabel = styled.label`
  display: block;
  padding: 12px 16px;
  background-color: #fff;
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  text-align: center;
  &:hover {
    border-color: #007bff;
  }
`;
const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
`;

interface ApplyFormProps {
    job: IJobDocument;
}

export const ApplyForm = ({ job }: ApplyFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<IApplicationData>();
    const { onChange: onResumeChange, ...resumeRegister } = register('resume', { required: true });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onResumeChange(e);
        setFileName(e.target.files?.[0]?.name || '');
    };

    const onSubmit = async (data: IApplicationData) => {
        setIsLoading(true);
        try {
            await submitApplication(job, data);
            alert('Ви успішно подали заявку!');
            navigate('/home'); // Повертаємо кандидата на його дашборд
        } catch (error) {
            console.error(error);
            alert('Не вдалося подати заявку. Спробуйте пізніше.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <h3>Подача заявки</h3>

            {/* 1. Питання для скринінгу */}
            {job.screeningQuestions.map((q, index) => (
                <QuestionBlock key={q.id}>
                    <QuestionLabel>{index + 1}. {q.question}</QuestionLabel>
                    <RadioGroup>
                        <label>
                            <input
                                type="radio"
                                value="yes"
                                {...register(`answers.${q.id}` as const, { required: true })}
                            /> Так
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="no"
                                {...register(`answers.${q.id}` as const, { required: true })}
                            /> Ні
                        </label>
                    </RadioGroup>
                </QuestionBlock>
            ))}

            {/* 2. Завантаження резюме */}
            <QuestionBlock>
                <QuestionLabel>Ваше резюме (PDF, DOCX)</QuestionLabel>
                <FileInputLabel>
                    {fileName || 'Натисніть, щоб обрати файл'}
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...resumeRegister}
                        onChange={handleFileChange} // (залишається)
                        hidden
                    />
                </FileInputLabel>
                {errors.resume && <ErrorMsg>Будь ласка, завантажте резюме</ErrorMsg>}
            </QuestionBlock>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Відправка...' : 'Надіслати заявку'}
            </Button>
        </FormContainer>
    );
};