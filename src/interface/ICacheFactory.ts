import { ICache } from "./ICache";
import { ECache } from "../enum/ECache";


export interface ICacheFactory {
    create(type: ECache): ICache;
}