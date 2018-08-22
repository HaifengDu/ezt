import './axios';
import './extendVue';
import Axios from "axios";
import cacheWraperAxios from "./extendAxios";
cacheWraperAxios(Axios);