import Vue from "vue";
import { Tab, XInput, Group, LoadingPlugin, XDialog, PopupRadio, Cell, CellBox, Checklist, XNumber, Search, InlineXNumber, Rater,Confirm, ConfirmPlugin, ButtonTab, ButtonTabItem } from 'vux'
import Toasted from 'vue-toasted';
import MessageBox from "element-ui/lib/message";
import Button from "element-ui/lib/button";
import Tabbar from 'mint-ui/lib/tabbar';
import TabItem from 'mint-ui/lib/tab-item';
import Navbar from 'mint-ui/lib/navbar';
import TabContainerItem from 'mint-ui/lib/tab-container-item';
import TabContainer from 'mint-ui/lib/tab-container';
import EztHeader from '../components/Header.vue';
import EztFooter from '../components/Footer.vue';
import EztCanlendar from '../components/Canlendar';
import EztNumber from "../components/EztNumber";
import IndexList from 'mint-ui/lib/index-list';
import IndexSection from 'mint-ui/lib/index-section';
import InfiniteScroll from 'mint-ui/lib/infinite-scroll';
import CellSwipe from 'mint-ui/lib/cell-swipe';

// import Notification from "element-ui/lib/notification";
// import DatePicker from "element-ui/lib/date-picker";
// import TimePicker from "element-ui/lib/time-picker";
// import TimeSelect from "element-ui/lib/time-select";
// import Table from "element-ui/lib/table";
// import TableColumn from "element-ui/lib/table-column";
// import Switch from "element-ui/lib/switch";
// import Tab from "element-ui/lib/tabs";
// import TabPane from "element-ui/lib/tab-pane";
// import Select from "element-ui/lib/select";
// import Option from "element-ui/lib/option";
// import Pagination from "element-ui/lib/pagination";
// import Tree from "element-ui/lib/tree";
// import InputNumber from "element-ui/lib/input-number";
// import CheckboxGroup from "element-ui/lib/checkbox-group";

/**
 * 布局 begin
 */
// import Container from "element-ui/lib/container";
// import Header from "element-ui/lib/header";
// import Aside from "element-ui/lib/aside";
// import Main from "element-ui/lib/main";
// import Footer from "element-ui/lib/footer";
/**
 * 布局 end
 */

// import Treeselect from '@riophae/vue-treeselect';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/input-number.css';
import 'mint-ui/lib/tabbar/style.css';
import 'mint-ui/lib/tab-item/style.css';
import 'mint-ui/lib/navbar/style.css';
import 'mint-ui/lib/tab-container-item/style.css';
import 'mint-ui/lib/tab-container/style.css';
import 'mint-ui/lib/index-list/style.css';
import 'mint-ui/lib/index-section/style.css';
import 'mint-ui/lib/cell-swipe/style.css';
// import 'element-ui/lib/theme-chalk/notification.css';
// import 'element-ui/lib/theme-chalk/date-picker.css';
// import 'element-ui/lib/theme-chalk/time-picker.css';
// import 'element-ui/lib/theme-chalk/time-select.css';
// import 'element-ui/lib/theme-chalk/table.css';
// import 'element-ui/lib/theme-chalk/table-column.css';
// import 'element-ui/lib/theme-chalk/switch.css';
// import 'element-ui/lib/theme-chalk/tabs.css';
// import 'element-ui/lib/theme-chalk/tab-pane.css';
// import 'element-ui/lib/theme-chalk/pagination.css';
// import 'element-ui/lib/theme-chalk/select.css';
// import 'element-ui/lib/theme-chalk/tree.css';
// import 'element-ui/lib/theme-chalk/input-number.css';
/**
 * 布局 begin
 */
// import 'element-ui/lib/theme-chalk/container.css';
// import 'element-ui/lib/theme-chalk/header.css';
// import 'element-ui/lib/theme-chalk/aside.css';
// import 'element-ui/lib/theme-chalk/main.css';
// import 'element-ui/lib/theme-chalk/footer.css';
/**
 * 布局 end
 */
// import '@riophae/vue-treeselect/dist/vue-treeselect.css';
Vue.prototype.$message = MessageBox;
Button.install(Vue);
Vue.use(Toasted, { duration: 1000, position: "top-center" });
Vue.prototype.fireEvent = function(element:HTMLElement,event:string){ 
    if ((document as any).createEventObject){ 
        // IE浏览器支持fireEvent方法 
        let evt = (document as any).createEventObject(); 
        return (document as any).fireEvent('on'+event,evt) 
    } 
    else{ 
        // 其他标准浏览器使用dispatchEvent方法 
        let evt = document.createEvent( 'HTMLEvents' ); 
        evt.initEvent(event, true, true); 
        return !element.dispatchEvent(evt); 
    } 
}; 
// Vue.prototype.$notify = Notification;
// DatePicker.install(Vue);
// TimePicker.install(Vue);
// TimeSelect.install(Vue);
// Switch.install(Vue);
// Tab.install(Vue);
// TabPane.install(Vue);
// Table.install(Vue);
// TableColumn.install(Vue);
// Pagination.install(Vue);
// Select.install(Vue);
// Tree.install(Vue);
// Option.install(Vue);
// InputNumber.install(Vue);
// CheckboxGroup.install(Vue);
/**
 * 布局 begin
 */
// Container.install(Vue);
// Header.install(Vue);
// Main.install(Vue);
// Footer.install(Vue);
// Aside.install(Vue);
/**
 * 布局 end  
 */
// Vue.component("tree-select", Vue.extend(Treeselect));
Vue.component(Tabbar.name, Vue.extend(Tabbar));
Vue.component(TabItem.name, Vue.extend(TabItem));
Vue.component(Navbar.name, Vue.extend(Navbar));
Vue.component(TabContainerItem.name, Vue.extend(TabContainerItem));
Vue.component(TabContainer.name, Vue.extend(TabContainer));
Vue.component('EztHeader', Vue.extend(EztHeader));//页面header组件
Vue.component('EztFooter', Vue.extend(EztFooter));//页面footer组件
Vue.component('EztCanlendar', Vue.extend(EztCanlendar));//页面日历
Vue.component('EztNumber',Vue.extend(EztNumber));//计数器
Vue.component("x-input", Vue.extend(XInput));
Vue.component("group", Vue.extend(Group));
Vue.component(IndexList.name, Vue.extend(IndexList));
Vue.component(IndexSection.name, Vue.extend(IndexSection));
Vue.component("tab", Vue.extend(Tab));
Vue.component('x-dialog', Vue.extend(XDialog))
Vue.component('popup-radio', Vue.extend(PopupRadio))
Vue.component('cell', Vue.extend(Cell))
Vue.component('cell-box', Vue.extend(CellBox))
Vue.component('checklist', Vue.extend(Checklist))
Vue.component('search', Vue.extend(Search))
Vue.component('inline-x-number', Vue.extend(InlineXNumber))
Vue.component('rater', Vue.extend(Rater))
Vue.use(LoadingPlugin)
Vue.use(InfiniteScroll);//更多加载
Vue.use(ConfirmPlugin);
Vue.component("x-dialog", Vue.extend(XDialog));
Vue.component("x-number", Vue.extend(XNumber));
Vue.component(CellSwipe.name, Vue.extend(CellSwipe));
Vue.component('confirm', Vue.extend(Confirm));//确认弹框
Vue.component('button-tab', Vue.extend(ButtonTab))
Vue.component('button-tab-item', Vue.extend(ButtonTabItem))
