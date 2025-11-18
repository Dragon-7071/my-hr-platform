import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { IApplicationDocument } from './applicationTypes';
import { useDraggable } from '@dnd-kit/core';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { Timestamp } from 'firebase/firestore';

// --- Змінюємо стилі, щоб приховувати оригінал під час перетягування ---
const CardContainer = styled.div<{ $isDragging: boolean }>`
    background: white;
    padding: 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;

    // Приховуємо ОРИГІНАЛ картки, поки ми тягнемо її копію
    ${(props) =>
            props.$isDragging &&
            css`
                opacity: 0.5;
                border: 1px dashed #555;
            `}
`;

const CardHeader = styled.h4`
    margin: 0 0 8px 0;
    cursor: grab; // Курсор "взяти"
`;
const CardInfo = styled.p`
    margin: 4px 0;
    font-size: 14px;
`;
const ResumeLink = styled.a`
    color: #007bff;
    font-weight: 600;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
const InterviewButton = styled.button`
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 8px;
    &:hover { background: #218838; }
`;
const InterviewInfo = styled.div`
    background: #fdfdea;
    border: 1px solid #f0e68c;
    border-radius: 6px;
    padding: 8px;
    margin-top: 8px;
    font-size: 14px;
`;

interface CandidateCardProps {
    application: IApplicationDocument;
    // Ми додамо 'isOverlay' для копії, яку тягнемо
    isOverlay?: boolean;
}

const formatInterviewTime = (time: Timestamp | Date): string => {
    const date = time instanceof Timestamp ? time.toDate() : time;
    return date.toLocaleString('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const CandidateCard = ({ application, isOverlay = false }: CandidateCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewDetails, setInterviewDetails] = useState({
        time: application.interviewTime,
        url: application.interviewUrl,
    });

    // Використовуємо useDraggable
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging, // Цей 'isDragging' скаже нам, що ОРИГІНАЛ тягнеться
    } = useDraggable({
        id: application.id,
        data: application, // Передаємо всі дані про картку
    });

    const handleSuccess = (date: Date, url: string) => {
        setInterviewDetails({ time: date, url: url });
    };

    return (
        <>
            <CardContainer
                // 'setNodeRef' вішаємо на контейнер
                ref={setNodeRef}
                // 'isDragging' передаємо для стилізації (приховування)
                $isDragging={isDragging && !isOverlay}
                // Додаємо 'style' тільки для оверлея
                style={isOverlay ? { cursor: 'grabbing' } : {}}
            >
                {/* 'listeners' і 'attributes' вішаємо на заголовок */}
                    <CardHeader {...listeners} {...attributes}>
                    {application.candidateEmail}
                    </CardHeader>

                    <CardInfo>
                        <strong>Скринінг:</strong> {application.score} / {application.maxScore}
                    </CardInfo>
                    <ResumeLink href={application.resumeUrl} download rel="noopener noreferrer">
                        Завантажити резюме
                    </ResumeLink>

                    {application.status === 'interview' && (
                        <div>
                            {interviewDetails.url ? (
                                <InterviewInfo>
                                    <strong>Заплановано:</strong> {formatInterviewTime(interviewDetails.time)}
                                    <br />
                                    <ResumeLink href={interviewDetails.url} target="_blank">
                                        Посилання на зустріч
                                    </ResumeLink>
                                </InterviewInfo>
                            ) : (
                                <InterviewButton onClick={() => setIsModalOpen(true)}>
                                    Запланувати інтерв'ю
                                </InterviewButton>
                            )}
                        </div>
                    )}
            </CardContainer>

            {/* Модальне вікно (залишається без змін) */}
            {isModalOpen && (
                <ScheduleInterviewModal
                    applicationId={application.id}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
};