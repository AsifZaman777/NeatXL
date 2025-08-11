// types/types.ts
export type CSVData = {
  headers: string[];
  data: string[][];
};

export interface DataPreviewProps {
  data: CSVData;
  onReorderColumns?: (oldIndex: number, newIndex: number) => void;
  onReorderRows?: (oldIndex: number, newIndex: number) => void;
  isDraggable?: boolean;
}
