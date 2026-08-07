export const PROGRAM_START_DATE = "2026-07-13";

export const TARGETS = { calories: 2200, protein: 175, waterGallons: 1 };

export const ESTIMATED_TDEE = 2500;
export const WEEKLY_DEFICIT_BUDGET = (ESTIMATED_TDEE - TARGETS.calories) * 7;

export type Exercise = { part: string; movement: string };

export type WorkoutDay = {
  date: string; dayNumber: number; dayLabel: string; shortLabel: string; focusTitle: string; isRest: boolean; isShoppingDay: boolean; isPrepDay: boolean; prepNote?: string; exercises: Exercise[]; focusSet?: string; restNote?: string; estCalories: number; estProtein: number;
  meals: { breakfast: { name: string; recipeId: string }; snack: { name: string; recipeId: string }; lunch: { name: string; recipeId: string }; dinner: { name: string; recipeId: string }; };
};

export type Recipe = { id: string; name: string; meal: "breakfast" | "snack" | "lunch" | "dinner"; context: string; servings: number; caloriesPerServing: number; proteinPerServing: number; ingredients: string[]; instructions: string[]; notes: string; vegetarian?: boolean; };

export const RECIPES: Recipe[] = [
  { id: "egg-muffins", name: "High-Protein Egg Muffins", meal: "breakfast", context: "Every day, Mon 7/13 through Sun 7/19 (batch cook once)", servings: 7, caloriesPerServing: 327, proteinPerServing: 34, ingredients: ["12 large eggs", "1 cup liquid egg whites (about 8 whites)", "1.5 lb lean ground turkey or turkey breakfast sausage", "1 cup shredded cheddar cheese", "1 red bell pepper, diced", "1/2 cup diced onion", "1 cup chopped spinach", "Salt, pepper, garlic powder, paprika to taste", "Cooking spray"], instructions: ["Preheat oven to 350°F. Spray two 12-cup muffin tins (you'll only fill 14 total).", "Brown the turkey in a skillet over medium heat, breaking it up as it cooks, about 6-8 minutes. Set aside to cool slightly.", "Whisk the eggs and egg whites together in a large bowl. Season with salt, pepper, garlic powder, paprika.", "Stir in the cooked turkey, bell pepper, onion, spinach, and cheese.", "Ladle the mixture evenly into 14 muffin cups, filling about 3/4 full.", "Bake 18-20 minutes, until set and lightly golden on top.", "Cool, then store in the fridge in an airtight container. Reheat 2 muffins for 45-60 seconds each morning."], notes: "One-time kickoff prep on Sunday, July 12 (the day before Day 1). Going forward this batch lands on Day 7 of each cycle, always a Sunday." },
  { id: "protein-shake", name: "Chocolate Protein & Egg White Shake", meal: "snack", context: "Every day, Mon 7/13 through Sun 7/19", servings: 1, caloriesPerServing: 205, proteinPerServing: 42, ingredients: ["1 scoop chocolate protein powder (~24g protein/scoop)", "5 servings liquid egg whites (about 5 whites, roughly 2/3 cup)", "Water or ice to taste", "Optional: splash of milk of choice"], instructions: ["Add protein powder and liquid egg whites to a blender or shaker bottle.", "Add water/ice to your preferred consistency.", "Blend or shake until fully combined, about 20-30 seconds.", "Drink immediately."], notes: "Pasteurized liquid egg whites are safe to drink without cooking. Tastes like chocolate milk." },
  { id: "steak-rice-bowl", name: "Reheated Sirloin Steak & Rice Bowl", meal: "lunch", context: "Monday 7/13 through Friday 7/17 (batch cook once)", servings: 5, caloriesPerServing: 686, proteinPerServing: 66, ingredients: ["3.5 lb sirloin steak (or chuck roast, cut into small steaks)", "Salt, pepper, garlic powder", "1 tbsp olive oil, for searing", "2.5 cups dry white rice (cooks to about 5 cups)", "3 cups broccoli florets, steamed"], instructions: ["Season the steaks with salt, pepper, and garlic powder.", "Sear steaks 3-4 minutes per side in a hot skillet with olive oil. Work in batches if needed.", "Rest steaks 5 minutes, then slice.", "Cook rice according to package instructions.", "Steam broccoli until just tender, about 5 minutes.", "Divide steak, rice, and broccoli evenly into 5 containers, refrigerate.", "Reheat 8-10 oz steak plus rice and broccoli about 1:10 in the microwave each day at lunch."], notes: "Cook alongside the egg muffins during Sunday, July 12 kickoff prep. Two portions can go in the freezer." },
  { id: "rotisserie-bowl", name: "Rotisserie Chicken & Rice Bowl", meal: "lunch", context: "Saturday 7/18 and Sunday 7/19", servings: 2, caloriesPerServing: 628, proteinPerServing: 56, ingredients: ["1 whole store-bought rotisserie chicken (using ~12 oz meat)", "1.5 cups dry brown rice (cooks to ~3 cups)", "2 cups mixed vegetables", "1 avocado, sliced", "Salt, pepper, lime or hot sauce to taste"], instructions: ["Cook brown rice according to package instructions.", "Pull about 12 oz of meat off the rotisserie chicken, shredding or chopping it.", "Steam or sauté the mixed vegetables until tender.", "Divide rice, chicken, and vegetables into 2 bowls, top with avocado.", "Season with salt, pepper, and lime or hot sauce."], notes: "Fastest protein on the list, no cooking required. Save leftover chicken for an easy add-on." },
  { id: "lemon-chicken", name: "Sheet-Pan Lemon Chicken & Vegetables", meal: "dinner", context: "Monday, July 13 (Day 1)", servings: 2, caloriesPerServing: 924, proteinPerServing: 70, ingredients: ["14 oz boneless, skinless chicken breast", "2 medium potatoes, cubed", "4 cups mixed vegetables (broccoli, carrots, zucchini)", "4 tbsp olive oil", "2 lemons (juice and zest)", "4 cloves garlic, minced (or 2 tsp garlic powder)", "Salt, pepper, Italian seasoning to taste"], instructions: ["Preheat oven to 425°F. Line a sheet pan with foil or parchment.", "Toss chicken, potato, and vegetables with olive oil, lemon, garlic, salt, pepper, seasoning.", "Spread in a single layer on the sheet pan.", "Roast 22-25 minutes, flipping halfway, until chicken reaches 165°F and vegetables are tender.", "Plate and serve."], notes: "One pan, minimal cleanup. Scaled for 2 servings." },
  { id: "beef-broccoli", name: "Ground Beef & Broccoli Stir-Fry", meal: "dinner", context: "Tuesday, July 14 (Day 2)", servings: 2, caloriesPerServing: 920, proteinPerServing: 45, ingredients: ["12 oz 90/10 ground beef", "4 cups broccoli florets", "1.5 cups dry white rice (cooks to ~3 cups)", "3 tbsp olive oil (or sesame oil)", "4 tbsp soy sauce or coconut aminos", "2 cloves garlic, minced", "2 tsp fresh ginger, minced (optional)"], instructions: ["Cook rice according to package instructions.", "Brown the ground beef in a hot skillet, about 5-6 minutes. Drain excess fat if needed.", "Add garlic and ginger, cook 30 seconds until fragrant.", "Add broccoli and soy sauce, stir-fry 4-5 minutes until tender-crisp.", "Serve over rice."], notes: "Simple, fast, hard to mess up. Swap broccoli for any vegetable you need to use up." },
  { id: "pork-tenderloin", name: "Garlic Pork Tenderloin & Roasted Sweet Potato", meal: "dinner", context: "Wednesday, July 15 (Day 3, rest day)", servings: 2, caloriesPerServing: 779, proteinPerServing: 60, ingredients: ["14 oz pork tenderloin", "2 medium sweet potatoes, cubed", "3 cups asparagus, trimmed", "3 tbsp olive oil", "4 cloves garlic, minced", "Salt, pepper, rosemary or thyme to taste"], instructions: ["Preheat oven to 400°F.", "Toss sweet potato with oil, salt, pepper. Roast on a sheet pan 15 minutes.", "Season pork with garlic, salt, pepper, herbs. Sear in an oven-safe skillet, ~2 minutes per side.", "Add pork to the sheet pan with asparagus (or transfer skillet to oven).", "Roast 12-15 minutes more, until pork reaches 145°F internally.", "Rest pork 5 minutes, slice, serve with sweet potato and asparagus."], notes: "Rest day, but you still eat like it matters. Use a thermometer, tenderloin overcooks fast." },
  { id: "black-bean-quinoa", name: "Black Bean & Quinoa Power Bowl", meal: "dinner", context: "Thursday, July 16 (Day 4, vegetarian)", servings: 2, caloriesPerServing: 1018, proteinPerServing: 42, vegetarian: true, ingredients: ["1 can (15 oz) black beans, drained and rinsed (use the whole can)", "2/3 cup dry quinoa (cooks to ~2 cups)", "1 avocado, sliced", "3 cups mixed vegetables (corn, bell pepper, tomato)", "1/2 cup shredded cheddar cheese", "Lime juice, cumin, chili powder, salt to taste"], instructions: ["Cook quinoa according to package instructions.", "Warm black beans in a small pot with cumin, chili powder, splash of water.", "Sauté mixed vegetables until tender, about 5 minutes.", "Build the bowl: quinoa, beans, vegetables, avocado, cheese.", "Squeeze lime juice over everything before serving."], notes: "Highest-calorie dinner of the week on purpose, meatless protein sources run lower density." },
  { id: "chicken-fajita", name: "Chicken Fajita Bowl", meal: "dinner", context: "Friday, July 17 (Day 5)", servings: 2, caloriesPerServing: 1030, proteinPerServing: 80, ingredients: ["14 oz boneless, skinless chicken breast, sliced into strips", "2 bell peppers, sliced", "1 onion, sliced", "4 (8-inch) flour tortillas", "1/2 cup shredded cheddar cheese", "2 tbsp olive oil", "Fajita seasoning (or chili powder + cumin + paprika + garlic powder)", "Salt to taste"], instructions: ["Heat olive oil in a large skillet over medium-high heat.", "Add chicken strips, season with fajita seasoning, cook 5-6 minutes until nearly done.", "Add bell pepper and onion, cook 4-5 more minutes until cooked through and tender-crisp.", "Warm tortillas.", "Build bowls or wraps with the chicken mixture, tortillas, and cheese."], notes: "Highest protein dinner of the week. Fast, and a strong favorite candidate." },
  { id: "grilled-sirloin", name: "Grilled Sirloin & Asparagus", meal: "dinner", context: "Saturday, July 18 (Day 6, full body day)", servings: 2, caloriesPerServing: 894, proteinPerServing: 68, ingredients: ["1 lb sirloin steak", "3 cups asparagus, trimmed", "2 medium potatoes, cubed or wedged", "3 tbsp olive oil", "Salt, pepper, garlic powder to taste"], instructions: ["Preheat grill or grill pan to high heat. Or roast the potato at 425°F for 20 min while searing the steak.", "Season steak, grill or sear 3-4 minutes per side for medium.", "Toss asparagus with oil, salt, pepper. Grill or roast 6-8 minutes until tender.", "Rest steak 5 minutes before slicing. Serve with asparagus and potato."], notes: "A little more effort, worth it. Good candidate for a favorite if you like a classic steak night." },
  { id: "lentil-curry", name: "Lentil Curry", meal: "dinner", context: "Sunday, July 19 (Day 7, rest + shopping + prep day, vegetarian)", servings: 2, caloriesPerServing: 961, proteinPerServing: 38, vegetarian: true, ingredients: ["2.5 cups dry lentils (cooks to ~6 cups)", "1 cup light coconut milk", "1 onion, diced", "3 cups mixed vegetables (cauliflower, spinach, or carrots)", "1.5 cups dry brown rice (cooks to ~3 cups)", "2 tbsp curry powder", "2 cloves garlic, minced", "Salt to taste"], instructions: ["Cook brown rice according to package instructions.", "Sauté onion and garlic until soft, about 3 minutes.", "Add lentils, curry powder, and ~3 cups water. Simmer 20-25 minutes until tender.", "Stir in coconut milk and vegetables, simmer 5 more minutes.", "Serve over rice."], notes: "Your batch-prep day recipe, intentionally low-effort and mostly hands-off. This Sunday slot is the standing shopping + prep day every week." },
  { id: "turkey-meatball-bowl", name: "Turkey Meatball & Rice Bowl", meal: "lunch", context: "Monday 8/10 through Friday 8/14 (batch cook once)", servings: 5, caloriesPerServing: 650, proteinPerServing: 62, ingredients: ["2 lb ground turkey (93/7)", "1/3 cup breadcrumbs", "1 large egg", "2 cloves garlic, minced", "Italian seasoning, salt, pepper to taste", "2.5 cups dry white rice (cooks to about 5 cups)", "3 cups green beans, steamed"], instructions: ["Preheat oven to 400°F.", "Mix turkey, breadcrumbs, egg, garlic, and seasoning. Form into 20 meatballs.", "Bake meatballs 18-20 minutes until they reach 165°F internally.", "Cook rice according to package instructions. Steam green beans until just tender, about 5 minutes.", "Divide meatballs (4 per portion), rice, and green beans into 5 containers, refrigerate.", "Reheat about 1:30 in the microwave each day at lunch."], notes: "Batch-cook once during the Sunday prep session. Freezes well if you want to stretch extra portions." },
  { id: "chicken-quinoa-bowl", name: "Grilled Chicken & Quinoa Bowl", meal: "lunch", context: "Saturday 8/15 and Sunday 8/16", servings: 2, caloriesPerServing: 600, proteinPerServing: 58, ingredients: ["12 oz boneless, skinless chicken breast", "1 cup dry quinoa (cooks to about 3 cups)", "2 cups mixed vegetables (bell pepper, cucumber, tomato)", "1 avocado, sliced", "Olive oil, lemon juice, salt, pepper to taste"], instructions: ["Season chicken breast, grill or pan-sear 5-6 minutes per side until it reaches 165°F.", "Cook quinoa according to package instructions.", "Slice chicken, build bowls with quinoa, chicken, vegetables, and avocado.", "Drizzle with olive oil and lemon juice."], notes: "Fresh-cooked, not batched, a quick 20-minute prep for Saturday and Sunday." },
  { id: "teriyaki-salmon", name: "Teriyaki Salmon & Broccoli Rice Bowl", meal: "dinner", context: "Monday, August 10 (Day 8)", servings: 2, caloriesPerServing: 910, proteinPerServing: 62, ingredients: ["14 oz salmon fillet", "1/3 cup teriyaki sauce", "1.5 cups dry white rice (cooks to about 3 cups)", "4 cups broccoli florets", "1 tsp sesame seeds (optional)"], instructions: ["Marinate salmon in teriyaki sauce 10-15 minutes.", "Preheat oven to 400°F, bake salmon 12-15 minutes until it flakes easily.", "Cook rice according to package instructions, steam broccoli about 5 minutes.", "Serve salmon over rice with broccoli, drizzle extra teriyaki sauce, sprinkle sesame seeds."], notes: "Salmon fillet thickness varies, adjust bake time so it just flakes without drying out." },
  { id: "turkey-zucchini-stirfry", name: "Turkey & Zucchini Stir-Fry", meal: "dinner", context: "Tuesday, August 11 (Day 9)", servings: 2, caloriesPerServing: 850, proteinPerServing: 50, ingredients: ["12 oz ground turkey (93/7)", "2 medium zucchini, sliced", "1.5 cups dry white rice (cooks to about 3 cups)", "3 tbsp soy sauce or coconut aminos", "2 cloves garlic, minced", "1.5 tbsp olive oil"], instructions: ["Cook rice according to package instructions.", "Brown ground turkey in a skillet, about 5-6 minutes.", "Add garlic and zucchini, stir-fry 4-5 minutes until tender.", "Add soy sauce, toss to coat, serve over rice."], notes: "Swap zucchini for any quick-cooking vegetable you have on hand." },
  { id: "herb-chicken-thighs", name: "Herb Chicken Thighs & Green Beans", meal: "dinner", context: "Wednesday, August 12 (Day 10, rest day)", servings: 2, caloriesPerServing: 820, proteinPerServing: 58, ingredients: ["4 boneless, skinless chicken thighs (~14 oz)", "3 cups green beans, trimmed", "2 medium sweet potatoes, cubed", "2 tbsp olive oil", "Rosemary, thyme, garlic powder, salt, pepper to taste"], instructions: ["Preheat oven to 425°F.", "Toss sweet potatoes with half the oil, salt, and pepper. Roast 15 minutes.", "Season chicken thighs with herbs and the remaining oil.", "Add chicken and green beans to the sheet pan, roast 20-25 minutes more until chicken reaches 165°F."], notes: "Rest day, but the sheet pan does most of the work." },
  { id: "chickpea-spinach-curry", name: "Chickpea & Spinach Curry Bowl", meal: "dinner", context: "Thursday, August 13 (Day 11, vegetarian)", servings: 2, caloriesPerServing: 980, proteinPerServing: 38, vegetarian: true, ingredients: ["2 cans (15 oz each) chickpeas, drained and rinsed", "3 cups baby spinach", "1 cup light coconut milk", "1.5 cups dry white rice (cooks to about 3 cups)", "1 onion, diced", "1 tbsp curry powder", "2 cloves garlic, minced"], instructions: ["Cook rice according to package instructions.", "Sauté onion and garlic until soft, about 3 minutes.", "Add chickpeas and curry powder, cook 2 minutes.", "Stir in coconut milk, simmer 8-10 minutes.", "Fold in spinach until wilted, serve over rice."], notes: "Highest-calorie vegetarian dinner of the week, chickpeas and coconut milk carry the calories since meatless protein runs lower density." },
  { id: "turkey-taco-bowl", name: "Turkey Taco Bowl", meal: "dinner", context: "Friday, August 14 (Day 12)", servings: 2, caloriesPerServing: 1000, proteinPerServing: 75, ingredients: ["1.5 lb ground turkey (93/7)", "1.5 cups dry white rice (cooks to about 3 cups)", "1/2 cup shredded cheddar cheese", "1 can (15 oz) black beans, drained and rinsed", "Taco seasoning (or chili powder + cumin + paprika + garlic powder)", "Salsa, to taste"], instructions: ["Cook rice according to package instructions.", "Brown ground turkey in a skillet, breaking it up, 6-7 minutes.", "Add taco seasoning and black beans, cook 3-4 minutes more.", "Build bowls with rice, turkey mixture, cheese, and salsa."], notes: "Highest protein dinner of the week, the doubled meat portion carries it." },
  { id: "flank-steak-sweet-potato", name: "Grilled Flank Steak & Sweet Potato", meal: "dinner", context: "Saturday, August 15 (Day 13, full body day)", servings: 2, caloriesPerServing: 900, proteinPerServing: 70, ingredients: ["1 lb flank steak", "2 medium sweet potatoes, cubed", "3 cups asparagus, trimmed", "2 tbsp olive oil", "Salt, pepper, garlic powder to taste"], instructions: ["Preheat oven to 425°F. Toss sweet potatoes with oil, salt, pepper, roast 15 minutes.", "Season flank steak, grill or sear 4-5 minutes per side for medium.", "Add asparagus to the sheet pan for the last 8-10 minutes of roasting.", "Rest steak 5 minutes, slice against the grain, serve with sweet potato and asparagus."], notes: "Slice thin and against the grain, flank steak toughens fast if cut with it." },
  { id: "white-bean-veg-stew", name: "White Bean & Vegetable Stew", meal: "dinner", context: "Sunday, August 16 (Day 14, rest + shopping + prep day, vegetarian)", servings: 2, caloriesPerServing: 950, proteinPerServing: 34, vegetarian: true, ingredients: ["2 cans (15 oz each) white beans (cannellini or great northern), drained and rinsed", "2 medium potatoes, cubed", "3 cups mixed vegetables (carrots, celery, kale)", "2 cups vegetable broth", "1 onion, diced", "2 cloves garlic, minced", "1 tbsp olive oil, herbs to taste"], instructions: ["Sauté onion and garlic in olive oil until soft, about 3 minutes.", "Add potatoes, mixed vegetables, and broth. Simmer 20-25 minutes until vegetables are tender.", "Stir in white beans, simmer 5 more minutes. Mash a few beans against the pot side to thicken if you like."], notes: "This week's batch-prep day recipe, low-effort and mostly hands-off while you shop and cook for next week." },
];

