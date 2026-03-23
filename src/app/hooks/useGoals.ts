import { useState, useEffect } from 'react';

export interface Goal {
  id: string;
  playerId: string;
  metricType: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('premier-select-goals');
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem('premier-select-goals', JSON.stringify(newGoals));
  };

  const setGoal = (playerId: string, metricType: string, value: number) => {
    const existingGoalIndex = goals.findIndex(
      g => g.playerId === playerId && g.metricType === metricType
    );

    if (existingGoalIndex >= 0) {
      // Update existing goal
      const updatedGoals = [...goals];
      updatedGoals[existingGoalIndex] = {
        ...updatedGoals[existingGoalIndex],
        value,
        updatedAt: new Date().toISOString(),
      };
      saveGoals(updatedGoals);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: `goal-${Date.now()}-${Math.random()}`,
        playerId,
        metricType,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveGoals([...goals, newGoal]);
    }
  };

  const getGoal = (playerId: string, metricType: string): number | undefined => {
    const goal = goals.find(
      g => g.playerId === playerId && g.metricType === metricType
    );
    return goal?.value;
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  return {
    goals,
    setGoal,
    getGoal,
    deleteGoal,
  };
}
