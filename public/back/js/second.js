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
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      success:function(info){
        console.log(info);

        $("tbody").html(template("tmp_second",info));


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

  //点击添加分类按钮 显示模态框
  $("#addBtn").click(function(){
    $("#addModal").modal("show");

    //请求一级分类名称，渲染下拉菜单
    $.ajax({
      url:"/category/queryTopCategoryPaging",
      type:"get",
      data:{
        page:1,
        pageSize:100,
      },
      success:function(info){
        console.log(info);

        $(".dropdown-menu").html(template("tmp_dropdown",info));
      }
    })
  })

  $(".dropdown-menu").on("click","a",function(){
    //选中的文本
    var txt = $(this).text();
    var id=$(this).data("id");

    //修改文本内容
    $("#dropdownText").text(txt);
    //将选中的id设置到input表单元素中
    $('[name="categoryId"]').val(id);

    //将表单校验状态置成VALID
    $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");

  });

  //配置图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      console.log(data);
      //获取上传成功的图片地址
      var picAddr = data.result.picAddr;

      //设置图片地址
      $("#imgBox img").attr("src",picAddr);
      //将图片地址存在隐藏域中
      $('[name="brandLogo"]').val(picAddr);

      // 重置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
    }
  });
  //配置表单校验
  $("#form").bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验的字段
    fields:{
      //品牌的名称
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      //一级分类的id
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      //图片的地址
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  });

  //注册校验成功事件 通过ajax进行添加
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    $.ajax({
      url:"/category/addSecondCategory",
      type:"post",
      data:$("#form").serialize(),
      success:function(info){
        console.log(info);

        //关闭模态框
        $("#addModal").modal("hide");
        //重置表单里面的内容和校验状态
        $("#form").data("bootstrapValidator").resetForm(true);

        currentPage=1;
        render();
        //找到下拉菜单文本重置
        $("#dropdownText").text("请选择一级分类")

        //找到图片重置
        $("#imgBox img").attr("src","images/none.png");
      }
    })
  })


})