import React, { useState } from 'react';
import styled from 'styled-components';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Імпорт стилів
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { scheduleInterview } from './applicationService';

// Стилі для модального вікна
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
`;
const DatePickerWrapper = styled.div`
  margin-bottom: 16px;
  // Стилі, щоб ReactDatePicker виглядав як наш Input
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
  }
`;

interface ScheduleInterviewModalProps {
    applicationId: string;
    onClose: () => void; // Функція, щоб закрити вікно
    onSuccess: (date: Date, url: string) => void; // Функція, щоб оновити UI
}

export const ScheduleInterviewModal = ({
                                           applicationId,
                                           onClose,
                                           onSuccess,
                                       }: ScheduleInterviewModalProps) => {
    const [interviewTime, setInterviewTime] = useState<Date | null>(new Date());
    const [interviewUrl, setInterviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!interviewTime || !interviewUrl) {
            alert('Будь ласка, заповніть всі поля');
            return;
        }

        setIsLoading(true);
        try {
            await scheduleInterview(applicationId, interviewTime, interviewUrl);
            onSuccess(interviewTime, interviewUrl); // Повертаємо дані для оновлення UI
            onClose(); // Закриваємо вікно
        } catch (error) {
            console.error(error);
            alert('Не вдалося запланувати інтерв\'ю');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Запланувати інтерв'ю</h2>
                    <DatePickerWrapper>
                        <label>Оберіть дату та час:</label>
                        <ReactDatePicker
                            selected={interviewTime}
                            onChange={(date) => setInterviewTime(date)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            minDate={new Date()}
                        />
                    </DatePickerWrapper>
                    <div>
                        <label>Посилання на зустріч (Google Meet, Zoom...):</label>
                        <Input
                            type="url"
                            placeholder="https://meet.google.com/..."
                            value={interviewUrl}
                            onChange={(e) => setInterviewUrl(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} style={{marginTop: '16px'}}>
                        {isLoading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                    <Button type="button" onClick={onClose} style={{marginTop: '8px', background: '#6c757d'}}>
                        Скасувати
                    </Button>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};