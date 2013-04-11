Ext.define("Ext.locale.en.ux.picker.DateTimePicker", {
	override : "Ext.ux.DateTimePicker",
	todayText : "Now",
	timeLabel : 'Time',
	showToday : false
});

Ext.define('Ext.ux.DateTimePicker', {
	extend : 'Ext.picker.Date',
	alias : 'widget.datetimepicker',
	todayText : 'Now',
	timeLabel : 'Time',
	requires : [ 'Ext.ux.form.TimePickerField' ],

	initComponent : function() {
		// keep time part for value
		var value = this.value || new Date();
		this.callParent();
		this.value = value;
	},
	onRender : function(container, position) {
		var me = this;
		if (!this.timefield) {
			this.timefield = Ext.create('Ext.ux.form.TimePickerField', {
				fieldLabel : this.timeLabel,
				labelWidth : 40,
				value : Ext.Date.format(this.value, 'H:i:s')
			});
		}
		this.timefield.ownerCt = this;
		this.timefield.on('change', this.timeChange, this);
		this.callParent(arguments);

		var table = Ext.get(Ext.DomQuery.selectNode('table', this.el.dom));
		var tfEl = Ext.core.DomHelper.insertAfter(table, {
			tag : 'div',
			style : 'border:0px;',
			children : [ {
				tag : 'div',
				cls : 'x-datepicker-footer ux-timefield'
			},{
				tag : 'div',
				cls : 'x-datepicker-footer buttons'
			} ]
		}, true);
		if(!this.btn){
			this.btn = Ext.create('Ext.Container', {
			    layout: {
			    	type : 'hbox',
					pack : 'center',
					align : 'middle',
			    },
			    height: 30,
			    items   : [
			        {
			            margin: '0 0 0 6',
			            xtype: 'button',
			            width: 60,
			            text : 'Ok',
			            listeners: {
			            	click: function(){
			            		me.handleOkBtnClick();
			            		Ext.menu.Manager.hideAll();
			            	}
			            }
			        },
			        {       
			            margin: '0 0 0 30',
			            xtype: 'button',
			            width: 60,
			            text : 'Cancel',
			            listeners: {
			            	click: function(){
			            		Ext.menu.Manager.hideAll();
			            	}
			            }
			        }
			    ]
			});
		}
		this.btn.render(this.el.child('div div.buttons'));
		this.timefield.render(this.el.child('div div.ux-timefield'));

		var p = this.getEl().parent('div.x-layer');
		if (p) {
			p.setStyle("height", p.getHeight() + 31);
		}
	},
	// listener Time domain changes, timefield change
	timeChange : function(tf, time, rawtime) {
		// if(!this.todayKeyListener) { // before render
		this.value = this.fillDateTime(this.value);
		// } else {
		// this.setValue(this.value);
		// }
	},
	// @private
	fillDateTime : function(value) {
		if (this.timefield) {
			var rawtime = this.timefield.getRawValue();
			value.setHours(rawtime.h);
			value.setMinutes(rawtime.m);
			value.setSeconds(rawtime.s);
		}
		return value;
	},
	// @private
	changeTimeFiledValue : function(value) {
		this.timefield.un('change', this.timeChange, this);
		this.timefield.setValue(this.value);
		this.timefield.on('change', this.timeChange, this);
	},

	// overwrite
	setValue : function(value) {
		this.value = value;
		this.changeTimeFiledValue(value);
		return this.update(this.value);
	},
	// overwrite
	getValue : function() {
		return this.fillDateTime(this.value);
	},

	// overwrite : fill time before setValue
	handleDateClick : function(e, t) {
		var me = this, handler = me.handler;

		e.stopEvent();
		if (!me.disabled && t.dateValue
				&& !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
			me.doCancelFocus = me.focusOnSelect === false;
			me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite: fill time before setValue
			delete me.doCancelFocus;
			var table = e.currentTarget.childNodes[1];
			var selected = table.getElementsByClassName('selected');
			Ext.each(selected,function(){
				this.classList.remove('selected');
			});
			var curTd = e.target.parentNode.parentNode.parentNode;
			if(curTd.classList.contains("x-datepicker-active"))
				curTd.classList.add('selected');
			if (handler) {
				handler.call(me.scope || me, me, me.value);
			}
			me.onSelect();
		}
	},

	// overwrite : fill time before setValue
	selectToday : function() {
		var me = this, btn = me.todayBtn, handler = me.handler;

		if (btn && !btn.disabled) {
			// me.setValue(Ext.Date.clearTime(new Date())); //src
			me.setValue(new Date());// overwrite: fill time before setValue
			me.fireEvent('select', me, me.value);
			if (handler) {
				handler.call(me.scope || me, me, me.value);
			}
			me.onSelect();
		}
		return me;
	},
	
	handleOkBtnClick : function(){
		var me = this, btn = me.todayBtn, handler = me.handler;
		me.setValue(this.value);
		me.fireEvent('select', me, me.value);
		if (handler) {
			handler.call(me.scope || me, me, me.value);
		}
		me.onSelect();
		return me;
	}
});
