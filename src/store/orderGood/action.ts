import { Action } from "vuex";
import OrderGoodType from "./mutation-types";
import IRootState from "../../interface/store/IRootState";
import { OrderGoodsService } from "../../service/orderGood/OrderGoodsService";
import Pager from "../../common/Pager";
const orderGoodsService = OrderGoodsService.getInstance();    