import { AxiosPromise } from 'Axios';


export interface IIndexService{
    checkDay(date:string):AxiosPromise<any>;
    checkBalance():AxiosPromise<any>;
}