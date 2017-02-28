var Utils = require( '../utils/utils' );
var config = require( '../config/gameConfig.json' );

function Bullets( ds, startships ) {
	this._ds = ds;
	this._startships = startships;

	this._bulletsList = this._ds.record.getList( 'game-startships-bullets' );
	this._bulletsList.setEntries( [] );
	this._ds.event.subscribe( 'fire', this._fireBullet.bind( this ) );
}

Bullets.prototype.updateState = function() {
	// console.log('Bullets', 'updateState')
	var bullets = this._bulletsList.getEntries();
	for( var i = 0; i < bullets.length; i++ ) {
		this._moveBullet( this._ds.record.getRecord( bullets[ i ] ) );
	}
};

Bullets.prototype._fireBullet = function( startshipName ) {
	if( !this._startships.isStartshipAlive( startshipName ) ) {
		return;
	}
	
	var startship = this._ds.record.getRecord( startshipName );

	var time = Date.now();
	if( time - startship.get( 'lastShotTime' ) < config.bulletReload ) {
		return;
	} else {
		startship.set( 'lastShotTime', time );
	}

	this._createBullet( startship );
};

Bullets.prototype._moveBullet = function( bullet, startships ) {
	var position = bullet.get( 'position' );
	var rangeRemaining = bullet.get( 'rangeRemaining');
	var rotation = bullet.get( 'rotation');

	if( this._startships.checkIfBulletHit( bullet.get( 'owner' ), position ) ) {
		this._destroyBullet( bullet );
		return;
	};

	if( rangeRemaining > 0 ) {
		position.x += ( Math.sin( rotation ) * config.bulletSpeed );		
		position.y -= ( Math.cos( rotation ) * config.bulletSpeed );		
		rangeRemaining--;

		bullet.set( 'position', position );
		bullet.set( 'rangeRemaining', rangeRemaining );

		return;
	} else {
		this._destroyBullet( bullet );
	}
};

Bullets.prototype._destroyBullet = function( bullet ) {
	this._bulletsList.removeEntry( bullet.name );
	bullet.set( 'destroyed', true );
};

Bullets.prototype._createBullet = function( startship ) {
	var bullets = this._bulletsList.getEntries();
	var bullet;
	var foundBullet = false;

	for( var i=0; i<bullets.length; i++ ) {
		bullet = this._ds.record.getRecord( bullets[ i ] );
		if( bullet.get( 'destroyed' ) ) {
			foundBullet = true;
			break;
		}
	}

	if( !foundBullet ) {
		bullet = this._ds.record.getRecord( 'game-startships-bullet-' + bullets.length );
	}

	bullet.set( {
		position: {
			x: startship.get( 'position.x' ),
			y: startship.get( 'position.y' )
		},
		rotation: startship.get( 'turretRotation' ),
		rangeRemaining: config.bulletRange,
		owner: startship.name,
		destroyed: false
	} );

	if( !foundBullet ) {
		bullet.whenReady( function( bullet ) {
			this._bulletsList.addEntry( bullet.name );
		}.bind( this ) );
	}

	return bullet;
};

module.exports = Bullets;