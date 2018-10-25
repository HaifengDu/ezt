import { Action } from "vuex";
import LeadbackMaterialType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { LeadbackMaterialService } from "../../service/LeadbackMaterialService";
import Pager from "../../common/Pager";
const leadbackMaterialService = LeadbackMaterialService.getInstance();     
