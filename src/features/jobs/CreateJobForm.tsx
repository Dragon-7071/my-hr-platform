import { useForm, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import type {IJobData} from './jobTypes';
import { createJob } from './jobService';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 120px;
  font-family: inherit;
`;
const QuestionBlock = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
const SmallButton = styled(Button)`
  width: auto;
  padding: 8px 12px;
  font-size: 14px;
  margin-top: 10px;
  margin-right: 10px;
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

export const CreateJobForm = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: {isLoading } } = useForm<IJobData>({
        defaultValues: {
            screeningQuestions: [], // За замовчуванням питань немає
        },
    });

    // react-hook-form для динамічних полів
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'screeningQuestions',
    });

    const onSubmit = async (data: IJobData) => {
        try {
            await createJob(data);
            alert('Вакансію успішно створено!');
            navigate('/home'); // Повертаємось на дашборд
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Помилка створення вакансії');
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <h2>Створення нової вакансії</h2>

            <Input placeholder="Назва вакансії (напр., 'React Developer')" {...register('title', { required: true })} />
            <Input placeholder="Локація (напр., 'Київ, Україна' або 'Remote')" {...register('location', { required: true })} />
            <Input type="number" placeholder="Зарплата (в USD)" {...register('salary', { required: true, valueAsNumber: true })} />
            <TextArea placeholder="Опис вакансії та вимоги" {...register('description', { required: true })} />

            <hr />
            <h3>Питання для авто-скринінгу (вимога курсової)</h3>
            {fields.map((field, index) => (
                <QuestionBlock key={field.id}>
                    <Input
                        placeholder={`Питання ${index + 1}`}
                        {...register(`screeningQuestions.${index}.question` as const, { required: true })}
                    />
                    <Select {...register(`screeningQuestions.${index}.correctAnswer` as const, { required: true })}>
                        <option value="yes">Очікувана відповідь: Так</option>
                        <option value="no">Очікувана відповідь: Ні</option>
                    </Select>
                    <SmallButton type="button" onClick={() => remove(index)} style={{backgroundColor: '#dc3545'}}>
                        Видалити питання
                    </SmallButton>
                </QuestionBlock>
            ))}
            <SmallButton
                type="button"
                onClick={() => append({ id: `${Date.now()}`, question: '', correctAnswer: 'yes' })}
            >
                Додати питання
            </SmallButton>

            <Button type="submit" disabled={isLoading} style={{ marginTop: '24px' }}>
                {isLoading ? 'Створення...' : 'Опублікувати вакансію'}
            </Button>
        </FormContainer>
    );
};