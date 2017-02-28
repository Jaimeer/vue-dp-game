var Utils = require('../utils/utils');
var config = require('../config/gameConfig.json');

function Startships(ds) {
	this._ds = ds;

	this._startships = {};
	this._startshipsList = this._ds.record.getList('startships-players');
	this._startshipsList.setEntries([]);

	this._ds.event.subscribe('join-game-startships', this._createStartship.bind(this));
	this._ds.event.subscribe('leave-game-startships', this._destroyStartship.bind(this));
}

Startships.prototype.updateState = function () {
	// console.log('Startships', 'updateState')
	var startships = this._startships;
	var startship, direction, destroyed;

	for (var startshipName in startships) {
		startship = startships[startshipName];
		startshipView = startship.view;
		startshipControl = startship.control;

		direction = startshipControl.get('direction');
		turret = startshipControl.get('turretDirection');
		destroyed = startshipView.get('destroyed');

		if (
			(direction.left || direction.right) && !(direction.left && direction.right) ||
			(direction.forwards || direction.backwards) && !(direction.forwards && direction.backwards)
		) {
			!destroyed && this._moveStartship(direction, startship, startships);
		}


		startshipView.set('turretRotation', startshipControl.get('turretRotation'));
	}
};

Startships.prototype.isStartshipAlive = function (startshipName) {
	var startship = this._startships[startshipName];
	return startship && startship.view.get('destroyed') === false;
};

Startships.prototype.checkIfBulletHit = function (bulletOwner, bulletPosition) {
	for (var startshipName in this._startships) {
		startshipView = this._startships[startshipName].view;
		if (bulletOwner === startshipName) {
			continue;
		}

		if (Utils.intersects(bulletPosition, startshipView.get('position'), config.bulletDimensions, config.startshipDimensions)) {
			startshipHealth = startshipView.get('health') - 1;
			startshipView.set('health', startshipHealth);
			if (startshipHealth === 0) {
				startshipView.set('destroyed', true);
				this._increaseStartshipStats(bulletOwner, 'kills');
				this._increaseStartshipStats(startshipName, 'died');
				setTimeout(this._respawnStartship.bind(this, startshipName), config.respawnTimeout);
			}
			return true;
		}
	}
	return false;
};

Startships.prototype._createStartship = function (startshipName) {
	var startship = this._ds.record.getRecord(startshipName);
	startship.set({
		position: this._getInitialPosition(startshipName),
		color: this._getColor(),
		turretRotation: 0,
		rotation: 0,
		destroyed: false,
		health: 3,
		kills: 0,
		died: 0,
		lastShotTime: Date.now()
	});

	var startshipControl = this._ds.record.getRecord(startshipName + '-control');
	startshipControl.set({
		direction: {
			left: false,
			right: false,
			forwards: false,
			backwards: false
		},
		turretRotation: 0
	});

	startship.whenReady(function () {
		startshipControl.whenReady(function () {
			if (this._startshipsList.getEntries().indexOf(startshipName) === -1) {
				this._startshipsList.addEntry(startshipName);
			}
			this._startships[startshipName] = {
				view: startship,
				control: startshipControl
			};
		}.bind(this));
	}.bind(this));
};

Startships.prototype._moveStartship = function (direction, startship, startships) {
	var startshipView = startship.view;
	var startshipControl = startship.control;

	var position = startshipView.get('position');
	var rotation = startshipView.get('rotation');

	if (direction.left) {
		rotation -= (Math.PI / 90);
	} else if (direction.right) {
		rotation += (Math.PI / 90);
	}

	if (rotation > (Math.PI * 2)) {
		rotation = 0;
	} else if (rotation < 0) {
		rotation = Math.PI * 2;
	}

	if (direction.forwards) {
		position.x += (Math.sin(rotation) * config.startshipSpeed);
		position.y -= (Math.cos(rotation) * config.startshipSpeed);
	} else if (direction.backwards) {
		position.x -= (Math.sin(rotation) * config.startshipSpeed);
		position.y += (Math.cos(rotation) * config.startshipSpeed);
	}

	if (this._collidesWithOtherStartships(position, startshipView.name) || Utils.collidesWithBorder(position)) {
		return;
	}

	startshipView.set('rotation', rotation);
	startshipView.set('position', position);
};

Startships.prototype._destroyStartship = function (startshipName) {
	var startship = this._startships[startshipName];
	delete this._startships[startshipName];
	this._startshipsList.removeEntry(startshipName);
};

Startships.prototype._respawnStartship = function (startshipName) {
	var startship = this._startships[startshipName];

	startship.view.set('position', this._getInitialPosition());
	startship.view.set('destroyed', false);
	startship.view.set('health', 3);

	startship.control.set({
		direction: {
			left: false,
			right: false,
			forwards: false,
			backwards: false
		},
		turretRotation: 0
	});
};

Startships.prototype._collidesWithOtherStartships = function (position, startshipName) {
	var startships = this._startships;
	for (var _startshipName in startships) {
		if (_startshipName === startshipName) {
			continue;
		}
		if (Utils.intersects(position, startships[_startshipName].view.get('position'), config.startshipDimensions, config.startshipDimensions)) {
			return true;
		}
	}

	return false;
};

Startships.prototype._getInitialPosition = function (startshipName) {
	var x = 1000 * Math.random() / 2;
	var y = 1000 * Math.random() / 2;

	while (this._collidesWithOtherStartships({
			x: x,
			y: y
		}, startshipName)) {
		x = 1000 * Math.random() / 2;
		y = 1000 * Math.random() / 2;
	}

	return {
		x: x,
		y: y
	};
};

Startships.prototype._getColor = function () {
	return Math.floor((Math.random() * 3) + 1);
};

Startships.prototype._increaseStartshipStats = function (startshipName, stat) {
	var startship = this._startships[startshipName].view;
	startship.set(stat, startship.get(stat) + 1);
};

module.exports = Startships;