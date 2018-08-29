import Vue,{VueConstructor,ComponentOptions} from "vue";
export const maskMixin:VueConstructor | ComponentOptions<Vue> = {
    created(){
        this.maskClickCbs = [];
    },
    mounted(){
        this.globalMask = document.getElementById('ezt-mask');
    },
    beforeDestroy(){
        (<any>this).maskClickCbs.forEach((item:any)=>{
            (<HTMLDivElement>(<any>this).globalMask).removeEventListener('click',item);
        });
    },
    methods:{
        showMask(){
            (<any>this).globalMask.style.display = "block";
        },
        hideMask(){
            (<any>this).globalMask.style.display = "none";
        },
        addMaskClickListener(cb:(...args:any[])=>void){
            (<any>this).maskClickCbs.push(cb);
            (<HTMLDivElement>(<any>this).globalMask).addEventListener('click',cb);
        }
    }
}