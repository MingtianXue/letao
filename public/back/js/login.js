/**
 * Created by HP on 2018/4/6.
 */


$(function(){

//进行表单校验
  //    校验要求: (1) 用户名不能为空
  //             (2) 密码不能为空, 且必须是 6-12 位

  $("#form").bootstrapValidator({
    //配置图标
    feedbackIcons:{
      valid:"glyphicon glyphicon-ok",
      invalid:"glyphicon glyphicon-remove",
      validating:"glyphicon glyphicon-refresh",
    },
    //对字段进行校验
    fields: {
      username: {
        //校验的规则
        validators:{
          //非空校验
          notEmpty:{
            //为空时显示的提示信息
            message:"用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:"用户名长度必须是2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"用户名不能为空"
          },
          stringLength:{
            min:6,
            max:9,
            message:"密码长度必须是6-9位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }

  });

  //2.进行登录请求
  //通过ajax进行登陆了请求
  //表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 阻止默认的提交
  $("#form").on("success.form.bv",function(e){
    //阻止默认的表单提交
    e.preventDefault();

    //console.log($("#form").serialize());
    //通过ajax进行登录请求
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      dataType:"json",
      data:$("#form").serialize(),
      success:function (info) {
        console.log(info);
        if(info.success) {
          //alert("hehe");
          location.href="index.html";
        }
        if(info.error === 1000) {
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        };
        if(info.error === 1001) {
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }

    })
  });

  //重置功能实现
  $('[type="reset"]').click(function(){
    console.log(111);
    //除了重置文本 还要重置校验状态
    $("#form").data("bootstrapValidator").resetForm();
  })



})

