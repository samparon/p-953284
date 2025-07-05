
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, children, isEditMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isEditMode && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 shadow-2xl z-50"
      )}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
    >
      {isEditMode && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10 pointer-events-none">
          Arrastar
        </div>
      )}
      <div className={cn(
        "transition-all duration-200",
        isEditMode && "hover:shadow-lg hover:scale-105 border-2 border-dashed border-blue-300",
        !isEditMode && "hover:scale-105"
      )}>
        {children}
      </div>
    </div>
  );
};

export default DraggableCard;
