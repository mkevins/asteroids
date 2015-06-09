# asteroids

This is an HTML5 version of the classic arcade shooter [Asteroids](http://en.wikipedia.org/wiki/Asteroids_(video_game)).

## Usage

The game can be played [here](http://asteroids.matthewkevins.com). Use the arrow keys to move around, and the spacebar to shoot. The mouse can also be used. Destroy all asteroids to move on to the next level.

## Techs

* Javascript inheritance with the revealing module pattern
* HTML5 canvas
* jQuery for convenience
* Poisson random variable generator for stochastic processes

## Implementation Details

Torus topology is used to wrap moving objects in the game world. The trivial implementation of this simply uses Javascript's faux-modulo operator '%'. This operator can have unexpected results as Javascript uses the common truncated division implementation (the range spans larger than the divisor, and includes negative numbers). To acheive the more useful Euclidian division based modulo, the following is used:

```javascript
var modulo = (divident % divisor + divisor) % divisor;
```

This guarantees that the output is non-negative, and less than the divisor (ideal for torus topology).

Additionally, the naive approach is not smoothly rendered at the edges of the viewport. Since the locations of moving objects are represented by a single coordinate point, the parts that overlap the viewport edge are not wrapped until the center of the object passes the edge. This means that the object suddenly disappears on one side of the screen and reappears on the other. To make this seemless, objects are simply rendered redundantly, 9 times. This approach was a quick fix, but surpisingly did not compromise performance in a meaningful way.

In order to make keyboard controls more fluid, keydown and keyup events were separately bound. Rather than applying an impulse for a given keypress, acceleration is applied for the duration of the keypress. This avoids the delay that accompanies controls that rely on a keyboard's repeat feature, and the varying rates thereof. This could only be accomplished after changing the physics model to account for time elapsed bewteen steps.

The window resize event triggers a function to resize the canvas, which keeps the game fullscreen. This function is throttled because certain browsers emit this event at an extremely high rate, needlessly littering the call stack and affecting performance.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Bugs

The ship often starts out too close to the screen edges.

## TODO

Write license

