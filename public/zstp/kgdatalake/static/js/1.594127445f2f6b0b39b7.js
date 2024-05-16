webpackJsonp([1],{"2pb0":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("//Fk"),n=a.n(s),i=a("1lyH"),l=a("M4fF"),o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"cron-item"},[a("el-radio-group",{staticClass:"scheduling-options",model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},[a("el-radio",{attrs:{label:1,value:"1"}},[t._v("普通调度")]),t._v(" "),a("el-radio",{attrs:{label:2,value:"2"}},[t._v("高级调度")])],1),t._v(" "),1===t.radio?a("el-radio-group",{staticClass:"crontab-options",model:{value:t.hourPoint,callback:function(e){t.hourPoint=e},expression:"hourPoint"}},t._l(24,function(e){return a("el-radio",{key:e,staticClass:"crontab-option",attrs:{label:e-1+""}},[t._v(t._s(e-1)+"点\n    ")])}),1):t._e(),t._v(" "),2===t.radio?a("div",{staticClass:"hight-scheduling"},[a("div",{staticClass:"time-input"},[a("el-input",{attrs:{placeholder:"例:*/15",size:"small"},model:{value:t.minute,callback:function(e){t.minute=e},expression:"minute"}}),t._v(" "),a("el-input",{attrs:{placeholder:"例:1-5",size:"small"},model:{value:t.hour,callback:function(e){t.hour=e},expression:"hour"}}),t._v(" "),a("el-input",{attrs:{placeholder:"例:1,3,5",size:"small"},model:{value:t.day,callback:function(e){t.day=e},expression:"day"}}),t._v(" "),a("el-input",{attrs:{placeholder:"例:*",size:"small"},model:{value:t.month,callback:function(e){t.month=e},expression:"month"}}),t._v(" "),a("span",{staticClass:"question-icon"},[a("el-tooltip",{attrs:{content:"点击帮助",placement:"right"}},[a("i",{staticClass:"el-icon-question",on:{click:t.showText}})])],1)],1),t._v(" "),t._m(0),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showScheduleHelp,expression:"showScheduleHelp"}],staticClass:"notice-text"},[t._v("\n      注：\n      "),t._m(1)])]):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"time-text"},[e("span",[this._v("分")]),this._v(" "),e("span",[this._v("时")]),this._v(" "),e("span",[this._v("天")]),this._v(" "),e("span",[this._v("月")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("(*)：代表每的意思,例如month字段如果是星号,则表示每月都执行该命令操作,")]),this._v(" "),e("li",[this._v('(,)：代表分隔时段的意思,例如"1,3,5,7,9",')]),this._v(" "),e("li",[this._v('(-)：表示一个时间范围,例如"2-6"表示"2,3,4,5,6",')]),this._v(" "),e("li",[this._v('(/)：可以用正斜线确定时间的间隔频率,例如"0-23/2"表示每两小时执行一次。')])])}]};var r={name:"DataLakeDataSyncSchedulingDialog",components:{CronItem:a("VU/8")({name:"CronItem",data:function(){return{radio:1,hourPoint:"0",minute:"",hour:"",day:"",month:"",showScheduleHelp:!1}},watch:{radio:function(t){1===t?this.$emit("input",this.getCrontabValue()):this.$emit("input",this.getScheduleValue())},hourPoint:function(){this.$emit("input",this.getCrontabValue())},minute:function(){this.$emit("input",this.getScheduleValue())},hour:function(){this.$emit("input",this.getScheduleValue())},day:function(){this.$emit("input",this.getScheduleValue())},month:function(){this.$emit("input",this.getScheduleValue())}},methods:{showText:function(){this.showScheduleHelp=!this.showScheduleHelp},reset:function(){this.radio=1,this.hourPoint="0",this.minute="",this.hour="",this.day="",this.month="",this.showScheduleHelp=!1,this.$emit("input",this.getCrontabValue())},getCrontabValue:function(){var t="0 0 0 ? * *".split(" ");return t[2]=this.hourPoint?this.hourPoint:"0",t.join(" ")},getScheduleValue:function(){var t="0 0 0 0 0 ?".split(" ");return t[1]=this.minute?this.minute:"",t[2]=this.hour?this.hour:"",t[3]=this.day?this.day:"",t[4]=this.month?this.month:"",t.join(" ")}}},o,!1,function(t){a("UHNL")},"data-v-58801bd8",null).exports},mixins:[],data:function(){return{dialogVisible:!1,taskData:{},rules:{rate:[{required:!0,message:"请选择执行频率",trigger:"change"}],cron:[{required:!0,message:"请输入cron表达式",trigger:"change"}]}}},computed:{},watch:{},created:function(){},methods:{open:function(t){var e=this;this.taskData=l.cloneDeep(t),this.$set(this.taskData,"isScheduling",!0),this.dialogVisible=!0,this.$nextTick(function(){e.$refs.form.clearValidate(),"自定义"===e.taskData.rate&&e.$refs.cronItem.reset()})},onRateChange:function(){var t=this;switch(this.taskData.rate){case"每天":this.taskData.cron="0 0 0 ? * *";break;case"每小时":this.taskData.cron="0 0 * ? * *";break;case"自定义":this.$nextTick(function(){t.$refs.cronItem.reset()})}},confirm:l.debounce(function(){var t=this;this.$refs.form.validate(function(e){e&&t.save()})},300,{leading:!1,trailing:!0}),save:function(){var t=this,e={incrementField:this.taskData.incrementField,cron:"",isMount:this.taskData.isMount,rate:""};this.taskData.isScheduling&&(e={incrementField:this.taskData.incrementField,cron:this.taskData.cron,isMount:this.taskData.isMount,rate:this.taskData.rate});var a={tableId:this.taskData.tableId};Object(i.pdAjax)({vm:this,path:a},{method:"POST",url:"/kgdatalake/etl/task/config/{tableId}"},{data:e}).then(function(e){return t.$message.success("配置成功"),t.$emit("update"),t.dialogVisible=!1,n.a.resolve(e)},function(t){return n.a.reject(t)})}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{staticClass:"data-lake-data-sync-scheduling-dialog",attrs:{title:"调度配置",visible:t.dialogVisible,width:"464px"},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("div",{staticClass:"data-lake-data-sync-scheduling-dialog-content"},[a("el-form",{ref:"form",staticClass:"data-lake-data-sync-scheduling-dialog-form",attrs:{rules:t.rules,model:t.taskData,"label-width":"100px","label-position":"left"}},[t.taskData.isScheduling?a("el-form-item",{attrs:{label:"执行频率",prop:"rate"}},[a("el-select",{attrs:{size:"small",placeholder:"请选择"},on:{change:t.onRateChange},model:{value:t.taskData.rate,callback:function(e){t.$set(t.taskData,"rate",e)},expression:"taskData.rate"}},[a("el-option",{attrs:{label:"每天",value:"每天"}}),t._v(" "),a("el-option",{attrs:{label:"每小时",value:"每小时"}}),t._v(" "),a("el-option",{attrs:{label:"自定义",value:"自定义"}})],1)],1):t._e(),t._v(" "),t.taskData.isScheduling&&"自定义"===t.taskData.rate?a("el-form-item",{attrs:{label:"调度类型",prop:"cron"}},[a("cron-item",{ref:"cronItem",model:{value:t.taskData.cron,callback:function(e){t.$set(t.taskData,"cron","string"==typeof e?e.trim():e)},expression:"taskData.cron"}})],1):t._e()],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{size:"small",type:"primary"},on:{click:t.confirm}},[t._v("确 定")])],1)])},staticRenderFns:[]};var u={name:"DataLakeDataSync",components:{DataLakeDataSyncSchedulingDialog:a("VU/8")(r,c,!1,function(t){a("h4M3")},"data-v-7e8b76ea",null).exports},mixins:[],data:function(){return{pageSize:10,pageNo:1,total:1,selectedDatasetId:null,tableData:[],kw:"",datasetList:[]}},computed:{},watch:{},created:function(){var t=this.$route.query.datasetId;t=parseInt(t),this.selectedDatasetId=isNaN(t)?"":t;var e=this.$route.query.pageNo;e=parseInt(e),this.pageNo=isNaN(e)?1:e,this.getList(this.pageNo),this.getDatasetList()},methods:{getList:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,a={page:e,size:this.pageSize,sorts:["createTime:DESC"]};Object(i.pdAjax)({vm:this,path:{datasetId:this.selectedDatasetId||0}},{method:"POST",url:"/kgdatalake/etl/task/list/{datasetId}"},{data:a}).then(function(a){t.pageNo=e,t.total=a.totalElements,t.tableData=a.data;var s=l.cloneDeep(t.$route.query);return t.selectedDatasetId?s.datasetId=t.selectedDatasetId:delete s.datasetId,s.pageNo=e,t.$router.push({query:s}),n.a.resolve(a)},function(e){return t.tableData=[],t.$message.error(e.message),n.a.reject(e)})},getDatasetList:function(){var t=this;Object(i.pdAjax)({vm:this,path:{type:3}},{method:"GET",url:"/kgdatalake/dataset/list/{type}"}).then(function(e){return t.datasetList=l.filter(e,["dataSetType","remoteDb"]),n.a.resolve(e)},function(t){return n.a.reject(t)})},getStatus:function(t){return{NONE:"未调度",SUCCESS:"成功",FAIL:"失败",WORK:"进行中"}[t]||t},getTableLabel:function(t){return{common:"普通结构",pdd2r:"pdd2r",pddoc:"pddoc"}[t]||t},singleExecution:function(t){var e=this,a={id:t.jobId,stdFireTime:0,stdDataOffset:0,userId:Object(i.getConfig)().user.id};Object(i.pdAjax)({vm:this},i.apiXxlAdminSdk.run_post,{data:a,params:{userId:null}}).then(function(){e.$message.success("任务执行成功"),e.getList(e.pageNo)},function(t){e.getList(e.pageNo),e.$message.error(t.message)})},stopScheduling:function(t){var e=this,a={incrementField:t.incrementField,cron:"",isMount:t.isMount,rate:""},s={tableId:t.tableId};Object(i.pdAjax)({vm:this,path:s},{method:"POST",url:"/kgdatalake/etl/task/config/{tableId}"},{data:a}).then(function(t){return e.$message.success("停止成功"),e.getList(e.pageNo),n.a.resolve(t)},function(t){return n.a.reject(t)})},goRecord:function(t){this.$router.push({name:"dataLakeDataSyncExecRecord",params:{taskId:t.jobId}})},openDataLakeDataSyncSchedulingDialog:function(t){this.$refs.dataLakeDataSyncSchedulingDialog.open(t)}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"data-manage-container kgms-el-main kg-el-main data-lake-data-sync"},[t._m(0),t._v(" "),a("div",{staticClass:"page-content data-lake-data-sync-content"},[a("div",{staticClass:"data-lake-data-sync-header"},[a("div",{staticClass:"data-lake-data-sync-header-left"},[a("el-select",{attrs:{size:"small",clearable:"",filterable:"",placeholder:"请选择数据集"},on:{change:function(e){return t.getList(1)}},model:{value:t.selectedDatasetId,callback:function(e){t.selectedDatasetId=e},expression:"selectedDatasetId"}},t._l(t.datasetList,function(t){return a("el-option",{key:t.id,attrs:{label:t.name,title:t.name,value:t.id}})}),1)],1),t._v(" "),a("div",{staticClass:"data-lake-data-sync-header-right"},[a("el-button",{attrs:{size:"small",type:"primary",plain:""},on:{click:function(e){return t.getList(t.pageNo)}}},[t._v("刷新\n          ")])],1)]),t._v(" "),a("div",{staticClass:"data-lake-data-sync-container"},[a("el-table",{staticClass:"data-lake-data-sync-table",staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[a("el-table-column",{attrs:{prop:"jobId",label:"ID",width:"60"}}),t._v(" "),a("el-table-column",{attrs:{prop:"datasetName",label:"数据集"}}),t._v(" "),a("el-table-column",{attrs:{prop:"tableName",label:"数据表"}}),t._v(" "),a("el-table-column",{attrs:{"show-overflow-tooltip":"",prop:"remoteUrl",label:"源数据库表"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"weak-font"},[t._v("\n              "+t._s(e.row.remoteUrl)+" / "+t._s(e.row.datasetName)+" / "+t._s(e.row.tableName)+"\n              ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"etlType",width:"180px",label:"配置"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(e.row.isMount?"远程挂载":"本地接入")+"\n              "),e.row.isMount?t._e():[t._v("\n                |\n                "+t._s(e.row.incrementField?"增量接入":"全量接入")+"\n              ")]]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"cron",width:"120px","show-overflow-tooltip":"",label:"定时周期 "},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.cron&&"自定义"!==e.row.rate?a("span",[t._v(t._s(e.row.rate))]):e.row.cron?a("span",[t._v(t._s(e.row.cron))]):a("span",{staticClass:"weak-font"},[t._v("关闭")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"lastRunStatus",width:"120px",label:"最新执行状态 "},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"data-lake-data-sync-table-status",class:"data-lake-data-sync-table-status-"+e.row.lastRunStatus},[t._v("\n                "+t._s(t.getStatus(e.row.lastRunStatus))+"\n              ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"createTime",width:"160px",label:"创建时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(t._f("secondTimeFilter")(e.row.createTime))+"\n            ")]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"address",width:"220px",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-link",{attrs:{underline:!1,disabled:"WORK"===e.row.lastRunStatus||e.row.isMount,type:"primary"},on:{click:function(a){return t.singleExecution(e.row)}}},[t._v("单次执行"+t._s(e.row.status)+"\n              ")]),t._v(" "),e.row.cron?t._e():a("el-link",{attrs:{underline:!1,disabled:"WORK"===e.row.lastRunStatus||e.row.isMount,type:"primary"},on:{click:function(a){return t.openDataLakeDataSyncSchedulingDialog(e.row)}}},[t._v("调度配置\n              ")]),t._v(" "),e.row.cron?a("el-link",{attrs:{underline:!1,type:"primary"},on:{click:function(a){return t.stopScheduling(e.row)}}},[t._v("停止调度\n              ")]):t._e(),t._v(" "),a("el-link",{attrs:{disabled:e.row.isMount,underline:!1,type:"primary"},on:{click:function(a){return t.goRecord(e.row)}}},[t._v("执行记录\n              ")])]}}])})],1)],1),t._v(" "),a("div",{staticClass:"data-lake-data-sync-footer"},[a("el-pagination",{attrs:{"current-page":t.pageNo,"page-size":t.pageSize,layout:"total, prev, next, jumper",total:t.total},on:{"current-change":t.getList,"update:currentPage":function(e){t.pageNo=e},"update:current-page":function(e){t.pageNo=e}}})],1)]),t._v(" "),a("data-lake-data-sync-scheduling-dialog",{ref:"dataLakeDataSyncSchedulingDialog",on:{update:function(e){return t.getList(t.pageNo)}}})],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"page-header"},[e("div",{staticClass:"title"},[this._v("\n        数据同步\n      ")]),this._v(" "),e("span",{staticClass:"flex-1"})])}]};var h=a("VU/8")(u,d,!1,function(t){a("Fp5s")},"data-v-ef62fafc",null);e.default=h.exports},Fp5s:function(t,e){},UHNL:function(t,e){},h4M3:function(t,e){}});