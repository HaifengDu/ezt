// export default class ResponseError extends Error{
//     public readonly ResonseError = true;
//     constructor(msg:string,private data:any){
//         super(msg);
//     }

//     public get resData(){
//         return this.data;
//     }
// }

function ResponseError(msg:string, data:any){
    this.message = msg;
    this.data = data;
    Error.apply(this);
}
function extend(a:any,b:any){
    function f(){}
    f.prototype = Error.prototype;
    a.prototype = new (<any>f)();
    a.prototype.constructor = a;
}
extend(ResponseError,Error);
export default ResponseError;