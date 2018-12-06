import { AxiosPromise } from 'Axios';
import { IPagerData } from '../IPagerData';

export interface IInStoreAllotService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>
}