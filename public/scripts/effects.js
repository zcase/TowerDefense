towerDefense.effects = (function (graphics) {


    function ParticleSystem(spec, graphics) {
        var that = {},
            nextName = 1,
            particles = [],
            imageSrc = spec.image;

        that.x = spec.center.x;
        that.y = spec.center.y;
        that.speed = spec.speed;
        that.lifetime = spec.lifetime;
        that.usedFor = spec.usedFor;


        spec.image = new Image();
        spec.image.onload = function () {
            that.render = function () {
                var value,
                    particle;

                for (value in particles) {
                    if (particles.hasOwnProperty(value)) {
                        particle = particles[value];
                        graphics.drawImage(particle);
                    }
                }
            };
        };
        spec.image.src = imageSrc;

        that.create = function () {
            var part; // will change based on what it is applied to
            if (that.usedFor === 'gun') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(10, 4),
                    center: { x: spec.center.x, y: spec.center.y },
                    // direction: Random.nextCircleVector(),
                    direction: Random.sprayForward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }

            if (that.usedFor === 'spark') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(6, 2),
                    center: { x: spec.center.x, y: spec.center.y },
                    // direction: Random.nextCircleVector(),
                    direction: Random.sprayForward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }

            if (that.usedFor === 'creep') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(4, 2),
                    center: { x: spec.center.x, y: spec.center.y },
                    direction: Random.nextCircleVector(),
                    // direction: Random.sprayForward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean / 2, spec.lifetime.std / 2),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }

            if (that.usedFor === 'creepDeath') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(10, 5),
                    center: { x: spec.center.x, y: spec.center.y },
                    direction: Random.nextCircleVector(),
                    // direction: Random.sprayForward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean / 2, spec.lifetime.std / 2),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }

            if (that.usedFor === 'sellBack') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(12, 7),
                    center: { x: spec.center.x, y: spec.center.y },
                    direction: Random.sprayForward(spec.rotation * 2),
                    // direction: Random.sprayForward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean / 2, spec.lifetime.std / 2),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }

            if (that.usedFor === 'tail') {
                part = {
                    image: spec.image,
                    size: Random.nextGaussian(6, 2),
                    center: { x: spec.center.x, y: spec.center.y },
                    // direction: Random.nextCircleVector(),
                    direction: Random.sprayBackward(spec.rotation),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std),	// How long the particle should live, in seconds
                    alive: 0	// How long the particle has been alive, in seconds
                };
            }


            //
            // Ensure we have a valid size - gaussian numbers can be negative
            part.size = Math.max(1, part.size);
            //
            // Same thing with lifetime
            part.lifetime = Math.max(0.01, part.lifetime);
            //
            // Assign a unique name to each particle
            particles[nextName++] = part;
        };

        that.update = function (elapsedTime) {
            var removeMe = [],
                value,
                particle;

            //
            // We work with time in seconds, elapsedTime comes in as milliseconds
            elapsedTime = elapsedTime / 1000;

            for (value in particles) {
                if (particles.hasOwnProperty(value)) {
                    particle = particles[value];
                    //
                    // Update how long it has been alive
                    particle.alive += elapsedTime;

                    //
                    // Update its position
                    particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
                    particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

                    // particle.center.y -= (elapsedTime * particle.speed * particle.direction.y);

                    //
                    // Rotate proportional to its speed
                    particle.rotation += particle.speed / 500;

                    //
                    // If the lifetime has expired, identify it for removal
                    if (particle.alive > particle.lifetime) {
                        removeMe.push(value);
                    }
                }

                //
                // Remove all of the expired particles
                for (particle = 0; particle < removeMe.length; particle++) {
                    delete particles[removeMe[particle]];
                }
                removeMe.length = 0;
            };
        };


        that.render = function () {
            for (value in particles) {
                if (particles.hasOwnProperty(value)) {
                    particle = particles[value];
                    graphics.drawImage(particle);
                }
            }
        };

        return that;
    }

    function ParticleSystemText(spec, graphics) {
        var that = {},
            nextName = 1,
            particles = [],
            text = spec.text;

        that.x = spec.x;
        that.y = spec.y;
        that.speed = spec.speed;
        that.lifetime = spec.lifetime;

        // spec. = function() {
        //     that.render = function() {
        //         var value,
        //             particle;

        //        for(value in particles) {
        //            if(particles.hasOwnProperty(value)) {
        //                particle = particles[value];
        //                graphics.drawText(particle);
        //            }
        //        }
        //     };
        // };


        that.create = function () {
            var part = {
                text: '+100',
                size: Random.nextGaussian(12, 7),
                direction: Random.sprayForward(spec.rotation),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.std), // pixels per second
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean / 2, spec.lifetime.std / 2),	// How long the particle should live, in seconds
                alive: 0	// How long the particle has been alive, in seconds
            };

            // Ensure we have a valid size - gaussian numbers can be negative
            part.size = Math.max(1, part.size);
            //
            // Same thing with lifetime
            part.lifetime = Math.max(0.01, part.lifetime);
            //
            // Assign a unique name to each particle
            particles[nextName++] = part;
        }

        that.update = function (elapsedTime) {
            var removeMe = [],
                value,
                particle;
            elapsedTime = elapsedTime / 1000;

            for (value in particles) {
                if (particles.hasOwnProperty(value)) {
                    particle = particles[value];
                    //
                    // Update how long it has been alive
                    particle.alive += elapsedTime;

                    //
                    // Update its position
                    particle.x += (elapsedTime * particle.speed * particle.direction.x);
                    particle.y += (elapsedTime * particle.speed * particle.direction.y);

                    if (particle.alive > particle.lifetime) {
                        removeMe.push(value);
                    }
                }

                //
                // Remove all of the expired particles
                for (particle = 0; particle < removeMe.length; particle++) {
                    delete particles[removeMe[particle]];
                }
                removeMe.length = 0;
            };
        };

        that.render = function () {
            for (vaule in particles) {
                if (particles.hasOwnProperty(value)) {
                    particle = particles[values];
                    graphics.drawText(particle);
                }
            }
        }

        return that
    }


    return {
        ParticleSystem: ParticleSystem,
        ParticleSystemText: ParticleSystemText
    }

} (towerDefense.graphics));