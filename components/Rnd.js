import { v4 as uuid } from "uuid";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";

const itemsFromBackend = [
  { id: uuid(), content: "First item" },
  { id: uuid(), content: "Second item" },
];

const columnsFromBackEnd = {
  [uuid()]: {
    name: "Todo",
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Ready for Prod",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    //get current column object.
    const column = columns[source.droppableId];
    //get "itemsfromBackend of that column"
    const copyItems = [...column.items];
    //remove the 1 item from "source.index"
    const [removed] = copyItems.splice(source.index, 1);
    //insert removed element into the desination index (thus swapping the items)
    copyItems.splice(destination.index, 0, removed);
    //update the columns state
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copyItems,
      },
    });
  }
};

export default function Rnd() {
  const [columns, setColumns] = useState(columnsFromBackEnd);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={id}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable key={id} droppableId={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        style={{
                          background: snapshot.isDraggingOver ? "red" : "green",
                          padding: 4,
                          minWidth: 250,
                          minHeight: 500,
                        }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className="draggableBox"
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