export const WEEK_1: WorkoutDay[] = [
  { date: "2026-07-13", dayNumber: 1, dayLabel: "Monday", shortLabel: "Mon", focusTitle: "FOCUS: LEGS", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Bicep Curls (backpack)" }, { part: "Legs", movement: "Glute Bridges (bodyweight)" }, { part: "Abs", movement: "Plank (20-30 sec)" }, { part: "Back", movement: "Banded Bent-Over Rows*" }], focusSet: "Bodyweight Squats", estCalories: 2142, estProtein: 213, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Steak & Rice Bowl", recipeId: "steak-rice-bowl" }, dinner: { name: "Sheet-Pan Lemon Chicken", recipeId: "lemon-chicken" } } },
  { date: "2026-07-14", dayNumber: 2, dayLabel: "Tuesday", shortLabel: "Tue", focusTitle: "FOCUS: ARMS/CHEST", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Kneeling Push-Ups" }, { part: "Legs", movement: "Reverse Lunges (bodyweight)" }, { part: "Abs", movement: "Leg Raises (floor)" }, { part: "Back", movement: "Doorway Isometric Pulls" }], focusSet: "Chair Dips", estCalories: 2138, estProtein: 187, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Steak & Rice Bowl", recipeId: "steak-rice-bowl" }, dinner: { name: "Beef & Broccoli Stir-Fry", recipeId: "beef-broccoli" } } },
  { date: "2026-07-15", dayNumber: 3, dayLabel: "Wednesday", shortLabel: "Wed", focusTitle: "REST DAY", isRest: true, isShoppingDay: false, isPrepDay: false, exercises: [], restNote: "Optional light movement: walk, stretch, mobility work. This is recovery, not a day off from eating well.", estCalories: 1997, estProtein: 202, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Steak & Rice Bowl", recipeId: "steak-rice-bowl" }, dinner: { name: "Garlic Pork Tenderloin", recipeId: "pork-tenderloin" } } },
  { date: "2026-07-16", dayNumber: 4, dayLabel: "Thursday", shortLabel: "Thu", focusTitle: "FOCUS: ABS", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Incline Push-Ups" }, { part: "Legs", movement: "Step-Ups (chair)" }, { part: "Abs", movement: "Penguins" }, { part: "Back", movement: "Supermans" }], focusSet: "Dead Bugs", estCalories: 2235, estProtein: 184, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Steak & Rice Bowl", recipeId: "steak-rice-bowl" }, dinner: { name: "Black Bean Quinoa Bowl (veg)", recipeId: "black-bean-quinoa" } } },
  { date: "2026-07-17", dayNumber: 5, dayLabel: "Friday", shortLabel: "Fri", focusTitle: "FOCUS: BACK", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Kneeling Push-Ups" }, { part: "Legs", movement: "Calf Raises (bodyweight)" }, { part: "Abs", movement: "Crunches" }, { part: "Back", movement: "Backpack Bent-Over Rows" }], focusSet: "Reverse Snow Angels", estCalories: 2248, estProtein: 222, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Steak & Rice Bowl", recipeId: "steak-rice-bowl" }, dinner: { name: "Chicken Fajita Bowl", recipeId: "chicken-fajita" } } },
  { date: "2026-07-18", dayNumber: 6, dayLabel: "Saturday", shortLabel: "Sat", focusTitle: "FULL BODY", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Chair Dips" }, { part: "Legs", movement: "Reverse Lunges (bodyweight)" }, { part: "Abs", movement: "Leg Raises (floor)" }, { part: "Back", movement: "Doorway Isometric Pulls" }], estCalories: 2053, estProtein: 200, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Rotisserie Chicken Bowl", recipeId: "rotisserie-bowl" }, dinner: { name: "Grilled Sirloin & Asparagus", recipeId: "grilled-sirloin" } } },
  { date: "2026-07-19", dayNumber: 7, dayLabel: "Sunday", shortLabel: "Sun", focusTitle: "REST DAY", isRest: true, isShoppingDay: true, isPrepDay: true, prepNote: "Shopping + prep day. Buy the week's groceries and batch-cook next week's steak lunches and egg muffins so Monday's breakfast and lunch are ready.", exercises: [], restNote: "Optional light movement. Also your weekly shopping + batch-prep day: cook next week's Mon-Fri lunch steak + egg muffins today.", estCalories: 2120, estProtein: 170, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Rotisserie Chicken Bowl", recipeId: "rotisserie-bowl" }, dinner: { name: "Lentil Curry (veg)", recipeId: "lentil-curry" } } },
];

