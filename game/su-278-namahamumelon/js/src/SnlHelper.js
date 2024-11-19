var SnlHelper = function() {}

SnlHelper.setNumVisible = function( obj, num, boolean ) {

    for (var i = 0; i < obj.m_SpriteNum.length; i++) {
        
        obj.m_SpriteNum[i].SetVisible(boolean);

        if (num < 100 && i == obj.m_SpriteNum.length - 1) {

            obj.m_SpriteNum[i].SetVisible(false);
        }
        if (num < 10 && i == obj.m_SpriteNum.length - 2) {

            obj.m_SpriteNum[i].SetVisible(false);
        }
    }
}

SnlHelper.getObjectSize = function( object )
{
    var size = 0;

    for ( var key in object )
    {
        if( object.hasOwnProperty( key ) ) size++;
    }
    
    return size;
};


SnlHelper.setZ = function( object, zIndex )
{
    if( object.SetZ != null )
    {
        object.SetZ( zIndex );
    } else
    {
        for( var prop in object )
        {
            if( object[prop] == null ) continue;

            if( typeof object[prop] === 'object' )
            {
                SnlHelper.setZ( object[prop], zIndex );
            }
        }
    }
};

// maxNumに対するcurrentNumの比率を返す
SnlHelper.getRatio = function( currentNum, maxNum )
{
    var currentNumFix = currentNum + 1;
    var centerNum = maxNum / 2 + 0.5;

    if( maxNum % 2 == 0 )
    {
        return currentNumFix - centerNum;
    } else
    {
        if( currentNumFix == centerNum )
        {
            return 0;
        } else
        {
            return currentNumFix - centerNum;
        }
    }
};

SnlHelper.getPos = function( _NowNum, _MaxNum )
{
    var _NowNumFix = _NowNum + 1;
    var _CenterNum = _MaxNum / 2 + 0.5;
    if( _MaxNum % 2 == 0 )
    {
        return _NowNumFix - _CenterNum;
    } else
    {
        if( _NowNumFix == _CenterNum )
        {
            return 0;
        } else
        {
            return _NowNumFix - _CenterNum;
        }
    }
};

SnlHelper.circleCollision = function( c1Pos, c2Pos, c1Radius, c2Radius )
{
    var distance = SnlMath.Distance( c1Pos, c2Pos );
    
    var radiusSum = c1Radius + c2Radius + 5;
    
    // console.log("거리: ", distance, radiusSum, distance < radiusSum)
    return distance < radiusSum;
};

SnlHelper.vecSub = function(vec1, vec2)
{
    var resultVec = {x: 0, y: 0};
    resultVec.x = vec1.x - vec2.x;
    resultVec.y = vec1.y - vec2.y;
    return resultVec;
}

SnlHelper.vecMul = function(vec, mul)
{
    var resultVec = {x: 0, y: 0};
    resultVec.x = vec.x * mul;
    resultVec.y = vec.y * mul;
    return resultVec;
}

SnlHelper.vecLenght = function(vec)
{
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

SnlHelper.vecNormalize = function(vec)
{
    var resultVecX = vec.x / SnlHelper.vecLenght(vec);
    var resultVecY = vec.y / SnlHelper.vecLenght(vec);

    return {x: resultVecX, y: resultVecY};

}
