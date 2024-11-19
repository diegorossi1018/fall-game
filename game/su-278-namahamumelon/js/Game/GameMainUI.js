var GameMainUI =  function()
{
	// 背景
	this.pauseModal = null;
	this.confirmModal = null;
	this.gameTime = null;
	this.m_Btn = null;
	this.timeScore = 0;
	this.Sec = 0;
	this.Min = 0;

	this.m_Time = null;
	this.m_Pos=0;
	this.gameTime = null;
	this.dateSprite = null;

	this.buttonCheck = false; 

};

GameMainUI.pos =
{
	whitebg : {x : 320, y : 400},
	bg		: {x : 320, y : 0},
	infoFrame : {x : 68, y : 720},
	gaugeBase : {x : 43, y : 375},
	gauge : {x : 43, y : 403},
	gaugeNum : {x: 43, y: 565},
	score : {x : 60, y: 25 },
	
	buttons :
	{
		stage	: {x : 180, y : 45},
		pause	: {x : 603, y : 751},
		how 	: {x : 420, y : 40},
		back	: {x : 480, y : 70},
	
		time : {x : 240 , y : 65},
		stageLevel : {x : 100, y : 25},
		
		playerModal : {x:608, y: 730}
	}
}

GameMainUI.state =
{
	common : 0,
	pause	: 1,
	confirm	: 2,
	player  : 3
}

GameMainUI.eBtn = 
{
	pause : 0,
	max : 1
}

GameMainUI.gaugeNumMax = 5;
GameMainUI.hamuScore = [];

