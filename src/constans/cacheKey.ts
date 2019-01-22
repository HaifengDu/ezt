const CACHE_KEY = {
    //当前设备的行高
    "DEVICE_LINEHEIGHT":"DEVICE_LINEHEIGHT",
    // 订货新增
    "ORDER_ADDINFO":"ORDER_ADDINFO",
    'ORDER_ADDBEFOREINFO':"ORDER_ADDBEFOREINFO",
    'ORDER_CONTAINTIME':"ORDER_CONTAINTIME",
    'ORDER_DETAILS':"ORDER_DETAILS",
    'ORDER_SEARCH':"ORDER_SEARCH",
    'ORDER_DELETEID':"ORDER_DELETEID",
    //收货新增
    "RECEIVE_ADDINFO":"RECEIVE_ADDiNFO",
    "RECEIVE_ADDBEFOREINFO":"RECEIVEBEFOREINFO",
    "RECEIVE_BILLTYPE":"RECEIVE_BILLTYPE",//收货单据区别
    "RECEIVE_DETAILLIST":"RECEIVE_DETAILLIST",//收货单据详情
    "RECEIVE_SEARCH":"RECEIVE_SEARCH",//收货搜索条件
    //库存初始化新增
    'INITSTOCK_ADDINFO':"INITSTOCK_ADDINFO",    
    "INITSTOCK_ADDBEFOREINFO":"INITSTOCK_ADDBEFOREINFO",
    "INITSTOCK_SETTING":"INITSTOCK_SETTING",
    "INITSTOCK_DETAILLIST":"INITSTOCK_DETAILLIST",
    "INITSTOCK_SEARCH":"INITSTOCK_SEARCH",//订货搜索条件
    // 盘库模块
    "INVENTORY_LIST":"INVENTORY_LIST",  //盘库首页
    "INVENTORY_ADDINFO":"INVENTORY_ADDINFO",//新增盘库单  选择货品
    "INVENTORY_ADDBEFOREINFO":"INVENTORY_ADDBEFOREINFO",
    "WAREHOUSE":"WAREHOUSE",                  //盘点仓库
    "INVENTORY_DETAILS":"INVENTORY_DETAILS",  //盘库详情
    "INVENTORY_RESULT":"INVENTORY_RESULT", //盘库搜索结果
    "INVENTORY_TYPE":"INVENTORY_TYPE",  //盘库类型
    "ADDINVENTORY":"ADDINVENTORY",
    "TEMPLATE_NAME":"TEMPLATE_NAME",  //盘库方式
    "TEMPLATEIMPORT":"TEMPLATEIMPORT", //导入模板
    
    //损溢模块
    "SPILLEDSHEET_ADDINFO":"SPILLEDSHEET_ADDINFO",//添加损溢单
    "SPILLED_ADDBEFOREINFO":"SPILLED_ADDBEFOREINFO",
    "SPILLEDSHEET_SEARCH":"SPILLEDSHEET_SEARCH",  //查询损溢单   
    "SPILLEDSHEET_DETAILS":"SPILLEDSHEET_DETAILS",//损溢详情    
    //店内调拨模块
    "INSTOREALLOT_ADDINFO":"INSTOREALLOT_ADDINFO",
    "INSTOREALLOT_ADDBEFOREINFO":"INSTOREALLOT_ADDBEFOREINFO",
    "INSTOREALLOT_DETAILLIST":"INSTOREALLOT_DETAILLIST",
    "INSTOREALLOT_SEARCH":"INSTOREALLOT_SEARCH",
    //店间平调模块
    'STOREALLOT_ADDINFO':"STOREALLOT_ADDINFO",
    "STOREALLOT_ADDBEFOREINFO":"STOREALLOT_ADDBEFOREINFO",
    "STOREALLOT_DETAILLIST":"STOREALLOT_DETAILLIST",
    "STOREALLOT_SEARCH":"STOREALLOT_SEARCH",
    //添加物料     
    "MATERIAL_LIMIT":"MATERIAL_LIMIT", //添加物料的一种限制判断
    "MATERIAL_PARAM":"MATERIAL_PARAM",//添加物料查询时的条件
    //供应商退货
    "SUPPLIERRETURN_ADDINFO":"SUPPLIERRETURN_ADDINFO",
    "SUPPLIERRETURN_ADDBEFOREINFO":"SUPPLIERRETURN_ADDBEFOREINFO",
    "SUPPLIERRETURN_DETAILLIST":"SUPPLIERRETURN_DETAILLIST",
    "SUPPLIERRETURN_SEARCH":"SUPPLIERRETURN_SEARCH",
    "SUPPLIERRETURN_RESULT":"SUPPLIERRETURN_RESULT", //退货搜索结果
    "SOURCERBILLLIST":"SOURCEBILLLIST",//源单号下拉列表数据，在moke中是动态的，只能存在缓存中保留回显
    "DISTRIBUTION_CENTER":"DISTRIBUTION_CENTER",//配送中心下拉列表数据
    "DISTRIBUTION_DELETEID":"DISTRIBUTION_DELETEID",//删除物品  提交审核 把id传后台
    //领退料单   
    "LEADBACKSHEET_ADDINFO":"LEADBACKSHEET_ADDINFO",//添加领退料单
    "LEADBACKSHEET_ADDBEFORE":"LEADBACKSHEET_ADDBEFORE",
    "LEADBACKSHEET_SEARCH":"LEADBACKSHEET_SEARCH", //领退料查询结果
    "LEADBACKSHEET_DETAILS":"LEADBACKSHEET_DETAILS",//领退料详情页
}
export default CACHE_KEY;