// pages/movies/detail/detail.js

var app = getApp();

var api = require('../../../config.js');

var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectUrl:'',
    subject:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.movieId;
    //console.log('传入的电影id='+movieId);
    var subjectUrl = app.globalData.doubanHost + app.globalData.subjectUrl + movieId;
    util.http(subjectUrl,'',this.subjectCallback);
    this.data.subjectUrl = subjectUrl;
  },
  subjectCallback: function (subject){
    console.log(subject);

    //处理一下数据

    var tempSubject = {
      coverImage: subject.images.large,
      title: subject.title,
      countries: subject.countries,
      year: subject.year,
      wish_count: subject.wish_count,
      comments_count: subject.comments_count,
      stars: util.convertToStartsArray(subject.rating.stars),
      directors: util.convertToDirectorsArray(subject.directors),
      castsname: util.convertToCastasArray(subject.casts),
      type: util.convertToTypeArray(subject.genres),
      average: subject.rating.average,
      summary: subject.summary,
      casts: subject.casts
    }


    this.setData({
      subject: tempSubject
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})