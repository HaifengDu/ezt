import { Action } from "vuex";
import ReceiveGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { SpilledSheetService } from "../../service/spilledSheet/SpilledSheetService";
import Pager from "../../common/Pager";
const spilledSheetService = SpilledSheetService.getInstance();  
