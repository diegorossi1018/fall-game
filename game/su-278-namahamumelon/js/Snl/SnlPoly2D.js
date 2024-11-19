/**
 * @file 	SnlPoly2D.js
 * @brief 	2Dポリゴンクラス（判定用） ただし現在のデータ設定関数は四角形しかない
 * @author	D.Hara
 */
var SnlPoly2D = function()
{
	// 中心位置
	this.m_CenterPos = null
	
	// 頂点データ（時計回り）
	this.m_Vertex = null;
	
	// 辺の法線ベクトル( 0:Vertext0-1 1:Vertext1-2…）
	this.m_NormalVector = null;
}

SnlPoly2D.HitCheck = function( PolyA, PolyB )
{
	for( var i=0; i<PolyA.m_Vertex.length; i++ )
	{
		for( var j=0; j<PolyB.m_Vertex.length; j++ )
		{
			var PolyAP1 = PolyA.m_Vertex[i];
			var PolyAP2 = PolyA.m_Vertex[0];
			if( i < PolyA.m_Vertex.length-1 )
			{
				PolyAP2 = PolyA.m_Vertex[i+1];
			}
			
			var PolyBP1 = PolyB.m_Vertex[j];
			var PolyBP2 = PolyB.m_Vertex[0];
			if( j < PolyB.m_Vertex.length -1 )
			{
				PolyBP2 = PolyB.m_Vertex[j+1];
			}
			
			if( SnlMath.LineCrossCheck( PolyAP1, PolyAP2, PolyBP1, PolyBP2 ) )
			{
				return true;
			}
		}
	}
	
	return false;
}

SnlPoly2D.HitCheckPoint = function( Poly, Point )
{
	var c = 0;
	var PointB = { x:99999, y:Point.y };
	
	for( var i=0; i<Poly.m_Vertex.length; i++ )
	{
		var PolyP1 = Poly.m_Vertex[i];
		var PolyP2 = Poly.m_Vertex[0];
		if( i < Poly.m_Vertex.length - 1 )
		{
			PolyP2 = Poly.m_Vertex[i+1];
		}
	
		if( SnlMath.LineCrossCheck( PolyP1, PolyP2, Point, PointB ) )
		{
			c++;
		}
	}
	
	return ( c % 2 ) == 1;
}

SnlPoly2D.DistancePoint = function( Poly, Point )
{
	var Dist = SnlMath.DistancePointToLine( Point, Poly.m_Vertex[0], Poly.m_Vertex[1] );
	Dist = SnlMath.Small( Dist, SnlMath.DistancePointToLine( Point, Poly.m_Vertex[1], Poly.m_Vertex[2] ) );
	Dist = SnlMath.Small( Dist, SnlMath.DistancePointToLine( Point, Poly.m_Vertex[2], Poly.m_Vertex[3] ) );
	Dist = SnlMath.Small( Dist, SnlMath.DistancePointToLine( Point, Poly.m_Vertex[3], Poly.m_Vertex[0] ) );
	
	return Dist;
}

SnlPoly2D.GetNearestLineIdx = function( Poly, Point )
{
	var Line = 0;
	var Dist = SnlMath.DistancePointToLine( Point, Poly.m_Vertex[0], Poly.m_Vertex[1] );
	
	for( var i=1; i<Poly.m_Vertex.length; i++ )
	{
		var j = i+1;
		if( Poly.m_Vertex.length <= j )
		{
			j = 0;
		}
		
		var d = SnlMath.DistancePointToLine( Point, Poly.m_Vertex[i], Poly.m_Vertex[j] );
		if( d < Dist )
		{
			Dist = d;
			Line = i;
		}
	}
	
	return Line;
}

SnlPoly2D.Distance = function( PolyA, PolyB )
{
	var Dist = SnlPoly2D.DistancePoint( PolyA, PolyB.m_Vertex[0] );
	Dist = SnlMath.Small( Dist, SnlPoly2D.DistancePoint( PolyA, PolyB.m_Vertex[1] ) );
	Dist = SnlMath.Small( Dist, SnlPoly2D.DistancePoint( PolyA, PolyB.m_Vertex[2] ) );
	Dist = SnlMath.Small( Dist, SnlPoly2D.DistancePoint( PolyA, PolyB.m_Vertex[3] ) );
	
	return Dist;
};

// PolyBの頂点でPolyA内に存在するものの頂点Index取得
SnlPoly2D.GetInsidePoint = function( PolyA, PolyB )
{
	var List = [];
	for( var i=0; i<PolyB.m_Vertex.length; i++ )
	{
		if( SnlPoly2D.HitCheckPoint( PolyA, PolyB.m_Vertex[i] ) )
		{
			List[List.length] = i;
		}
	}
	
	return List;
}

// 指定ラインと接触した辺のIndexを取得
SnlPoly2D.GetHitLineIndex = function( Poly, LinePointA, LinePointB )
{
	var List = [];
	for( var i=0; i<Poly.m_Vertex.length; i++ )
	{
		var PolyP1 = Poly.m_Vertex[i];
		var PolyP2 = Poly.m_Vertex[0];
		if( i < Poly.m_Vertex.length-1 )
		{
			PolyP2 = Poly.m_Vertex[i+1];
		}
			
		if( SnlMath.LineCrossCheck( PolyP1, PolyP2, LinePointA, LinePointB ) )
		{
			List[List.length] = i;
		}
	}
	
	return List;
}




