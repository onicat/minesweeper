import React from 'react'
import { connect } from 'react-redux';

import { getBoard } from 'redux/selectors';
import Store from 'models/Store';
import Board from 'models/Board';
import RowComponent from './RowComponent';
import { installMines, changeStage, openCells } from 'redux/actions';
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
}

const BoardComponent = ({
  board,
  settings,
  stage,
  installMines,
  changeStage,
  openCells
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
        openCells(cellCoordinates);
      }
    }
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
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
};

const mapStateToProps = (state: Store) => ({
  board: getBoard(state)
});

export default connect(
  mapStateToProps,
  {installMines, changeStage, openCells}
)(BoardComponent);