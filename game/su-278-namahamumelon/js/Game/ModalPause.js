var ModalPause = function()
{
    this.shaderSprite = null;
    this.pauseBG = null;
};

ModalPause.pos =
{
    buttons :
    {
        BG		: { x : 320, y : 400 },
        restart : { x : 320, y : 280 },
        title   : { x : 320, y : 400 },
        backGame: { x : 320, y : 520 },
    }
}

ModalPause.eBtn = 
{
    Restart     : 0,
    Title       : 1,
    BackGame    : 2,
    Max         : 3
}

ModalPause.state = 
{
    common : 0,
    restart : 1,
    title : 2,
    destroy : 3,
}

ModalPause.isVisible = false;

ModalPause.prototype = {
    
    create : function()
    {
        
        this.shaderSprite = new SnlObject();
        this.shaderSprite.CreateSprite( ImgInfo.eImg.pause_bg, ModalPause.pos.buttons.BG.x, ModalPause.pos.buttons.BG.y, 0.5, 0.5, GameDefine.eDispSort.Top );

        this.pauseBG = new SnlObject();
        this.pauseBG.CreateSprite(ImgInfo.eImg.pause_frame, ModalPause.pos.buttons.BG.x, ModalPause.pos.buttons.BG.y,0.5,0.5, GameDefine.eDispSort.Top );

        // 各種ボタン作成
		this.buttons = [];
		for ( var i=0; i<ModalPause.eBtn.Max; i++ ) {
			this.buttons[i] = new SnlButton();     
		}

		// ゲームスタートボタン作成（押されると画像を切替えるボタン）
		this.buttons[ModalPause.eBtn.Restart].CreateScaleBtn( ImgInfo.eImg.pause_btn_retry,  ModalPause.pos.buttons.restart.x, ModalPause.pos.buttons.restart.y, GameDefine.eDispSort.Top );
		this.buttons[ModalPause.eBtn.Title].CreateScaleBtn( ImgInfo.eImg.pause_btn_title, ModalPause.pos.buttons.title.x, ModalPause.pos.buttons.title.y, GameDefine.eDispSort.Top );
        this.buttons[ModalPause.eBtn.BackGame].CreateScaleBtn( ImgInfo.eImg.pause_btn_back, ModalPause.pos.buttons.backGame.x, ModalPause.pos.buttons.backGame.y, GameDefine.eDispSort.Top );
      
        ModalPause.isVisible = false;

        this.setVisible(ModalPause.isVisible);
        this.state = ModalPause.state.common;


    },

    update : function()
    {
        for (var i = 0; i<ModalPause.eBtn.Max; i++) {
			this.buttons[i].Update();

			if (this.buttons[i].GetLastHit()) {
				switch(i)
				{
					case ModalPause.eBtn.Restart:
                        this.state = ModalPause.state.restart;
                    break;
                    case ModalPause.eBtn.Title:
                        this.state = ModalPause.state.title;
                    break;
                    case ModalPause.eBtn.BackGame:
                        this.state = ModalPause.state.destroy;
                    break;
                   
				}
			}
        }
    },
    
    destroy : function()
    {
        this.shaderSprite.Destroy();
        this.shaderSprite = null;

        this.pauseBG.Destroy();
        this.pauseBG = null;

        for (var i=0; i<this.buttons.length; i++) {
            this.buttons[i].Destroy();
            this.buttons[i] = null;
        }
    },

    setVisible : function( boolean )
    {
        ModalPause.isVisible = boolean;
        this.pauseBG.SetVisible( boolean );
        this.shaderSprite.SetVisible( boolean );
        this.buttons.forEach( function( button ) { button.SetVisible( boolean ); } );
    },

    setState : function( state )
    {
        this.state = state;
    },

}