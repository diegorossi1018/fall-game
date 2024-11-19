/**
 * @file 	SnlScroll.js
 * @brief 	汎用スクロール入力クラス
 * @author	D.Hara
 */

var SnlScroll = function () {
    this.m_MouseBasePos = null;
    this.m_MousePos = null;
    this.m_Speed = null;
    this.m_ScrollPos = null;
    this.m_ScrollRect = null;
    this.m_InertialTimer = 0;
    this.m_isScroll = false;
    this.m_SpeedScale = 1;

    this.m_Mode = 0;

    this.m_ScrollInputArea = null;

    //２窓対応
    this.m_IsRightPane = false;
};

// 状態定義
SnlScroll.eMode = {
    Wait: 0,
    MoveStart: 1,
    Move: 2,
    WaitNextTouch: 3,
};

SnlScroll.prototype = {
    Create: function (RectL, RectR, RectT, RectB) {
        this.m_ScrollBasePos = { x: 0, y: 0 };
        this.m_MousePos = { x: 0, y: 0 };
        this.m_Speed = { x: 0, y: 0 };
        this.m_ScrollPos = { x: 0, y: 0 };
        this.m_ScrollRect = { l: RectL, r: RectR, t: RectT, b: RectB };
        SnlScrollMgr.Add(this);
    },

    Destroy: function () {
        SnlScrollMgr.Add(this);
        this.m_ScrollBasePos = null;
        this.m_MousePos = null;
        this.m_Speed = null;
        this.m_ScrollPos = null;
        this.m_ScrollRect = null;
    },

    SetScrollInputArea: function (RectL, RectR, RectT, RectB) {
        this.m_ScrollInputArea = { l: RectL, r: RectR, t: RectT, b: RectB };
    },

    InputAreaCheck: function () {
        if (this.m_ScrollInputArea != null) {
            if (SnlPixiMgr.m_MousePos.x < this.m_ScrollInputArea.l || this.m_ScrollInputArea.r < SnlPixiMgr.m_MousePos.x || SnlPixiMgr.m_MousePos.y < this.m_ScrollInputArea.t || this.m_ScrollInputArea.b < SnlPixiMgr.m_MousePos.y) {
                return false;
            }
        }

        return true;
    },

    Update: function () {
        if (this.m_Mode == SnlScroll.eMode.WaitNextTouch) {
            if (SnlPixiMgr.m_TouchMode && SnlPixiMgr.m_MultiTouch) {
                if (SnlPixiMgr.m_TouchStep.length <= 0) {
                    this.m_Mode = SnlScroll.eMode.Wait;
                } else {
                    for (var i = 0; i < SnlPixiMgr.m_TouchStep.length; i++) {
                        if (SnlPixiMgr.m_TouchStep[i] != SnlPixiMgr.eTouchStep.None) {
                            return;
                        }
                    }
                    this.m_Mode = SnlScroll.eMode.Wait;
                }
            } else {
                if (!SnlPixiMgr.m_MousePress && !SnlPixiMgr.m_MouseDown) {
                    this.m_Mode = SnlScroll.eMode.Wait;
                }
            }
            return;
        }

        if (this.m_Mode == SnlScroll.eMode.Wait) {
            if (this.m_IsRightPane === true) {
                //２窓対応
                if (SnlPixiMgr.m_MousePos.x < SnlPixiMgr.m_Width * 0.5) {
                    return;
                }
            } else {
                /*if( ChatController != null )
				{
					if (ChatController.isActive()===true)
					{
						if(SnlPixiMgr.m_MousePos.x > (SnlPixiMgr.m_Width*0.5))
						{
							return;
						}
					}
				}*/
            }

            if (!this.InputAreaCheck()) {
                return;
            }

            this.m_isScroll = false;
            if (SnlPixiMgr.m_MouseDown) {
                this.m_Speed.x = 0;
                this.m_Speed.y = 0;

                this.m_MousePos.x = SnlPixiMgr.m_MousePos.x;
                this.m_MousePos.y = SnlPixiMgr.m_MousePos.y;

                this.m_ScrollBasePos.x = this.m_ScrollPos.x;
                this.m_ScrollBasePos.y = this.m_ScrollPos.y;

                this.m_Mode = SnlScroll.eMode.MoveStart;
            } else {
                if (0 < this.m_InertialTimer) {
                    this.Move();
                    this.m_InertialTimer -= SnlFPS.deltaTime * 3;
                }
            }
            return;
        }

        this.m_Speed.x = (SnlPixiMgr.m_MousePos.x - this.m_MousePos.x) * this.m_SpeedScale;
        this.m_Speed.y = (SnlPixiMgr.m_MousePos.y - this.m_MousePos.y) * this.m_SpeedScale;

        this.m_InertialTimer = 1;
        this.Move();

        if (SnlPixiMgr.m_MouseUp) {
            this.m_Mode = SnlScroll.eMode.Wait;
            return;
        }

        this.m_MousePos.x = SnlPixiMgr.m_MousePos.x;
        this.m_MousePos.y = SnlPixiMgr.m_MousePos.y;

        if (this.m_Mode == SnlScroll.eMode.MoveStart) {
            if (30 < Math.abs(SnlMath.Distance(this.m_ScrollPos, this.m_ScrollBasePos))) {
                this.m_Mode = SnlScroll.eMode.Move;
                this.m_isScroll = true;
            }
        }
    },

    isScroll: function () {
        return this.m_isScroll;
    },

    ScrollCancel: function (waitNextTouch) {
        if (waitNextTouch == null) {
            waitNextTouch = false;
        }

        if (waitNextTouch) {
            this.m_Mode = SnlScroll.eMode.WaitNextTouch;
        } else {
            this.m_Mode = SnlScroll.eMode.Wait;
        }

        if (this.m_Speed != null) {
            this.m_Speed.x = 0;
            this.m_Speed.y = 0;
        }
    },

    Move: function () {
        this.m_ScrollPos.x += this.m_Speed.x * this.m_InertialTimer;
        this.m_ScrollPos.y += this.m_Speed.y * this.m_InertialTimer;

        this.AreaCheck();
    },

    AreaCheck: function () {
        if (this.m_ScrollPos.x < this.m_ScrollRect.l) {
            this.m_ScrollPos.x = this.m_ScrollRect.l;
        }

        if (this.m_ScrollPos.y < this.m_ScrollRect.t) {
            this.m_ScrollPos.y = this.m_ScrollRect.t;
        }

        if (this.m_ScrollRect.b < this.m_ScrollPos.y) {
            this.m_ScrollPos.y = this.m_ScrollRect.b;
        }

        if (this.m_ScrollRect.r < this.m_ScrollPos.x) {
            this.m_ScrollPos.x = this.m_ScrollRect.r;
        }
    },

    GetScrollPos: function () {
        return this.m_ScrollPos;
    },

    SetScrollPos: function (PosX, PosY) {
        this.m_ScrollPos.x = PosX;
        this.m_ScrollPos.y = PosY;
    },

    SetScrollPosX: function (PosX) {
        this.m_ScrollPos.x = PosX;
    },

    SetScrollPosY: function (PosY) {
        this.m_ScrollPos.y = PosY;
    },

    SetScrollRect: function (RectL, RectR, RectT, RectB) {
        this.m_ScrollRect.l = RectL;
        this.m_ScrollRect.r = RectR;
        this.m_ScrollRect.t = RectT;
        this.m_ScrollRect.b = RectB;
    },

    SetSpeedScale: function (Scale) {
        this.m_SpeedScale = Scale;
    },
};

// スクロール管理

var SnlScrollMgr = function () {};

SnlScrollMgr.m_Scroll = [];

SnlScrollMgr.Add = function (Scroll) {
    SnlScrollMgr.m_Scroll.push(Scroll);
};

SnlScrollMgr.Delete = function (Scroll) {
    for (var i = 0; i < SnlScrollMgr.m_Scroll.length; i++) {
        if (SnlScrollMgr.m_Scroll[i] == Scroll) {
            SnlScrollMgr.m_Scroll.splice(i, 1);
            return;
        }
    }
};

SnlScrollMgr.ScrollCancel = function (waitNextTouch) {
    if (waitNextTouch == null) {
        waitNextTouch = false;
    }

    for (var i = 0; i < SnlScrollMgr.m_Scroll.length; i++) {
        SnlScrollMgr.m_Scroll[i].ScrollCancel(waitNextTouch);
    }
};

SnlScrollMgr.prototype = {};
