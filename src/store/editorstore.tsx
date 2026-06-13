import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

// ==================== TYPES ====================
export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  properties: {
    // Text properties
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: string;
    textAlign?: string;
    lineHeight?: number;
    
    // Image properties
    url?: string;
    opacity?: number;
    
    // Shape properties
    shapeType?: 'rectangle' | 'circle' | 'triangle';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
}

export interface EditorState {
  // Elements
  elements: DesignElement[];
  selectedElementId: string | null;
  
  // Zoom & View
  zoom: number;
  panX: number;
  panY: number;
  
  // History
  history: DesignElement[][];
  historyIndex: number;
  
  // UI State
  projectName: string;
  unsavedChanges: boolean;
  showGrid: boolean;
  
  // Actions
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectElement: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setProjectName: (name: string) => void;
  setShowGrid: (show: boolean) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  
  // Batch operations
  duplicateElement: (id: string) => void;
  raiseLayer: (id: string) => void;
  lowerLayer: (id: string) => void;
  toggleLock: (id: string) => void;
  
  // Reset
  clearAll: () => void;
}

// ==================== ZUSTAND STORE ====================
export const useEditorStore = create<EditorState>()(
  devtools(
    subscribeWithSelector((set) => ({
      // Initial state
      elements: [],
      selectedElementId: null,
      zoom: 100,
      panX: 0,
      panY: 0,
      history: [[]],
      historyIndex: 0,
      projectName: 'Untitled Design',
      unsavedChanges: false,
      showGrid: true,

      // Element actions
      addElement: (element) => {
        set((state) => {
          const newId = `element-${Date.now()}`;
          const newElement: DesignElement = {
            ...element,
            id: newId,
          };
          const newElements = [...state.elements, newElement];
          
          // Add to history
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);
          
          return {
            elements: newElements,
            selectedElementId: newId,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      removeElement: (id) => {
        set((state) => {
          const newElements = state.elements.filter((el) => el.id !== id);
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);
          
          return {
            elements: newElements,
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      updateElement: (id, updates) => {
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          );
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);
          
          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      selectElement: (id) => {
        set({ selectedElementId: id });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(50, Math.min(200, zoom)) });
      },

      setPan: (x, y) => {
        set({ panX: x, panY: y });
      },

      setProjectName: (name) => {
        set({ projectName: name, unsavedChanges: true });
      },

      setShowGrid: (show) => {
        set({ showGrid: show });
      },

      // History management
      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex,
              selectedElementId: null,
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex,
              selectedElementId: null,
            };
          }
          return state;
        });
      },

      saveSnapshot: () => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          if (newHistory[newHistory.length - 1] !== state.elements) {
            newHistory.push(state.elements);
            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          }
          return state;
        });
      },

      // Batch operations
      duplicateElement: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const newElement: DesignElement = {
            ...element,
            id: `element-${Date.now()}`,
            x: element.x + 20,
            y: element.y + 20,
            zIndex: Math.max(...state.elements.map((el) => el.zIndex), 0) + 1,
          };

          const newElements = [...state.elements, newElement];
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            selectedElementId: newElement.id,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      raiseLayer: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, zIndex: maxZ + 1 } : el
          );
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      lowerLayer: (id) => {
        set((state) => {
          const element = state.elements.find((el) => el.id === id);
          if (!element) return state;

          const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, zIndex: minZ - 1 } : el
          );
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      toggleLock: (id) => {
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, locked: !el.locked } : el
          );
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            unsavedChanges: true,
          };
        });
      },

      clearAll: () => {
        set({
          elements: [],
          selectedElementId: null,
          history: [[]],
          historyIndex: 0,
          unsavedChanges: true,
        });
      },
    }))
  )
);
