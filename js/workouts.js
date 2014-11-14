// some way of importing the actual exercises (squat, bench, etc)

function getStrengthWorkout (position, strength) {
        var workout = {};
        workout["exercises"] = [];
        switch (position) {
                case: 0
                      workout["exercises"] += squat(strength["squat"]);
                      workout["exercises"] += bench(strength["bench"]);
                      workout["exercises"] += row(strength["row"]);

                      workout["video"] = ; // some youtube video
                      // or image
                      break;
                case: 1
                	  workout["exercises"] += squat(strength["squat"]);
                      workout["exercises"] += overhead(strength["overhead"]);
                      workout["exercises"] += deadlift(strength["deadlift"]);
                      //...
                      break;
        }

}

function getCardioWorkout (position, strength) {
		switch (position) {
				case:0
					workout["exercises"] = treadmill(strength["treadmill"]);
				case:1
					workout["exercises"] = stairs(strength["stairs"]);
				case:2
					workout["exercises"] = elliptical(strength["elliptical"]);
		}

}

function getFlexibilityWorkout () {
		workout["exercises"] = flexibility();
}

function getWeightLossWorkout (strength) {
		workout["exercises"] = interval(strength["interval"]);
}




function getWorkout (profile) {
        switch (profile.goal) {
                case: strength
                      return getStrengthWorkout(profile.position, profile.strengths);
                      break;
                case: cardio
                	  return getCardioWorkout(profile.position, profile.strengths);	
                      break;
                case: flexibility
                	  return getFlexibilityWorkout();
                      break;
                case: weight
                	  return getWeightLossWorkout(profile.strengths);
                      break;
        }
}
