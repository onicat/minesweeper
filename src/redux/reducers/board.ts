import { produce } from 'immer'

import BoardCreator from 'logic/creators/BoardCreator'
import Board from 'models/Board';
import { initialSettings } from 'logic/constants';
import actionTypes from 'redux/actionTypes';
import generateRandomCoordinates from 'logic/generateRandomCoordinates';
import getArea from 'logic/getArea';

const boardCreator = new BoardCreator();
const initialState: Board = boardCreator.create(
  initialSettings.BOARD_WIDTH,
  initialSettings.BOARD_HEIGHT
);

const board = produce((state, action) => {
  switch (action.type) {
    case actionTypes.INSTALL_MINES: {
      const minesCoordinates = [];

      while (minesCoordinates.length < action.minesNumber) {
        const randomCoordinates = generateRandomCoordinates(
          state.length,
          state[0].length,
          action.excludedArea
        );

        const randomCell = state[randomCoordinates[0]][randomCoordinates[1]];

        if (randomCell.status !== -1) {
          randomCell.status = -1;
          minesCoordinates.push(randomCoordinates);
        }
      }

      for (let mineCoordinates of minesCoordinates) {
        const mineArea = getArea(
          mineCoordinates,
          {height: state.length, width: state[0].length},
          false
        );

        for (let areaCellCoordinates of mineArea) {
          const cell = state[areaCellCoordinates[0]][areaCellCoordinates[1]];

          if (cell.status !== -1) {
            cell.status++;
          }
        }
      }
    }
  }
}, initialState);

export default board;