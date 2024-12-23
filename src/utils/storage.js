export function saveProgress(level, tasksCompleted) {
    const progress = { level, tasksCompleted };
    localStorage.setItem('gameProgress', JSON.stringify(progress));
}

// Загрузить прогресс игры
export function loadProgress() {
    const progress = localStorage.getItem('gameProgress');
    return progress ? JSON.parse(progress) : { level: 1, tasksCompleted: [] }; // Начальный уровень и пустые задачи
}

// Сбросить прогресс игры
export function resetProgress() {
    localStorage.removeItem('gameProgress');
}