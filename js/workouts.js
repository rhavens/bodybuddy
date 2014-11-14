// some way of importing the actual exercises (squart, bench, etc)

function getStrengthWorkout (position, strength) {
        var workout = {};
        workout["exercises"] = [];
        switch (position) {
                case: 0
                      workout["exercises"] += squat(strength);
                      workout["exercises"] += bench(strength);
                      // ...
                      workout["video"] = ; // some youtube video
                      // or image
                      break;
                case: 1
                      //...
                      break;
        }

}

function getCardioWorkout () {

}

// ... 


function getWorkout (profile) {
        switch (profile.goal) {
                case: strength
                      return getStrengthWorkout(profile.position, profile.strength);
                      break;
                case: cardio

                      break;
                case: flexibility

                      break;
                case: weight

                      break;
        }
}
