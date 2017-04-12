import $ from 'jquery'
import './jquery.base64.js'
import './jquery.jsonp.js'
import '../css/reset.css'
import '../css/reader.css'

(function () {
  'use strict'
  var Util = (function () {
    var prefix = 'html5_reader_'
    var StorageGetter = function (key) {
      return localStorage.getItem(prefix + key)
    }
    var StorageSetter = function (key, val) {
      return localStorage.setItem(prefix + key, val)
    }
    var getBSONP = function (url, callback) {
      return $.jsonp({
        url: url,
        cache: true,
        callback: 'duokan_fiction_chapter',
        success: function (result) {
          var data = $.base64.decode(result)
          var json = decodeURIComponent(escape(data))
          callback(json)
        }
      })
    }
    return {
      getBSONP: getBSONP,
      StorageGetter: StorageGetter,
      StorageSetter: StorageSetter
    }
  })()

  // 主题背景切换函数
  var toggleTheme = function (theme) {
    var $current,
      $root,
      currentTheme,
      nextTheme,
      $target = $('.bk-container[data-theme="' + theme + '"]')

    $current = $('.bk-container-current')
    $root = $('#root')
    currentTheme = $current.parent().data('theme')
    nextTheme = $target.data('theme')
    $root.attr('class', $root.attr('class').replace(currentTheme, nextTheme))
    $current.appendTo($target)
    Util.StorageSetter('theme', nextTheme)

    if ($target.is('[data-theme="bg2"]')) {
      $('#light').removeClass('light-night-active')
    } else if ($target.is('[data-theme="bg5"]')) {
      $('#light').addClass('light-night-active')
    }
  }

  // 从缓存中获取主题背景设置
  var userTheme = Util.StorageGetter('theme')
  userTheme && toggleTheme(userTheme)
  var Dom = {
    top_nav: $('#top-nav'),
    bottom_nav: $('#bottom-nav'),
    night_day_switch_button: $('#day-botton'),
    font_container: $('#font-container'),
    font_button: $('#font-button'),
    day_button: $('#day-button'),
    night_button: $('#night-button'),
    bk_button: $('.bk-container')
  }
  var Win = $(window)
  // var Doc = $(document)
  var readerModel
  var readerUI
  var RootContainer = $('#fiction-container')
  var initFontSize = Util.StorageGetter('font-size')
  initFontSize = parseInt(initFontSize)
  if (!initFontSize) {
    initFontSize = 14
  }
  RootContainer.css('font-size', initFontSize)

  function main () {
    // todo 整个项目的入口函数
    readerModel = ReaderModel()
    readerUI = ReaderBaseFrame(RootContainer)
    readerModel.init(function (data) {
      readerUI(data)
    })
    EventHanlder()
  }

  function ReaderModel () {
    // todo 实现和阅读器相关的数据交互的方法
    // 第一步，获得章节列表信息
    var chapterId
    var chapterTotal
    var init = function (UIcallback) {
      // getFictionInfo(function () {
      //   getCurChapterContent(chapterId, function (data) {
      //     // todo...
      //   })
      // })
        getFictionInfoPromise().then(function (d) {
          return getCurChapterContentPromise()
        }).then(function (data) {
          UIcallback && UIcallback(data)
        })
    }
    var getFictionInfo = function (callback) {
      $.get('mock/chapter.json', function (data) {
        // todo 获得章节信息之后的回调
        chapterId = Util.StorageGetter('curChapterId')
        if (chapterId == null) {
          chapterId = data.chapters[1].chapter_id
        }
        chapterTotal = data.chapters.length
        callback && callback()
      }, 'json')
    }
    var getFictionInfoPromise = function () {
      return new Promise(function(resolve,reject){
        $.get('mock/chapter.json', function (data) {
          // todo 获得章节信息之后的回调
          if (data.result == 0) {
            chapterId = Util.StorageGetter('curChapterId')
            if (chapterId == null) {
              chapterId = data.chapters[1].chapter_id
            }
            chapterTotal = data.chapters.length
            resolve()
          } else {
            reject()
          }
        }, 'json')
      })
    }
    var getCurChapterContent = function (chapterId, callback) {
      $.get('mock/data' + chapterId + '.json', function (data) {
        if (data.result === 0) {
          var url = data.jsonp
          // 获得加密的json数据
          Util.getBSONP(url, function (data) {
            callback && callback(data)
          })
        }
      }, 'json')
    }
    var getCurChapterContentPromise = function () {
      return new Promise(function(resolve,reject){
        $.get('mock/data' + chapterId + '.json', function (data) {
          if (data.result === 0) {
            var url = data.jsonp
            // 获得加密的json数据
            Util.getBSONP(url, function (data) {
              resolve(data)
            })
          } else {
            reject({msg:'fail'})
          }
        }, 'json')
      })
    }
    var prevChapter = function (UIcallback) {
      chapterId = parseInt(chapterId, 10)
      if (chapterId === 0) {
        return
      }
      chapterId -= 1
      Util.StorageSetter('curChapterId',chapterId)
      getCurChapterContent(chapterId, UIcallback)
    }
    var nextChapter = function (UIcallback) {
      chapterId = parseInt(chapterId, 10)
      if (chapterId === chapterTotal) {
        return
      }
      chapterId += 1
      Util.StorageSetter('curChapterId',chapterId)
      getCurChapterContent(chapterId, UIcallback)
    }
    return {
      init: init,
      prevChapter: prevChapter,
      nextChapter: nextChapter
    }
  }

  function ReaderBaseFrame (container) {
    // todo 渲染基本的UI结构
    function parseChapterData (jsonData) {
      var jsonObj = JSON.parse(jsonData)
      var html = '<h4>' + jsonObj.t + '</h4>'
      for (var i = 0; i < jsonObj.p.length; i++) {
        html += '<p>' + jsonObj.p[i] + '</p>'
      }
      return html
    }
    return function (data) {
      container.html(parseChapterData(data))
    }
  }

  function EventHanlder () {
    // todo 交互的事件绑定
    // 中间唤醒操作区
    $('#action_mid').click(function () {
      if (Dom.top_nav.css('display') === 'none') {
        Dom.bottom_nav.show()
        Dom.top_nav.show()
      } else {
        Dom.bottom_nav.hide()
        Dom.top_nav.hide()
        Dom.font_container.hide()
        Dom.font_button.removeClass('current')
      }
    })

    // 字体按钮点击事件
    Dom.font_button.click(function () {
      if (Dom.font_container.css('display') === 'none') {
        Dom.font_container.show()
        Dom.font_button.addClass('current')
      } else {
        Dom.font_container.hide()
        Dom.font_button.removeClass('current')
      }
    })

    // 白天夜晚模式切换交互
    $('#light').click(function () {
      $(this).toggleClass('light-night-active')
      if ($('#light').hasClass('light-night-active')) {
        toggleTheme('bg5')
      } else {
        toggleTheme('bg2')
      }
    })

    // 调整字体大小交互
    $('#large-font').click(function () {
      if (initFontSize > 20) {
        return
      }
      initFontSize += 1
      RootContainer.css('font-size', initFontSize)
      Util.StorageSetter('font-size', initFontSize)
      console.log('bjkv')
    })

    $('#small-font').click(function () {
      if (initFontSize < 12) {
        return
      }
      initFontSize -= 1
      RootContainer.css('font-size', initFontSize)
      Util.StorageSetter('font-size', initFontSize)
    })

    // 切换主题背景
    $('#font-container .child-mod:last-child').on('click', function (e) {
      var theme = $(e.target).data('theme')
      //  var theme = $(e.target).attr('data-theme')
      //  var theme = e.target.dataset.theme
      //  var theme = e.target.getAttribute('data-theme')
      theme && toggleTheme(theme)
    })

    // 滚动事件
    Win.scroll(function () {
      Dom.bottom_nav.hide()
      Dom.top_nav.hide()
      Dom.font_container.hide()
      Dom.font_button.removeClass('current')
    })

    // 上下翻页
    $('#prev-button').on('click', function () {
      // todo 获得章节的翻页数据->把数据拿出来渲染
      readerModel.prevChapter(function (data) {
        readerUI(data)
      })
    })
    $('#next-button').on('click', function () {
      readerModel.nextChapter(function (data) {
        readerUI(data)
      })
    })
  }
  main()
})()
