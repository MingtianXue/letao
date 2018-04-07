/**
 * Created by HP on 2018/4/6.
 */

//配置禁用小圆环
NProgress.configure({showSpinner:false});

//所有的ajax开始调用
$(document).ajaxStart(function() {
  NProgress.start();
});

//所有的ajax结束调用
$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },500)

});


//在一进入页面进行登录状态获取
//如果后端响应头中设置了Content-Type: application/json
//jquery会自动识别，将返回数据类型 把json字符串解析成对象

if(location.href.indexOf("login.html") === -1) {
  $.ajax({
    url:"/employee/checkRootLogin",
    type:"get",
    success:function(info) {
      console.log(info);
      if(info.success) {
        console.log("登陆了");
      }

      if(info.error === 400) {
        //进行拦截 拦截到登录页
        location.href="login.html";
      }
    }

  })
}

$(function(){

  //二级分类
  $(".category").click(function(){
    $(this).next().stop().slideToggle();
  });

  //点击头部侧边栏隐藏
  $(".icon_menu").click(function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");

  })

  //点击退出按钮 弹出模态框
  $(".icon_logout").click(function(){
    //让模态框显示
    $("#logout").modal("show");
  })
  //再外面注册logout退出按钮点击事件
  $("#logoutBtn").click(function(){
    //console.log("hehe");
    //访问退出接口 进行退出
    $.ajax({
      url:"/employee/employeeLogout",
      type:"GET",
      dataType:"json",
      success:function(info){
        //console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })

  })
})