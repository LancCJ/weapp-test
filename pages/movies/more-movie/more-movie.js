// pages/movies/more-movie/more-movie.js

var app = getApp();

var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{},
    requestUrl:'',
    start:0,
    count:12,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var in_theatersUrl = app.globalData.in_theatersUrl;
    var coming_soonUrl = app.globalData.coming_soonUrl;
    var top250Url = app.globalData.top250Url;

    var categoryTitle = options.categoryTitle;
    wx.setNavigationBarTitle({
      title: categoryTitle,
    })
    //console.log(options);
    var categoryId = options.categoryId;
    //console.log('传过来的categoryId:' + categoryId);

    //util.douban_limit();
    
    switch (categoryId){
      case 'inTheaters':
        this.data.requestUrl = app.globalData.doubanHost + in_theatersUrl;
        util.http(app.globalData.doubanHost + in_theatersUrl+'?start=0&count=12', '', this.processData);
        //this.getMovieListDate(app.globalData.doubanHost + in_theatersUrl, categoryId, categoryTitle);
        break;
      case 'comingSoon':
        this.data.requestUrl = app.globalData.doubanHost + coming_soonUrl;
        util.http(app.globalData.doubanHost + coming_soonUrl + '?start=0&count=12', '', this.processData);
        //this.getMovieListDate(app.globalData.doubanHost + coming_soonUrl, categoryId, categoryTitle);
        break;
      case 'top250':
        this.data.requestUrl = app.globalData.doubanHost + top250Url;
        util.http(app.globalData.doubanHost + top250Url + '?start=0&count=12', '', this.processData);
        //this.getMovieListDate(app.globalData.doubanHost + top250Url, categoryId, categoryTitle);
        break;
    }
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
  
  },
  processData: function (moviesData) {
    // console.log(moviesData.subjects)
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      //console.log(subject);
      var title = subject.title;

      if (title.length >= 6) {
        title = title.substring(0, 6);
      }
      //console.log(title);
      var temp = {
        stars: util.convertToStartsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        coverId: subject.id
      }
      movies.push(temp);
    }

    //console.log(movies);
    var totalMovie={};
    if(!this.data.isEmpty){
      totalMovie = this.data.movies.concat(movies);
    }else{
      totalMovie = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovie
    });

    this.data.start += 12;

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    // var readyData = {}
    // readyData[categoryId] = {
    //   categoryTitle: categoryTitle,
    //   categoryId: categoryId,
    //   movies: movies
    // };
  },
  onScrolltolower:function(event){
    //console.log('load more');
    wx.showNavigationBarLoading();
    var nextUrl = this.data.requestUrl + '?start=' + this.data.start+'&count=12';
    util.http(nextUrl, '', this.processData);
    
  },
  onPullDownRefresh: function (event) {
    //console.log('load more');
    wx.showNavigationBarLoading();
    this.data.movies = {};
    this.data.isEmpty = true;
    var refreshUrl = this.data.requestUrl + '?start=0&count=12';
    util.http(refreshUrl, '', this.processData);
  },
  onMovieDetail: function (event) {
    wx.navigateTo({
      url: '/pages/movies/detail/detail?movieId=' + event.currentTarget.dataset.movieId,
    })
  }
})