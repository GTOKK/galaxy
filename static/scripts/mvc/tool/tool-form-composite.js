define(["utils/utils","mvc/ui/ui-misc","mvc/form/form-view","mvc/form/form-data","mvc/tool/tool-form-base"],function(a,b,c,d,e){var f=Backbone.View.extend({initialize:function(f){var g=this;this.workflow_id=f.id,this.forms={},this.steps={},this.setElement('<div class="ui-form-composite"/>'),this.$header=$("<div/>").addClass("ui-form-header"),this.$header.append(new b.Label({title:"Workflow: "+f.name}).$el),this.$header.append(new b.Button({title:"Collapse",icon:"fa-angle-double-up",onclick:function(){_.each(g.forms,function(a){a.portlet.collapse()})}}).$el),this.$header.append(new b.Button({title:"Expand all",icon:"fa-angle-double-down",onclick:function(){_.each(g.forms,function(a){a.portlet.expand()})}}).$el),this.$el.append(this.$header),_.each(f.steps,function(b,f){Galaxy.emit.debug("tool-form-composite::initialize()",f+" : Preparing workflow step."),b=a.merge({name:"Step "+(parseInt(f)+1)+": "+b.name,icon:"",help:null,description:b.annotation&&" - "+b.annotation||b.description,citations:null,collapsible:!0,collapsed:f>0,sustain_version:!0,sustain_repeats:!0,sustain_conditionals:!0,narrow:!0,text_enable:"Edit",text_disable:"Undo",cls_enable:"fa fa-edit",cls_disable:"fa fa-undo"},b);var h=null;-1!=["data_input","data_collection_input"].indexOf(b.step_type)?h=new c(a.merge({title:"<b>"+b.name+"</b>"},b)):"tool"==b.step_type&&(a.deepeach(b.inputs,function(a){a.type&&(a.options&&0==a.options.length&&(a.is_workflow=!0),a.value&&"RuntimeValue"==a.value.__class__?a.value=null:-1==["data","data_collection"].indexOf(a.type)&&"$"!=String(a.value).substring(0,1)&&(a.collapsible=!0,a.collapsible_value=a.value,a.collapsible_preview=!0))}),d.matchIds(b.inputs,b.input_connections_by_name,function(a,b){b&&(b.type="hidden",b.value=b.ignore="",b.options=null,b.help=_.reduce(a,function(a,b){return a&&(a+=", "),a+"Output dataset '"+b.output_name+"' from step "+b.order_index},""))}),d.matchContext(b.inputs,"data_ref",function(a,b){a.is_workflow=!b.options||!b.options[a.value]}),h=new e(b).form),g.forms[b.step_id]=h,g.steps[b.step_id]=b});var h={},i={},j=0,k=function(a,b,c){var d=a.$("input");0===d.length&&(d=a.$el),d.addClass(c).css({color:b,"border-color":b})};if(_.each(this.steps,function(b,c){_.each(b.inputs,function(b){var d=String(b.value);if("$"===d.substring(0,1)){var e=g.forms[c].field_list[b.id],f=g.forms[c].element_list[b.id],l=a.sanitize(d.substring(2,d.length-1));h[l]=h[l]||[],h[l].push(e),e.value(l),f.disable(!0),i[l]=i[l]||{type:b.type,is_workflow:b.options,label:l,name:l,color:"hsl( "+100*++j+", 70%, 30% )"},k(e,i[l].color,"ui-form-wp-target")}})}),!_.isEmpty(i)){var l=new c({title:"<b>Workflow Parameters</b>",inputs:i,onchange:function(){_.each(l.data.create(),function(b,c){_.each(h[c],function(d){d.value(a.sanitize(b)||c)})})}});_.each(l.field_list,function(a,b){k(a,l.input_list[b].color,"ui-form-wp-source")}),this.$el.append("<p/>").addClass("ui-margin-top"),this.$el.append(l.$el)}_.each(g.steps,function(a,b){g.$el.append("<p/>").addClass("ui-margin-top"),g.$el.append(g.forms[b].$el),a.post_job_actions&&a.post_job_actions.length&&g.$el.append($("<div/>").addClass("fa fa-bolt")).append(_.reduce(a.post_job_actions,function(a,b){return a+" "+b.short_str},"")),Galaxy.emit.debug("tool-form-composite::initialize()",b+" : Workflow step state ready.",a)}),this.history_form=null,f.history_id||(this.history_form=new c({inputs:[{type:"conditional",test_param:{name:"new_history",label:"Send results to a new history",type:"boolean",value:"false",help:""},cases:[{value:"true",inputs:[{name:"new_history_name",label:"History name",type:"text",value:f.name}]}]}]}),this.$el.append("<p/>").addClass("ui-margin-top"),this.$el.append(this.history_form.$el)),this.$el.append("<p/>").addClass("ui-margin-top"),this.execute_btn=new b.Button({icon:"fa-check",title:"Run workflow",cls:"btn btn-primary",floating:"clear",onclick:function(){g._execute()}}),this.$el.append(this.execute_btn.$el),$("body").append(this.$el)},_execute:function(){var b=this,c={inputs:{},parameters:{}},d=!0;_.each(this.forms,function(a,e){var f=a.data.create(),g=b.steps[e],h=g.step_id,i=g.step_type,j=g.order_index;c.parameters[h]={},a.trigger("reset");for(var k in f){var l=f[k],m=a.data.match(k),n=(a.field_list[m],a.input_list[m]);-1!=["data_input","data_collection_input"].indexOf(i)?l&&l.values&&l.values.length>0?c.inputs[j]=l.values[0]:d&&(a.highlight(m),d=!1):n.optional||n.is_workflow||null!=l?c.parameters[h][k]=l:(a.highlight(m),d=!1)}}),console.log(JSON.stringify(c)),d?(b._enabled(!1),Galaxy.emit.debug("tools-form-composite::submit()","Validation complete.",c),a.request({type:"POST",url:Galaxy.root+"api/workflows/"+this.workflow_id+"/invocations",data:c,success:function(a){Galaxy.emit.debug("tool-form-composite::submit","Submission successful.",a),parent.Galaxy&&parent.Galaxy.currHistoryPanel&&parent.Galaxy.currHistoryPanel.refreshContents(),console.log(a)},error:function(a){if(console.log(a),a&&a.err_data){var b=form.data.matchResponse(a.err_data);for(var c in b){form.highlight(c,b[c]);break}}else Galaxy.modal&&Galaxy.modal.show({title:"Job submission failed",body:a&&a.err_msg||ToolTemplate.error(options.job_def),buttons:{Close:function(){Galaxy.modal.hide()}}})},complete:function(){b._enabled(!0)}})):b._enabled(!0)},_enabled:function(a){a?this.execute_btn.unwait():this.execute_btn.wait(),a?this.history_form.portlet.enable():this.history_form.portlet.disable(),_.each(this.forms,function(b){a?b.portlet.enable():b.portlet.disable()})}});return{View:f}});
//# sourceMappingURL=../../../maps/mvc/tool/tool-form-composite.js.map