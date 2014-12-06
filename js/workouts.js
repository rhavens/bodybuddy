// for each workout generation function, workout must contain a list of object containing:
// a title (string), a description (string), an intensity (string describing reps, 
// sets, duration, etc), and optionally an image or video (string for a link) with an alt (string)

function bench(strength) {
        var exercise = {"title":"Bench",
                        "description":"" + 
                        "1. Lie back on a flat bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked.<br> " +
                        "2. From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest.<br> " +
                        "3. After a brief pause, push the bar back to the starting position as you breathe out. Focus on pushing the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position at the top of the motion, hold for a second and then start coming down slowly again.<br>",
                        "intensity":("Do three sets of five reps at " + strength + " lbs.")
        };
        return exercise;
}

function row(strength) {
        var exercise = {"title":"Row",
                        "description":"" +
                        "1. Bend over at the waist until the torso is parallel to floor or at 45 degree angle, abs in and knees slightly bent. <br>" +
                        "2. Hold weights straight down without locking the elbows.<br>" +
                        "3. Bend the elbows and pull the weights up until the elbows are level with the torso in a rowing motion. <br>",
                        "intensity":("Do five sets of ten reps at " + strength + " lbs.")
        };
        return exercise;
}

function squat(strength) {
        var exercise = {"title":"Squat",
                        "description":""+
                        "1. Plant your feet flat on the ground, about shoulder-width apart.<br>"+
                        "2. Point your feet slightly outward, not straight ahead. Grasp the bar and rest on the arch of your shoulders. <br>"+
                        "3. Pull in your abs, and keep your lower back in a near neutral position (a slightly arched back might be unavoidable). <br>"+
                        "4. Lower yourself. In a controlled manner slowly lower yourself down and back so that your upper legs are nearly parallel with the floor.<br>",
                        "intensity":("Do three sets of ten reps at " + strength + " lbs.")
        };
        return exercise;
}

function overhead(strength) {
        var exercise = {"title":"Overhead",
                        "description":""+
                        "1. Grip the barbell with palms slightly wider than shoulder-width apart. Wrap the thumbs around the bar and over the fingers. Be sure to position the bar in the heel of the palm.<br>"+
                        "2. Stand tall, feet shoulder-width apart, chest up. Fix your eyes forward, take a deep breath in, and exhale as you drive the barbell over your head<br>",
                        "intensity":("Do three sets of five reps at " + strength + " lbs.")
        };
        return exercise;
}

function deadlift(strength) {
        var exercise = {"title":"Deadlift",
                        "description":"1. Step up to the bar so that your feet are approximately shoulder width apart, the balls of your feet are under the bar, and your toes are pointing forward or slightly outward. Pointing your feet slightly outward will give you a bit more balance. <br>"+
                        "2. Bend your knees while keeping your back straight, so that you are sitting back. It is important to bend from the hips rather than from your waist. <br>"+
                        "3. Lower your hips so that your thighs are parallel to the floor. Keep the lower part of your legs mostly vertical. <br>"+
                        "4. Straighten your back and look straight ahead. <br>"+
                        "5. Lift the bar. Stand up by raising your hips and shoulders at the same rate and maintaining a flat back. Keep your abs tight during the whole lift. You should lift the bar straight up vertically and close to your body, thinking of it as pushing the floor away. Come to a standing position with upright posture and your shoulders pulled back. Allow the bar to hang in front of your hips; do not try to lift it any higher.<br>",
                        "intensity":("Do five sets of three reps at " + strength + " lbs.")
        };
        return exercise;
}

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


function treadmill(strength) {
    var exercise = {"title":"Treadmill",
                        "description":"Take caution while on the treadmill. Run at your own pace, but push yourself. Keep your heart rate up for an extended period of time, and make sure to break a sweat.",
                        "intensity":("Run for " + strength + " minutes")
        };
        return exercise;
}

function stairs(strength) {
    var exercise = {"title":"Stairs",
                        "description":"Find a flight of stairs high enough so that you can do prolonged sets. Keep a steady pace, and increase your heart rate. You should feel slight muscle pain in your quads. Make sure to hit every step on the way up and down. Take a short, minute long break between sets. Aim for more reps.",
                        "intensity":("Do at least 10 sets of stairs, for no longer than" + strength + " minutes of exercise")
        };
        return exercise;
}

