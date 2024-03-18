import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { BoardContainer, BoardGroup, TrashCan } from "../styles/dndStyle";
import { useRecoilState } from "recoil";
import { toDoState } from "../recoil/atom";
import DropSection from "./DropSection";
import { FaTrashAlt } from "react-icons/fa";

const DndSection = () => {
  const [todos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    // console.log(draggableId, source, destination);
    // 보드 밖에 드롭한 경우
    if (!destination) return;

    // 할일 삭제
    if (destination.droppableId === "삭제") {
      setToDos((prevToDos) => {
        const deleteTask = [...prevToDos[source.droppableId]];

        deleteTask.splice(source.index, 1);

        return {
          ...prevToDos,
          [source.droppableId]: deleteTask,
        };
      });
    } else if (source.droppableId === destination?.droppableId) {
      // 같은 카테고리로 이동한 경우
      setToDos((prevTodos) => {
        const updateBoard = [...prevTodos[destination.droppableId]];

        // 움직인 리스트
        const movedTodo = updateBoard[source.index];

        updateBoard.splice(source.index, 1);
        updateBoard.splice(destination.index, 0, movedTodo);

        // 보드 최신화
        return {
          ...prevTodos,
          [destination.droppableId]: updateBoard,
        };
      });
    }
    // 다른 카테고리로 이동한 경우
    else {
      setToDos((prevTodos) => {
        const originalBoard = [...prevTodos[source.droppableId]];

        const updateBoard = [...prevTodos[destination.droppableId]];

        // 움직인 리스트
        const movedTodo = originalBoard[source.index];

        originalBoard.splice(source.index, 1);
        updateBoard.splice(destination.index, 0, movedTodo);

        // 보드 최신화
        return {
          ...prevTodos,
          [source.droppableId]: originalBoard,
          [destination.droppableId]: updateBoard,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BoardContainer>
        <BoardGroup>
          {/* 카테고리로 drop section 분류 */}
          {Object.keys(todos).map((v) => (
            <DropSection key={v} boardId={v} todos={todos[v]} />
          ))}
        </BoardGroup>
      </BoardContainer>
      <Droppable droppableId="삭제">
        {(provided) => (
          <TrashCan ref={provided.innerRef} {...provided.droppableProps}>
            <FaTrashAlt className="logo" />
            {/* {provided.placeholder} */}
          </TrashCan>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DndSection;
