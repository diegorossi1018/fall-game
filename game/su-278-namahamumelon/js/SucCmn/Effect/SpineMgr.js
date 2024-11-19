var SpineMgr = function(){}

SpineMgr.isAllLoad = false;
SpineMgr.m_LoadStep = 0;
SpineMgr.m_LoadIdx = -1;
SpineMgr.m_SpineAsset = [];

// エフェクトリスト
SpineMgr.m_List = [];

// エフェクト管理ID
SpineMgr.m_EffectIDHead = 0;

// リソース読み込みの進捗を取得(1=100%)
SpineMgr.GetLoadProgress = function()
{
	return SpineMgr.m_LoadStep / GameDefine.eSpine.Max;
};

// GameDefineに登録されてSpineを全部読み込む
SpineMgr.LoadAllAsset = function()
{
	SpineMgr.m_LoadStep = 0;
	SpineMgr.isAllLoad = true;
	SpineMgr.LoadAsset(0);
}

// Spineの単発読み込み
SpineMgr.LoadAsset = function(Idx)
{
	if( 0 <= SpineMgr.m_LoadIdx )
	{
		return false;
	}
	SpineMgr.m_LoadIdx = Idx;

	var sharedLoader = PIXI.Loader.shared; 
	sharedLoader.add('spine_' + Idx, SnlPixiMgr.m_BasePath + GameDefine.SpineFileTbl[Idx]);
	sharedLoader.load(function (loader, resources) 
	{
		SpineMgr.m_SpineAsset[SpineMgr.m_LoadIdx] = resources["spine_"+Idx];
		SpineMgr.m_LoadIdx = -1;
		
		if( SpineMgr.isAllLoad )
		{
			SpineMgr.m_LoadStep++;
			if( GameDefine.eSpine.Max <= SpineMgr.m_LoadStep )
			{
				SpineMgr.isAllLoad = false;
				return;
			}
			SpineMgr.LoadAsset(SpineMgr.m_LoadStep);			
		}
		
		// const animation = new Spine(.spineData);
	});
	
	return true;
}

// Spineの削除
SpineMgr.Delete = function( Obj )
{
	for( var i=0; i<this.m_List.length; i++ )
	{
		if( this.m_List[i].m_SpineObjID == Obj.m_SpineObjID )
		{
			this.m_List[i] = null;
			this.m_List.splice( i, 1 );
			return;
		}
	}
};

// Spineの作成してSpineObjを返す
// EffectType 	: エフェクトタイプ（GameDefine.eSpine）
// PosX, PosY 	: エフェクトの位置
// Anim			: アニメーション名（省略するとキーの0番を再生）
// isLoop		: ループ再生するか
// EffectZ		: エフェクトの描画順( GameDefine.eDispSort -1で親オブジェクト依存)
// Parent		: エフェクトの親オブジェクト
SpineMgr.CreateSpine = function( EffectType, PosX, PosY, Anim, isLoop, EffectZ, Parent )
{
	var Obj = new SpineObj();
	Obj.Create( SpineMgr.m_EffectIDHead, EffectType, PosX, PosY, Anim, isLoop, EffectZ, Parent );
	SpineMgr.m_List.push( Obj );
	
	// エフェクトID指定
	SpineMgr.m_EffectIDHead++;

	return Obj;
}

// アニメーション更新
SpineMgr.Update = function()
{
	for( var i=0; i<this.m_List.length; i++ )
	{
		if( this.m_List[i] == null )
		{
			continue;
		}
		this.m_List[i].Update(SnlFPS.deltaTime);
	}	
}