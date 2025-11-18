import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {DndContext, type DragEndEvent, type DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, } from '@dnd-kit/core';
import {getApplicationsForJob, updateApplicationStatus, } from './applicationService';
import type { IApplicationDocument } from './applicationTypes';
import { CandidateCard } from './CandidateCard';

// Константа колонок
const KANBAN_COLUMNS = {
    new: { id: 'new', title: 'Нові заявки' },
    screening: { id: 'screening', title: 'Скрінінг' },
    interview: { id: 'interview', title: 'Інтерв\'ю' },
    rejected: { id: 'rejected', title: 'Відхилено' },
};

type ColumnId = keyof typeof KANBAN_COLUMNS;
type KanbanState = Record<ColumnId, IApplicationDocument[]>;

// Стилі (BoardContainer, Column, ColumnTitle залишаються)
const BoardContainer = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px;
    background-color: #f4f7f6;
    border-radius: 12px;
    overflow-x: auto;
`;
const Column = styled.div`
    width: 300px;
    min-width: 300px;
    background: #ebecf0;
    border-radius: 8px;
`;
const ColumnTitle = styled.h3`
    padding: 16px;
    margin: 0;
    text-align: center;
`;
// 4. DropZone тепер використовує 'isOver' з useDroppable
const DropZone = styled.div<{ $isOver: boolean }>`
    padding: 16px;
    min-height: 500px;
    background-color: ${(props) => (props.$isOver ? '#e6efff' : 'transparent')};
    transition: background-color 0.2s ease;
`;

// 5. Новий компонент для Колонки, щоб інкапсулювати логіку 'useDroppable'
interface KanbanColumnProps {
    id: ColumnId;
    title: string;
    items: IApplicationDocument[];
}

const KanbanColumn = ({ id, title, items }: KanbanColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Column>
            <ColumnTitle>{title}</ColumnTitle>
            <DropZone ref={setNodeRef} $isOver={isOver}>
                {items.map((app) => (
                    <CandidateCard key={app.id} application={app} />
                ))}
            </DropZone>
        </Column>
    );
};

// 6. Основний компонент Kanban
interface CandidateKanbanProps {
    jobId: string;
}

export const CandidateKanban = ({ jobId }: CandidateKanbanProps) => {
    const [applications, setApplications] = useState<KanbanState>({
        new: [], screening: [], interview: [], rejected: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    // 7. Стан для 'DragOverlay'
    const [activeItem, setActiveItem] = useState<IApplicationDocument | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // Завантаження даних
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const apps = await getApplicationsForJob(jobId);
                const newState: KanbanState = { new: [], screening: [], interview: [], rejected: [] };
                apps.forEach((app) => {
                    const statusKey = (app.status || 'new') as ColumnId;
                    if (newState[statusKey]) {
                        newState[statusKey].push(app);
                    } else {
                        newState['new'].push(app);
                    }
                });
                setApplications(newState);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);

    // 8. Обробник початку перетягування (для DragOverlay)
    const handleDragStart = (event: DragStartEvent) => {
        // 'data' ми передали з useDraggable
        setActiveItem(event.active.data.current as IApplicationDocument);
    };

    // 9. Спрощена логіка 'onDragEnd'
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveItem(null); // Завжди очищуємо оверлей
        const { active, over } = event;

        // 'over.id' - це ID колонки (з useDroppable)
        // 'active.id' - це ID картки (з useDraggable)
        if (!over || !active.id) return;

        const newStatus = over.id as ColumnId;
        const activeId = String(active.id);

        // Знаходимо, де картка була
        const oldStatus = (Object.keys(applications) as ColumnId[]).find((key) =>
            applications[key].some((item) => item.id === activeId)
        );

        if (!oldStatus || oldStatus === newStatus) {
            return;
        }

        // Оновлюємо стан локально
        setApplications((prev) => {
            const movedItem = prev[oldStatus].find((item) => item.id === activeId);
            if (!movedItem) return prev;

            const newState = { ...prev };
            newState[oldStatus] = newState[oldStatus].filter(
                (item) => item.id !== activeId
            );
            newState[newStatus] = [...newState[newStatus], movedItem];
            return newState;
        });

        // Оновлюємо в Firebase
        updateApplicationStatus(activeId, newStatus).catch((e) => {
            console.error('Failed to update status: ', e);
        });
    };

    if (isLoading) return <p>Завантаження заявок...</p>;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <BoardContainer>
                {(
                    Object.entries(KANBAN_COLUMNS) as [
                        ColumnId,
                        typeof KANBAN_COLUMNS[ColumnId],
                    ][]
                ).map(([colId, column]) => (
                    // 10. Рендеримо компонент 'KanbanColumn'
                    <KanbanColumn
                        key={colId}
                        id={colId}
                        title={column.title}
                        items={applications[colId]}
                    />
                ))}
            </BoardContainer>

            {/* 11. DragOverlay */}
            <DragOverlay>
                {activeItem ? (
                    <CandidateCard application={activeItem} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};