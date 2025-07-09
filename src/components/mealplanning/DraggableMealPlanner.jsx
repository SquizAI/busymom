import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

// Sortable Meal Card Component
const SortableMealCard = ({ meal, day }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'z-50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1">
          <h4 className="font-medium text-sm">{meal.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{meal.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meal.prepTime}min
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              meal.type === 'breakfast' ? 'bg-yellow-100 text-yellow-700' :
              meal.type === 'lunch' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {meal.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Day Column Component
const DayColumn = ({ day, meals, onDrop }) => {
  const dayMeals = meals.filter(meal => meal.day === day);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {day}
      </h3>
      
      <SortableContext
        items={dayMeals.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[200px]">
          {dayMeals.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop meals here
            </div>
          ) : (
            dayMeals.map((meal) => (
              <SortableMealCard key={meal.id} meal={meal} day={day} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const DraggableMealPlanner = ({ initialMeals, onMealsReorder }) => {
  const [meals, setMeals] = useState(initialMeals);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeMeal = meals.find(m => m.id === active.id);
    const overMeal = meals.find(m => m.id === over.id);

    if (!activeMeal) {
      setActiveId(null);
      return;
    }

    // If dropping on another meal, swap positions
    if (overMeal) {
      const activeIndex = meals.indexOf(activeMeal);
      const overIndex = meals.indexOf(overMeal);

      const newMeals = arrayMove(meals, activeIndex, overIndex);
      
      // Update the day if moving to a different day
      if (activeMeal.day !== overMeal.day) {
        newMeals[overIndex] = { ...newMeals[overIndex], day: overMeal.day };
      }

      setMeals(newMeals);
      onMealsReorder(newMeals);
      toast.success('Meal order updated!');
    }

    setActiveId(null);
  };

  const activeMeal = activeId ? meals.find(m => m.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700">
          <strong>Tip:</strong> Drag and drop meals to reorder them or move them to different days. 
          Your changes are saved automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {days.map((day) => (
          <DayColumn
            key={day}
            day={day}
            meals={meals}
            onDrop={(meal, targetDay) => {
              const updatedMeals = meals.map(m =>
                m.id === meal.id ? { ...m, day: targetDay } : m
              );
              setMeals(updatedMeals);
              onMealsReorder(updatedMeals);
            }}
          />
        ))}
      </div>

      <DragOverlay>
        {activeMeal ? (
          <div className="bg-white rounded-lg border p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{activeMeal.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{activeMeal.description}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableMealPlanner;