/*global Ext:false */
/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', 'ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.grid.PagingScroller'
]);

Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [
       {name: 'rating', type: 'int'},
       {name: 'salary', type: 'float'},
       {name: 'name'}
    ]
});

Ext.onReady(function(){
    /**
     * Returns an array of fake data
     * @param {Number} count The number of fake rows to create data for
     * @return {Array} The fake record data, suitable for usage with an ArrayReader
     */
    function createFakeData(count) {
        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'],
            lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'],
            ratings      = [1, 2, 3, 4, 5],
            salaries     = [100, 400, 900, 1500, 1000000];

        var data = [];
        for (var i = 0; i < (count || 25); i++) {
            var ratingId    = Math.floor(Math.random() * ratings.length),
                salaryId    = Math.floor(Math.random() * salaries.length),
                firstNameId = Math.floor(Math.random() * firstNames.length),
                lastNameId  = Math.floor(Math.random() * lastNames.length),

                rating      = ratings[ratingId],
                salary      = salaries[salaryId],
                name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

            data.push({
                rating: rating,
                salary: salary,
                name: name
            });
        }
        return data;
    }
   

 // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        id: 'store1',
        pageSize: 50,
        // allow the grid to interact with the paging scroller by buffering
        buffered: true,
        // never purge any data, we prefetch all up front
        model: 'Employee',
        proxy: {
            type: 'pagingmemory'
        },
	listeners: {
		// Creating a paging store 	   	
		add : function (me, records, successful, eOpts){
			var newStore = Ext.create('Ext.data.Store', {
	    		id: 'store2',
		        model: 'Employee',
		        buffered: true,
		        pageSize: 100,
		        data: records,
		        proxy: {
		            type: 'pagingmemory',
		        },
		    });
		var grid1 = Ext.getCmp("tweetsgrid");
		grid1.reconfigure(newStore);
		}
	}
    });


//Creting Table
    var grid = Ext.create('Ext.grid.Panel', {
        width: 700,
        height: 500,
	id:'tweetsgrid',
        title: 'Bufffered Grid of 5,000 random records',
        store: store,
        selModel : {
		pruneRemoved: false
	},
	viewConfig : {
        	trackOver: false
    	},
   	verticalScroller : {
    		variableRowHeight: true,
    	},
        loadMask: true,
        // grid columns
	columns : [{
	    xtype: 'rownumberer',
	    width: 40,
	    sortable: false
	},{
	    text: 'Name',
	    flex:1 ,
	    sortable: true,
	    dataIndex: 'name'
	},{
	    text: 'Rating',
	    width: 125,
	    sortable: true,
	    dataIndex: 'rating'
	},{
	    text: 'Salary',
	    width: 125,
	    sortable: true,
	    dataIndex: 'salary',
	    align: 'right',
	    renderer: Ext.util.Format.usMoney
	}],
        renderTo: Ext.getBody()
    });

    var data = createFakeData(5000),
        ln = data.length,
        records = [],
        i = 0;
    for (; i < ln; i++) {
        records.push(Ext.create('Employee', data[i]));
    }
    store.add(records);
});



