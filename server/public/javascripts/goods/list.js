/**
 * 商品列表
 * Created by zlongxiao@126.com on 2015/11/7.
 */
window.goods = window.goods || {};

$(function () {
    PagingControl.init(goods.list.getAndShowDetail);
    goods.list.getAndShowDetail(1);
    //$("#formUploadExcel").on('change',goods.list.batchAddGoods);
    $("#flowState_query").on("change", function () {
        goods.list._flowState = $("#flowState_query").val();
        goods.list.getAndShowDetail(1);
    });
});

goods.list = {

    _keywords: "",

    _flowState: "",

    /**
     * 关键字搜索
     */
    goodsSearch: function () {
        goods.list._keywords = $.trim($("#queryKeyStr").val());
        goods.list.getAndShowDetail(1);
    },
    /**
     * 列表数据获取参数传递
     * @param pageIndex
     */
    getAndShowDetail: function (pageIndex, keywords) {
        var args = {
            pageIndex: pageIndex
        };
        goods.list.getDetail(args);
    },
    /**
     * 列表数据获取
     * @param args
     */
    getDetail: function (args) {
        var layerLoadId = layer.load();
        var url = '/goodsgroup/list';
        var data = {
            succ: {
                args: args,
                layerLoadId: layerLoadId
            }
        };
        var param = {pageIndex: args.pageIndex};
        if (goods.list._keywords) {
            param.queryKeyStr = goods.list._keywords;
        }
        if (goods.list._flowState) {
            param.saleState = goods.list._flowState;
        }
        common.ajax(url, param, goods.list._getDetailSucc, goods.list._getDetailError, data);
    },
    /**
     * 列表数据获取成功回调
     * @param data
     * @param parm
     * @private
     */
    _getDetailSucc: function (data, parm) {
        console.log(data);
        var totalPageNum = Math.ceil(parseInt(data.data.total) / 100);
        var curPageIndex = parm.succ.args.pageIndex;
        goods.list.refreshTable(data.data.goods, curPageIndex);
        PagingControl.updatePagingControl(totalPageNum, curPageIndex);
        layer.close(parm.succ.layerLoadId);
    },
    /**
     * 列表数据获取失败回调
     * @param err
     * @param parm
     * @private
     */
    _getDetailError: function (err, parm) {
        layer.close(parm.succ.layerLoadId);
    },
    /**
     * 列表数据绑定
     * @param goods
     */
    refreshTable: function (goods) {
        var temp = document.getElementById('goods_list_table').innerHTML;
        var ejs = new EJS({text: temp, type: "["});
        var html = ejs.render({list: goods});
        $("#listTBody").html(html);
    },
    /**
     * 批量上传商品
     * 功能废弃（没有调试通过）
     */
    batchAddGoods: function () {
        var layerId = layer.load();
        var url = '/goods/import/goods_excel';
        var formData = new FormData($("#formUploadExcel")[0]);
        common.ajax(url, formData, goods.list._batchAddSuc, goods.list._error, layerId);
    },
    _batchAddSuc: function (data, layerId) {

        $("#inputFile_excel").replaceWith('<input id="inputFile_excel" name="files" type="file" accept=".xls" style="cursor: pointer">');
    },
    _error: function () {
        layer.alert('服务异常');
    },
    /**
     * 删除商品组
     * @param goodsGroupId
     */
    deleteGoodGroup: function (goodsGroupId) {
        if(confirm("确认删除？")){
            var url = '/goodsgroup/delete/';
            var param = {goodsGroupId: goodsGroupId};
            common.ajax(url, param, goods.list._deleteSuc, goods.list._error);
        }
    },
    _deleteSuc: function (data) {
        if (data.code == 200) {
            layer.alert(data.msg);
            goods.list.getAndShowDetail(1);
        } else {
            layer.alert(data.msg);
        }
    },
    alertCannotEdit: function (brandTitle){
        layer.alert('您的品牌<span style="color: red;font-weight: bolder">'+ brandTitle + '</span>未通过审核，请联系管理员，审后才能编辑哦！');
    },
    kd_category:function(Id){
        //获取所有的分类
        $.ajax({
            url: '/goods/get_goods_categories',
            type: 'POST',
            data:{Id:Id},
            success: function (res) {
                if (200 === res.code) {
                    var data = res.data;
                    $("#temp .container").empty();
                    var types = ['','首页分类','按症状找药分类','按科室找药分类','分类页分类'];
                    for(var i=0; i<data.length; i++){

                        var name = types[data[i].CategoryType] +
                                    '->'+
                                    data[i].CategoryTitle+
                                    '->'+
                                    data[i].name;
                        var t_Id = data[i].Id;
                        var item = $('<div class="item">'+
                            '<div class="left">'+name+'</div>'+
                            '<div class="right" onclick="delete_category('+t_Id+')">X</div>'+
                            '</div>');
                        $("#temp .container").append(item);
                    }
                    layer.open({
                        title:"分类信息",
                        type:1,
                        content:$("#temp"),
                        btn:['添加','关闭'],
                        yes:function(index){
                            layer.open({
                                title:"添加分类",
                                type:1,
                                btn:['确定','取消'],
                                content:$("#temp1"),
                                yes:function(index){
                                    var category = $("#level3").val();
                                    if(category){
                                        goods.list.kd_add_category(Id,category);
                                    }
                                }
                            });
                        }
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        
    },
    kd_add_category:function(Id,category){
        $.ajax({
            url: '/goods/goods2category',
            type: 'POST',
            data:{Id:Id,type:category},
            success: function (res) {
                if (200 === res.code) {
                    history.go(0);
                }
            },
            error: function (err) {
                layer.alert("查询商品分类失败，请刷新页面重试。");
            }
        });
    }
};