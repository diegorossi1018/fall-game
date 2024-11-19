var ModeMain =  function(){};


ModeMain.prototype = {
	// 初期化
	Init : function() 
	{
		this.MainUI = new GameMainUI();
		this.MainUI.create();	
	},

	
	// 更新処理
	Update : function() 
	{
		this.MainUI.update();
	},
	
	// モード終了処理
	Exit : function() 
	{
		this.MainUI.destroy();
		this.MainUI = null;
	}

};