GameMainUI.prototype = {

	create : function()
	{
		
		GameMainUI.gameScore = 0;
		GameMainUI.gameComboScore = 0;
		GameMainUI.hamuScore = [0,0,0,0,0,0,0,0,0,0,0];

		GameMainUI.gaugeScore = 0;
		GameMainUI.filterCheck = false; 

		MatterMgr.collisionCheck = false; 
		MatterMgr.collisionInfo = null; 

		this.whiteBG = new SnlObject();
		this.whiteBG.CreateSprite(ImgInfo.eImg.game_bg, GameMainUI.pos.whitebg.x, GameMainUI.pos.whitebg.y, 0.5, 0.5, GameDefine.eDispSort.BG);

		this.nextHamuLine = new SnlObject();
		this.nextHamuLine.CreateSprite(ImgInfo.eImg.game_hint, GameMainUI.pos.whitebg.x - 30, GameMainUI.pos.whitebg.y + 350, 0.5, 0.5, GameDefine.eDispSort.UI);

		this.newBoard = new Board();
		this.newBoard.create();

		this.pauseModal = new ModalPause();
		this.pauseModal.create();

		this.confirmModal = new ModalConfirm();
		this.confirmModal.create(ImgInfo.eImg.pause_frame, ImgInfo.eImg.pause_text_01, ModalConfirm.type.title);
		this.confirmModal.setVisible( false );

		
		this.buttons = [];
		for ( var i = 0; i < GameMainUI.eBtn.max; i++ ) {
			this.buttons[i] = new SnlButton();
		}

		this.buttons[GameMainUI.eBtn.pause].CreateScaleBtn( ImgInfo.eImg.game_btn_pause, GameMainUI.pos.buttons.pause.x, GameMainUI.pos.buttons.pause.y, GameDefine.eDispSort.UI );
		
		this.setState(GameMainUI.state.common);

		this.sunflowerCheck = false;
		this.gaugeFilterCheck = false; 

		this.scoreSprite = new SnlObject();
		this.scoreSprite.CreateSprite(ImgInfo.eImg.game_score, GameMainUI.pos.score.x, GameMainUI.pos.score.y, 0.5, 0.5, GameDefine.eDispSort.UI);

		this.score = new SnlNumDisp();
		this.score.Create(GameMainUI.pos.score.x + 70, GameMainUI.pos.score.y, GameMainUI.gameScore, 7, ImgInfo.eImg.game_score_num_0,  ImgInfo.c_ImgData[ImgInfo.eImg.game_score_num_0].w - 6, GameDefine.eDispSort.UI, null, SnlNumDisp.eArigen.Left);

		this.gaugeBase = new SnlObject();
		this.gaugeBase.CreateSprite(ImgInfo.eImg.game_gauge_00, GameMainUI.pos.gaugeBase.x, GameMainUI.pos.gaugeBase.y, 0.5, 0.5, GameDefine.eDispSort.UI);
		
		this.gauge = new SnlObject();
		this.gauge.CreateSprite(ImgInfo.eImg.game_gauge_01, GameMainUI.pos.gauge.x, GameMainUI.pos.gauge.y, 0.5, 0.5, GameDefine.eDispSort.UI);
		this.gauge.SetScale(1, GameMainUI.gaugeScore / GameMainUI.gaugeNumMax);

		this.sunflowerSeed = SpineMgr.CreateSpine(GameDefine.eSpine.seed, GameMainUI.pos.gauge.x, GameMainUI.pos.gauge.y - 170, "seed_a", true, GameDefine.eDispSort.UI);
		this.sunflowerSeed.m_SpineObj.pivot.set(this.sunflowerSeed.m_SpineObj.width / 2, this.sunflowerSeed.m_SpineObj.height / 2);


		this.gaugeMaxSprite = new SnlObject();
		this.gaugeMaxSprite.CreateSprite(ImgInfo.eImg.game_gauge_num_5, GameMainUI.pos.gaugeNum.x + 15, GameMainUI.pos.gaugeNum.y + 5, 0.5, 0.5, GameDefine.eDispSort.UI);
		this.gaugeMaxSprite.ChangeTextureColor(124, 96, 92);
		this.gaugeMaxSprite.SetScale(0.7, 0.7);

		this.gaugeSlash = new SnlObject();
		this.gaugeSlash.CreateSprite(ImgInfo.eImg.game_gauge_num_slash, GameMainUI.pos.gaugeNum.x, GameMainUI.pos.gaugeNum.y + 5, 0.5, 0.5, GameDefine.eDispSort.UI);

		this.gaugeNumSprite = new SnlNumDisp();
		this.gaugeNumSprite.Create(GameMainUI.pos.gaugeNum.x - 20, GameMainUI.pos.gaugeNum.y, GameMainUI.gaugeScore, 1, ImgInfo.eImg.game_gauge_num_0,  ImgInfo.c_ImgData[ImgInfo.eImg.game_gauge_num_0].w, GameDefine.eDispSort.UI, null, SnlNumDisp.eArigen.Left);
		this.gaugeNumSprite.ChangeTextureColor(140, 151, 203);

	},

	update : function()
	{
	
		switch ( GameMainUI.mainState ) 
		{
			case GameMainUI.state.common:
				
				this.updateGauge();
				this.updateButtons();
				this.newBoard.update();

				if (this.score.GetNum() != GameMainUI.gameScore) {
					this.score.SetNum(GameMainUI.gameScore);
				}

			break;
			case GameMainUI.state.pause:
				this.pauseModal.update();

				switch(this.pauseModal.state)
				{
					case ModalPause.state.title:
						this.confirmModal.change(ImgInfo.eImg.pause_frame, ImgInfo.eImg.pause_text_01, ModalConfirm.type.title);
						this.confirmModal.setState(ModalConfirm.state.common);
						this.confirmModal.setVisible(true);
						this.pauseModal.setVisible(false);

						this.setState(GameMainUI.state.confirm);
					break;

					case ModalPause.state.restart:
						this.confirmModal.change(ImgInfo.eImg.pause_frame, ImgInfo.eImg.pause_text_00, ModalConfirm.type.restart);
						this.confirmModal.setState(ModalConfirm.state.common);
						this.confirmModal.setVisible(true);
						this.pauseModal.setVisible(false);

						this.setState(GameMainUI.state.confirm);
					break;

					case ModalPause.state.destroy:
						this.pauseModal.setVisible(false);
						this.pauseModal.setState(ModalPause.state.common);

						this.setState(GameMainUI.state.common);
					break;
				}

			break;

			case GameMainUI.state.confirm:
				this.confirmModal.update();
				
				if (this.confirmModal.state == ModalConfirm.state.destroy) {
					if (this.confirmModal.answer == ModalConfirm.answer.yes) {
						switch(this.confirmModal.type) {
							case ModalConfirm.type.title:
								window.gameMain.ChangeMode(GameDefine.eMode.Title);
								if( SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU")
								{
									Ads_Api.Ads(Ads_Api.AdsType.BackTitle);
								}
							break;
							case ModalConfirm.type.restart:
								window.gameMain.ChangeMode(GameDefine.eMode.Main);
								if(SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU")
								{
									Ads_Api.Ads( Ads_Api.AdsType.Start );
								}
							break;
						}
					}

					this.confirmModal.setVisible( false );
					this.pauseModal.setState( ModalConfirm.state.common );
					this.pauseModal.setVisible( true );

					this.setState(GameMainUI.state.pause);
				}
			break;
		}

	},

	updateGauge : function()
	{
		if(this.gaugeNumSprite.GetNum() != GameMainUI.gaugeScore) {
			this.gaugeNum = GameMainUI.gaugeScore / GameMainUI.gaugeNumMax;
			this.plus = (GameMainUI.gaugeNumMax - GameMainUI.gaugeScore) * 7;
	
			this.gauge.SetScale(1, this.gaugeNum);
			this.gauge.SetPosY(GameMainUI.pos.gauge.y + (( 100 - this.gaugeNum * 100 )) + this.plus);
			this.gaugeNumSprite.SetNum(GameMainUI.gaugeScore);
		}
			
		if (GameMainUI.gaugeScore === 4) {
			
			if (!this.sunflowerCheck) {
				this.sunflowerCheck = true; 
				this.SFS_scale = new TWEEN.Tween(this.sunflowerSeed.m_Object.scale).to({x:0.9, y:0.9}, 0.7).easing(TWEEN.Easing.Back.In);
				this.SPS_scaleBig = new TWEEN.Tween(this.sunflowerSeed.m_Object.scale).to({x:1.05, y:1.05}, 0.7).easing(TWEEN.Easing.Back.In).onComplete(function(){
					this.sunflowerCheck = false; 
				}.bind(this));
				this.SFS_scale.chain(this.SPS_scaleBig).start();
			}

		} else if (GameMainUI.gaugeScore === 5) {
			if (!this.gaugeFilterCheck) {
				
				this.gaugeFilterCheck = true; 
				GameMainUI.filterCheck = true; 
				this.SFS_scale.stop(); 
				this.sunflowerCheck = false; 
				this.sunflowerSeed.SetScale(1, 1);
				this.sunflowerSeed.Play("seed_b" , true);
			}
		
		} else {
			if (this.sunflowerSeed.m_TrackEntry.animation.name !== "seed_a") {
				this.sunflowerSeed.Play("seed_a", true);
				this.gaugeFilterCheck = false; 
			}
		}
		
	},

	setState : function( state )
	{
		GameMainUI.mainState = state;
	},

	updateButtons : function()
	{
		for ( var i = 0; i < GameMainUI.eBtn.max; i++ ) {
			this.buttons[i].Update();

			if (this.buttons[i].GetLastHit()) {
				switch (i) {
					case GameMainUI.eBtn.pause:
						this.pauseModal.setVisible(true);
						this.pauseModal.setState(ModalPause.state.common);
						this.setState(GameMainUI.state.pause);
					break;
				}
			}
		}
	},

	destroy : function()
	{
		this.whiteBG.Destroy();
		this.whiteBG = null;

		this.pauseModal.destroy();
		this.pauseModal = null;
		
		this.confirmModal.destroy();
		this.confirmModal = null;

		this.newBoard.destroy();
		this.newBoard = null;

		this.nextHamuLine.Destroy();
		this.nextHamuLine = null;

		for (var i = 0; i < GameMainUI.eBtn.max; i++) {
			this.buttons[i].Destroy();
			this.buttons[i] = null;
		}

		this.gaugeBase.Destroy();
		this.gaugeBase = null;

		this.gauge.Destroy();
		this.gauge = null;

		this.sunflowerSeed.Destroy();
		this.sunflowerSeed = null;

		this.scoreSprite.Destroy();
		this.scoreSprite = null;

		this.score.Destroy();
		this.score = null;

		this.gaugeNumSprite.Destroy();
		this.gaugeNumSprite = null;

		this.gaugeMaxSprite.Destroy();
		this.gaugeMaxSprite = null;

		this.gaugeSlash.Destroy();
		this.gaugeSlash = null;
	}
};
