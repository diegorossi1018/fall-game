var ModalRule = function()
{
    this.bg = null;
    this.rule = null;
    this.m_btn = null;
}

ModalRule.pos =
{
    BG : {x : 320, y : 400},
    text : {x : 320, y : 180},
    spine : {x : 300, y : 380},
    buttons : 
    {
        close : { x : 560, y : 50},
    }
}

ModalRule.state =
{
    common  : 0,
    destroy : 1,
}
ModalRule.isVisible = false;

ModalRule.prototype = {
    
    create : function()
    {
        
        this.rule = new SnlObject();
        this.rule.CreateSprite(ImgInfo.eImg.how_bg, ModalRule.pos.BG.x, ModalRule.pos.BG.y, 0.5, 0.5, GameDefine.eDispSort.Top);

        this.m_btn = new SnlButton();
        this.m_btn.CreateScaleBtn(ImgInfo.eImg.how_btn_back,  ModalRule.pos.buttons.close.x, ModalRule.pos.buttons.close.y , GameDefine.eDispSort.Top);

        this.howSpine = null;
        this.howSpine = SpineMgr.CreateSpine(GameDefine.eSpine.how, ModalRule.pos.spine.x, ModalRule.pos.spine.y, true, true, GameDefine.eDispSort.Top);
        this.howSpine.SetScale(0.5, 0.5);

        this.textSprite = [];
        for (i = 0; i < 5; i++) {
            this.textSprite[i] = new SnlObject();
            this.textSprite[i].CreateSprite(ImgInfo.eImg.how_text_00 + i, ModalRule.pos.text.x, ModalRule.pos.text.y, 0.5, 0.5, GameDefine.eDispSort.Top);
        }

        this.textSprite[0].SetPos(ModalRule.pos.text.x + 225, ModalRule.pos.text.y + 485);
        this.textSprite[1].SetPos(ModalRule.pos.text.x - 175, ModalRule.pos.text.y + 540);
        this.textSprite[2].SetPos(ModalRule.pos.text.x - 150, ModalRule.pos.text.y + 265);
        this.textSprite[3].SetPos(ModalRule.pos.text.x - 175, ModalRule.pos.text.y + 415);
        
        ModalRule.isVisible = false;
        this.setVisible(ModalRule.isVisible);

    },
    
    update : function()
    {
        this.m_btn.Update();
        if (this.m_btn.GetLastHit()) {
            this.setVisible(false);
            this.state = ModalRule.state.destroy;
        }

    },

    setVisible : function(boolean)
    {
        ModalRule.isVisible = boolean;

        this.rule.SetVisible(boolean);
        this.m_btn.SetVisible(boolean);
        if(!boolean && this.howSpine != null) {
            this.howSpine.Destroy();
            this.howSpine = null;
        } else {
            this.howSpine = SpineMgr.CreateSpine(GameDefine.eSpine.how, ModalRule.pos.spine.x, ModalRule.pos.spine.y, true, true, GameDefine.eDispSort.Top);
            this.howSpine.SetScale(0.5, 0.5);
        }

        for (i = 0; i < 5; i++) {
            this.textSprite[i].SetVisible(boolean);
        }
        
        SnlHelper.setZ(this, GameDefine.eDispSort.Top);

    },
    setState : function( state )
    {
        this.state = state;
    },
    
    destroy : function()
    {

        this.rule.Destroy();
        this.rule = null;

        this.m_btn.Destroy();
        this.m_btn = null;

        if(this.howSpine != null) {
            this.howSpine.Destroy();
            this.howSpine = null;
        }

        for (i = 0; i < 5; i++) {
            this.textSprite[i].Destroy();
            this.textSprite[i] = null;
        }
    }

}