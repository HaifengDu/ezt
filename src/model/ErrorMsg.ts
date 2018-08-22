
export default class ErrorMsg{
    constructor(public success=false,public message?:string){

    }
    public toString(){
        return `{"success":${this.success},"message":${this.message||""}}`;
    }
}