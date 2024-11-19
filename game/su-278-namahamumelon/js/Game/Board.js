var Board = function() {};

Board.pos =
{
    standard : {x: 0, y: 0},
    center : {x: 320, y:400},
    wall : {x: 432 , y: 250},
    bgwall : {x: 32, y: 400},
    obstacle : {x: 300, y: 450},
    plusball : {x: 400, y: 179},

    player : {x: 320, y: 110},
    gameover : {x: 0, y: -250},
    bonusScore : {x: 180, y: 230}
}

Board.wallPos =
{
    bottom		: 0,
    up  		: 1,
    left		: 2,
    right		: 3,
    max			: 4,
};

Board.eMode = 
{
    common      : 0,
    result      : 1,
    press       : 2,
    max         : 3,
  
}

Board.seedPlayerNum = 11;

Board.prototype = {

    create : function() 
    {

        this.m_Mode	= Board.eMode.common;

        // 背景の壁
        var posX = Board.pos.bgwall.x;
        var posY = Board.pos.bgwall.y;
        var leftRightWallWidth = 5;
        
        this.upWallPosY = posY-400;
        this.downWallPosY = posY+400;
        
        this.bgWallArr = [];
        this.matterArr = [];

        this.topBackLine = new SnlObject();
        this.topBackLine.CreateSprite(ImgInfo.eImg.game_line_back, posX + 300, posY - 280, 0.5, 0.5, GameDefine.eDispSort.BG);

        for (var i = 0; i < Board.wallPos.max; i++) {
            this.bgWallArr[i] = new SnlObject();
        }

        // 画像が一個でleftだけ
        this.bgWallArr[Board.wallPos.bottom].CreateSprite(ImgInfo.eImg.game_frame_00, posX + 290, posY + 277, 0.5, 0.5, GameDefine.eDispSort.BG);
        this.bgWallArr[Board.wallPos.left].CreateSprite(ImgInfo.eImg.game_frame_01, posX + 290, posY - 50, 0.5, 0.5, GameDefine.eDispSort.BG); 
        this.bgWallArr[Board.wallPos.up].CreateSprite(ImgInfo.eImg.game_line, posX + 300, posY - 220, 0.5, 0.5, GameDefine.eDispSort.Top);


        this.matterArr[Board.wallPos.left] = MatterMgr.addWall(posX + 70, posY, leftRightWallWidth, 800, {index: 20, isStatic : true, label : "bgWall"
            ,collisionFilter : {
                category : MatterMgr.bgWallCategory,
                mask : MatterMgr.playerCategory
            }
        });
        this.matterArr[Board.wallPos.right] = MatterMgr.addWall(SnlPixiMgr.m_Width - 90, posY, leftRightWallWidth, 800,{index: 20, isStatic : true, label : "bgWall"
            ,collisionFilter : {
                category : MatterMgr.bgWallCategory,
                mask : MatterMgr.playerCategory
            }
        });     
        this.matterArr[Board.wallPos.up] = MatterMgr.addWall(posX + 300, posY - 220, this.bgWallArr[Board.wallPos.up].GetRect().w, 3, {
            index: 20,
            isStatic : true, 
            label : "topBG",
            isSensor : true
        });
        this.matterArr[Board.wallPos.bottom] = MatterMgr.addWall(posX + 290, posY + 277, this.bgWallArr[Board.wallPos.bottom].GetRect().w, 50, {
            index: 20,
            isStatic : true, 
            label : "bgWallBottom",
            collisionFilter : {
                category : MatterMgr.bgWallCategory,
                mask : MatterMgr.playerCategory
            }
        });

        this.wallLeftPos = posX + 58 + leftRightWallWidth/2;
        this.wallRightPos = SnlPixiMgr.m_Width - 78 - leftRightWallWidth/2;
        this.wallBottomPos = posY + 277;

        this.ufoPlayerMargin = 50;
        this.ufoSprite = new SnlObject();
        this.ufoSprite.CreateSprite(ImgInfo.eImg.game_ufo, Board.pos.player.x + this.ufoPlayerMargin, Board.pos.player.y - 35, 0.5, 0.5, GameDefine.eDispSort.UI);
        this.ufoSprite.SetScale(0.9, 0.9);

        this.ufoLine = new SnlObject();
        this.ufoLine.CreateSprite(ImgInfo.eImg.game_ufo_line, -55, 370, 0.5, 0.5, -1, this.ufoSprite);
        this.ufoLine.SetScale(1.1, 1.1);

        MatterMgr.nextNewPlayer = {};
        
        this.movePlayerArr = [];
        this.movePlayerArr.push(new Player());
        this.movePlayerArr[0].create(Board.pos.player, "default", {
            index : 0,
            isStatic : true,  
            label : "player",
            collisionFilter : {
                category : MatterMgr.topPlayerCategory,
                mask : MatterMgr.bgWallCategory
            }
        });

        this.endPlayerTimer = 0;
        this.endTimerCheck = false; 
        this.endPlayerNum = 10;

        this.comboCheckNum = 0; 
        this.oldComboNum = 0;

        this.nextPlayerNum = Math.floor(Math.random() * 4);
        this.nextPlayer2Num = null;

        this.nextSprite = new SnlObject();
        this.nextSprite.CreateSprite(ImgInfo.eImg.game_next_frame, Board.pos.player.x + 265, Board.pos.player.y - 50, 0.5, 0.5, GameDefine.eDispSort.UI);

        this.nextPlayer = new SnlObject();
        this.nextPlayer.CreateSprite(ImgInfo.eImg.game_next_hamu_00 + this.nextPlayerNum, Board.pos.player.x + 265, Board.pos.player.y - 50, 0.5, 0.5, GameDefine.eDispSort.UI);

        this.moveCheck = false; 
        this.resultCount = 0;

        this.ufoTouch = false; 

        this.comboScore = 0;
        this.nextPlayerTimer = 0;
        this.velocityPlus = false; 

        this.gameOverSpine = null;

        this.bonusSprite = new SnlObject();
        this.bonusSprite.CreateSprite(ImgInfo.eImg.game_score_bonus, Board.pos.bonusScore.x, Board.pos.bonusScore.y, 0.5, 0.5, GameDefine.eDispSort.Top);
        this.bonusSprite.SetVisible(false);

        this.bonusScore = new SnlNumDisp();
        this.bonusScore.Create(Board.pos.bonusScore.x, Board.pos.bonusScore.y + 40, 86, 2, ImgInfo.eImg.game_score_num_0, ImgInfo.c_ImgData[ImgInfo.eImg.game_score_num_0].w - 5, GameDefine.eDispSort.Top, null, SnlNumDisp.eArigen.Center );
        this.bonusScore.SetVisible(false);

        this.mark = new SnlObject();
        this.mark.CreateSprite(ImgInfo.eImg.game_score_bai, Board.pos.bonusScore.x + 10, Board.pos.bonusScore.y + 42, 0.5, 0.5, GameDefine.eDispSort.Top);
        this.mark.SetVisible(false);

        this.bonusScoreNum = new SnlNumDisp();
        this.bonusScoreNum.Create( Board.pos.bonusScore.x + 30, Board.pos.bonusScore.y + 40, 3, 2, ImgInfo.eImg.game_score_num_0, ImgInfo.c_ImgData[ImgInfo.eImg.game_score_num_0].w - 5, GameDefine.eDispSort.Top, null, SnlNumDisp.eArigen.Left );
        this.bonusScoreNum.SetVisible(false);
        this.scoreTimer = 0;
    },

    
    update : function()
    {   
        var oldMode = this.m_Mode;

        switch(this.m_Mode)
        {
            case Board.eMode.common:    this.update_common();   break;
            case Board.eMode.press:     this.update_press();    break;
            case Board.eMode.result:    this.update_result();   break;
        }  

        if ( oldMode === this.m_Mode ) {
            this.m_ModeTimer += SnlFPS.deltaTime;
        }

        if (this.m_Mode !== Board.eMode.result) {
            MatterMgr.update();
    
            for (var i = 0; i < this.movePlayerArr.length; i++) {
                this.movePlayerArr[i].update();
            }

            // ゲージ初期化
            if (MatterMgr.seedDownCheck) { 
                GameMainUI.gaugeScore = 0;
                MatterMgr.seedDownCheck = false; 
            } 

            // 同じ種類のプレイヤーなら
            for (var i = 0; i < this.movePlayerArr.length; i++) {
                for (var j = 0; j < MatterMgr.collisionID.length; j++) {

                    if (this.movePlayerArr[i].matterID == MatterMgr.collisionID[j]) {
                        if(!this.movePlayerArr[i].deleteCheck){

                            if (MatterMgr.seedCollisionID != null && this.movePlayerArr[i].matterID === MatterMgr.seedCollisionID) {
                                SnlSound.PlaySE( GameDefine.eSound.SeedEat );  

                                if(this.movePlayerArr[i].nowPlayer === 10) { // 10は種を食べるとボーナススコア
                                    
                                    this.movePlayerArr[i].changeMode(Player.eMode.bigSeedMode);

                                    this.bonusSprite.SetPos(this.movePlayerArr[i].getPos().x, this.movePlayerArr[i].getPos().y - 150);
                                    this.bonusScore.SetPos(this.movePlayerArr[i].getPos().x, this.movePlayerArr[i].getPos().y - 110);
                                    
                                    if (this.movePlayerArr[i].bigSeed > 1) {
                                        this.bonusScore.SetPos(this.movePlayerArr[i].getPos().x - 24, this.movePlayerArr[i].getPos().y - 110);
                                        this.mark.SetPos(this.movePlayerArr[i].getPos().x + 10, this.movePlayerArr[i].getPos().y - 108);
                                        this.bonusScoreNum.SetPos(this.movePlayerArr[i].getPos().x + 30, this.movePlayerArr[i].getPos().y - 110);
                                        this.bonusScoreNum.SetNum(this.movePlayerArr[i].bigSeed);
                                    }

                                    MatterMgr.collisionID.splice(j, 1);
                                    MatterMgr.seedCollisionID = null;
                                    return;

                                } else {
                                    this.movePlayerArr[i].deleteState("seed");
                                }

                            } else {
                                this.movePlayerArr[i].deleteState("default");
                            }
                            
                        }else{
                            
                            if (this.movePlayerArr[i].matterID === MatterMgr.seedCollisionID && this.movePlayerArr[i].seedNext ) {
                                if ("idx" in MatterMgr.nextNewPlayer) {
                                    MatterMgr.nextNewPlayer.pos = this.movePlayerArr[i].getPlayerPos();
                                }

                                MatterMgr.seedCollisionID = null;
                            }

                            if(this.movePlayerArr[i].collisionDelete) 
                            {
                                this.movePlayerArr[i].destroy();
                                this.movePlayerArr.splice(i, 1);
                                
                                MatterMgr.collisionID.splice(j, 1);
                            }
                        }
                        break;
                    }
                }
            }

            // ボーナス得点がフェードイン、アウト
            for (i = 0; i < this.movePlayerArr.length; i++) {
                if (this.movePlayerArr[i].bonusScoreIn) {

                    this.bonusVisible(true, this.movePlayerArr[i].bigSeed);

                    this.scoreTimer += SnlFPS.deltaTime;
                    if (this.scoreTimer > 1) {
                        this.movePlayerArr[i].bonusScoreIn = false; 
                        this.movePlayerArr[i].bonusScoreOut = true; 
                        this.scoreTimer = 0;
                    }
                } 

                if (this.movePlayerArr[i].bonusScoreOut) {
       
                    this.bonusVisible(false, this.movePlayerArr[i].bigSeed);
                    this.movePlayerArr[i].seedAnimation = true; 
                }

                if (this.movePlayerArr[i].changeCheck) {

                    var score = 86 * this.movePlayerArr[i].bigSeed;
                    GameMainUI.gameScore += score;
    
                    this.movePlayerArr[i].bigSeed++;
                    this.movePlayerArr[i].changeCheck = false; 
                }
                
            }
            

            // 次の形に
            if (MatterMgr.seedCollisionID === null && "idx" in MatterMgr.nextNewPlayer) {

                var next = MatterMgr.nextNewPlayer;
                
                if (!(next.seedSound && next.idx === 11)) {
                    var score = next.idx + next.idx;
                    GameMainUI.hamuScore[next.idx-1] += score;
                    GameMainUI.gameScore += score;
                }

                if (next.seedSound) {
                    if (next.idx !== 11) {
                        SnlSound.PlaySE( GameDefine.eSound.SeedBig );  
                    }
                } else {
                    SnlSound.PlaySE( GameDefine.eSound.Merge );  
                }

                if(next.idx === Board.seedPlayerNum) {
                    MatterMgr.nextNewPlayer = {};
                    return;
                }

                if (next.pos.x - ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].w / 2 < this.wallLeftPos) {
                    next.pos.x += ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].w / 2.5;
                } else if (next.pos.x + ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].w / 2 > this.wallRightPos) {
                    next.pos.x -= ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].w / 2.5;
                }

                if (next.pos.y + ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].h / 2 > this.wallBottomPos) {
                    next.pos.y -= ImgInfo.c_ImgData[ImgInfo.eImg.hamu_00 + next.idx].h / 2.5;
                }

                this.movePlayerArr.unshift(new Player());
                this.movePlayerArr[0].create(next.pos, "next", {
                    index : next.idx,
                    isStatic : false,
                    label : "playerEnd",
                    collisionFilter : {
                        category : MatterMgr.playerCategory,
                        mask : MatterMgr.bgWallCategory
                    }
                });

                if (next.combo !== null) {
                    MatterMgr.comboScoreID = this.movePlayerArr[0].matterID;
                    this.comboScore++;
                }

                MatterMgr.body.setVelocity(this.movePlayerArr[0].getBody(), { x: 0, y: -5}); 
                
                if (GameMainUI.gaugeScore < 5) {
                    // 一回落ちる際に一個以上進化するとコンボ （ゲージ）
                    if (this.oldComboNum != this.comboCheckNum) {
                        this.oldComboNum = this.comboCheckNum;
                    } else {
                        GameMainUI.gaugeScore++;
                    }
                }
                
                // console.log("next player shape");
                MatterMgr.nextNewPlayer = {};
            }

        }
    },

    bonusVisible : function( boolean, bigSeed )
    {
        this.bonusSprite.SetVisible(boolean);
        this.bonusScore.SetVisible(boolean);

        if (bigSeed > 1) {
            this.mark.SetVisible(boolean);
            this.bonusScoreNum.SetVisible(boolean);
        }
    },


    hitCheck : function()
    {
        if (this.movePlayerArr[this.movePlayerArr.length-1] == undefined) return;

        if (this.movePlayerArr[this.movePlayerArr.length-1].getStatic()) {
            
            this.ufoTouch = this.ufoSprite.HitCheck(SnlPixiMgr.m_MousePos); 

            if(this.ufoTouch || ((SnlPixiMgr.m_MousePos.y < this.bgWallArr[Board.wallPos.up].GetPos().y) && (SnlPixiMgr.m_MousePos.x >= this.wallLeftPos + this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2) && (SnlPixiMgr.m_MousePos.x <= this.wallRightPos - this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2)))
            {
                return true; 
            } else {
                return false;
            }

        } else {
            return false; 
        }
    },
    
    update_common : function()
    {
        // 次のプレイヤー
        if(MatterMgr.collisionCheck && MatterMgr.collisionInfo !== null) { 
            if (!this.velocityPlus) {
                this.velocityPlus = true; 
                if (this.movePlayerArr[this.movePlayerArr.length-1].getBody() != null) {
                    MatterMgr.body.setVelocity(this.movePlayerArr[this.movePlayerArr.length-1].getBody(), { x: 0, y: -4.8});
                }
            }

            if(MatterMgr.collisionInfo.position.y > Board.pos.player.y + MatterMgr.collisionInfo.circleRadius * 2 || this.nextPlayerTimer > 1) {

                this.ufoSprite.SetPosX(Board.pos.player.x + this.ufoPlayerMargin);
                this.ufoLine.SetVisible(true);


                this.movePlayerArr.push(new Player());
                this.movePlayerArr[this.movePlayerArr.length-1].create(Board.pos.player, "default", {
                    index : this.nextPlayerNum,
                    isStatic : true,
                    label : "player",
                    collisionFilter : {
                        category : MatterMgr.topPlayerCategory,
                        mask : MatterMgr.bgWallCategory
                    }
                });


                if (this.nextPlayer2Num == null) {
                    this.nextPlayerNum = Math.floor(Math.random() * 4);
                } else {
                    
                    this.nextPlayerNum = this.nextPlayer2Num;
                    this.nextPlayer2Num = null;
                }

                this.nextPlayer.ChangeTexture(ImgInfo.eImg.game_next_hamu_00 + this.nextPlayerNum);
                
                MatterMgr.collisionCheck = false;
                MatterMgr.collisionInfo = null;
                this.nextPlayerTimer = 0;
                this.velocityPlus = false; 

                this.createSunflowerSeed();

                return;
            }

            this.nextPlayerTimer += SnlFPS.deltaTime;
        }
        

        // playerタッチ
        if (SnlPixiMgr.m_MousePress && !this.moveCheck) {
            if (this.hitCheck()) {
                this.changeMode(Board.eMode.press);
            }
        }
        
        
        switch( SnlKeyboard.DownKey )
        {
            case SnlKeyboard.eKey.Space: case SnlKeyboard.eKey.Down:
                this.playerDown();
                SnlKeyboard.Update();  
            break;

            case SnlKeyboard.eKey.Left :
                this.update_pos("left");
            break;

            case SnlKeyboard.eKey.Right:
                this.update_pos("right");
            break;
        }


        // GameOver
        for (var i = 0; i < this.movePlayerArr.length; i++) {
            if (this.movePlayerArr[i].getBody() != null && this.movePlayerArr[i].m_Mode == Player.eMode.common) {
                if (this.movePlayerArr[i].getBody().label === "playerEnd" && !("idx" in MatterMgr.nextNewPlayer) && this.movePlayerArr[i].collisionCheck(this.topBackLine)) { 
                    
                    this.movePlayerArr[i].overTimer += SnlFPS.deltaTime;
                    if ( this.movePlayerArr[i].overTimer > 1.8) {
                        SnlSound.PlaySE( GameDefine.eSound.GameOver );  
                        this.changeMode(Board.eMode.result);
                        return;
                    }
                } else {
                    this.movePlayerArr[i].overTimer = 0;
                }
            }
        }

        this.createSunflowerSeed();
  
    },

    createSunflowerSeed : function()
    {
        // ヒマワリの種生成
        if (GameMainUI.filterCheck && this.movePlayerArr[this.movePlayerArr.length-1].getStatic()) {
            GameMainUI.filterCheck = false; 
            this.moveCheck = true; 
            this.nextPlayer.SetVisible(false);

            // ヒマワリの種が割り込んで次落とす予定だったアイテムはNEXTなる
            this.nextPlayer2Num = this.nextPlayerNum;
            this.nextPlayerNum = this.movePlayerArr[this.movePlayerArr.length-1].nowPlayer;
            this.nextPlayer.ChangeTexture(ImgInfo.eImg.game_next_hamu_00 + this.movePlayerArr[this.movePlayerArr.length-1].nowPlayer)
            this.nextPlayer.SetVisible(true);

            this.movePlayerArr[this.movePlayerArr.length-1].destroy();
            this.movePlayerArr[this.movePlayerArr.length-1].create(Board.pos.player, "default", {
                index : Board.seedPlayerNum,
                isStatic : true,
                label : "player",
                collisionFilter : {
                    category : MatterMgr.topPlayerCategory,
                    mask : MatterMgr.bgWallCategory
                }
            });

            this.moveCheck = false; 

        }
    },

    
    playerDown : function()
    {
        if (this.movePlayerArr[this.movePlayerArr.length-1].getBody() === null) return;

        if (this.movePlayerArr[this.movePlayerArr.length-1].getStatic()) {
            // 落としたハムスターが連続で大きくなったときコンボ（スコア）
            if (this.comboScore > 1) {
                GameMainUI.gameComboScore += 3 * this.comboScore;
            }
    
            this.comboScore = 0;
            MatterMgr.comboScoreID = this.movePlayerArr[this.movePlayerArr.length-1].matterID;
    
            SnlSound.PlaySE( GameDefine.eSound.Down );  
    
            this.movePlayerArr[this.movePlayerArr.length-1].setStatic();
            this.ufoLine.SetVisible(false);
            
            this.comboCheckNum++;
    
            if(this.m_Mode !== Board.eMode.common) {
                this.changeMode(Board.eMode.common);
            }
        }

    },
    
    update_pos : function( direction )
    {
        if (this.movePlayerArr[this.movePlayerArr.length-1].getStatic()) {
            var plus = 0;
            if ( direction === "left") {
                if (this.movePlayerArr[this.movePlayerArr.length-1].getPos().x > this.wallLeftPos + this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2) {
                    plus = -320 * SnlFPS.deltaTime;
                }
            } else if ( direction === "right") {
                if (this.movePlayerArr[this.movePlayerArr.length-1].getPos().x < this.wallRightPos - this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2) {
                    plus = 320 * SnlFPS.deltaTime;
                }
            }
    
            this.movePlayerArr[this.movePlayerArr.length-1].setPos(this.movePlayerArr[this.movePlayerArr.length-1].getPos().x + plus, Board.pos.player.y);
            this.ufoSprite.SetPosX(this.movePlayerArr[this.movePlayerArr.length-1].getPos().x + this.ufoPlayerMargin);
        }
    },

    update_press : function()
    {
        if (this.movePlayerArr[this.movePlayerArr.length-1].getBody() === null) return;

        if (SnlPixiMgr.m_MousePress) {

            if ((SnlPixiMgr.m_MousePos.x < this.wallLeftPos + this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2) || (SnlPixiMgr.m_MousePos.x > this.wallRightPos - this.movePlayerArr[this.movePlayerArr.length-1].getRect().w/2)) {
                return;
            }

            this.movePlayerArr[this.movePlayerArr.length-1].setPos(SnlPixiMgr.m_MousePos.x, Board.pos.player.y);
            this.ufoSprite.SetPosX(SnlPixiMgr.m_MousePos.x + this.ufoPlayerMargin);

        } else {
            this.playerDown();
        }
    },

    update_result : function()
    {
        if (this.gameOverSpine.isEnd()) {
            this.resultCount++;
            if (this.resultCount === 2) {
                window.gameMain.ChangeMode( GameDefine.eMode.Result );
                return;
            }

            this.gameOverSpine.Play("start", false);
        }
    },


    changeMode : function( mode )
    {
        this.m_Mode = mode;
        this.m_ModeTimer = 0;
        
        switch(this.m_Mode)
        {
            case Board.eMode.common:    break;
            case Board.eMode.press:     break;
            case Board.eMode.result: 
                this.gameOverSpine = SpineMgr.CreateSpine(GameDefine.eSpine.gameOver, Board.pos.gameover.x, Board.pos.gameover.y, true, false, GameDefine.eDispSort.Top);
            break;
        } 
    },


    destroy : function()
    {
        for ( var i = 0; i < Board.wallPos.max; i++ ) {
            this.bgWallArr[i].Destroy();
            this.bgWallArr[i] = null;

            MatterMgr.destroy(this.matterArr[i]);
        }


        for ( var i = 0; i < this.movePlayerArr.length; i++ ) {
            this.movePlayerArr[i].destroy();
            this.movePlayerArr[i] = null;
        }

        this.nextSprite.Destroy();
        this.nextSprite = null;

        this.nextPlayer.Destroy();
        this.nextPlayer = null;

        this.ufoSprite.Destroy();
        this.ufoSprite = null;

        if (this.gameOverSpine != null) {
            this.gameOverSpine.Destroy();
            this.gameOverSpine = null;
        }
       
    }
}
