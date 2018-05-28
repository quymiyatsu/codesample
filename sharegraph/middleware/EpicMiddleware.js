import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {changeCurrencyEpic, changeInstrumentEpic, networkEpic, updateDataEpic} from "./DataEpic";
import {getSettingProfileEpic} from "../../settings/profile/account/middleware/SettingProfileEpic";

const rootEpic = combineEpics(
  changeInstrumentEpic,
  changeCurrencyEpic,
  updateDataEpic,
  networkEpic,
  getSettingProfileEpic
);

const epicMiddleware = createEpicMiddleware(rootEpic);

export default epicMiddleware;