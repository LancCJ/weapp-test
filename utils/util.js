const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStartsArray(stars){
  var num = stars.toString().substring(0,1);
  var array = [];
  for(var i=0;i<5;i++){
    if(i<num){
      array.push(1);
    }else{
      array.push(0);
    }
  }
  return array;
}

function convertToDirectorsArray(directors) {
  //console.log(directors);
  //console.log(directors.length);
  var array = '';
  for (var i = 0; i < directors.length; i++) {
    if (i ==0) {
      array += directors[i].name;
    } else {
      array += '/' + directors[i].name;
    }
  }
  //console.log(array);
  return array;
}


function convertToCastasArray(castas) {
  //console.log(directors);
  //console.log(directors.length);
  var array = '';
  for (var i = 0; i < castas.length; i++) {
    if (i == 0) {
      array += castas[i].name;
    } else {
      array += '/' + castas[i].name;
    }
  }
  //console.log(array);
  return array;
}

function convertToTypeArray(type) {
  //console.log(directors);
  //console.log(directors.length);
  var array = '';
  for (var i = 0; i < type.length; i++) {
    if (i == 0) {
      array += type[i];
    } else {
      array += '、' + type[i];
    }
  }
  //console.log(array);
  return array;
}


function http(url,method,callback) {
  wx.request({
    url: url,
    header: {
      'Content-Type': 'application/json' // 默认值
    },
    method: (method != '' && method!=null)?method:'GET',
    success: function (res) {
      callback(res.data);
    },
    fail : function(error){
      console.log(error);
    }
  })
}

function douban_limit() {
  var timestamp = Date.parse(new Date());
  var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
  var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
  if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
    wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
    if (requestDoubanNum < 35) {
      //Lower than 35/m,pass            
      return;
    }
    else {
      wx.showToast({
        title: '豆瓣api请求\t频率超35/m，小心',
        icon: 'loading',
        duration: 5000
      })
      //提示或者去别的地方
      // wx.redirectTo({
      //      url:"pages/welcome/welcome"
      // });
    }
  }
  else {
    wx.setStorageSync('requestDoubanTime', timestamp);
    wx.setStorageSync('requestDoubanNum', 1);
  }
}

module.exports = {
  convertToStartsArray: convertToStartsArray,
  convertToDirectorsArray: convertToDirectorsArray,
  convertToCastasArray:convertToCastasArray,
  convertToTypeArray: convertToTypeArray,
  http:http,
  douban_limit: douban_limit
}
