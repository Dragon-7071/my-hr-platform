// Імпортуємо інструменти для тестування з Vitest
import { describe, test, expect } from 'vitest';

// Імпортуємо функцію, яку тестуємо
import { getStatusLabel } from './formatStatus';

// 'describe' групує тести
describe('getStatusLabel', () => {

    // 'test' або 'it' - це один конкретний тест-кейс
    test('should return correct label for "new"', () => {
        // Arrange (Підготовка)
        const status = 'new';

        // Act (Дія)
        const result = getStatusLabel(status);

        // Assert (Перевірка)
        expect(result.label).toBe('Отримано');
        expect(result.color).toBe('#007bff');
    });

    test('should return correct label for "interview"', () => {
        // Arrange
        const status = 'interview';

        // Act
        const result = getStatusLabel(status);

        // Assert
        expect(result.label).toBe('Інтерв\'ю');
        expect(result.color).toBe('#28a745');
    });

    test('should return correct label for "rejected"', () => {
        // Arrange
        const status = 'rejected';

        // Act
        const result = getStatusLabel(status);

        // Assert
        expect(result.label).toBe('Відхилено');
        expect(result.color).toBe('#dc3545');
    });

    test('should return default label for unknown status', () => {
        // Arrange
        const status = 'some-unknown-status';

        // Act
        const result = getStatusLabel(status);

        // Assert
        expect(result.label).toBe('Отримано'); // Перевіряємо, що повертається 'default'
    });
});