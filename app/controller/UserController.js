Ext.define('Wgo.controller.UserController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            //For the matching component query / xtype, sencha will create a free function for us whose name will be get<KeyName>()            
            userlist:'userlist', //this will give the instance of 'userlist' view
            userForm:'#userForm'
        },
        control: {
            'button[action=btnAddUser]' : {tap:"showUserForm"},
            'button[action=btnBack]' : {tap:"showUserList"},
            'button[action=btnUserSubmit]' : {tap:"btnUserSubmitClick"},
            '#idUserList': {disclose: 'showEdit'} //"#idUserList" is a component query (can say dom selector)
        }
    },
    //------------------------------------------------------------------------------------------------------------------
    init: function() {
        console.log("User controller init(Start)")
        console.log("User controller init(End)")
    },
    //------------------------------------------------------------------------------------------------------------------
    showUserForm: function() {
        //Todo: Detailsview not showingup after first attempt
        console.log("User controller showUserForm(Start)")
        var auv = Ext.create("Wgo.view.AddUser");
        this.getUserlist().push(auv);
        this.toggleAddFormButtons()
        console.log("User controller showDetail(End)")
    },
    showUserList: function() {
        console.log("User controller showUserList(Start)")
        this.getUserlist().pop();
        Ext.getCmp('idBtnAdd').show();
        Ext.getCmp('idBtnBack').hide();
        console.log("User controller showUserList(End)")
    },
    btnUserSubmitClick: function() {
        console.log("User controller btnUserSubmitClick(Start)")
        var username = Ext.getCmp('txtUser').getValue(), // Get form value by Dom identifier
            password = Ext.getCmp('txtPwd').getValue(),
            email = Ext.getCmp('txtEmail').getValue(),
            id = Ext.getCmp('txtUserId').getValue() 
        Ext.getCmp('userForm').setMasked({
            xtype: 'loadmask',
            message: 'Adding New user...'
        });
        //Run with "chrome.exe --disable-web-security" to allow cross domain call (recommended for development)
        //PhoneGap supports Cross Domain.
        //Reference:
        //a) http://stackoverflow.com/questions/3102819/chrome-disable-same-origin-policy
        //b)
        //CORS / Cross Domain Request
        //JSONP
        Ext.Ajax.request({
            //url: 'http://wgo-1.apphb.com/user', 
            //http://localhost:4404/user/update/2,
            url: 'http://localhost:3000/users/saveUser',
            method: 'post',
            type:'json',
            params: {
                id: id,
                username: username,
                password: password,
                email: email
            },
            callback: this.onAddUserCallback,
            scope: this
        });

        //adduser
        console.log("password = [" + password + "]")
        console.log("User controller btnUserSubmitClick (End)")
    },
    onAddUserCallback: function(options, success, response) {

        Ext.getCmp('userForm').setMasked(false);
        Ext.getStore('UserStore').load();
        //Ext.Viewport.setActiveItem(Ext.getCmp('userlist'));
        this.showUserList();

    },
    //------------------------------------------------------------------------------------------------------------------
    showEdit: function(list, record) {
    //Todo: Detailsview not showingup after first attempt
    console.log("User controller showEdit(Start)")
    console.log(record.getData().id);
    var recordId = record.getData().id;  
    var auv = Ext.create("Wgo.view.AddUser");
        auv.setValues({
        txtUserId: record.get("id"),
        txtUser: record.get("username"),
        txtEmail: record.get("email"),
        txtPwd: record.get("password")
    });    
        var but = auv.getAt(4)
        but.setText("Edit")

        this.getUserlist().push(auv);
        this.toggleAddFormButtons()
    console.log("User controller showEdit(End)")
},
toggleAddFormButtons : function(){
    Ext.getCmp('idBtnAdd').hide();
    Ext.getCmp('idBtnBack').show();
    //Ext.getCmp('btnUserSubmit').setText("");
}


});
