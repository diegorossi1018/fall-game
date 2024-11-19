var Player = function() {};

Player.eMode = 
{
    common : 0,
    delete : 1,
    bigSeedMode : 2,
}


Player.spineName = 
[
    "hamu_01",
    "hamu_02",
    "hamu_03",
    "hamu_04",
    "hamu_05",
    "hamu_06",
    "hamu_07",
    "hamu_08",
    "hamu_09",
    "hamu_10",
    "hamu_11",
    "seed"
]

Player.prototype = {
    
    create : function( pos, type, option )
    {
        this.m_Mode = Player.eMode.common;
        this.m_Pos = pos;
        this.type = type;
        this.nowPlayer = option.index;

        this.playerShape = new SnlObject();
        this.playerShape.CreateSprite(ImgInfo.eImg.hamu_00 + this.nowPlayer, this.m_Pos.x, this.m_Pos.y, 0.5, 0.5, GameDefine.eDispSort.UI);
        this.playerShape.SetVisible(false);

        this.playerObj = SpineMgr.CreateSpine(GameDefine.eSpine[Player.spineName[this.nowPlayer]], this.m_Pos.x, this.m_Pos.y, Player.spineName[this.nowPlayer] + "_a", true, GameDefine.eDispSort.UI);
        this.playerObj.m_SpineObj.pivot.set(this.playerObj.m_SpineObj.width / 2, this.playerObj.m_SpineObj.height / 2);

        if (this.nowPlayer !== 6) 
        {
            this.size = this.playerShape.GetRect().w / 2;
        } else {
            this.size = this.playerShape.GetRect().h / 2;
        }

        if (this.nowPlayer === 6) {
            this.m_Pos.x -= 4;
        } else if (this.nowPlayer === 7) {
            this.m_Pos.y += 2;
        }
        
        this.body = MatterMgr.addCircle(this.m_Pos.x, this.m_Pos.y, this.size, option);

        this.matterID = this.body.id;

        this.endPlayer = false; 
        
        this.deleteCheck = false;
        this.collisionDelete = false; 
        this.deleteType = "";

        this.overCheck = false; 
        this.overTimer = 0;

        this.seedNext = false; 

        this.bigSeed = 1;
        this.seedAnimation = false; 
        this.bonusScoreIn = false; 
        this.bonusScoreOut = false;
        this.changeCheck = false; 
    },

    changeMode : function( mode ) 
    {   
        this.m_Mode = mode;

        switch( this.m_Mode ) 
        {
            case Player.eMode.common:   break;
            case Player.eMode.delete:
                this.deleteCheck = true; 

                if (this.deleteType == "seed") {
                    if (this.nowPlayer != 11) {
                        this.playerObj.Play(Player.spineName[this.nowPlayer] + "_b", false);
                    } 
                } else {

                    this.matterDestroy();
                   
                    if (this.nowPlayer != 11) {
                        this.playerObj.Play(Player.spineName[this.nowPlayer] + "_c", false);
                        this.playerObj.m_TrackEntry.animationStart = 0.3;
                    }
                }
            break;
            case Player.eMode.bigSeedMode:
                this.playerObj.Play(Player.spineName[this.nowPlayer] + "_d", false);
            break;
        }
    },

    update : function()
    {
        switch(this.m_Mode) 
        {
            case Player.eMode.common:   break;
            case Player.eMode.delete:
                this.update_delete();
            break;
            case Player.eMode.bigSeedMode:
                this.update_seed();
            break;
        }

        if (this.body === null) return;

        this.playerObj.m_Object.position.set(this.body.position.x, this.body.position.y);
        this.playerShape.SetPos(this.body.position.x, this.body.position.y);

        this.playerObj.m_Object.rotation = this.body.angle;
        this.playerShape.m_Object.rotation = this.body.angle;
    },

    collisionCheck : function( obj )
    {
        var rect = this.playerShape.GetRect();
        var rectObj = {x: obj.GetRect().x, y: obj.GetPos().y, w: obj.GetRect().w, h: 5};

        if (SnlMath.HitBox(rect, rectObj)) {
            this.overCheck = true; 
            return true;
        }

        this.overCheck = false; 
        return false; 
    },

    update_seed : function()
    {
        if (this.body != null) {
            if (!this.bonusScoreIn && !this.bonusScoreOut && this.playerObj.isEnd()) {
                this.playerObj.Play(Player.spineName[this.nowPlayer] + "_a", false);
                this.bonusScoreIn = true; 
            }

            if (this.seedAnimation) {
                this.bonusScoreOut = false; 
                this.bonusScoreIn = false; 
                this.changeCheck = true; 
                this.seedAnimation = false; 
                
                this.changeMode(Player.eMode.common);
            }
        }
    },

    update_delete : function()
    {
        if (this.body != null && this.deleteType == "seed" && this.nowPlayer != 11) {
            if (this.playerObj.m_TrackEntry.animationLast > this.playerObj.m_TrackEntry.animationEnd - 0.6) {
                this.matterDestroy();
                this.seedNext = true; 
            }
        }

        if (this.playerObj.isEnd()) {
            this.collisionDelete = true;
        }
        
    },

    deleteState : function( type )
    {
        this.deleteType = type;
        this.changeMode(Player.eMode.delete);
    },

    getRect : function()
    {
        return this.playerShape.GetRect();
    },

    addPos : function( x, y )
    {
        this.playerObj.AddPos(x, y);   
    },

    setPos : function( x, y )
    {   
        MatterMgr.body.setPosition(this.body, {
            x: x,
            y: y
        });
        
        this.playerObj.m_Object.position.set(this.body.position.x, this.body.position.y);
        this.playerShape.SetPos(this.body.position.x, this.body.position.y );
    },

    setStatic : function() 
    {
        MatterMgr.body.set(this.body, {
            collisionFilter: {
              category: MatterMgr.playerCategory, 
              mask : MatterMgr.bgWallCategory,
              group: 0
            },
            isStatic: false 
          });
    },

    getStatic : function()
    {
        if (this.body != null) {
            return this.body.isStatic;
        } 
    },

    getSleeping : function()
    {
        return this.body.isSleeping;
    },

    getObject : function()
    {
        return this.playerObj;
    },

    getBody : function()
    {
        return this.body;
    },

    getPos : function()
    {
        return this.body.position;
    },

    getPlayerPos : function()
    {
        return {x: this.playerShape.GetPos().x, y: this.playerShape.GetPos().y - 30};
    },

    setZ : function( z )
    {
        this.playerObj.SetZ(z);
    },

    playerDestroy : function()
    {
        if (this.playerObj == null && this.playerShape == null) return;

        this.playerObj.Destroy();
        this.playerObj = null;
 
        this.playerShape.Destroy();
        this.playerShape = null;
    },

    matterDestroy : function()
    {
        if (this.body == null) return;

        MatterMgr.destroy(this.body);
        this.body = null;
    },

    destroy : function()
    {
        this.playerDestroy();
        this.matterDestroy();
    }

}
