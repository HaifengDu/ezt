import Vue from "vue";
import Toasted from 'vue-toasted';
import MessageBox from "element-ui/lib/message";
import Button from "element-ui/lib/button";
import Tabbar from 'mint-ui/lib/tabbar';
import TabItem from  'mint-ui/lib/tab-item';
import TabContainerItem from 'mint-ui/lib/tab-container-item';
import TabContainer from 'mint-ui/lib/tab-container';
import EztHeader from '../components/Header.vue';
import EztFooter from '../components/Footer.vue';
import XInput from "vux/src/components/x-input";
import Group from "vux/src/components/group";
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
import 'mint-ui/lib/tabbar/style.css';
import 'mint-ui/lib/tab-item/style.css';
import 'mint-ui/lib/tab-container-item/style.css';
import 'mint-ui/lib/tab-container/style.css';
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
Vue.use(Toasted,{duration:1000,position:"top-center"});
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
Vue.component(Tabbar.name,Vue.extend(Tabbar));
Vue.component(TabItem.name,Vue.extend(TabItem));
Vue.component(TabContainerItem.name,Vue.extend(TabContainerItem));
Vue.component(TabContainer.name,Vue.extend(TabContainer));
Vue.component('EztHeader',Vue.extend(EztHeader));//页面header组件
Vue.component('EztFooter',Vue.extend(EztFooter));//页面footer组件
Vue.component("x-input", Vue.extend(XInput));
Vue.component("group", Vue.extend(Group));