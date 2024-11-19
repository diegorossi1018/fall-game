var Ads_Api = function()
{
    
}

Ads_Api.AdsType = 
{
    Loading : {Type : "preroll", Name : "Loading"},
    Start : {Type : "start", Name : "Start-Game"},
    Restart : {Type : "next", Name : "Restart-Game"},
    SelectLevel : {Type : "next",Name : "Select-Level"},
    NextLevel : {Type : "next",Name : "Next-Level"},
    Result : {Type : "next",Name : "Result"},
    BackTitle : {Type : "next",Name : "Back-Title"},
    GameOver : {Type : "next",Name : "Game-Over"},
    UserAction : {Type : "next",Name : "UserAction"},
    Reward : {Type : "reward",Name : "Reward"},
    Other : {Type : "next",Name : "Other"} //一応作ってはいるけど、表す範囲が広すぎるのでなるべく使わない
}

Ads_Api.RewardType = 
{
    AddCoin     : {Type : "reward", Name : "AddCoin"},
    AddItem     : {Type : "reward", Name : "AddItem"},
    UseFunction : {Type : "reward", Name : "UseFunction"},
    ShowHint    : {Type : "reward", Name : "ShowHint"},
    Continue    : {Type : "reward", Name : "Continue"},
}

Ads_Api.IsDebug = true;

Ads_Api.m_InitCheck = false;
Ads_Api.m_IsView = false;
Ads_Api.m_IsBGM = false;

Ads_Api.IsIE = false;
Ads_Api.iOS_Version = 0; 

//ステージングかどうか(ios11以下対応用)
Ads_Api.IsStg = false;

Ads_Api.UniqueVersion = 1100;

Ads_Api.Game

//Ads_Api.isUse

Ads_Api.Init = function(_sound)
{
    //多重生成阻止
    if( Ads_Api.m_InitCheck ){
        return;
    }

    GetVersion_iOS = function()
    {
	    var UserAgent = navigator.userAgent.toLowerCase();
	    var iOSVer = 0;

        //iosじゃない場合
        if(!navigator.userAgent.match(/ipad|ipod|iphone/i))
        {
            return 9999;
        }
        
	    if ( 0 < UserAgent.indexOf("cpu os 1") )
	    {
	    	UserAgent.match(/cpu os (\w+){1,4}/g);
	    	iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
	    }
	    else
	    {
	    	UserAgent.match(/cpu os (\w+){1,3}/g);
	    	iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
	    }
    
	    if( 0 < iOSVer )
	    {
	    	return iOSVer;
	    }
    
	    if ( 0 < UserAgent.indexOf("iphone os 1") )
	    {
	    	UserAgent.match(/iphone os (\w+){1,4}/g);
	    	iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
	    }
	    else
	    {
	    	UserAgent.match(/iphone os (\w+){1,3}/g);
	    	iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
	    }
	
	    return iOSVer;
    }

    var ua = navigator.userAgent;
    Ads_Api.IsIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
    Ads_Api.iOS_Version = GetVersion_iOS();

    if(Ads_Api.iOS_Version < Ads_Api.UniqueVersion )
    {
        const host = location.hostname;
        //ステージングサーバー化どうか判別
        Ads_Api.IsStg = host === "yahoo-stg.success-corp.jp" || host === "sugotoku.bdsuccesstest.red";
    }
    
    if(typeof(_sound) === "undefined")
    {
        _sound = false;
    }


    adConfig(
    {
        preloadAdBreaks : 'on',
        
    });

   
    Ads_Api.m_InitCheck = true;
};

Ads_Api.BeforeFunc = function(){
    $(top.document).find("#im_panel").css('display', 'none');

    if (typeof SnlSound !== 'undefined') {
        Ads_Api.m_IsBGM = SnlSound.m_isEnableBGM;
        if(typeof(SnlSound.SetEnableBGM) === 'function')SnlSound.SetEnableBGM(false);
    }

    if(Ads_Api.iOS_Version < Ads_Api.UniqueVersion)
    {
        //ステージングの場合は挙動が変わるので別の対応をします
        if( Ads_Api.IsStg )
        {
            var view = document.getElementById("pixiview");
            if(view != null)view.style.visibility = "hidden";
        }
        else
        {
            var view = document.getElementsByTagName("body");
            if(view != null)view[0].hidden = true;
        }
    }
    

    if(SU_Api.m_ServiceProvider == "YGP")
    {
        var menu = window.parent.document.getElementById("yahooMenu");
        //メニューが前面に出てるので消す
        
        if(menu != null)menu.style.display = "none";
        //iosの古い端末では広告表示中ゲームのキャンバスを消す
       
        if(typeof SnlPixiMgr !== 'undefined' && !SnlPixiMgr.m_isPC)
        {
            var footer = window.parent.document.getElementById("footerMobileAd");
            if(footer != null)footer.style.display = "none";
        }
    }
    
    Ads_Api.m_IsView = true;
};

