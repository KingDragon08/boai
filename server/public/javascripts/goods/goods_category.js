
function add_category(){
    layer.open({
        title:'添加分类',
        type: 1,
        content: $("#add_index_category"),
        area:['450px'],
        btn:['添加','取消'],
        yes:function(index){
            var kd_type = $("#add_index_category input[name='type']:checked").val()
            var name = $("#add_index_category input[name='name']").val();
            var icon = $("#add_index_category input[name='icon']").val();
            var url = $("#add_index_category input[name='url']").val();
            if(name.length>0 && icon.length>5 && url.length>5){
                _add_category(kd_type,name,icon,url).done(function(){
                    console.log("add_category success");
                    layer.close(index);
                    history.go(0);
                });
            } else {
                alert("信息不完整");
            }
        }
    });

}


/**
*type 1=>首页分类
*type 2=>按症状找药分类
*type 3=>按科室找药分类
*type 4=>分类页分类
**/
function _add_category(type,name,icon,url){
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_ADD_CATEGORY,
        type: 'POST',
        data:{type:type,name:name,icon:icon,url:url},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
                layer.alert("添加成功");
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            console.log(err);
            layer.alert("添加商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

function bindCommands(){}

function getAndShowCategories(){
    getCategories().done(function(categories){
        if(categories){
            console.log(categories);
            showCategories(categories);
        }
    });
}

function getCategories(){
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_CATEGORY,
        type: 'POST',
        data:{},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

function showCategories(categories){
    $("#listTBody").empty();
    for(var i=0;i<categories.length;i++){
        var name = "&nbsp"+categories[i].categoryName;
        var types = ['','首页分类','按症状找药分类','按科室找药分类','分类页分类'];
        var type = types[categories[i].categoryType];
        var icon = categories[i].icon;
        var url = categories[i].url;
        var Id = categories[i].Id;

        var tr = $('<tr>'+
            '<td>'+(i+1)+'</td>'+
            '<td>'+name+'</td>'+
            '<td>'+type+'</td>'+
            '<td><img src="'+icon+'"/></td>'+
            '<td>'+url+'</td>'+
            '<td><span class="ct" onclick=edit(\"'+Id+'\",\"'+name+'\",\"'+icon+'\",\"'+url+'\",\"'+type+'\")>修改</span>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;<span class="ct" onclick=delete_cat(\"'+Id+'\")>删除</span>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;<a href="/goods/sub_category?Id='+Id+'">子类</a></td>'+
            '</tr>');
        $("#listTBody").append(tr);
    }
}

function edit(Id,name,icon,url,type){
    $("#name").val(name);
    $("#icon").val(icon);
    $("#url").val(url);
    layer.open({
        title:'编辑'+type,
        type: 1,
        content: $("#edit_category"),
        area:['450px'],
        btn:['修改','取消'],
        yes:function(index){
            var name = $("#name").val();
            var icon = $("#icon").val();
            var url = $("#url").val();
            if(name.length>0 && icon.length>5 && url.length>5){
                _eidt_category(Id,name,icon,url).done(function(){
                    console.log("edit_category success");
                    layer.close(index);
                    history.go(0);
                });
            } else {
                alert("信息不完整");
            }
        }
    });
}

/**
*type 1=>首页分类
*type 2=>按症状找药分类
*type 3=>按科室找药分类
*type 4=>分类页分类
**/
function _eidt_category(Id,name,icon,url){
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_EDIT_CATEGORY,
        type: 'POST',
        data:{Id:Id,name:name,icon:icon,url:url},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
                layer.alert("编辑成功");
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            console.log(err);
            layer.alert("编辑商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

function _delete_category(Id){
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_DELETE_CATEGORY,
        type: 'POST',
        data:{Id:Id},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
                layer.alert("删除成功");
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            console.log(err);
            layer.alert("删除商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}


function delete_cat(Id){
    if(confirm("删除该类，则该类下所有子类都将被删除，确认删除？")){
        _delete_category(Id).done(function(){
            console.log("删除成功");
            history.go(0);
        });
    }
}


function init(){
    getAndShowCategories();
    bindCommands();
}

window.onload = init();