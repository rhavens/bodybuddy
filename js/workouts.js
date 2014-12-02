// for each workout generation function, workout must contain a list of object containing:
// a title (string), a description (string), an intensity (string describing reps, 
// sets, duration, etc), and optionally an image or video (string for a link) with an alt (string)

function squat(strength) {
        var exercise = {"title":"Squat",
                        "description":"",
                        "intensity":("Do five sets of five reps at " + strength + " lbs.")
        };
        return exercise;
}

// fill in functions for Bench, Row, etc.

function getStrengthWorkout (position, strength) {
        var workout = [];
        switch (position) {
            case 0:
                      workout += squat(strength["Squat"]);//weights
                      workout += bench(strength["Bench"]);
                      workout += row(strength["Row"]);
                      break;
            case 1:
                      workout += squat(strength["Squat"]);
                      workout += overhead(strength["Overhead"]);
                      workout += deadlift(strength["Deadlift"]);
                      break;
        }
        return workout;
}

function getCardioWorkout (position, strength) {
    var workout = [];
	switch (position) {
		case 0:
			workout += treadmill(strength["Treadmill"]); //amount of time
		case 1:
			workout += stairs(strength["Stairs"]);
		case 2:
			workout += elliptical(strength["Elliptical"]);
	}
    return workout;
}

function getFlexibilityWorkout () {
        var workout = [];
        var chest = {"title":"Chest Stretch",
                     "description":"Take a pair of dumbells with the amount of weight you would use for about 12 reps of flies. Lie flat on a bench and lift them in a contracted position. Then slowly lower them where your pecs will be stretched to the maximum possible. Hold this position.",
                     //"image": ,// fill this in, linking to something in static, not another site
                             // get them from www.bodybuilding.com/fun/wotw80.htm first workout listed
                     "alt":"Image of a chest stretch"
        };
        // ...
        workout += chest;
        // workout += ...
        return workout;
}

function getWeightLossWorkout (position, strength) {
        if (position < 10) {
                return getCardioWorkout(position % 3, strength);
        } else {
                var workout = [];

                // fill in burpees, mountain climbers, jumping jacks, lunges, pushups, 
                // and box jumps
                // following the format used below
                var burpees = {"title":"Burpees",
                               "description":"1. Begin in a standing position.<br>2. Drop into a squat position with your hands on the ground.<br>3. Kick your feet back, keeping your arms extended.<br>4. (Optional) Do a push-up.<br>5. Return your feet to a squat position.<br>6. Jump up from the squat position.<br><br>Source: en.wikipedia.org/wiki/Burpee_%28exercise%29",
                               "intensity":"Repeat for 45 seconds then take a 15 second break."
                };
                var mountainClimbers = {};
                var jumpingJacks = {};
                var lunges = {};
                var pushups = {};
                var boxJumps = {};
                workout += burpees;
                workout += mountainClimbers;
                workout += jumpingJacks;
                workout += lunges;
                workout += pushups;
                workout += boxJumps;
                return workout;
        }
}

function getWorkout (profile) {
    switch (profile.goal) {
        case 'strength':
            return getStrengthWorkout(profile.position, profile.strength);
            break;
        case 'cardio':
            return getCardioWorkout(profile.position, profile.strength);	
            break;
        case 'flexibility':
            return getFlexibilityWorkout();
            break;
        case 'weight':
            return getWeightLossWorkout(profile.position, profile.strength);
            break;
    }
}

exports.getWorkout = getWorkout;
