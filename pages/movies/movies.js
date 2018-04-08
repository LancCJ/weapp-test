// movie.js

var app = getApp();

var api = require('../../config.js');

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{},

    containerShow:true,
    searchPanelShow:false,
    searchMovies:{
      movies:{}
    },

    requestUrl: '',
    start: 0,
    count: 12,
    searchValue:'',
    isEmpty: true

  },

  /**
   * 生命周期函数--监听页面加载
   * 豆瓣的API禁止小程序访问，所以用了别人的代理地址转发过去
   */
  onLoad: function (options) {
    var in_theatersUrl = app.globalData.in_theatersUrl+'?start=0&count=3';
    var coming_soonUrl = app.globalData.coming_soonUrl+'?start=0&count=3';
    var top250Url = app.globalData.top250Url+'?start=0&count=3';
    
    

    this.getMovieListDate(app.globalData.doubanHost + in_theatersUrl, 'inTheaters', '正在上映');
    this.getMovieListDate(app.globalData.doubanHost + coming_soonUrl, 'comingSoon', '即将上映');
    this.getMovieListDate(app.globalData.doubanHost + top250Url, 'top250', '豆瓣Top250');

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
  getMovieListDate: function (url, categoryId,categoryTitle ){

    //util.douban_limit();

    var that = this;
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        that.processData(res.data, categoryId, categoryTitle);
      }
    })
  },
  processData: function (moviesData, categoryId, categoryTitle){
    // console.log(moviesData.subjects)
    var movies = [];
    for (var idx in moviesData.subjects){
      var subject = moviesData.subjects[idx];
      //console.log(subject);
      var title = subject.title;
      
      if(title.length>=6){
        title = title.substring(0,6);
      }
      //console.log(title);
      var temp ={
        stars: util.convertToStartsArray(subject.rating.stars),
        title:title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        coverId: subject.id
      }
      movies.push(temp);
    }
    var readyData={}
    readyData[categoryId] = {
      categoryTitle:categoryTitle,
      categoryId: categoryId,
      movies : movies
    };
    this.setData(readyData);
  },
  onMoreTap: function (event){
    //console.log(event);
    var categoryId = event.currentTarget.dataset.categoryId;
    var categoryTitle = event.currentTarget.dataset.categoryTitle;
   
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?categoryId=' + categoryId + '&categoryTitle=' + categoryTitle
    })
  },
  onBindfocus: function (event) {
    //console.log('onBindfocus');
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });


    //键入搜索内容 然后请求数据 绑定数据

  },
  onClearSearch: function (event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,

      searchMovies: {
        movies: {}
      },

      start: 0,
      count: 12,
      searchValue: '',
      isEmpty: true

    });
    //清空输入的内容 todo
  },
  onConfirm:function(event){

    wx.showNavigationBarLoading();

    // util.douban_limit();

    var searchValue = event.detail.value;
    //console.log(searchValue);
    //发送请求
    var searchUrl = app.globalData.doubanHost+app.globalData.searchUrl + searchValue;
    
    util.http(searchUrl + '?start=' + this.data.start + '&count=12','',this.searchCallback);

    this.data.requestUrl = searchUrl;
    this.data.searchValue = searchValue;
  },
  searchCallback: function (moviesData){
    //console.log(moviesData);
    // this.setDate({
    if (moviesData.count>0){

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
// console.log(movies);
      var totalMovie = {};
      if (!this.data.isEmpty) {
        totalMovie = this.data.searchMovies.movies.concat(movies);
      } else {
        totalMovie = movies;
        this.data.isEmpty = false;
      }
      this.setData({
        searchMovies: {
          movies: totalMovie
        }
      });

      this.data.start += 12;

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

      
    }else{
      wx.showToast({
        title:'没有搜索到相关数据',
        icon:'none'
      });
    }
    // });
  },
  onScrolltolower: function (event) {
    //console.log('load more');
    wx.showNavigationBarLoading();
    var nextUrl = this.data.requestUrl + '?start=' + this.data.start + '&count=12';
    util.http(nextUrl, '', this.searchCallback);
  },
  onMovieDetail:function(event){
    //console.log(event);
    wx.navigateTo({
      url: '/pages/movies/detail/detail?movieId='+event.currentTarget.dataset.movieId,
    })
  }
})