function elliptical(strength) {
    var exercise = {"title":"Elliptical",
                        "description":"Focus on good form when using the ellipticals. Push yourself to keep your heart rate up for an extended period of time.",
                        "intensity":("Do the ellipticals for " + strength + " minutes at your own pace.")
        };
        return exercise;
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
                     "image":"/img/workout_img/cheststretch.jpg",
                     "alt":"Image of a chest stretch"
        };
        var abdominal = {
            "title":"Abdominal Stretch",
             "description":"Sit upright on the ground. Flex your knees and bring your heels together. Gently pull your feet towards your bottom. Place your elbows on the inside of your knees. Gently push your legs to the floor. Hold this position.",
             "image":"/img/workout_img/butterflystretch.jpg",
             "alt":"Image of abdominal stretch"
        };
        var shoulder = {
            "title":"Shoulder Stretch",
             "description":"Find a stationary bar; a smith machine works just fine. Turn facing away from it and grasp it with your palms down. Walk forward slowly until your delts are maximally stretched. Hold this position.",
             "image":"/img/workout_img/shoulderstretch.jpg",
             "alt":"Image of shoulder stretch"
        };
        var lower_back = {
            "title":"Lower Back Stretch",
             "description":"Lie on your back with knees bent and your feet flat on the floor. Place your hands on the back of your thighs and pull your legs toward your chest. Pull until a gentle stretch is felt. Hold this position.",
             "image":"/img/workout_img/lowbackstretch.jpg",
             "alt":"Image of lower back stretch"
        };
        var upper_back = {
            "title":"Lower Back Stretch",
             "description":"Hang from a bar with your palms facing away from you in a pullup position. Lift your body up then back down. Once in the down position, hang from the bar for 30 seconds. Note if you don't have access to a pullup bar or unable to perform this exercise, simply stretching and holding your arms as high as possible is also a great lat stretching exercise.",
             "image":"/img/workout_img/upperbackstretch.jpg",
             "alt":"Image of upper back stretch"
        };
        var yogaMove = {
            "title":"Downward Facing Dog",
             "description":""+
             "1. Come to your hands and knees with the wrists underneath the shoulders and the knees underneath the hips.</br>"+
             "2. Curl the toes under and push back raising the hips and straightening the legs.</br>"+
             "3. Spread the fingers and ground down from the forearms into the fingertips.</br>"+
             "4. Outwardly rotate the upper arms broadening the collarbones.</br>"+
             "5. Let the head hang, move the shoulder blades away from the ears towards the hips.</br>"+
             "6. Engage the quadriceps strongly to take the weight off the arms, making this a resting pose.</br>"+
             "7. Rotate the thighs inward, keep the tail high and sink your heels towards the floor.</br>",
             "image":"/img/workout_img/downwardfacingdog.jpg",
             "alt":"Image of downward facing dog"
        };

        workout += chest; 
        workout += abdominal;
        workout += shoulder;
        workout += lower_back;
        workout += upper_back;
        workout += yogaMove;
        
        return workout;
}

function getWeightLossWorkout (position, strength) {
        if (position < 10) {
                return getCardioWorkout(position % 3, strength);
        } else {
                var workout = [];
                var burpees = {"title":"Burpees",
                               "description":"1. Begin in a standing position. <br> 2. Drop into a squat position with your hands on the ground.<br>3. Kick your feet back, keeping your arms extended.<br>4. (Optional) Do a push-up.<br>5. Return your feet to a squat position.<br>6. Jump up from the squat position.<br>Source: en.wikipedia.org/wiki/Burpee_%28exercise%29",
                               "intensity":"Repeat for 45 seconds then take a 15 second break."};
                var jumpingJacks = {"title":"Jumping Jacks",
                                        "description":"<br>1. Stand with your feet flat and your arms down at your sides.<br>2. Jump into the air and land with your feet apart and your arms in the air.<br>3. Jump into the air again and land with your feet together and your arms at your sides",
                                        "intensity":"Do three sets with 20 repetitions per set."};
                var mountainClimbers = {"title":"Mountain Climbers",
                                    "description":"1. Start the exercise by lying face down on the floor.<br>2. Straighten out your arms and then touch your knees down to the ground or floor.<br>3. Now you are ready to lift yourself up into position. When doing this, be sure that your hands are directly under your chest at a width that is slightly more than your shoulder length distance.<br>4. Once you have settled into position and checked the position of your hands you should be sure to keep your legs stretched out, ensuring that they are properly lined up with the rest of your body.<br>5. Now you should stretch out your left leg for stability. Bend your right knee and bring it up in the direction of your right hand. <br>6. After bringing your right knee up, return it to the original position and do the previous step with your left leg.",
                                    "intensity":"Do three sets with 15 repetitions per set."};
                var lunges = {"title":"Lunges",
                              "description":"1. Stand with your feet shoulder's width apart, spine long and straight, shoulders back, gaze forward.<br>2. Step forward with one leg into a wide stance (about one leg's distance between feet) while maintaining spine alignment.<br>3. Lower your hips until both knees are bent at approximately a 90 degree angle. Your front knee should not extend over your ankle, and your back knee should hover above the ground. Keep your weight in your heels as you push back up to starting position. Repeat on both sides.",
                              "intensity":"Do three sets with 10 repetitions per set."};
                var pushups = {"title":"Push-Ups",
                               "description":"<br>1. Lay flat on the ground.</br><br>2. Stretch your legs out behind you.<br>3. Face forward.<br>4. Lift your body.<br>5. Slowly begin to lower your body in the manor at which you began your push-up.<br>6. Continue to lower your body. Go all the way down, until your chest touches the floor and if able, proceed again.<br>",
                               "intensity":"Do three sets with 15 repetitions per set."};
                var boxJumps = {"title":"Box Jumps",
                                "description":"<br>1. Stand in front of the box with feet directly under the hips and hands by your side.<br>2. Lower yourself into the jumping position by bending at the knees and hips. Keep your head up and back straight.<br>3. Explosively jump from the crouched position whilst swinging the arms.<br>4. Land softly on the centre of the platform absorbing the impact with your legs. <br>5. Stand tall. <br>6. Return to starting position by either jumping backwards off the box, or by stepping down and repeat the movement.<br>",
                                "intensity":"Do three sets with 10 repetitions per set."};
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
