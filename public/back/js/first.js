/**
 * Created by HP on 2018/4/8.
 */

$(function(){

  var currentPage = 1;//记录当前页
  var pageSize = 5;//记录每页的条数

  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function(info){
        console.log(info);

        $("tbody").html(template("tmp_first",info));


        //配置分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//指定当前bootstrap的版本，如果是3，必须指定
          currentPage:info.page,//指定当前页
          totalPages:Math.ceil(info.total/info.size),//指定总页数
          onPageClicked:function(a,b,c,page) {
            //page指的是点击的页码，修改了当前页
            currentPage = page;
            //重新渲染
            render();
          }
        });

      }
    })
  }

  //点击添加分类按钮 让模态框显示
  $("#addBtn").click(function(){
    $("#addModal").modal("show");

  })

  //表单校验
  $("#form").bootstrapValidator({
    //小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"请输入一级分类"
          }
        }
      }
    }
  });

  //注册表单校验成功事件
  //    表单校验插件, 会在表单提交时, 进行校验
  //    如果通过校验, 默认会进行提交, 需要阻止, 通过 ajax 进行提交
$("#form").on("success.form.bv",function(e){
  e.preventDefault();

  //console.log($("#form").serialize());
  $.ajax({
    type:"post",
    url:"/category/addTopCategory",
    data:$("#form").serialize(),
    success:function(info){
      console.log(info);
      if(info.success){
        //模态框隐藏
        $("#addModal").modal("hide");
        //重新渲染页面 添加的分类会在第一页 所以重新渲染第一页
        currentPage=1;
        render();


        //重置表单校验状态和表单内容
        $("#form").data("bootstrapValidator").resetForm(true);
      }
    }
  })
})


})