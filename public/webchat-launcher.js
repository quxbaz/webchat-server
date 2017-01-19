/*
  Script for rendering the widget launcher, getting app config, and
  creating the chat window iframe

  <Here there be dragons> Because this file runs on a third party
  site, all script and styles must be self contained. Basically here,
  we are doing CSS imperatively, which accounts for a large bulk of
  the code. We also must stick to ES5 and not affect the parent
  context.
*/

;(function () {

  // Util functions

  function isBlack (color) {
    return color.toLowerCase() === '#000000' || color.toLowerCase() === '#000'
  }

  function isWhite (color) {
    return color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff'
  }

  // Constants and declarations

  var WHITE_CHATS_SVG = 'data:image/svg+xml;utf8,<svg width="32px" height="30px" viewBox="0 0 32 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: sketchtool 40.3 (33839) - http://www.bohemiancoding.com/sketch --><title>0A642313-4BAB-454D-A9A3-F49A9FABBCAA</title><desc>Created with sketchtool.</desc><defs></defs><g id="Future-V1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="18.-User-bubble-tool-tip" transform="translate(-280.000000, -184.000000)" fill="#FFFFFF"><g id="Group-10-Copy-18" transform="translate(50.000000, 51.000000)"><g id="#intercom-container-+-Group-33-+-Group-33-Copy-+-Topics-+-Group-8-+-Group-32-+-Group-5-+-Group-+-Group-30-Mask"><g id="Group-17" transform="translate(180.000000, 105.000000)"><g id="Group" transform="translate(20.000000, 10.000000)"><g id="Chats-Icon-white" transform="translate(30.000000, 18.000000)"><g id="Chats-Icon"><path d="M5,23.9066464 L11.9374124,17 L18.5,17 C23.1946224,17 27,13.1944471 27,8.5 C27,3.80555287 23.1946224,0 18.5,0 L8.5,0 C3.80605287,0 0,3.80587762 0,8.5 C0,11.8827947 1.99806945,14.8824397 5,16.2387971 L5,23.9066464 Z M7,14.8571922 L6.33370926,14.621324 C3.7565141,13.7089916 2,11.2724446 2,8.5 C2,4.91046773 4.91060176,2 8.5,2 L18.5,2 C22.0900323,2 25,4.91010175 25,8.5 C25,12.0898983 22.0900323,15 18.5,15 L11.1115876,15 L7,19.0933536 L7,14.8571922 Z" id="Stroke-1"></path><path d="M28.00005,29.9496518 L28.00005,23.4965407 C30.3836628,22.5043935 32.00005,20.162373 32.00005,17.49975 C32.00005,13.9098066 29.0901761,10.99975 25.50005,10.99975 L25.13505,10.99975 L25.13505,12.99975 L25.50005,12.99975 C27.9855785,12.99975 30.00005,15.014348 30.00005,17.49975 C30.00005,19.5239743 28.6491563,21.281382 26.72756,21.8255914 L26.00005,22.0316273 L26.00005,25.1208482 L22.8792959,21.99975 L19.50005,21.99975 C17.0149612,21.99975 15.00005,19.9850918 15.00005,17.49975 C15.00005,17.0800601 15.0575644,16.6676852 15.1695199,16.2706383 L13.2445801,15.7278617 C13.0830314,16.300789 13.00005,16.895761 13.00005,17.49975 C13.00005,21.0897175 15.910448,23.99975 19.50005,23.99975 L22.0508041,23.99975 L28.00005,29.9496518 Z" id="Stroke-3"></path></g></g></g></g></g></g></g></g></svg>'
  var BLACK_CHATS_SVG = 'data:image/svg+xml;utf8,<svg width="32px" height="30px" viewBox="0 0 32 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: sketchtool 40.3 (33839) - http://www.bohemiancoding.com/sketch --><title>64311C0F-D949-43C6-8973-B9B817E3FC56</title><desc>Created with sketchtool.</desc><defs></defs><g id="Future-V1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="19.-Widget-colors-customized" transform="translate(-280.000000, -184.000000)" fill="#000000"><g id="Group-10-Copy-5" transform="translate(50.000000, 51.000000)"><g id="#intercom-container-+-Group-33-+-Group-33-Copy-+-Topics-+-Group-8-+-Group-32-+-Group-5-+-Group-+-Group-30-Mask"><g id="Group-17" transform="translate(180.000000, 105.000000)"><g id="Group" transform="translate(20.000000, 10.000000)"><g id="Chats-Icon-black" transform="translate(30.000000, 18.000000)"><g id="Chats-Icon"><path d="M5,23.9066464 L11.9374124,17 L18.5,17 C23.1946224,17 27,13.1944471 27,8.5 C27,3.80555287 23.1946224,0 18.5,0 L8.5,0 C3.80605287,0 0,3.80587762 0,8.5 C0,11.8827947 1.99806945,14.8824397 5,16.2387971 L5,23.9066464 Z M7,14.8571922 L6.33370926,14.621324 C3.7565141,13.7089916 2,11.2724446 2,8.5 C2,4.91046773 4.91060176,2 8.5,2 L18.5,2 C22.0900323,2 25,4.91010175 25,8.5 C25,12.0898983 22.0900323,15 18.5,15 L11.1115876,15 L7,19.0933536 L7,14.8571922 Z" id="Stroke-1"></path><path d="M28.00005,29.9496518 L28.00005,23.4965407 C30.3836628,22.5043935 32.00005,20.162373 32.00005,17.49975 C32.00005,13.9098066 29.0901761,10.99975 25.50005,10.99975 L25.13505,10.99975 L25.13505,12.99975 L25.50005,12.99975 C27.9855785,12.99975 30.00005,15.014348 30.00005,17.49975 C30.00005,19.5239743 28.6491563,21.281382 26.72756,21.8255914 L26.00005,22.0316273 L26.00005,25.1208482 L22.8792959,21.99975 L19.50005,21.99975 C17.0149612,21.99975 15.00005,19.9850918 15.00005,17.49975 C15.00005,17.0800601 15.0575644,16.6676852 15.1695199,16.2706383 L13.2445801,15.7278617 C13.0830314,16.300789 13.00005,16.895761 13.00005,17.49975 C13.00005,21.0897175 15.910448,23.99975 19.50005,23.99975 L22.0508041,23.99975 L28.00005,29.9496518 Z" id="Stroke-3"></path></g></g></g></g></g></g></g></g></svg>'
  var WHITE_X_SVG = 'data:image/svg+xml;utf8,<svg width="32px" height="30px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: sketchtool 40.3 (33839) - http://www.bohemiancoding.com/sketch --><title>03F0BABC-D992-48F9-BF1A-0C34BDEC14E1</title><desc>Created with sketchtool.</desc><defs><filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="Future-V1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="21.-Page-scrolled" transform="translate(-900.000000, -719.000000)" fill="#FFFFFF"><g id="Group-10-Copy" transform="translate(50.000000, 51.000000)"><g id="#intercom-container-+-Group-33-+-Group-33-Copy-+-Topics-+-Group-8-+-Group-32-+-Group-5-+-Group-+-Group-30-Mask"><g id="Message-CTA" filter="url(#filter-1)" transform="translate(834.000000, 652.000000)"><g id="X-icon-white" transform="translate(25.000000, 25.000000)"><polygon id="Rectangle-61" points="10 8 2 0 -8.03887339e-14 2 8 10 -8.03887339e-14 18 2 20 10 12 18 20 20 18 12 10 20 2 18 0 10 8"></polygon></g></g></g></g></g></g></svg>'
  var BLACK_X_SVG = 'data:image/svg+xml;utf8,<svg width="32px" height="30px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: sketchtool 40.3 (33839) - http://www.bohemiancoding.com/sketch --><title>72F64C89-15F1-4562-9CFF-B1540301B104</title><desc>Created with sketchtool.</desc><defs><filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="Future-V1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="19.-Widget-colors-customized" transform="translate(-900.000000, -719.000000)" fill="#000000"><g id="Group-10-Copy-5" transform="translate(50.000000, 51.000000)"><g id="#intercom-container-+-Group-33-+-Group-33-Copy-+-Topics-+-Group-8-+-Group-32-+-Group-5-+-Group-+-Group-30-Mask"><g id="Message-CTA" filter="url(#filter-1)" transform="translate(834.000000, 652.000000)"><g id="X-icon-black" transform="translate(25.000000, 25.000000)"><polygon id="Rectangle-61" points="10 8 2 0 -8.03887339e-14 2 8 10 -8.03887339e-14 18 2 20 10 12 18 20 20 18 12 10 20 2 18 0 10 8"></polygon></g></g></g></g></g></g></svg>'

  var DEFAULT_WIDTH = 500
  var DEFAULT_HEIGHT = 600

  var CHAT_CONTAINER_STYLE = {
    position: 'fixed',
    bottom: '120px',
    right: '30px',
    width: DEFAULT_WIDTH + 'px',
    height: DEFAULT_HEIGHT + 'px',
    overflow: 'hidden',
    userSelect: 'none',
    webkitUserSelect: 'none',
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateY(12px)',
    transition: 'all 240ms ease-out',
    boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)',
  }

  var IFRAME_STYLE = {
    background: '#fff',
    border: 'none',
    boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)',
  }

  var LAUNCHER_STYLE = {
    cursor: 'pointer',
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '30px',
    right: '30px',
    width: '70px',
    height: '70px',
    border: 'none',
    borderRadius: '100px',
    background: '#2e7de1',
    transform: 'scale(0)',
    transition: 'all 120ms linear',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.3)',
  }

  // Mutables
  var chatContainerWidth = DEFAULT_WIDTH
  var chatContainerHeight = DEFAULT_HEIGHT

  var iframeSrc
  if (window.pypestreamConfig.domain === 'localhost') {
    iframeSrc = 'http://localhost:5000'
  } else if (window.pypestreamConfig.domain === 'heroku') {
    iframeSrc = 'https://test-webchat.herokuapp.com'
  } else if (window.pypestreamConfig.domain === 'dev') {
    iframeSrc = 'http://stage-webchat-v3r2.pype.tech'
  }

  var isLauncherActive = false
  var hasIframeLoaded = false
  var animId

  // DOM elements
  var chatContainer
  var appLoader
  var appIframe
  var appLauncher
  var customStyle

  // Stateless function declarations

  function post (url, data, onSuccess) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')

    // <TEMP>
    xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa('f7843613-825c-4969-8129-4a548ae21c7d:eb338475-ca62-48db-aac6-84dda054793f'))

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        onSuccess(xhr.responseText)
      }
    }
    xhr.send(data)
  }

  function createChatContainer () {
    var div = document.createElement('div')
    Object.assign(div.style, CHAT_CONTAINER_STYLE)
    return div
  }

  function createLoader () {
    var div = document.createElement('div')
    Object.assign(div.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#79797',
    })
    var loader = document.createElement('div')
    Object.assign(loader.style, {
      width: '40px',
      height: '40px',
      border: '12px solid #f3f3f3',
      borderTop: '12px solid #2e7de1',
      borderRadius: '50%',
    })

    var rate = 540  // degree rotations per sec
    var last = Date.now()
    var deg = 0

    animId = setInterval(() => {
      window.requestAnimationFrame(() => {
        if (hasIframeLoaded) {
          return
        }
        var now = Date.now()
        var dt = Date.now() - last
        last = now
        deg += rate * dt / 1000
        loader.style.transform = 'rotate(' + deg + 'deg)'
      })
    }, 10)

    div.appendChild(loader)
    return div
  }

  function createIframe (src) {
    var iframe = document.createElement('iframe')
    iframe.src = src
    iframe.width = '100%'
    iframe.height = '100%'
    Object.assign(iframe.style, IFRAME_STYLE)
    iframe.addEventListener('load', function () {
      hasIframeLoaded = true
      clearInterval(animId)
      appLoader.style.display = 'none'
    })
    return iframe
  }

  function toggleWidget () {
    isLauncherActive = !isLauncherActive
    var icon = appLauncher.querySelector('img')
    if (isLauncherActive) {
      if (!appIframe) {
        if (window.pypestreamConfig.debug) {
          iframeSrc += '&debug=true'
        }
        if (window.pypestreamConfig.ENV) {
          iframeSrc += '&env=' + window.pypestreamConfig.ENV
        }
        appLoader = createLoader()
        appIframe = createIframe(iframeSrc)
        var fragment = document.createDocumentFragment()
        fragment.appendChild(appLoader)
        fragment.appendChild(appIframe)
        chatContainer.appendChild(fragment)
      }
      chatContainer.style.transform = 'translateY(0)'
      chatContainer.style.visibility = 'visible'
      chatContainer.style.opacity = 1
      icon.src = isBlack(customStyle.widgetStyleTextColor) ? BLACK_X_SVG : WHITE_X_SVG
    } else {
      chatContainer.style.transform = 'translateY(12px)'
      chatContainer.style.visibility = 'hidden'
      chatContainer.style.opacity = 0
      icon.src = isBlack(customStyle.widgetStyleTextColor) ? BLACK_CHATS_SVG : WHITE_CHATS_SVG
    }
    setLauncherVisibility()
  }

  function createLauncher (style={}) {
    var div = document.createElement('div')
    Object.assign(div.style, LAUNCHER_STYLE, style)
    div.addEventListener('click', toggleWidget, false)
    return div
  }

  function setLauncherVisibility () {
    if (window.innerWidth <= 768) {
      appLauncher.style.display = isLauncherActive ? 'none' : 'flex'
    } else {
      appLauncher.style.display = 'flex'
    }
  }

  function onResize () {
    var width = window.innerWidth
    var height = window.innerHeight
    if (width <= 768) {
      chatContainer.style.width = '100%'
      chatContainer.style.height = '100%'
      chatContainer.style.bottom = 0
      chatContainer.style.right = 0
      chatContainer.style.borderRadius = 0
    } else {
      chatContainer.style.width = Math.min(width, chatContainerWidth) + 'px'
      chatContainer.style.height =  Math.min(height, chatContainerHeight) + 'px'
      if (customStyle.styleSelection === 2) {
        chatContainer.style.bottom = '90px'
      } else {
        chatContainer.style.bottom = '120px'
      }
      chatContainer.style.right = '30px'
      chatContainer.style.borderRadius = '10px'
    }
    setLauncherVisibility()
  }

  function onGetWidgetData (resp) {
    var json = JSON.parse(resp)
    var styleStr = json.widget_data.style
    var styleJson = JSON.parse(styleStr)
    customStyle = styleJson
    iframeSrc += '?style=' + window.encodeURIComponent(styleStr)
    iframeSrc += '&app_id=' + window.encodeURIComponent(window.pypestreamConfig.APP_ID)
    iframeSrc += '&pype_id=' + window.encodeURIComponent(json.widget_data.pype_id)
    iframeSrc += '&stream_id=' + window.encodeURIComponent(json.widget_data.stream_id)
    iframeSrc += '&user_id=' + window.encodeURIComponent(json.id)
    iframeSrc += '&access_token=' + window.encodeURIComponent(json.access_token)

    // <TEMP>
    // styleJson.styleSelection = 2

    // <TEMP>
    // styleJson.widgetPosition = 'top-left'
    // styleJson.widgetPosition = 'top-right'
    // styleJson.widgetPosition = 'bottom-left'
    // styleJson.widgetPosition = 'bottom-right'

    var appLauncherStyle = {
      background: styleJson.widgetStyleColor || '#ff00ff',
      color: styleJson.widgetStyleTextColor || '#ffffff',
    }

    if (styleJson.styleSelection === 2) {
      appLauncherStyle.width = '222px'
      appLauncherStyle.height = '60px'
      appLauncherStyle.borderRadius = '26px 26px 0 0'
      appLauncherStyle.fontFamily = 'sans-serif'
      appLauncherStyle.fontSize = '20px'
      appLauncherStyle.fontWeight = 'bold'
      if (styleJson.widgetPosition === 'top-left' || styleJson.widgetPosition === 'top-right') {
        appLauncherStyle.borderRadius = '0 0 26px 26px'
      }
    }

    chatContainer = createChatContainer()
    // appLoader = createLoader()
    // appIframe = createIframe(src)
    appLauncher = createLauncher(appLauncherStyle)
    var icon = document.createElement('img')
    icon.style.userSelect = 'none'
    icon.style.webkitUserSelect = 'none'
    icon.src = isBlack(styleJson.widgetStyleTextColor) ? BLACK_CHATS_SVG : WHITE_CHATS_SVG
    appLauncher.appendChild(icon)
    if (styleJson.styleSelection === 2) {
      icon.style.marginRight = '18px'
      var text = document.createElement('span')
      text.innerText = 'Chat with us'
      text.style.color = styleJson.widgetStyleTextColor
      text.style.userSelect = 'none'
      text.style.webkitUserSelect = 'none'
      appLauncher.appendChild(text)
    }

    chatContainerWidth = styleJson.widgetWidth
    chatContainerHeight = styleJson.widgetHeight
    chatContainer.style.width = styleJson.widgetWidth
    chatContainer.style.height = styleJson.widgetHeight

    chatContainer.style.top = 'auto'
    chatContainer.style.right = 'auto'
    chatContainer.style.bottom = 'auto'
    chatContainer.style.left = 'auto'
    appLauncherStyle.top = 'auto'
    appLauncherStyle.right = 'auto'
    appLauncherStyle.bottom = 'auto'
    appLauncherStyle.left = 'auto'

    if (styleJson.widgetPosition === 'top-left') {
      if (styleJson.styleSelection === 2) {
        chatContainer.style.top = '90px'
        chatContainer.style.left = '30px'
        appLauncher.style.top = '0'
        appLauncher.style.left = '30px'
      } else {
        chatContainer.style.top = '120px'
        chatContainer.style.left = '30px'
        appLauncher.style.top = '30px'
        appLauncher.style.left = '30px'
      }
    } else if (styleJson.widgetPosition === 'top-right') {
      if (styleJson.styleSelection === 2) {
        chatContainer.style.top = '90px'
        chatContainer.style.right = '30px'
        appLauncher.style.top = '0'
        appLauncher.style.right = '30px'
      } else {
        chatContainer.style.top = '120px'
        chatContainer.style.right = '30px'
        appLauncher.style.top = '30px'
        appLauncher.style.right = '30px'
      }
    } else if (styleJson.widgetPosition === 'bottom-left') {
      if (styleJson.styleSelection === 2) {
        chatContainer.style.bottom = '90px'
        chatContainer.style.left = '30px'
        appLauncher.style.bottom = '0'
        appLauncher.style.left = '30px'
      } else {
        chatContainer.style.bottom = '120px'
        chatContainer.style.left = '30px'
        appLauncher.style.bottom = '30px'
        appLauncher.style.left = '30px'
      }
    } else {
      if (styleJson.styleSelection === 2) {
        chatContainer.style.bottom = '90px'
        chatContainer.style.right = '30px'
        appLauncher.style.bottom = '0'
        appLauncher.style.right = '30px'
      } else {
        chatContainer.style.bottom = '120px'
        chatContainer.style.right = '30px'
        appLauncher.style.bottom = '30px'
        appLauncher.style.right = '30px'
      }
    }

    // chatContainer.appendChild(appLoader)
    // chatContainer.appendChild(appIframe)

    document.body.appendChild(chatContainer)
    document.body.appendChild(appLauncher)

    setTimeout(function () {
      appLauncher.style.transform = 'scale(1.4)'
      setTimeout(function () {
        appLauncher.style.transform = 'scale(1)'
      }, 120)
    }, 100)

    onResize()
  }

  function onReady () {
    var ENV = window.pypestreamConfig.ENV || 'prod'
    var url = 'https://' + ENV + '-webservice-v3r2.pype.tech/v3/consumer/anonymous_session'
    post(url, JSON.stringify({
      app_id: window.pypestreamConfig.APP_ID,
      app_type : 'consumer',
      device_id : 'my-device-id',
      device_type : 'web',
      phone : '15555555555',
    }), onGetWidgetData)
  }

  window.addEventListener('resize', function () {
    window.requestAnimationFrame(onResize)
  }, false)

  window.addEventListener('message', function (event) {
    if (event.data === 'TOGGLE') {
      toggleWidget()
    }
  }, false)

  if (document.readyState === 'complete' ||
      document.readyState === 'loaded' ||
      document.readyState === 'interactive') {
    onReady()
  } else {
    document.addEventListener('DOMContentLoaded', onReady, false)
  }
})()
