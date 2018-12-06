import { AxiosPromise } from 'Axios';
import { IPagerData } from "../IPagerData";

export interface IInitStockService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>
}