Ads_Api.AfterFunc = function()
{
    $(top.document).find("#im_panel").css('display', 'block');

    if (typeof SnlSound !== 'undefined' && typeof(SnlSound.SetEnableBGM) === 'function') {
        SnlSound.SetEnableBGM(Ads_Api.m_IsBGM);
        Ads_Api.m_IsBGM = false;
    }

    if(Ads_Api.iOS_Version < Ads_Api.UniqueVersion)
    {
        if( Ads_Api.IsStg )
        {
            var view = document.getElementById("pixiview");
            if(view != null)view.style.visibility = "visible";
        }
        else
        {
            var view = document.getElementsByTagName("body");
            if(view != null)view[0].hidden = false;
        }
    }


    if(SU_Api.m_ServiceProvider == "YGP")
    {
        var menu = window.parent.document.getElementById("yahooMenu");
        if(menu != null)menu.style.display = "";

        
        if(typeof SnlPixiMgr !== 'undefined' && !SnlPixiMgr.m_isPC)
        {
            var footer = window.parent.document.getElementById("footerMobileAd");
            if(footer != null)footer.style.display = "block";
        }  
    }
    Ads_Api.m_IsView = false;
}

Ads_Api.AdBreakDone = function()
{
    if(!Ads_Api.IsDebug)return;

}
//広告呼び出し
//※出す広告やタイミングはGoogle側が決めるので何も出ない場合があります
Ads_Api.CallAds = function(_type,_name,_beforeFunc,_afterFunc,_adBreakDone)
{
	//if(window.game_id != 'su-212-circle')
	//{
	//	Ads_Api.Callback_afterFunc = _afterFunc;
	//	if(typeof(_beforeFunc) === "function"){ _beforeFunc(); }
	//	Ads_Api.BeforeFunc();
	//	SU_Api.adsCallback = function()
	//	{
	//		if(typeof(Ads_Api.Callback_afterFunc) === "function"){ Ads_Api.Callback_afterFunc(); }
	//		Ads_Api.AfterFunc();
	//		SU_Api.isPlayingAd = false;
	//		Ads_Api.Callback_afterFunc = null;
	//	}
	//	SU_Api.ads();
	//	return;
	//}
	
    //name...広告に名前をつけて管理する用(現状は何も実装されていないです)
    //ゲームごとに名前が変わってくると
    //広告毎のレポートなどが見れたりする予定みたいです
    
    _type= _type || "next";
    _name= _name || "dummy";
    adBreak({
        type : _type,  // ad shows at start of next level
        name : _name,
        beforeAd : function(){
            if(typeof(_beforeFunc) === "function")_beforeFunc();
            Ads_Api.BeforeFunc();
        },  // You may also want to mute the game's sound.
        afterAd : function(){
            if(typeof(_afterFunc) === "function")_afterFunc();
            Ads_Api.AfterFunc();     
        },    // resume the game flow.

        //広告が表示されていない場合でも必ず呼ばれる関数
        adBreakDone : function(placementInfo)
        {
            if(typeof(_adBreakDone) === "function")_adBreakDone();
            if(Ads_Api.IsDebug)console.log(placementInfo);  
        },
        });
};