export const WEEK_2: WorkoutDay[] = [
  { date: "2026-08-10", dayNumber: 8, dayLabel: "Monday", shortLabel: "Mon", focusTitle: "FOCUS: LEGS", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Bicep Curls (backpack)" }, { part: "Legs", movement: "Glute Bridges (bodyweight)" }, { part: "Abs", movement: "Plank (20-30 sec)" }, { part: "Back", movement: "Banded Bent-Over Rows*" }], focusSet: "Bodyweight Squats", estCalories: 2092, estProtein: 200, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Turkey Meatball & Rice Bowl", recipeId: "turkey-meatball-bowl" }, dinner: { name: "Teriyaki Salmon & Broccoli Rice Bowl", recipeId: "teriyaki-salmon" } } },
  { date: "2026-08-11", dayNumber: 9, dayLabel: "Tuesday", shortLabel: "Tue", focusTitle: "FOCUS: ARMS/CHEST", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Kneeling Push-Ups" }, { part: "Legs", movement: "Reverse Lunges (bodyweight)" }, { part: "Abs", movement: "Leg Raises (floor)" }, { part: "Back", movement: "Doorway Isometric Pulls" }], focusSet: "Chair Dips", estCalories: 2032, estProtein: 188, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Turkey Meatball & Rice Bowl", recipeId: "turkey-meatball-bowl" }, dinner: { name: "Turkey & Zucchini Stir-Fry", recipeId: "turkey-zucchini-stirfry" } } },
  { date: "2026-08-12", dayNumber: 10, dayLabel: "Wednesday", shortLabel: "Wed", focusTitle: "REST DAY", isRest: true, isShoppingDay: false, isPrepDay: false, exercises: [], restNote: "Optional light movement: walk, stretch, mobility work. This is recovery, not a day off from eating well.", estCalories: 2002, estProtein: 196, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Turkey Meatball & Rice Bowl", recipeId: "turkey-meatball-bowl" }, dinner: { name: "Herb Chicken Thighs & Green Beans", recipeId: "herb-chicken-thighs" } } },
  { date: "2026-08-13", dayNumber: 11, dayLabel: "Thursday", shortLabel: "Thu", focusTitle: "FOCUS: ABS", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Incline Push-Ups" }, { part: "Legs", movement: "Step-Ups (chair)" }, { part: "Abs", movement: "Penguins" }, { part: "Back", movement: "Supermans" }], focusSet: "Dead Bugs", estCalories: 2162, estProtein: 176, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Turkey Meatball & Rice Bowl", recipeId: "turkey-meatball-bowl" }, dinner: { name: "Chickpea & Spinach Curry Bowl (veg)", recipeId: "chickpea-spinach-curry" } } },
  { date: "2026-08-14", dayNumber: 12, dayLabel: "Friday", shortLabel: "Fri", focusTitle: "FOCUS: BACK", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Kneeling Push-Ups" }, { part: "Legs", movement: "Calf Raises (bodyweight)" }, { part: "Abs", movement: "Crunches" }, { part: "Back", movement: "Backpack Bent-Over Rows" }], focusSet: "Reverse Snow Angels", estCalories: 2182, estProtein: 213, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Turkey Meatball & Rice Bowl", recipeId: "turkey-meatball-bowl" }, dinner: { name: "Turkey Taco Bowl", recipeId: "turkey-taco-bowl" } } },
  { date: "2026-08-15", dayNumber: 13, dayLabel: "Saturday", shortLabel: "Sat", focusTitle: "FULL BODY", isRest: false, isShoppingDay: false, isPrepDay: false, exercises: [{ part: "Arms/Chest", movement: "Chair Dips" }, { part: "Legs", movement: "Reverse Lunges (bodyweight)" }, { part: "Abs", movement: "Leg Raises (floor)" }, { part: "Back", movement: "Doorway Isometric Pulls" }], estCalories: 2032, estProtein: 204, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Grilled Chicken & Quinoa Bowl", recipeId: "chicken-quinoa-bowl" }, dinner: { name: "Grilled Flank Steak & Sweet Potato", recipeId: "flank-steak-sweet-potato" } } },
  { date: "2026-08-16", dayNumber: 14, dayLabel: "Sunday", shortLabel: "Sun", focusTitle: "REST DAY", isRest: true, isShoppingDay: true, isPrepDay: true, prepNote: "Shopping + prep day. Buy next week's groceries and batch-cook next week's lunch + egg muffins so Monday's breakfast and lunch are ready.", exercises: [], restNote: "Optional light movement. Also your weekly shopping + batch-prep day: cook next week's Mon-Fri lunch + egg muffins today.", estCalories: 2082, estProtein: 168, meals: { breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" }, snack: { name: "Protein Shake", recipeId: "protein-shake" }, lunch: { name: "Grilled Chicken & Quinoa Bowl", recipeId: "chicken-quinoa-bowl" }, dinner: { name: "White Bean & Vegetable Stew (veg)", recipeId: "white-bean-veg-stew" } } },
];

export const ALL_DAYS: WorkoutDay[] = [...WEEK_1, ...WEEK_2];

export type GroceryItem = { section: string; label: string; qty: string };

export const GROCERY_LIST: GroceryItem[] = [
  { section: "Protein", label: "Sirloin steak (or chuck roast)", qty: "4 lb — Thu-Mon lunch batch + Tue dinner (dinner now 1 lb for 2)" },
  { section: "Protein", label: "Boneless, skinless chicken breast", qty: "1.75 lb — Thu + Mon dinners (2 servings each)" },
  { section: "Protein", label: "90/10 ground beef", qty: "1 lb — Fri dinner (2 servings)" },
  { section: "Protein", label: "Pork tenderloin", qty: "1 lb — Sat dinner (2 servings)" },
  { section: "Protein", label: "Whole rotisserie chicken", qty: "1 — Tue + Wed lunch" },
  { section: "Protein", label: "Lean ground turkey or turkey breakfast sausage", qty: "1.5 lb — egg muffins" },
  { section: "Protein", label: "Eggs", qty: "2 dozen" },
  { section: "Protein", label: "Liquid egg whites", qty: "1 carton (32 oz)" },
  { section: "Protein", label: "Chocolate protein powder", qty: "1 container (~24g protein/scoop)" },
  { section: "Produce", label: "Red bell peppers", qty: "3" },
  { section: "Produce", label: "Yellow onions", qty: "3 medium" },
  { section: "Produce", label: "Baby spinach", qty: "1 bag (5 oz)" },
  { section: "Produce", label: "Broccoli", qty: "2 lb florets" },
  { section: "Produce", label: "Mixed roasting vegetables", qty: "4 lb (carrots/zucchini/squash)" },
  { section: "Produce", label: "Asparagus", qty: "2 bunches (~1.5 lb)" },
  { section: "Produce", label: "Avocados", qty: "2" },
  { section: "Produce", label: "Baby or gold potatoes", qty: "2 lb" },
  { section: "Produce", label: "Sweet potato", qty: "2 medium" },
  { section: "Produce", label: "Lemon", qty: "2" },
  { section: "Grains / Pantry", label: "White rice", qty: "1 lb bag" },
  { section: "Grains / Pantry", label: "Brown rice", qty: "12 oz" },
  { section: "Grains / Pantry", label: "Quinoa", qty: "smallest bag (~2/3 cup needed)" },
  { section: "Grains / Pantry", label: "Dry lentils", qty: "1 lb bag" },
  { section: "Grains / Pantry", label: "Black beans", qty: "1 can (15 oz)" },
  { section: "Grains / Pantry", label: "Light coconut milk", qty: "1 can (13.5 oz)" },
  { section: "Grains / Pantry", label: "8-inch flour tortillas", qty: "1 pack (need 4)" },
  { section: "Grains / Pantry", label: "Olive oil", qty: "~1/2 cup total this week" },
  { section: "Dairy", label: "Shredded cheddar cheese", qty: "12 oz bag" },
  { section: "Seasoning check", label: "Garlic (fresh or powder)", qty: "" },
  { section: "Seasoning check", label: "Paprika", qty: "" },
  { section: "Seasoning check", label: "Chili powder or fajita seasoning", qty: "" },
  { section: "Seasoning check", label: "Curry powder", qty: "" },
  { section: "Seasoning check", label: "Salt & pepper", qty: "" },
];

export const GROCERY_LIST_WEEK_2: GroceryItem[] = [
  { section: "Protein", label: "Ground turkey (93/7)", qty: "4.25 lb — lunch batch + Tue stir-fry + Fri tacos" },
  { section: "Protein", label: "Salmon fillet", qty: "14 oz — Mon dinner" },
  { section: "Protein", label: "Boneless, skinless chicken thighs", qty: "14 oz — Wed dinner" },
  { section: "Protein", label: "Boneless, skinless chicken breast", qty: "12 oz — Sat/Sun lunch" },
  { section: "Protein", label: "Flank steak", qty: "1 lb — Sat dinner" },
  { section: "Protein", label: "Eggs", qty: "2 dozen" },
  { section: "Protein", label: "Liquid egg whites", qty: "1 carton (32 oz)" },
  { section: "Protein", label: "Chocolate protein powder", qty: "1 container (~24g protein/scoop)" },
  { section: "Protein", label: "Lean ground turkey or turkey breakfast sausage", qty: "1.5 lb — egg muffins" },
  { section: "Produce", label: "Zucchini", qty: "2 medium" },
  { section: "Produce", label: "Green beans", qty: "1.5 lb (Mon-Fri batch + Wed dinner)" },
  { section: "Produce", label: "Broccoli", qty: "4 cups florets" },
  { section: "Produce", label: "Sweet potatoes", qty: "4 medium" },
  { section: "Produce", label: "Asparagus", qty: "1 bunch (~0.75 lb)" },
  { section: "Produce", label: "Baby spinach", qty: "1 bag (5 oz), plus what's left from Week 1 if any" },
  { section: "Produce", label: "Onions", qty: "2 medium" },
  { section: "Produce", label: "Bell pepper, cucumber, tomato (mixed)", qty: "2 cups worth" },
  { section: "Produce", label: "Avocados", qty: "1" },
  { section: "Produce", label: "Carrots, celery, kale (mixed)", qty: "3 cups worth" },
  { section: "Produce", label: "Potatoes (regular)", qty: "2 medium" },
  { section: "Grains / Pantry", label: "White rice", qty: "1.5 lb bag" },
  { section: "Grains / Pantry", label: "Quinoa", qty: "smallest bag (~1 cup needed)" },
  { section: "Grains / Pantry", label: "Breadcrumbs", qty: "1 small container (~1/3 cup needed)" },
  { section: "Grains / Pantry", label: "Chickpeas", qty: "2 cans (15 oz each)" },
  { section: "Grains / Pantry", label: "Black beans", qty: "1 can (15 oz)" },
  { section: "Grains / Pantry", label: "White beans (cannellini or great northern)", qty: "2 cans (15 oz each)" },
  { section: "Grains / Pantry", label: "Light coconut milk", qty: "1 can (13.5 oz)" },
  { section: "Grains / Pantry", label: "Vegetable broth", qty: "1 carton (2 cups needed)" },
  { section: "Grains / Pantry", label: "Teriyaki sauce", qty: "1 small bottle" },
  { section: "Grains / Pantry", label: "Soy sauce or coconut aminos", qty: "check what's on hand" },
  { section: "Grains / Pantry", label: "Salsa", qty: "1 small jar" },
  { section: "Grains / Pantry", label: "Olive oil", qty: "~1/3 cup total this week" },
  { section: "Dairy", label: "Shredded cheddar cheese", qty: "4 oz (on top of any left from Week 1)" },
  { section: "Seasoning check", label: "Garlic (fresh or powder)", qty: "" },
  { section: "Seasoning check", label: "Taco seasoning (or chili powder + cumin + paprika + garlic powder)", qty: "" },
  { section: "Seasoning check", label: "Curry powder", qty: "" },
  { section: "Seasoning check", label: "Rosemary, thyme", qty: "" },
  { section: "Seasoning check", label: "Sesame seeds (optional)", qty: "" },
  { section: "Seasoning check", label: "Salt & pepper", qty: "" },
];

// --- Stage 1 additions for auto-generation (additive only, not yet wired into any page) ---

export const WORKOUT_SET_A: Record<string, { exercises: Exercise[]; focusSet?: string }> = {
  Monday: { exercises: [
    { part: "Arms/Chest", movement: "Bicep Curls (backpack)" },
    { part: "Legs", movement: "Glute Bridges (bodyweight)" },
    { part: "Abs", movement: "Plank (20-30 sec)" },
    { part: "Back", movement: "Banded Bent-Over Rows*" },
  ], focusSet: "Bodyweight Squats" },
  Tuesday: { exercises: [
    { part: "Arms/Chest", movement: "Kneeling Push-Ups" },
    { part: "Legs", movement: "Reverse Lunges (bodyweight)" },
    { part: "Abs", movement: "Leg Raises (floor)" },
    { part: "Back", movement: "Doorway Isometric Pulls" },
  ], focusSet: "Chair Dips" },
  Thursday: { exercises: [
    { part: "Arms/Chest", movement: "Incline Push-Ups" },
    { part: "Legs", movement: "Step-Ups (chair)" },
    { part: "Abs", movement: "Penguins" },
    { part: "Back", movement: "Supermans" },
  ], focusSet: "Dead Bugs" },
  Friday: { exercises: [
    { part: "Arms/Chest", movement: "Kneeling Push-Ups" },
    { part: "Legs", movement: "Calf Raises (bodyweight)" },
    { part: "Abs", movement: "Crunches" },
    { part: "Back", movement: "Backpack Bent-Over Rows" },
  ], focusSet: "Reverse Snow Angels" },
  Saturday: { exercises: [
    { part: "Arms/Chest", movement: "Chair Dips" },
    { part: "Legs", movement: "Reverse Lunges (bodyweight)" },
    { part: "Abs", movement: "Leg Raises (floor)" },
    { part: "Back", movement: "Doorway Isometric Pulls" },
  ] },
};

export const WORKOUT_SET_B: Record<string, { exercises: Exercise[]; focusSet?: string }> = {
  Monday: { exercises: [
    { part: "Arms/Chest", movement: "Standard Push-Ups" },
    { part: "Legs", movement: "Goblet Squats (Kettlebell)" },
    { part: "Abs", movement: "Russian Twists (Kettlebell)" },
    { part: "Back", movement: "Kettlebell Single-Arm Rows" },
  ], focusSet: "Bulgarian Split Squats (Chair)" },
  Tuesday: { exercises: [
    { part: "Arms/Chest", movement: "Standard Push-Ups" },
    { part: "Legs", movement: "Bulgarian Split Squats (Chair)" },
    { part: "Abs", movement: "Leg Raises (floor)" },
    { part: "Back", movement: "Kettlebell Single-Arm Rows" },
  ], focusSet: "Kettlebell Swings" },
  Thursday: { exercises: [
    { part: "Arms/Chest", movement: "Kneeling Push-Ups" },
    { part: "Legs", movement: "Goblet Squats (Kettlebell)" },
    { part: "Abs", movement: "Russian Twists (Kettlebell)" },
    { part: "Back", movement: "Backpack Bent-Over Rows" },
  ], focusSet: "Kettlebell Swings" },
  Friday: { exercises: [
    { part: "Arms/Chest", movement: "Standard Push-Ups" },
    { part: "Legs", movement: "Bulgarian Split Squats (Chair)" },
    { part: "Abs", movement: "Russian Twists (Kettlebell)" },
    { part: "Back", movement: "Kettlebell Single-Arm Rows" },
  ], focusSet: "Goblet Squats (Kettlebell)" },
  Saturday: { exercises: [
    { part: "Arms/Chest", movement: "Standard Push-Ups" },
    { part: "Legs", movement: "Goblet Squats (Kettlebell)" },
    { part: "Abs", movement: "Russian Twists (Kettlebell)" },
    { part: "Back", movement: "Kettlebell Single-Arm Rows" },
  ] },
};

// Alternates every 2 weeks: weeks 1-2 = Set A, weeks 3-4 = Set B, weeks 5-6 = Set A, etc.
export function workoutSetForWeek(weekNumber: number): Record<string, { exercises: Exercise[]; focusSet?: string }> {
  const cycleIndex = Math.floor((weekNumber - 1) / 2) % 2;
  return cycleIndex === 0 ? WORKOUT_SET_A : WORKOUT_SET_B;
}
