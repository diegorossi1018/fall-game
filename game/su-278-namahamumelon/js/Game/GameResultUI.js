var GameResultUI = function()
{
    this.result = null;
    this.m_resultBtn = null;
    this.resultScore = 0;
    this.resultNum = null;

    this.m_resultBack = null;
    this.m_SpriteBG = null;
    this.scoreSprite = null;

    this.spineTimer = 0;
};

GameResultUI.pos =
{

    BG : { x:320, y:400 },
    score : {x:320, y:270},
    bestScore : {x:240, y:415},
    textSpine : {x:10, y:-530},
    recordSpine : {x:480, y:180},

    buttons :
    {
        rePlay : {x:450, y:690},
        title : {x:180, y:690},
    }
}

GameResultUI.eBtn =
{
    Title : 0,
    RePlay : 1,
    Max : 2

}

GameResultUI.prototype = {

    create:function()
    {
        
        SnlSound.PlaySE( GameDefine.eSound.Result );
        
        GameMainUI.isTimeActive = false; 

        this.m_SpriteBG = new SnlObject();
		this.m_SpriteBG.CreateSprite( ImgInfo.eImg.result_bg, GameResultUI.pos.BG.x, GameResultUI.pos.BG.y, 0.5, 0.5, GameDefine.eDispSort.BG );

        this.frameSprite = new SnlObject();
		this.frameSprite.CreateSprite( ImgInfo.eImg.result_best, GameResultUI.pos.BG.x, GameResultUI.pos.BG.y + 65, 0.5, 0.5, GameDefine.eDispSort.BG );

        this.spine = SpineMgr.CreateSpine(GameDefine.eSpine.result, GameResultUI.pos.textSpine.x, GameResultUI.pos.textSpine.y, true, true, GameDefine.eDispSort.UI);

        // =======
        // 追加スコア
        GameMainUI.gameScore += Math.floor(GameMainUI.gameComboScore);

        for (var i = 0; i < GameMainUI.hamuScore.length; i++) {
            GameMainUI.gameScore += Math.floor(GameMainUI.hamuScore[i] * (1 + 0.1 * (i + 2)));
        }

        // =======

        
        this.scoreSprite = new SnlObject();
        this.scoreSprite.CreateSprite(ImgInfo.eImg.result_score, GameResultUI.pos.score.x, GameResultUI.pos.score.y - 60, 0.5, 0.5, GameDefine.eDispSort.BG);
      
        this.scoreNum = new SnlNumDisp();
        this.scoreNum.Create( GameResultUI.pos.score.x, GameResultUI.pos.score.y, GameMainUI.gameScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 5, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Center );

        this.recordSpine = null;

        
        if (SaveDataMgr.SaveData.HighScore < GameMainUI.gameScore) {
            SaveDataMgr.SaveData.ThirdScore = SaveDataMgr.SaveData.SecondScore;
            SaveDataMgr.SaveData.SecondScore = SaveDataMgr.SaveData.HighScore;
            SaveDataMgr.SaveData.HighScore = GameMainUI.gameScore;
            
            this.recordSpine = SpineMgr.CreateSpine(GameDefine.eSpine.record, GameResultUI.pos.recordSpine.x, GameResultUI.pos.recordSpine.y, true, true, GameDefine.eDispSort.UI);

        } else if (SaveDataMgr.SaveData.SecondScore < GameMainUI.gameScore && GameMainUI.gameScore < SaveDataMgr.SaveData.HighScore) {
            SaveDataMgr.SaveData.ThirdScore = SaveDataMgr.SaveData.SecondScore;
            SaveDataMgr.SaveData.SecondScore = GameMainUI.gameScore;
            
        } else if (SaveDataMgr.SaveData.ThirdScore < GameMainUI.gameScore && GameMainUI.gameScore < SaveDataMgr.SaveData.SecondScore) {
            SaveDataMgr.SaveData.ThirdScore = GameMainUI.gameScore;
        }

        SaveDataMgr.Save();

        if (SaveDataMgr.SaveData.HighScore === 0) {
            this.firstScore = new SnlObject();
            this.firstScore.CreateSprite(ImgInfo.eImg.result_num_none, GameResultUI.pos.bestScore.x + 70, GameResultUI.pos.bestScore.y, 0.5, 0.5, GameDefine.eDispSort.BG);
        } else {
            this.firstScore = new SnlNumDisp();
            this.firstScore.Create(GameResultUI.pos.bestScore.x, GameResultUI.pos.bestScore.y, SaveDataMgr.SaveData.HighScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 15, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
            this.firstScore.SetScale(0.7, 0.7);
        }

        if (SaveDataMgr.SaveData.SecondScore === 0) {
            this.secondScore = new SnlObject();
            this.secondScore.CreateSprite(ImgInfo.eImg.result_num_none, GameResultUI.pos.bestScore.x + 70, GameResultUI.pos.bestScore.y + 55, 0.5, 0.5, GameDefine.eDispSort.BG);
        } else {
            this.secondScore = new SnlNumDisp();
            this.secondScore.Create(GameResultUI.pos.bestScore.x, GameResultUI.pos.bestScore.y + 55, SaveDataMgr.SaveData.SecondScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 15, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
            this.secondScore.SetScale(0.7, 0.7);
        }

        if (SaveDataMgr.SaveData.ThirdScore === 0) {
            this.thirdScore = new SnlObject();
            this.thirdScore.CreateSprite(ImgInfo.eImg.result_num_none, GameResultUI.pos.bestScore.x + 70, GameResultUI.pos.bestScore.y + 110, 0.5, 0.5, GameDefine.eDispSort.BG);
        } else {
            this.thirdScore = new SnlNumDisp();
            this.thirdScore.Create(GameResultUI.pos.bestScore.x, GameResultUI.pos.bestScore.y + 110, SaveDataMgr.SaveData.ThirdScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 15, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
            this.thirdScore.SetScale(0.7, 0.7);
        }

        // 各種ボタン作成
        this.m_resultBtn = [];
        for ( var i = 0; i < GameResultUI.eBtn.Max; i++ ) {
            this.m_resultBtn[i] = new SnlButton();
        }

        // ゲームスタートボタン作成（押されると画像を切替えるボタン）
        this.m_resultBtn[GameResultUI.eBtn.Title].CreateScaleBtn( ImgInfo.eImg.result_btn_title, GameResultUI.pos.buttons.title.x, GameResultUI.pos.buttons.title.y, GameDefine.eDispSort.Top );
        this.m_resultBtn[GameResultUI.eBtn.RePlay].CreateScaleBtn( ImgInfo.eImg.result_btn_retry,  GameResultUI.pos.buttons.rePlay.x, GameResultUI.pos.buttons.rePlay.y, GameDefine.eDispSort.Top );

        this.isResults = null;
    },


    update : function()
    {
        
        if( this.isResults == null )
        {
            this.isResults = false;
        }

        if( !this.isResults )
        {
            if( SnlFader.m_isFadeEnd )
            {
                this.isResults = true;
                SU_Api.results( GameMainUI.gameScore );
            }
            
            return;
        }

        for (var i = 0; i < GameResultUI.eBtn.Max; i++) {
            this.m_resultBtn[i].Update();

            if (this.m_resultBtn[i].GetLastHit()) {
				switch(i) 
                {
                    case GameResultUI.eBtn.Title:
                        window.gameMain.ChangeMode(GameDefine.eMode.Title);
                        if( SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU")
                        {
                            Ads_Api.Ads(Ads_Api.AdsType.BackTitle);
                        }
                    break;
                    case GameResultUI.eBtn.RePlay:
                        window.gameMain.ChangeMode(GameDefine.eMode.Main);
                        if(SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU")
                        {
                            Ads_Api.Ads( Ads_Api.AdsType.Start );
                        }
                       
                    break;
				}
			}
        }
        
    },

    destroy : function()
    {

        for (var i = 0; i < this.m_resultBtn.length; i++) {
            this.m_resultBtn[i].Destroy();
            this.m_resultBtn[i] = null;
        }

        this.m_SpriteBG.Destroy();
        this.m_SpriteBG = null;

        this.scoreSprite.Destroy();
        this.scoreSprite = null;
       
        this.frameSprite.Destroy();
        this.frameSprite = null;

        this.scoreNum.Destroy();
        this.scoreNum = null;

        this.spine.Destroy();
        this.spine = null;

        if (this.recordSpine != null) {
            this.recordSpine.Destroy();
            this.recordSpine = null;
        }

        this.firstScore.Destroy();
        this.firstScore = null;

        this.secondScore.Destroy();
        this.secondScore = null;

        this.thirdScore.Destroy();
        this.thirdScore = null;
    }

}

