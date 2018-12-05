export default {
    methods: {
        handlerChangeNo(e:KeyboardEvent){
            const inputElement =  (e.currentTarget as HTMLInputElement);
            if((<any>inputElement).customDispatch){
                return;
            }
            let val = inputElement.value;
            if(val){
                if(val != "" && val.length >= 20 ){
                    // val = val.replace(new RegExp("[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）+|{}【】‘；：”“’。，、？]+", "gm"), "");
                    val = val.replace(/[^\w\d\_]/g, "");
                    val = val.substr(0, 20);
                }else{
                    // val = val.replace(new RegExp("[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）+|{}【】‘；：”“’。，、？]+", "gm"), "");
                    val = val.replace(/[^\w\d\_]/g, "");
                }
            }
            setTimeout(()=>{
                inputElement.value = val;    
                const that = this;
                (<any>inputElement).customDispatch = true;
                this.fireEvent(inputElement,'input');
                (<any>inputElement).customDispatch = false;
            });
        }
    }
}