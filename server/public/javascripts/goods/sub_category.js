window.onload = init();

function init(){
	getAndShowCategories();
    bindCommands();
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
	alert(common.QueryString('Id'));
    var def = $.Deferred();
    $.ajax({
        url: '/goods/category2',
        type: 'POST',
        data:{categoryId:common.QueryString('Id')},
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
        var name = "&nbsp"+categories[i].name;
        var icon = categories[i].icon;
        var Id = categories[i].Id;

        var tr = $('<tr>'+
            '<td>'+(i+1)+'</td>'+
            '<td>'+name+'</td>'+
            '<td><img src="'+icon+'"/></td>'+
            '<td>'+url+'</td>'+
            '<td><span class="ct" onclick=edit(\"'+Id+'\",\"'+name+'\",\"'+icon+'\",\"'+url+'\",\"'+type+'\")>修改</span>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;<span class="ct" onclick=delete_cat(\"'+Id+'\")>删除</span>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;<a href="/goods/sub_category/'+Id+'">子类</a></td>'+
            '</tr>');
        $("#listTBody").append(tr);
    }
}
