// components/DataPreview.tsx
'use client';

import { CSVData, DataPreviewProps } from '../types/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Modifier } from '@dnd-kit/core';

// Custom modifier to offset drag overlay position
const offsetOverlay: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: transform.x - 500, // move left from the original position
    y: transform.y - 250,  // move up from the original position
  };
};

// Draggable Column Header Component
function DraggableColumnHeader({
  id,
  children,
  index,
}: {
  id: string;
  children: React.ReactNode;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'column',
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' : 'static',
    opacity: isDragging ? 0.3 : 1,
  } as React.CSSProperties;

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`px-3 py-2 text-left text-xs font-bold text-gray-700 bg-gray-100 border-r border-gray-300 min-w-32 relative`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing select-none"
      >
        <span className="text-gray-400 hover:text-gray-600">⋮⋮</span>
        <span className="truncate" title={String(children)}>
          {children}
        </span>
      </div>
    </th>
  );
}

// Draggable Row Component
function DraggableRow({
  id,
  children,
  rowIndex,
  isEven,
}: {
  id: string;
  children: React.ReactNode;
  rowIndex: number;
  isEven: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'row',
      index: rowIndex,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' : 'static',
    opacity: isDragging ? 0.3 : 1,
  } as React.CSSProperties;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-200 hover:bg-blue-50 ${
        isEven ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      {/* Row number with drag handle */}
      <td className="w-12 px-2 py-2 text-center text-xs font-medium text-gray-500 bg-gray-100 border-r border-gray-300 relative">
        <div
          {...attributes}
          {...listeners}
          className="flex flex-col items-center cursor-grab active:cursor-grabbing hover:bg-gray-200 rounded p-1 select-none"
        >
          <span className="text-gray-400 text-xs hover:text-gray-600">⋮</span>
          <span>{rowIndex + 1}</span>
        </div>
      </td>
      {children}
    </tr>
  );
}

export default function DataPreview({
  data,
  onReorderColumns,
  onReorderRows,
  isDraggable = true,
}: DataPreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'column' | 'row' | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    const d = event.active.data.current;
    setDragType(d?.type || null);
    setActiveData(d);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const activeData = active.data.current;
      const overData = over.data.current;

      if (
        activeData?.type === 'column' &&
        overData?.type === 'column' &&
        onReorderColumns
      ) {
        onReorderColumns(activeData.index, overData.index);
      } else if (
        activeData?.type === 'row' &&
        overData?.type === 'row' &&
        onReorderRows
      ) {
        onReorderRows(activeData.index, overData.index);
      }
    }
    setActiveId(null);
    setDragType(null);
    setActiveData(null);
  };

  const columnIds = data.headers.map((_, index) => `column-${index}`);
  const rowIds = data.data.slice(0, 100).map((_, index) => `row-${index}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
        <div className="bg-gray-100 border-b border-gray-300 px-2 py-1 text-xs text-gray-600 font-medium flex justify-between items-center">
          <span>
            📊 Spreadsheet View - {data.data.length} rows × {data.headers.length}{' '}
            columns
          </span>
          <span className="text-blue-600">
            🖱️ Drag headers and row numbers to reorder
          </span>
        </div>

        <div className="overflow-auto max-h-96 relative">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="w-12 px-2 py-2 text-center text-xs font-bold text-gray-600 bg-gray-200 border-r border-gray-300">
                  #
                </th>
                <SortableContext
                  items={columnIds}
                  strategy={horizontalListSortingStrategy}
                >
                  {data.headers.map((header, index) => (
                    <DraggableColumnHeader
                      key={`column-${index}`}
                      id={`column-${index}`}
                      index={index}
                    >
                      {header}
                    </DraggableColumnHeader>
                  ))}
                </SortableContext>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={rowIds}
                strategy={verticalListSortingStrategy}
              >
                {data.data.slice(0, 100).map((row, rowIndex) => (
                  <DraggableRow
                    key={`row-${rowIndex}`}
                    id={`row-${rowIndex}`}
                    rowIndex={rowIndex}
                    isEven={rowIndex % 2 === 0}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: '200px', minWidth: '120px' }}
                        title={String(cell)}
                      >
                        <div className="truncate">
                          {cell || (
                            <span className="text-gray-400 italic">empty</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </DraggableRow>
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </div>

      {/* Drag overlay with position adjustment */}
      <DragOverlay
        dropAnimation={{
          duration: 20,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        modifiers={[offsetOverlay]}
      >
        {activeId && activeData ? (
          dragType === 'column' ? (
            <div className="bg-blue-500 text-white border border-blue-600 rounded shadow-2xl px-3 py-2 text-xs font-bold opacity-95 cursor-grabbing">
              <div className="flex items-center gap-2">
                <span>⋮⋮</span>
                <span className="truncate max-w-32">
                  {data.headers[activeData.index]}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-green-500 text-white border border-green-600 rounded shadow-2xl px-3 py-2 text-xs font-bold opacity-95 cursor-grabbing">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>Row {activeData.index + 1}</span>
              </div>
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
