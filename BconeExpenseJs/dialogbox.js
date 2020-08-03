
/*对话弹窗
 * JQuery dialogbox
 * Email: chenfahui@foxmail.com
 * Date: 2016-01-11

      $.dialogbox({
        type:'msg',  //弹窗样式：msg || iframe || default 
        title:'对话框',//标题
        content:'您确定要删除吗？',//内容
        url:'dialogbox_table.html',//iframe src路径
        width:750,//iframe 宽度
        height:380,//iframe 高度
        klass:'class-name',//弹窗添加class
        overlayOpacity:'0',//遮罩层透明度0~1
        time:3000 //自动延迟隐藏时间
        icon:'0',//0:警告图标 1:打勾图标
        btn:['确定','取消'],//按钮名称，按钮个数自定
        call:[function(){
          //对应序列按钮点击事件
        },function(){
          //对应序列按钮点击事件
        }],
        closeCallback:function(){
          // 关闭弹窗执行;
        }
      });

      $.dialogbox.prompt({
        content:'请填写账号！',
        time:2000 //自动延迟隐藏时间
      });

 */
(function($){
  var btnClass = {0:'button-default',1:'button-white'};
  var promptAuto,dialogboxAuto;
  $.dialogbox = function(data){
      $.dialogbox.loading(data);
      $.dialogbox.reveal(data);
      $.dialogbox.closeCallback = data ? data.closeCallback : '';
  };

  $.extend($.dialogbox,{
    settings:{
      opacity     : 0.3,
      overlay     : true,
      dialogboxHtml :'\
      <div id="dialogbox" class="dialogbox" style="display:none;">\
        <div class="dialogboxTitle">提示</div>\
        <div class="dialogboxBody"></div>\
        <div class="dialogboxClose"></div>\
      </div>'
    },
    /*初始化*/
    init:function(settings){
      if(!$(".dialogbox").length) $('body').append($.dialogbox.settings.dialogboxHtml);
      $(".dialogboxClose").click($.dialogbox.close);
    },
    prompt:function(data){
      var content = data ? data.content ? data.content : '' : '' ,
            time = data ? data.time ? data.time : 2000 : '' ;
      $(".dialogPrompt").fadeOut(function(){$(this).remove()});
      $('body').append('<div class="dialogPrompt shake">'+content+'</div>');
      $.dialogbox.position($('.dialogPrompt'));
      if(time){
        clearTimeout(promptAuto);
        promptAuto = setTimeout(function(){
          $('.dialogPrompt').stop(true,true).fadeOut(function(){$(this).remove()});
        },time);
      }
    },
    loading:function(data){
      $.dialogbox.init();
      $.dialogbox.position();
      $.dialogbox.showOverlay(data);
      $(".dialogboxBody").html('<div class="dialogLoading"></div>');
    },
    reveal:function(data){
      var title = data ? data.title ? data.title : '' : '' ,
            content =  data ? data.content ? data.content : '' :'',
            klass =  data ? data.klass ? data.klass : '' : '',
            uri =  data ? data.url ? data.url : '' : '',
            width =  data ? data.width > 0 ? data.width : $(window).width() < 1200 ?  $(window).width()  - 150 : 1100 : '',
            height =  data ? data.height > 0 ? data.height : $(window).height()  - 250 : '',
            time = data ? data.time ? data.time : '' : '' ,
            closeBtn =  data ? data.closeBtn ? data.closeBtn : false : false;

      if(data && data.type == 'msg'){/*********************************打开对话框*********************************/      

        var  tipsHtml=btnHtml = '';
        var icon = '';
        if(data.icon && data.icon==0)
          icon = '../img/dailogbox_warning_icon.png';
        if(data.icon && data.icon==1)
          icon = '../img/dailogbox_success_icon.png';
        if(data.content){
          tipsHtml = '<div class="dialogTips"><img src="'+icon+'" />'+content+'</div>';
        }

        if(data.btn && data.btn instanceof Array){
          btnHtml ='<div class="dialogConfirm">';
          for (var lenBtn = 0; lenBtn < data.btn.length; lenBtn++) {
            var btnName = data.btn[lenBtn];
            var btnKlass = btnClass.hasOwnProperty(lenBtn)?btnClass[lenBtn]:'button-default';
            if(data.color && data.color instanceof Array && data.color.length>=lenBtn){
              var btnClassKey = data.color[lenBtn];
              if(btnClass.hasOwnProperty(btnClassKey))
                btnKlass = btnClass[btnClassKey];
            }
            btnHtml += '<a class="button '+btnKlass+'">'+btnName+'</a>';
          }
          btnHtml += '</div>';
        }

        content = tipsHtml + btnHtml;
        
        $('.dialogbox').on('click','.dialogConfirm a',function(){
          var aIndex = $(this).index();
          if(data.call && data.call instanceof Array && data.call.length>=aIndex){
            var callBack = data.call[aIndex];
            if(callBack instanceof Function)
              callBack();
          }
        });
        
      }else if(data && data.type == 'iframe'){/*********************************打开URL*********************************/

        var iframeHtml = '<iframe width="'+width+'" height="'+height+'" src="'+uri+'" frameborder="no"></iframe>';
        if(content) iframeHtml = '<div class="dialogTopTips">'+content+'</div>' + iframeHtml;
        content = iframeHtml;

      }else if(data && data.type == 'waiting'){/*********************************waiting*********************************/
        content = '<div class="dialogLoading"></div>';
      }

      $('.dialogboxBody').html(content);
      if(title){
        $('.dialogboxTitle').html(title);        
      }else{
         $('.dialogboxTitle').hide();
      }      
      if(time){
        clearTimeout(dialogboxAuto);
        dialogboxAuto = setTimeout(function(){
          $.dialogbox.close();
        },time);
      }
      if(closeBtn){
        $('.dialogboxClose').remove();
      }
      $('.dialogbox').addClass(klass);
      $('.dialogboxClose').on('click',function(){
        $.dialogbox.close();
      }) ;
      $.dialogbox.position($('.dialogbox'));
      $.dialogbox.move();
    },
    close:function(){
      $(".dialogbox").fadeOut(function(){$(this).remove()});
      $.dialogbox.hideOverlay();
      if($.dialogbox.closeCallback && $.dialogbox.closeCallback instanceof Function){
        $.dialogbox.closeCallback();
        $.dialogbox.closeCallback = null;
      }
    },
    /*显示位置*/
    position:function(obj){
      var left = $(window).width() / 2 - ($(obj).outerWidth() / 2) + $(window).scrollLeft();
      var top = $(window).height() / 2 - ($(obj).outerHeight() / 2) + $(window).scrollTop();
      if(top < $(window).scrollTop())
        top= $(window).scrollTop() + 10;
      $(obj).css({left:left,top:top}).fadeIn();
      $(".dialogboxOverlay").css('width','').css({height:$(document).height(),width:$(document).width()});
    },
    /*显示遮罩*/
    showOverlay:function(data){
      var overlay = $.dialogbox.settings.opacity;
      if(!$(".dialogboxOverlay").length) $("body").append('<div class="dialogboxOverlay"></div>');
      if(data && data.overlayOpacity)  overlay = data.overlayOpacity;
      $(".dialogboxOverlay").css({'opacity':overlay,height:$(document).height(),width:$(document).width()});
    },    
    /*移除遮罩*/
    hideOverlay:function(){
      $(".dialogboxOverlay").fadeOut(function(){$(this).remove()});
    },
    /*拖动*/
    move:function(){
      var box = $('.dialogbox'),/*弹窗*/
            handle = $('.dialogboxTitle'),/*拖动对象*/
            isClick = false,/*左键是否按住*/
            defaultX,/*拖动前的x坐标*/
            defaultY,/*拖动前的y坐标*/
            mouseX,/*拖动后的x坐标*/
            mouseY,/*拖动后的y坐标*/
            divTop,/*弹窗拖动前的x坐标*/
            divLeft;/*弹窗拖动前的y坐标*/
      handle.mousedown(function(e){
        isClick = true;
        defaultX = e.pageX;
        defaultY = e.pageY;
        divTop = box.position().top;
        divLeft = box.position().left;
      });
      $(document).mousemove(function(e){
        if(!isClick)
          return false;
        mouseX = e.pageX;
        mouseY = e.pageY;
        var left = parseInt(mouseX-defaultX)+divLeft;
        var top = parseInt(mouseY-defaultY)+divTop;
        if(left < 0)/*防止拖动出左边*/
          left = 0;
        if(top < 0)/*防止拖动出顶部*/
          top = 0;
        if(left+box.outerWidth() > $(document).width())/*防止拖动出右边*/
          left = $(document).width() - box.outerWidth();
        if(top+box.outerHeight() > $(document).height())/*防止拖动出底边*/
          top = $(document).height() - box.outerHeight();
        if(isClick){/*确认鼠标按住*/
          box.css({top:top,left:left});
        }
      });
      $(document).mouseup(function(e){
        isClick = false;
      });
    }
  });

  $(window).resize(function(){
    $.dialogbox.position($('.dialogbox'));
  });

})(jQuery);
