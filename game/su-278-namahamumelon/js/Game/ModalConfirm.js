var ModalConfirm = function()
{
    this.shaderSprite   = null;
    this.frameSprite    = null;
    this.textSprite     = null;

    this.buttons    = null;

    this.isVisible  = null;

    this.answer = null;
    this.type   = null;
    this.state   = null;
};

ModalConfirm.pos =
{
    buttons :
    {
        yes : { x : 210, y : 500 },
        no  : { x : 430, y : 500 },
        shaderSprite : { x : 320, y:400},
        frameSprite : { x : 320, y : 400 },
        textSprite  : { x : 320, y : 310 },
    },
};

ModalConfirm.state =
{
    common  : 0,
    destroy : 1
};

ModalConfirm.type =
{
	title	: 0,
	restart	: 1,

};

ModalConfirm.answer =
{
    yes : 0,
    no  : 1
};

ModalConfirm.isVisible = false;

ModalConfirm.prototype = {
    
    create : function( frame, text, type )
    {
        this.shaderSprite = new SnlObject();
        this.shaderSprite.CreateSprite( ImgInfo.eImg.pause_bg, ModalConfirm.pos.buttons.shaderSprite.x,ModalConfirm.pos.buttons.shaderSprite.y, 0.5, 0.5, GameDefine.eDispSort.Top );

        this.frameSprite = new SnlObject();
        this.frameSprite.CreateSprite( frame, ModalConfirm.pos.buttons.frameSprite.x, ModalConfirm.pos.buttons.frameSprite.y , 0.5, 0.5, GameDefine.eDispSort.Top );
        
        this.textSprite = new SnlObject();
        this.textSprite.CreateSprite( text, ModalConfirm.pos.buttons.textSprite.x, ModalConfirm.pos.buttons.textSprite.y , 0.5, 0.5, GameDefine.eDispSort.Top );

        this.buttons = [];
        this.buttons[ModalConfirm.answer.yes] = new SnlButton();
        this.buttons[ModalConfirm.answer.yes].CreateScaleBtn( ImgInfo.eImg.pause_btn_yes,  ModalConfirm.pos.buttons.yes.x, ModalConfirm.pos.buttons.yes.y, GameDefine.eDispSort.Top );
        this.buttons[ModalConfirm.answer.no] = new SnlButton();
        this.buttons[ModalConfirm.answer.no].CreateScaleBtn( ImgInfo.eImg.pause_btn_no, ModalConfirm.pos.buttons.no.x, ModalConfirm.pos.buttons.no.y , GameDefine.eDispSort.Top );

        ModalConfirm.isVisible = true;

        this.type = type;
        this.state = ModalConfirm.state.common;
    },

    update : function()
    {
        this.buttons.forEach( function( button, index ) { button.Update(); if( button.GetLastHit() ) {
            this.answer = index;
            this.state = ModalConfirm.state.destroy;
        }}, this );
    },

    change : function( frame, text, type )
    {
        if ( frame != null ) {
            this.frameSprite.ChangeTexture( frame );
        }

        if ( text != null ) {
            this.textSprite.ChangeTexture( text );
        }

        if ( type != null ) {
            this.type = type;
        }
    },

    setVisible : function( boolean )
    {
        ModalConfirm.isVisible = boolean;
        this.shaderSprite.SetVisible( boolean );
        this.frameSprite.SetVisible( boolean );
        this.textSprite.SetVisible( boolean );
        this.buttons.forEach( function( button ) { button.SetVisible( boolean ); } );
    },

    setState : function( state )
    {
        this.state = state;
    },

    destroy : function()
    {
        this.shaderSprite.Destroy();
        this.shaderSprite = null;
        
        this.frameSprite.Destroy();
        this.frameSprite = null;
        
        this.textSprite.Destroy();
        this.textSprite = null;

        this.buttons.forEach( function( button ) { button.Destroy(); } );
        this.buttons = null;
    }
};