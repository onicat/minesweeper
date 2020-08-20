import React from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getBoard } from 'redux/selectors';
import Store from 'models/Store';
import Board from 'models/Board';
import RowComponent from './RowComponent';
import { blowUpCell, showMines, installMines, changeStage, openCells } from 'redux/actions';
import Coordinates from 'models/Coordinates';
import getArea from 'logic/getArea';
import Settings from 'models/Settings';
import { stages } from 'logic/constants';

interface BoardComponentProps {
  board: Board;
  settings: Settings;
  stage: string;
  installMines: Function;
  changeStage: Function;
  openCells: Function;
  showMines: Function;
  blowUpCell: Function;
}

const StyledBoardComponent = styled.table`
  text-align: center;
  font-weight: 800;
  border-spacing: 0;
`;

const BoardComponent = ({
  board,
  settings,
  stage,
  installMines,
  changeStage,
  openCells,
  showMines,
  blowUpCell
}: BoardComponentProps) => {
  const getCellClickHandler = (cellCoordinates: Coordinates) => {
    if (stage === stages.BEFORE_START) {      
      return () => {
        const excludedArea = getArea(
          cellCoordinates,
          {width: settings.boardWidth, height: settings.boardHeight}
        );
        
        installMines(settings.minesNumber, excludedArea);
        changeStage(stages.IN_GAME);
        openCells(cellCoordinates);
      }
    }

    if (stage === stages.IN_GAME) {
      return () => {
        const targetCell = board[cellCoordinates[0]][cellCoordinates[1]];
        
        if (targetCell.isOpen) return;
        if (targetCell.status === -1) {
          blowUpCell(cellCoordinates);
          openCells(cellCoordinates);
          showMines();
          changeStage(stages.LOSING);
        } else {
          openCells(cellCoordinates);
        }
      }
    }

    return null;
  };

  const rows = [];
  
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    rows.push(
      <RowComponent 
        row={board[rowIndex]}
        getCellClickHandler={getCellClickHandler}
      />
    );
  }

  return (
    <StyledBoardComponent>
      <tbody>
        {rows}
      </tbody>
    </StyledBoardComponent>
  )
};

const mapStateToProps = (state: Store) => ({
  board: getBoard(state)
});

export default connect(
  mapStateToProps,
  {blowUpCell, showMines, installMines, changeStage, openCells}
)(BoardComponent);