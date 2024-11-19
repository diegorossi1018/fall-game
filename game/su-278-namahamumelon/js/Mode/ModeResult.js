var ModeResult = function(){};

ModeResult.prototype = {
    Init : function()
    {
        this.gameResult = new GameResultUI();
        this.gameResult.create();
    },

    Update : function()
    {
        this.gameResult.update();
    },

    Exit : function()
    {
        this.gameResult.destroy();
        this.gameResult = null;
    }
}