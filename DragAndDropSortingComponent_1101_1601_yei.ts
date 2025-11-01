// 代码生成时间: 2025-11-01 16:01:41
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DndProvider, DndContext, DndVirtualList, useSensor, DndSensor, DndSensorOptions, DndMouseEvent, DndKeyboardEvent,SensorType, useSensors, DndSensorEvent, DragOverlay, Draggable, Droppable, DndState } from '@dnd-kit/core';
import { css } from '@dnd-kit/utilities';
import { arrayMove, SortableContext } from 'react-sortable-hoc';

@Component
export default class DragAndDropSortingComponent extends Vue {
  // The list of items to be sorted
  @Prop() items: any[] = [];
  
  // Context to provide to children for state management
  sortableContext: SortableContext = new SortableContext(this.$createElement);
  
  // Internal state to track the list of items after sorting
  private sortedItems: any[] = [];
  
  // Method to update the list of items and emit the sorted list to the parent
  private handleSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number; }): void {
    // Error handling for out-of-bounds indices
    if (oldIndex < 0 || newIndex < 0 || oldIndex >= this.items.length || newIndex >= this.items.length) {
      console.error('Invalid indices provided to handleSortEnd.');
      return;
    }
    
    // Update the internal state
    this.sortedItems = arrayMove(this.items, oldIndex, newIndex);
    
    // Emit the sorted list to the parent component
    this.$emit('sorted', this.sortedItems);
  }
  
  // Mount hook to initialize sortedItems with the initial items
  mounted(): void {
    this.sortedItems = [...this.items];
  }
  
  // Render function
  render(): VNode {
    // Use DndContext for drag and drop context
    return (
      <DndProvider options={{
        backend: 'HTML5',
        options: {
          sensitivity: 5,
          delay: 100,
        },
      }}>
        <DndContext onDragEnd={this.handleSortEnd} sensors={[
          useSensor(DndSensor.POINTER, {
            options: {
              pointerType: 'mouse',
            } as DndSensorOptions['POINTER'],
          }),
          useSensor(DndSensor.POINTER, {
            options: {
              pointerType: 'touch',
            } as DndSensorOptions['POINTER'],
          }),
          useSensor(DndSensor.KEYBOARD),
        ] as DndSensor[]}>
          {this.sortedItems.map((item: any, index: number) => (
            <Droppable droppableId={String(index)} key={String(index)} onDragOver={this.handleDragOver}>
              <Draggable
                key={String(item.id)}
                id={String(item.id)}
                draggableId={String(item.id)}
                index={index}
              >
                {this.renderItem(item)}
              </Draggable>
            </Droppable>
          ))}
        </DndContext>
      </DndProvider>
    );
  }
  
  // Render individual item
  private renderItem(item: any): VNode {
    // Custom rendering logic for each item can be placed here
    return (
      <div class='item'>
        {item.name}
      </div>
    );
  }
  
  // Method to handle drag over event
  private handleDragOver(event: DndMouseEvent | DndKeyboardEvent): void {
    // Implement logic to handle drag over event, e.g., highlighting the current item
    // For simplicity, we're omitting the details here
  }
}

// CSS styles
const itemStyles = css({
  padding: '16px',
  margin: '4px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
});

// Register styles globally
Vue.component('DragAndDropSortingComponent', DragAndDropSortingComponent);