SnlPoly2D.GetHitPoint = function( Poly, LineP1, LineP2 )
{
	var Ret = null;
	var Dist = 99999;
	for( var i=0; i<Poly.m_Vertex.length; i++ )
	{
		var PolyP1 = Poly.m_Vertex[i];
		var PolyP2 = Poly.m_Vertex[0];
		if( i < Poly.m_Vertex.length - 1 )
		{
			PolyP2 = Poly.m_Vertex[i+1];
		}
		
		var r = SnlMath.GetLineCrossPoint( PolyP1, PolyP2, LineP1, LineP2 );
		if( r != null )
		{
			var d = SnlMath.Distance( r, Poly.m_CenterPos );
			
			if( d < Dist )
			{
				Dist = d;
				Ret = r;
			}
		}

	}
	
	return Ret;
};

SnlPoly2D.prototype = {}

// 四角形のデータを設定
SnlPoly2D.prototype.SetRect = function( x, y, ancX, ancY, w, h, rotDeg )
{
	ancX = SnlMath.Clamp( ancX, 0, 1 );
	ancY = SnlMath.Clamp( ancY, 0, 1 );
	w = Math.abs( w );
	h = Math.abs( h );
	
	this.m_Pos = { x:x, y:y };
	this.m_Anchor = { x:ancX, y:ancY };
	this.m_Size = { x:w, y:h };
	this.m_RotDeg = rotDeg;
	
	this.CalcVertexRect( x, y, ancX, ancY, w, h, rotDeg );
};

// SnlObjectから四角形を作成
SnlPoly2D.prototype.SetRectFromSnlObject = function( Obj )
{
	this.SetRect
	(
		Obj.GetPos().x,
	 	Obj.GetPos().y, 
		Obj.GetObject().anchor.x, 
		Obj.GetObject().anchor.y,
		Obj.m_BaseSize.x * Obj.GetScale().x,
		Obj.m_BaseSize.y * Obj.GetScale().y,
		Obj.GetRot() 
	);
};

// 頂点位置の計算
SnlPoly2D.prototype.CalcVertexRect = function( x, y, ancX, ancY, w, h, rotDeg )
{
	// 四角形の頂点を初期化
	if( this.m_Vertex == null )
	{
		this.m_Vertex = [];
		this.m_NormalVector = [];
	}
	
	var lx = x - w * ancX;
	var ty = y - h * ancY;
	
	
	this.m_Vertex[0] = { x: lx, 	y: ty };		// 左上
	this.m_Vertex[1] = { x: lx + w, y: ty };		// 右上
	this.m_Vertex[2] = { x: lx + w, y: ty + h };	// 右下
	this.m_Vertex[3] = { x: lx, 	y: ty + h };	// 左下
	
	this.m_NormalVector[0] = { x: 0, y:-1 }; 	// 0-1
	this.m_NormalVector[1] = { x: 1, y: 0 };  	// 1-2
	this.m_NormalVector[2] = { x: 0, y: 1 }; 	// 2-3
	this.m_NormalVector[3] = { x:-1, y: 0 };  	// 3-0
	
	// 中心点の算出
	this.m_CenterPos = { x:0, y:0 };
	for( var i=0; i<4; i++ )
	{
		this.m_CenterPos.x += this.m_Vertex[i].x;
		this.m_CenterPos.y += this.m_Vertex[i].y;
	}
	this.m_CenterPos.x /= 4;
	this.m_CenterPos.y /= 4;
	
	// 頂点に回転を適用
	for( var i=0; i<4; i++ )
	{
		this.m_Vertex[i] = this.CalcRotate( this.m_Vertex[i], this.m_Pos, rotDeg );
		this.m_NormalVector[i] = this.CalcRotate( this.m_NormalVector[i], null, rotDeg );
	}
};

// 加法定理使って頂点を回転させる
SnlPoly2D.prototype.CalcRotate = function( Pos, Center, rotDeg )
{
	if( Center == null )
	{
		Center = {x:0,y:0};
	}
	
	var RotRad = rotDeg * SnlMath.DegToRad;
	var retPos = {x:0, y:0};
	
	retPos.x=(Pos.x-Center.x)*Math.cos(RotRad)-(Pos.y-Center.y)*Math.sin(RotRad)+ Center.x;
	retPos.y=(Pos.x-Center.x)*Math.sin(RotRad)+(Pos.y-Center.y)*Math.cos(RotRad)+ Center.y;
	
	return retPos;
};

SnlPoly2D.prototype.HitCheckPoint = function( Point )
{
	return SnlPoly2D.HitCheckPoint( this, Point );
};

SnlPoly2D.prototype.HitCheck = function( Poly )
{
	return SnlPoly2D.HitCheck( this, Poly );
};

SnlPoly2D.prototype.GetHitPoint = function( LineP1, LineP2 )
{
	return SnlPoly2D.GetHitPoint( this, LineP1, LineP2 );
};

SnlPoly2D.prototype.GetInsidePoint = function( Poly )
{
	return SnlPoly2D.GetInsidePoint( this, Poly );
};

SnlPoly2D.prototype.GetHitLineIndex = function( LineP1, LineP2 )
{
	return SnlPoly2D.GetHitLineIndex( this, LineP1, LineP2 );
};

