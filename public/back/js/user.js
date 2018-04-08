/**
 * Created by HP on 2018/4/7.
 */

$(function(){

  var currentPage = 1;//记录当前页
  var pageSize = 5;//记录每页的条数

  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function(info){
        console.log(info);
        //isDelete表示用户的启用状态 1就是启用 0就是禁用
        $("tbody").html(template("tmp_user",info));


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

  //通过事件委托 给启用禁用按钮注册点击事件
  $("tbody").on("click",".btn",function(){
    $("#userModal").modal("show");

    var id = $(this).parent().data("id");
    //console.log(id);
    var isDelete = $(this).hasClass("btn-success")? 1 : 0;

    $("#submitBtn").off("click").on("click",function(){
      //console.log("haha");
      $.ajax({
        type:'post',
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete,
        },
        success:function(info) {
          console.log(info);
          if(info.success) {
            //成功 关闭模态框
            $("#userModal").modal("hide");
            //重新渲染
            render();
          }
        }

      })

    })
  })


})