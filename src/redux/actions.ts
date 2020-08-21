import actionTypes from "./actionTypes";
import Cell from "models/Cell";
import { stages } from "logic/constants";
import getArea from "logic/getArea";
import getRandomCells from "logic/getRandomCells";
import getOpenableCellsSet from "logic/getOpenableCellsSet";
import getCellsWithFlags from "logic/getCellsWithFlags";

export const installMines = (cells: Set<Cell>) => ({
  type: actionTypes.INSTALL_MINES,
  cells
});

export const openCells = (cells: Set<Cell>) => ({
  type: actionTypes.OPEN_CELLS,
  cells
});

export const changeStage = (stage: string) => ({
  type: actionTypes.CHANGE_STAGE,
  stage
});

export const showMines = () => ({
  type: actionTypes.SHOW_MINES
});

export const blowUpCell = (cell: Cell) => ({
  type: actionTypes.BLOW_UP_CELL,
  cell
});

export const handleCellClick = (cell: Cell) => (
  dispatch: Function,
  getState: Function
) => {
  const {stage, settings} = getState();

  if (stage === stages.BEFORE_START) {
    const excludedArea = getArea(cell, getState().board);
    const minesCells = getRandomCells(
      settings.minesNumber, getState().board, excludedArea
    );

    dispatch(installMines(minesCells));

    const openableCells = getOpenableCellsSet(cell, getState().board);
    const cellsWithFlags = getCellsWithFlags(openableCells);
    
    dispatch(openCells(openableCells));
    dispatch(removeFlags(cellsWithFlags));
    dispatch(changeStage(stages.IN_GAME));
  } else if (stage === stages.IN_GAME) {
    if (cell.isOpen) return;
    if (cell.status === -1) {
      dispatch(blowUpCell(cell));
      
      const openableCells = getOpenableCellsSet(cell, getState().board);
      const cellsWithFlags = getCellsWithFlags(openableCells);
      
      dispatch(openCells(openableCells));
      dispatch(removeFlags(cellsWithFlags));
      dispatch(showMines());
      dispatch(changeStage(stages.LOSING));
    } else {
      const openableCells = getOpenableCellsSet(cell, getState().board);

      dispatch(openCells(openableCells));
    }
  }
};

export const toggleFlag = (cell: Cell, value: boolean) => ({
  type: actionTypes.TOGGLE_FLAG,
  cell,
  value
});

export const handleFlagPlacing = (cell: Cell) => (
  dispatch: Function,
  getState: Function
) => {
  if (cell.isOpen) return;

  const newFlagValue = (cell.isFlagged) ? false : true;

  dispatch(toggleFlag(cell, newFlagValue));
};

export const removeFlags = (cells: Set<Cell>) => ({
  type: actionTypes.REMOVE_FLAGS,
  cells
});