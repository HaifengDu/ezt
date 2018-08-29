export interface ITab {
    name: string,
    active: boolean,
    status: string | number,
    sup_status?:string|number,
    customcls?:string;
    canEdit?: boolean
}
export interface ITabTreeNode extends ITab {
    children?: Array<ITab>,
    childShow?: boolean
}

export abstract class ATabArray<T extends ITab> extends Array<T> {
    public setActive(index: number): void {
        this.forEach((item, i) => {
            item.active = index === i;
        });
    }

    public setActivebyNode(node: T): void {
        this.forEach((item, i) => {
            item.active = item == node;
        });
    }

    public setActiveByName(name: string): void {
        const node:T = this.getActive();
        let hasActive = false;
        this.forEach((item, index) => {
            item.active = item.name == name;
            hasActive = hasActive||item.active;
        });
        if(!hasActive){
            node.active = true;
        }
    }

    public getTab(index: number): T {
        return this[index];
    }

    public getTabByName(name: string): T {
        let tempTabs = this.filter((item, index) => {
            return item.name == name;
        });
        if (tempTabs.length) {
            return tempTabs[0];
        }
        return null;
    }

    public getActive(): T {
        let tempTabs = this.filter((item, index) => {
            return item.active;
        });
        if (tempTabs.length) {
            return tempTabs[0];
        }
        return null;
    }
}

export class TabList extends ATabArray<ITab>{
}

export class TabTreeList extends ATabArray<ITabTreeNode>{
    public setChildActive(node: ITabTreeNode, child: ITab) {
        let isShow: boolean = child.active;
        //父级node设置active
        this.setActivebyNode(node);
        if (node.children && node.children.length) {
            node.children.forEach(item => {
                item.active = item == child;
            });
        }
    }
    
    public setChildActiveByName(node: ITabTreeNode, name: string) {
        let current = this.getActive();
        current.children.forEach((item, index) => {
            item.active = item.name == name;
        });
    }

    public getChildActive() {
        let current = this.getActive();
        let tempTabs = current.children.filter((item, index) => {
            return item.active;
        });
        if (tempTabs.length) {
            return tempTabs[0];
        }
        return null;
    }

    private setAllChildActive(active: boolean) {
        this.forEach(item => {
            if (item.children) {
                item.children.forEach(model => {
                    model.active = active;
                });
            }
        });
    }

    private setChildShow() {
        let current: ITabTreeNode = this.getActive()
            , ischildShow = current.childShow;
        
        this.forEach(item => {
            item.childShow = false;
        });
        current.childShow = !ischildShow;
    }

    public setActive(index: number) {
        super.setActive(index);
        this.setChildShow();
    }
}