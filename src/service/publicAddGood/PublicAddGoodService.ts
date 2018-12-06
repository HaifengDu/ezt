import { BaseService } from "../BaseService";//接口请求的地址
import { ERequestType } from "../../enum/ERequestType";//遍历请求接口的几个前缀
import Axios from "axios";
import { IPublicAddGoodService } from "../../interface/service/IPublicAddGoodService";

export class PublicAddGoodService extends BaseService implements IPublicAddGoodService{

    private static _instance: PublicAddGoodService;
    private constructor() {
        super(ERequestType.AppOrder)
    }
    getGoodList(){
        // const promise = Axios.post(`${this.reqUrl}returnorder/post`,{
        //     data: [{"bill_type":"dc_order"}],
        //     "oper": "UNDER_RECEIVING_LIST",
        //     "pagination": pager
        // });
       /*  const promise = Axios.get(`http://api.scmacewill.cn:3000/apimock/getMockData?id=12`);
        return promise; */
        let data = {
            data:[{
                id:1,
                name:"牛羊肉",
                cdata:[{
                  id:0,
                  name:"全部",
                  goodList:[{
                    material_id:11,
                    name:"草鱼半成品",
                    price:12,
                    returnNum:2,
                    stock:3,
                    amt:10,
                    utilname:"KG",
                    unit:"箱",
                    roundValue:{//可直拨的数据
                      num: 10,
                      numed:3,
                    }
                  }]
                }]
              },{
                id:2,
                name:"成本类",
                cdata:[{
                  id:3,
                  name:"全部",
                  goodList:[{
                    material_id:21,
                    name:"海参",
                    price:9,
                    amt:8,
                    returnNum:0,
                    stock:2,
                    num:0,
                    utilname:"KG",
                    unit:"箱",
                    roundValue:{//可直拨的数据
                      num: 10,
                      numed:3,
                    }
                  },{
                    material_id:31,
                    name:"土豆",
                    price:3,
                    amt:4,
                    num:0,
                    returnNum:8,
                    stock:5,
                    utilname:"KG",
                    unit:"斤",
                    roundValue:{//可直拨的数据
                      num: 10,
                      numed:3,
                    }
                  }]
                },{
                  id:21,
                  name:"速冻类",
                  goodList:[{
                    material_id:211,
                    name:"牛肉",
                    price:15,
                    amt:22,
                    returnNum:2,
                    stock:8,
                    utilname:"KG",
                    unit:"斤",
                    roundValue:{//可直拨的数据
                      num: 10,
                      numed:3,
                      list:[{
                        name:"仓库一号",
                        num:0
                      },{
                        name:"仓库二号",
                        num:0
                      },{
                        name:"仓库三号",
                        num:0
                      },{
                        name:"仓库四号",
                        num:0
                      },{
                        name:"仓库五号",
                        num:0
                      },{
                        name:"仓库六号",
                        num:0
                      }]
                    }
                  }]
                },{
                  id:22,
                  name:"演示品项",
                }]
              },{
                id:3,
                name:"222222222222222222222222",
                cdata:[{
                  id:2,
                  name:"全部"
                }]
            }] 
        }
        return Promise.resolve(data as any)
    }
    static createInstance() {
        PublicAddGoodService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}

export default PublicAddGoodService;