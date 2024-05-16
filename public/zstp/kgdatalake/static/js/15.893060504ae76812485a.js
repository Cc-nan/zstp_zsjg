webpackJsonp([15],{LBap:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("//Fk"),i=a.n(s),l=a("M4fF"),n=a("1lyH"),o=a("PJh5"),r=a.n(o),c={name:"TheTaskExecRecord",components:{},filters:{timeFilter:function(t,e){return t?(e=e||"YYYY-MM-DD HH:mm:ss",r()(t).format(e)):"--"}},data:function(){return{pageNo:1,pageSize:10,total:0,tableData:[],execId:null,taskId:parseInt(this.$route.params.taskId,10),filter:{status:"0"},execTypeList:[{value:"FAIL",alias:"失败"},{value:"SUCCESS",alias:"成功"},{value:"WORK",alias:"进行中"}],inLoading:!1,logDialog:{visible:!1,logData:[]}}},computed:{inCenter:function(){return!!~this.$route.path.indexOf("/home/taskCenter/exec")},isDepend:function(){return!!~this.$route.path.indexOf("/home/taskCenter/taskGroup")}},watch:{$route:function(t,e){this.loadData()}},created:function(){this.loadExecList()},methods:{loadExecList:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.pageNo=e;var a={kgName:this.$route.params.kgName||"",page:this.pageNo,group:0,size:this.pageSize,taskType:"invisable-etl",userId:Object(n.getUser)().id};return this.taskId&&(a.id=this.taskId),this.filter.taskId&&(a.id=this.filter.taskId),"0"!==this.filter.status&&(a.status=this.filter.status),a.taskId=a.id,this.listLoading=!0,Object(n.pdAjax)({vm:this},n.apiXxlAdminSdk.execlist_post,{data:a}).then(function(e){return t.listLoading=!1,e&&(t.total=e.count,t.tableData=e.data),i.a.resolve(e)},function(e){return t.listLoading=!1,i.a.reject(e)})},handleExecStop:function(t){var e=this;this.stopScheduleTask(t).then(function(){e.$message.success("任务停止成功"),e.loadExecList()},function(t){e.$message.error(t.message)})},stopScheduleTask:function(t){return Object(n.pdAjax)({vm:this,path:{execId:t,userId:Object(n.getUser)().id}},n.apiXxlAdminSdk.stop_userId_execId_post).then(function(t){return i.a.resolve(t)},function(t){return i.a.reject(t)})},getExecLog:function(t){return Object(n.pdAjax)({vm:this,path:{execId:t,userId:Object(n.getUser)().id}},n.apiXxlAdminSdk.log_userId_execId_post).then(function(t){return i.a.resolve(t)},function(t){return i.a.reject(t)})},handleLoadLog:function(t){var e=this;this.execId=t.execId,this.getExecLog(t.execId).then(function(t){t&&t.log&&(e.logDialog.logData=t.log.split("\n"))}),this.logDialog.visible=!0},refreshLog:function(){var t=this;this.getExecLog(this.execId).then(function(e){e&&e.log&&(t.logDialog.logData=e.log.split("\n"))})},goBack:function(){this.$router.go(-1)},renderTaskStatus:function(t){var e=l.find(this.execTypeList,["value",t]);return e?e.alias:""},resetQuery:function(){this.filter.status="0",this.filter.taskId=""}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"task-exec-container"},[a("div",{staticClass:"page-header"},[t.inCenter?a("div",{staticClass:"title"},[t._v("执行列表")]):a("el-button",{attrs:{type:"primary",size:"small",plain:""},on:{click:t.goBack}},[t._v("返回")]),t._v(" "),a("div",{staticClass:"line"}),t._v(" "),t.inCenter?a("el-form",{attrs:{inline:!0,model:t.filter,size:"small"}},[a("el-form-item",{attrs:{label:"执行状态:"}},[a("el-select",{attrs:{placeholder:"请选择",size:"small"},on:{change:function(e){return t.loadExecList(1)}},model:{value:t.filter.status,callback:function(e){t.$set(t.filter,"status",e)},expression:"filter.status"}},[a("el-option",{attrs:{value:"0",label:"全部"}}),t._v(" "),t._l(t.execTypeList,function(t){return a("el-option",{key:t.value,attrs:{label:t.alias,value:t.value}})})],2)],1),t._v(" "),a("el-form-item",{attrs:{label:"任务id:"}},[a("el-input",{model:{value:t.filter.taskId,callback:function(e){t.$set(t.filter,"taskId",e)},expression:"filter.taskId"}},[a("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:function(e){return t.loadExecList(1)}},slot:"append"})],1)],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{plain:""},on:{click:t.resetQuery}},[t._v("重置")])],1)],1):a("el-select",{attrs:{placeholder:"请选择",size:"small"},on:{change:function(e){return t.loadExecList(1)}},model:{value:t.filter.status,callback:function(e){t.$set(t.filter,"status",e)},expression:"filter.status"}},[a("el-option",{attrs:{value:"0",label:"全部"}}),t._v(" "),t._l(t.execTypeList,function(t){return a("el-option",{key:t.value,attrs:{label:t.alias,title:t.alias,value:t.value}})})],2),t._v(" "),a("span",{staticClass:"flex-1"}),t._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){return t.loadExecList(1)}}},[t._v("刷新")])],1),t._v(" "),a("div",{staticClass:"page-content"},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.inLoading,expression:"inLoading"}],staticClass:"table-container"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,border:"","tooltip-effect":"dark","cell-style":{padding:"10px 0"}}},[a("el-table-column",{attrs:{align:"center",prop:"execId",label:"执行id",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{label:"调度时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("timeFilter")(e.row.submitTime)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"完成时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("timeFilter")(e.row.endTime)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"执行状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"status",class:"status_"+e.row.status},[t._v(t._s(t.renderTaskStatus(e.row.status)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"调度方式"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"fireMsg"},[t._v(t._s(e.row.fireMsg))]),a("span",{staticClass:"stdMsg"},[t._v(t._s(e.row.stdFireTime)+" / "+t._s(e.row.stdDataOffset))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center",width:"240"},scopedSlots:t._u([{key:"default",fn:function(e){return["WORK"===e.row.status?a("el-link",{attrs:{underline:!1,type:"danger"},on:{click:function(a){return t.handleExecStop(e.row.execId)}}},[t._v("停止")]):t._e(),t._v(" "),a("el-link",{attrs:{underline:!1,type:"primary"},on:{click:function(a){return t.handleLoadLog(e.row)}}},[t._v("日志")])]}}])})],1)],1),t._v(" "),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{background:"",layout:"total, prev, next, jumper","page-size":t.pageSize,"current-page":t.pageNo,total:t.total},on:{"current-change":t.loadExecList}})],1)]),t._v(" "),a("el-dialog",{staticClass:"logDialog",attrs:{title:"任务日志",visible:t.logDialog.visible,width:"800px","close-on-click-modal":!1},on:{"update:visible":function(e){return t.$set(t.logDialog,"visible",e)}}},[a("div",{staticClass:"logBox"},[a("ul",t._l(t.logDialog.logData,function(e,s){return a("li",{key:s},[t._v(t._s(e))])}),0)]),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small",type:"primary",plain:""},on:{click:t.refreshLog}},[t._v("刷新")])],1)])],1)},staticRenderFns:[]};var d=a("VU/8")(c,u,!1,function(t){a("ZpCi")},null,null);e.default=d.exports},ZpCi:function(t,e){}});