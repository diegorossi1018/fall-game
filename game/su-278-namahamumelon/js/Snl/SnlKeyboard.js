/**
 * @file 	SnlKeyboard.js
 * @brief 	キーボード入力取得クラス
 			二個目以降のキーは現在取得しない
 * @author	D.Hara
 */
	
var SnlKeyboard =  function(){};

// キーボード入力は有効か？
SnlKeyboard.isEnable = false;

// 最後に判定したキー
SnlKeyboard.LastKeyCode = -1;

// 押されたキー（シングル）
SnlKeyboard.DownKey = -1;

// キー情報（マルチ）
SnlKeyboard.KeyStates = null;

// 
SnlKeyboard.KeyMax = 128;

// キーコード定数
SnlKeyboard.eKey =
{
	Space : 	32,
	Left :		37,
	Up : 		38,
	Right:		39,
	Down : 		40,
};

// 初期化
SnlKeyboard.Init = function()
{
	SnlKeyboard.isEnable = true;
	document.onkeydown = SnlKeyboard.OnKeyDown;
	document.onkeyup = SnlKeyboard.OnKeyUp;
	
	SnlKeyboard.KeyStates = [];
	for( var i=0; i<SnlKeyboard.KeyMax; i++ )
	{
		SnlKeyboard.KeyStates[i] = false;
	}
};

// 入力クリア
SnlKeyboard.Clear = function()
{
	SnlKeyboard.LastKeyCode = -1;
	SnlKeyboard.DownKey = -1;
};

 // キー下げイベント
 SnlKeyboard.OnKeyDown = function ( e )
 {
 	if( !SnlKeyboard.isEnable )
 	{
 		
 		return;
 	}
 	
  	if( SnlKeyboard.KeyMax <= e.keyCode )
 	{
 		return;
 	}
 	
 	
 	//e.preventDefault();
 	
 	if( SnlKeyboard.LastKeyCode != e.keyCode )
 	{
 		SnlKeyboard.DownKey = e.keyCode;
 		SnlKeyboard.LastKeyCode = e.keyCode;
 	}
 	SnlKeyboard.KeyStates[e.keyCode] = true;

       
};

// キー上げイベント
SnlKeyboard.OnKeyUp = function ( e )
{
 	if( !SnlKeyboard.isEnable )
 	{
 		return;
 	}
 	
 	if( SnlKeyboard.KeyMax <= e.keyCode )
 	{
 		return;
 	}
 	
 	if( SnlKeyboard.LastKeyCode == e.keyCode )
 	{
 		SnlKeyboard.DownKey = -1;
 		SnlKeyboard.LastKeyCode = -1;
 	}
 	SnlKeyboard.KeyStates[e.keyCode] = false;
};
	
// 有効/無効設定
SnlKeyboard.SetEnbale = function( isEnable )
{
	SnlKeyboard.isEnable = isEnable;
	SnlKeyboard.LastKeyCode = -1;
	SnlKeyboard.DownKey = -1;
}

// 更新
SnlKeyboard.Update = function()
{
	SnlKeyboard.DownKey = -1;
};

// 前フレームから今のフレームまでの間で押されたキー
SnlKeyboard.GetLastKeyCode = function()
{
	return SnlKeyboard.DownKey;
};

SnlKeyboard.isPress = function( KeyCode )
{
	
	
	if( SnlKeyboard.KeyMax <= KeyCode || KeyCode < 0 )
 	{
 		return false;
 	}
 	
 	return SnlKeyboard.KeyStates[KeyCode];
};

SnlKeyboard.prototype = {};

