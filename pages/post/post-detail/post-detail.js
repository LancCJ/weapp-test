// pages/post/post-detail/post-detail.js

var postData = require("../../../data/posts-data.js")

const backgroundAudioManager = wx.getBackgroundAudioManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    //console.log(postId);
    var postDate = postData.postList[postId];
    //console.log(postDate);
    this.setData({
      detail_key: postDate
    });

    var postsCollected = wx.getStorageSync('_postsCollected');
    if (postsCollected){
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({
          collected: postCollected
        });
      }
      
    }else{  
      var postsCollected ={};
      postsCollected[postId] = false;
      wx.setStorageSync('_postsCollected', postsCollected);
    }
    
    //为保证主控音频和页面的播放状态同步 所以需要监听
    var that = this;
    backgroundAudioManager.onPlay(function(){
      that.setData({
        isPlaying:true
      });
    });

    backgroundAudioManager.onPause(function(){
      that.setData({
        isPlaying: false
      });
    });

    backgroundAudioManager.onEnded(function () {
      that.setData({
        isPlaying: false
      });
    });

    backgroundAudioManager.onStop(function () {
      that.setData({
        isPlaying: false
      });
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
    backgroundAudioManager.stop();
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

  onCollectionTap:function(event){
    //console.log(wx.getStorageSync('test'));


    var postsCollected = wx.getStorageSync('_postsCollected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    wx.setStorageSync('_postsCollected', postsCollected);
    this.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected ? '收藏成功' : title = '取消收藏',
      icon: 'success',
      duration: 1000
    })
  },

  onShareTap: function (event) {
    //wx.removeStorageSync('test');

    //wx.clearStorageSync();清除所有缓存  缓存上线是10MB


    var itemList = [
      "分享到微信朋友圈",
      "分享到微信好友",
      "分享到QQ"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success:function(res){
        //res.cancel
        //res.tapIndex 从0开始
        
      }
    })
  },


  onPlayTap:function(event){
    this.setData({
      isPlaying: !this.data.isPlaying
    });

    if (this.data.isPlaying){
      //播放
      backgroundAudioManager.title = this.data.detail_key.music.title;
      backgroundAudioManager.epname = this.data.detail_key.music.title;
      backgroundAudioManager.coverImgUrl = this.data.detail_key.music.coverImg;
      backgroundAudioManager.src = this.data.detail_key.music.url;

      backgroundAudioManager.play();
    }else{
      //暂停
      backgroundAudioManager.pause();
    }
  }
})
