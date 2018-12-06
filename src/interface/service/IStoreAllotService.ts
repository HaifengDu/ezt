import { AxiosPromise } from 'axios';
import { IPagerData } from '../IPagerData';

export interface IStoreAllotService{
    getGoodList(status:string,pager:IPagerData):AxiosPromise<any>;
}