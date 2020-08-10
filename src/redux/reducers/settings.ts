import produce from "immer";

import Settings from "models/Settings";
import { initialSettings } from "logic/constants";

const initialState: Settings = {
  boardWidth: initialSettings.BOARD_WIDTH,
  boardHeight: initialSettings.BOARD_HEIGHT
};

const settings = produce((state, action) => {

}, initialState);

export default settings;