//リワード広告呼び出し
//_viewedFunc =　広告を最後まで見た際のコールバック(報酬を渡して上げる等の)
//_dismissedFunc = 広告がキャンセルされた場合のコールバック
//_beforeRewardFunc = 広告が用意された際のコールバック(基本的に必ず呼ばれる)
Ads_Api.AdsReward = function(adsType,_viewedFunc,_dismissedFunc,_beforeRewardFunc,_beforeFunc,_afterFunc)
{

    //IEの場合は前の広告を呼び出す
    //
    if(Ads_Api.IsIE)
    {
        switch(SU_Api.m_ServiceProvider)
        {
            case "YGP" : 
                var container = window.parent.document.getElementById("adContainer");
                container.style.display = "";


                if(typeof(_beforeFunc) === "function")_beforeFunc();
                if(typeof(_beforeRewardFunc) === "function")_beforeRewardFunc();
                Ads_Api.BeforeFunc();
                if( typeof SUCCESS.gameController !== 'undefined')
                {
                    SUCCESS.gameController.requestAds(function(_afterFunc,_viewedFunc)
                    {
                    
                        if(typeof(_afterFunc) === "function")_afterFunc();
                        if(typeof(_viewedFunc) === "function")_viewedFunc();
                        Ads_Api.AfterFunc();
                        var container = window.parent.document.getElementById("adContainer");
                        container.style.display = "none";
    
                    }.bind(this,_afterFunc,_viewedFunc));    
                }
            break;

            case "SU" : 
                if(typeof(_beforeFunc) === "function")_beforeFunc();
                if(typeof(_beforeRewardFunc) === "function")_beforeRewardFunc();

                SU_Api.ads()
                if(typeof(_beforeFunc) === "function")_afterFunc();
                if(typeof(_viewedFunc) === "function")_viewedFunc();
                break;
            
        }
        return;   
    }     
    
    var _type,_name
    if(typeof(adsType) === "string")
    {
        _type = "reward";
        _name = adsType;
    }
    else if(typeof(adsType) === "object")
    {
        _type = adsType.Type;
        _name = adsType.Name;
    }
    
    adBreak({
        type : _type,  // ad shows at start of next level
        name : _name,
        beforeAd : function(){
            if(typeof(_beforeFunc) === "function")_beforeFunc();
            Ads_Api.BeforeFunc();  
        },  // You may also want to mute the game's sound.
        afterAd : function(){
            if(typeof(_afterFunc) === "function")_afterFunc();
            Ads_Api.AfterFunc();
        },    // resume the game flow.
        beforeReward : function(showAdFn)
        {
            if(typeof(_beforeRewardFunc) === "function")_beforeRewardFunc();
            //リワード広告表示
            showAdFn(); 
        },
        adDismissed : function()
        {
            if(typeof(_dismissedFunc) === "function")_dismissedFunc();
        },
        adViewed : function()
        {
            if(typeof(_viewedFunc) === "function")_viewedFunc();
        },

		adBreakDone : function(placementInfo)
        {
            if(placementInfo.breakStatus == "notReady" || 
			placementInfo.breakStatus == "timeout" || 
			placementInfo.breakStatus == "error" || 
			placementInfo.breakStatus == "noAdPreloaded" || 
			placementInfo.breakStatus == "ignored" || 
			placementInfo.breakStatus == "frequencyCapped" || 
			placementInfo.breakStatus == "other")
			{
				if(typeof(_viewedFunc) === "function")_viewedFunc();
			}
            if(Ads_Api.IsDebug)console.log(placementInfo);  
        },

        });
};

Ads_Api.Ads = function(adsType,_beforeFunc,_afterFunc)
{   
    if(Ads_Api.IsIE)return;
    try{
        if(adsType.Name == "Reward")
        {
            //var test = function(){console.log("Reward Test");};
            // if(typeof SU_Api !== 'undefined')
            // {
            //             if(typeof(_beforeFunc) === "function")_beforeFunc();
            //             Ads_Api.BeforeFunc();
            
            //             SU_Api.adsCallback = function(){
            //             if(typeof(_afterFunc) === "function")_afterFunc();
            //                 Ads_Api.AfterFunc();
            //                 SU_Api.isPlayingAd = false;
            //             };
            //     SU_Api.ads();
            // }
            Ads_Api.AdsReward(adsType);
        }
        else
        {
            Ads_Api.CallAds(adsType.Type,adsType.Name,_beforeFunc,_afterFunc);
        }
    }
    catch(e)
    {
        Ads_Api.CallAds();
        console.error("AdsTypeが存在しません\n" + e);
    }
    
}
//広告の設定を行う
//設定が変更された際に呼ぶ
Ads_Api.AdConfig = function(_sound)
{
    if(Ads_Api.IsIE)return;
    //音声の設定を入力
    //sound : 'on' , 'off'

    //booleanはstringに変換
    if(typeof(_sound) === "boolean")
    {
        if(_sound)
        {
            _sound = "on";
        }
        else
        {
            _sound = "off";
        }
    }

    //numberにも対応
    if(typeof(_sound) === "number")
    {
        if(_sound >= 1)
        {
            _sound = "on";
        }
        else
        {
            _sound = "off";
        }
    }

    adConfig({sound : _sound});
},


//SU_Apiと似たような形にした方が分かりやすいかなと思い関数化してます
//Ads_Api.m_IsViewを取得してもよいです
Ads_Api.isView = function()
{
    return Ads_Api.m_IsView;
};

//ファイル読み込み時にSU_Api生成
new Ads_Api();
Ads_Api.Init(false);