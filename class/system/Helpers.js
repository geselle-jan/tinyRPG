var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
	GetDirectionFromVelocity: function (sprite, tolerance) {
	    var vel = sprite.body.velocity,
	        v,
	        h,
	        x = vel.x,
	        y = vel.y;

	    if (x == 0)
	        h = 'none';

	    if (x > 0)
	        h = 'Right';

	    if (x < 0)
	        h = 'Left';

	    if (y == 0)
	        v = 'none';

	    if (y > 0)
	        v = 'Down';

	    if (y < 0)
	        v = 'Up';

	    if (h == 'none' && v == 'none')
	        return 'standDown';

	    x = Math.abs(x);
	    y = Math.abs(y);

	    if (x > y) {
	    	h = x < tolerance ? 'stand' + h : 'walk' + h;
	        return h;
	    } else {
	    	v = y < tolerance ? 'stand' + v : 'walk' + v;
	        return v;
	    }
	}
};