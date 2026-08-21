// recipes.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Recipe Data Structure
   const recipesData = [
        // ==========================================
        // EVERYDAY MEALS (3 Recipes)
        // ==========================================
        {
            id: 1,
            category: "Everyday Meals",
            filterId: "everyday-meals",
            title: "Authentic Dal Tadka",
            time: "15 min",
            difficulty: "Easy",
            servings: "4",
            img: "Tadka daal.png",
            desc: "A fragrant finishing of cumin, garlic, red chilli and pure ghee turns simple dal into everyday comfort.",
            ingredients: [
                "1 cup Toor Dal (split pigeon peas), boiled",
                "2 tbsp Ghosh Dhara Traditional Ghee",
                "1 tsp Cumin seeds (Jeera)",
                "3-4 cloves Garlic, finely chopped",
                "2 Dried red chillies",
                "1/4 tsp Asafoetida (Hing)",
                "Fresh coriander for garnish"
            ],
            steps: [
                "Ensure your dal is boiled, mashed lightly, and seasoned with salt and turmeric.",
                "In a small pan, heat the Ghosh Dhara ghee over medium heat until it melts and warms through.",
                "Add cumin seeds and let them crackle.",
                "Add chopped garlic, dried red chillies, and hing. Sauté until the garlic turns golden brown.",
                "Immediately pour the hot tadka over the prepared dal. Stir gently and garnish with coriander."
            ],
            gheeMoment: "The final tadka—sizzling the earthy spices in pure, hot ghee before pouring it over the lentils releases maximum aroma and transforms the dish."
        },
        {
            id: 5,
            category: "Everyday Meals",
            filterId: "everyday-meals",
            title: "Crisp Ghee Phulka",
            time: "15 min",
            difficulty: "Easy",
            servings: "8-10 Phulkas",
            img: "Roti.png",
            desc: "Freshly puffed rotis finished with melted ghee—the small ritual that makes a meal feel like home.",
            ingredients: [
                "2 cups Whole wheat flour (Atta)",
                "Water as needed for kneading",
                "Ghosh Dhara Traditional Ghee for smearing",
                "A pinch of salt (optional)"
            ],
            steps: [
                "Knead the flour and water into a soft, pliable dough. Let it rest for 15 minutes.",
                "Pinch out small lemon-sized balls and roll them into thin, even circles.",
                "Heat a tawa (griddle). Cook the roti on one side until slight bubbles appear, flip, and cook the other side.",
                "Place directly over the open flame (or use a kitchen towel on the tawa) until it puffs up entirely.",
                "Remove from heat and immediately place on a plate."
            ],
            gheeMoment: "While the phulka is still steaming hot, spread a half-teaspoon of ghee over the surface. It melts instantly, keeping the bread soft for hours and adding a sweet, toasted aroma."
        },
        {
            id: 7,
            category: "Everyday Meals",
            filterId: "everyday-meals",
            title: "Bengali Musur Dal",
            time: "20 min",
            difficulty: "Easy",
            servings: "4",
            img: "Musur daal.png",
            desc: "A staple in every Bengali household, this light red lentil soup is elevated with panch phoron and pure ghee.",
            ingredients: [
                "1 cup Red Lentils (Musur Dal), washed",
                "1 tbsp Mustard Oil (for tempering)",
                "1 tbsp Ghosh Dhara Traditional Ghee",
                "1/2 tsp Panch Phoron (Bengali five-spice)",
                "2 Dried red chillies",
                "1/2 tsp Turmeric powder",
                "Fresh green chillies and coriander"
            ],
            steps: [
                "Boil the washed musur dal with water, salt, turmeric, and slit green chillies until completely soft.",
                "In a separate small pan, heat mustard oil. Add panch phoron and dried red chillies, letting them crackle.",
                "Pour the tempering over the boiling dal and stir well.",
                "Turn off the heat, add the ghee, and cover immediately with a lid to trap the aroma."
            ],
            gheeMoment: "Stirring in a spoonful of our Krishnanagar ghee right after taking the dal off the heat rounds out the sharp mustard oil tempering, bringing a comforting, buttery aroma to the table."
        },

        // ==========================================
        // QUICK COMFORT FOOD (3 Recipes)
        // ==========================================
        {
            id: 2,
            category: "Quick Comfort Food",
            filterId: "quick-comfort-food",
            title: "Comforting Moong Dal Khichdi",
            time: "30 min",
            difficulty: "Easy",
            servings: "3",
            img: "Khichdi.png",
            desc: "Soft, nourishing and deeply satisfying—made complete with a generous spoonful of Ghosh Dhara ghee.",
            ingredients: [
                "1/2 cup Basmati rice, washed",
                "1/2 cup Yellow Moong Dal, washed",
                "3 tbsp Ghosh Dhara Traditional Ghee (divided)",
                "1 tsp Cumin seeds",
                "1/2 tsp Turmeric powder",
                "Salt to taste",
                "4 cups Water"
            ],
            steps: [
                "In a pressure cooker, heat 1 tbsp of ghee. Add cumin seeds and let them splutter.",
                "Add the washed rice and moong dal. Sauté for a minute to coat the grains in ghee.",
                "Add water, turmeric, and salt. Close the lid and cook for 3-4 whistles until very soft.",
                "Allow the pressure to release naturally. Open and stir to achieve a porridge-like consistency."
            ],
            gheeMoment: "Stir in a generous tablespoon of fresh ghee right after taking it off the heat for a velvety, rich, and deeply comforting finish."
        },
        {
            id: 8,
            category: "Quick Comfort Food",
            filterId: "quick-comfort-food",
            title: "Ghee Gorom Bhaat & Aloo Bhaate",
            time: "10 min",
            difficulty: "Easy",
            servings: "1",
            img: "Alu vat.png",
            desc: "The ultimate Bengali soul food: steaming hot rice and mashed potatoes, brought to life with golden ghee.",
            ingredients: [
                "1 cup Steaming hot white rice",
                "1 large Potato, boiled until very soft",
                "1 Dry red chilli, dry-roasted until charred",
                "1 tbsp Ghosh Dhara Traditional Ghee",
                "Pinch of salt"
            ],
            steps: [
                "Serve the freshly steamed hot rice on a plate.",
                "In a small bowl, crumble the roasted dry red chilli with salt, then mash it thoroughly into the boiled potato.",
                "Create a small well in the center of the hot rice and pour in the ghee.",
                "Mix the ghee-infused rice with the spicy aloo bhaate using your hands, and enjoy immediately."
            ],
            gheeMoment: "When the pure ghee melts into the steaming hot rice, it releases an aroma that instantly transports you to childhood dinners at your grandmother's table."
        },
        {
            id: 9,
            category: "Quick Comfort Food",
            filterId: "quick-comfort-food",
            title: "Ghee Chire Bhaja",
            time: "10 min",
            difficulty: "Easy",
            servings: "2",
            img: "Chire bhaja.png",
            desc: "A crispy, savory evening snack of flattened rice roasted in ghee with crunchy peanuts and fresh green chillies.",
            ingredients: [
                "2 cups Thick flattened rice (Chire/Poha)",
                "2 tbsp Ghosh Dhara Traditional Ghee",
                "1/4 cup Raw peanuts",
                "2 Slit green chillies",
                "8-10 Curry leaves",
                "Salt and a pinch of sugar to taste"
            ],
            steps: [
                "Heat the ghee in a wide kadhai or pan.",
                "Fry the raw peanuts in the ghee until golden brown, then temporarily remove them to a plate.",
                "In the remaining ghee, add curry leaves and slit green chillies. Let them sizzle.",
                "Add the chire and roast continuously on low heat for 5-7 minutes until completely crisp.",
                "Toss the peanuts back in, season with salt and sugar, mix well, and serve with hot tea."
            ],
            gheeMoment: "Roasting the chire slowly in ghee instead of dry-roasting coats every flake in a rich, buttery layer, making it the perfect crunchy companion to a hot cup of evening tea."
        },

        // ==========================================
        // TRADITIONAL RECIPES (3 Recipes)
        // ==========================================
        {
            id: 4,
            category: "Traditional Recipes",
            filterId: "traditional-recipes",
            title: "Ghee Jeera Rice",
            time: "20 min",
            difficulty: "Easy",
            servings: "4",
            img: "Jeera rice.png",
            desc: "Fragrant basmati, crackling cumin and warm ghee for a simple side that never feels ordinary.",
            ingredients: [
                "1 cup Long-grain Basmati rice, soaked for 20 mins",
                "2 tbsp Ghosh Dhara Traditional Ghee",
                "1.5 tsp Cumin seeds (Jeera)",
                "1 Bay leaf",
                "2 cups Water",
                "Salt to taste"
            ],
            steps: [
                "Drain the soaked rice completely.",
                "Heat ghee in a pan or pot over medium heat. Add the bay leaf and cumin seeds.",
                "Once the cumin crackles and turns fragrant, add the drained rice. Sauté gently for 2 minutes to toast the grains.",
                "Add water and salt. Bring to a boil, then cover and simmer on low heat for 10-12 minutes.",
                "Turn off heat, let it rest for 5 minutes, then fluff gently with a fork."
            ],
            gheeMoment: "Toasting the raw rice grains directly in warm ghee before boiling seals in the starch, preventing stickiness and infusing every grain with nutty richness."
        },
        {
            id: 10,
            category: "Traditional Recipes",
            filterId: "traditional-recipes",
            title: "Bengali Basanti Pulao",
            time: "35 min",
            difficulty: "Medium",
            servings: "4",
            img: "basanti pulao.png",
            desc: "A fragrant, sweet, and bright yellow Gobindobhog rice pilaf that is the centerpiece of any traditional Bengali celebration.",
            ingredients: [
                "1 cup Gobindobhog rice, washed and air-dried",
                "3 tbsp Ghosh Dhara Traditional Ghee",
                "1 tsp Ginger paste",
                "1/2 tsp Turmeric powder",
                "Whole spices: 3 cloves, 3 cardamom pods, 1 cinnamon stick, 1 bay leaf",
                "Cashews and raisins",
                "2 tbsp Sugar and Salt to taste"
            ],
            steps: [
                "In a bowl, gently rub the dried rice with 1 tbsp of ghee, turmeric, and ginger paste. Let it marinate for 15 minutes.",
                "Heat the remaining ghee in a heavy-bottomed pan. Fry the cashews and raisins, then set them aside.",
                "In the same ghee, add the whole spices. Once aromatic, add the marinated rice and sauté gently for 3-4 minutes.",
                "Pour in exactly 2 cups of warm water. Add salt and sugar. Cover and cook on a very low flame until the water is absorbed.",
                "Garnish with the fried nuts and let it rest for 10 minutes before fluffing."
            ],
            gheeMoment: "Massaging the raw Gobindobhog rice with ghee before cooking ensures every single grain remains separate, glossy, and deeply infused with a rich, nutty sweetness."
        },
        {
            id: 11,
            category: "Traditional Recipes",
            filterId: "traditional-recipes",
            title: "Classic Bengali Shukto",
            time: "40 min",
            difficulty: "Hard",
            servings: "4",
            img: "sukto.png",
            desc: "A delicate, milk-based vegetable medley with a hint of bitterness, traditionally served as the palate-cleansing first course.",
            ingredients: [
                "Mixed chopped veggies: Bitter gourd (Korola), Raw banana, Sweet potato, Drumsticks",
                "1/4 cup Bori (Sun-dried lentil dumplings)",
                "1 tbsp Mustard paste & 1 tsp Ginger paste",
                "1/2 cup Milk",
                "1 tsp Radhuni (Celery seeds) and 1 Bay leaf for tempering",
                "2 tbsp Ghosh Dhara Traditional Ghee"
            ],
            steps: [
                "Lightly fry the bori in oil until golden and set aside. Fry the bitter gourd pieces and set aside.",
                "In the same pan, heat a little oil and temper with radhuni and a bay leaf.",
                "Add all the remaining vegetables, ginger paste, and sauté for 5 minutes.",
                "Add water and simmer until veggies are tender. Stir in the mustard paste and milk, bringing it to a gentle boil.",
                "Add the fried bitter gourd and bori. Turn off the heat and generously drizzle the ghee over the top."
            ],
            gheeMoment: "The final drizzle of ghee over the simmering milk broth tames the slight bitterness of the korola, bringing a silken, luxurious texture to this traditional palate cleanser."
        },

        // ==========================================
        // FESTIVE COOKING (3 Recipes)
        // ==========================================
        {
            id: 3,
            category: "Festive Cooking",
            filterId: "festive-cooking",
            title: "Besan Ladoo",
            time: "45 min",
            difficulty: "Medium",
            servings: "12 Ladoos",
            img: "laddu.png",
            desc: "Slow-roasted besan, golden ghee and cardamom come together in a timeless festive favourite.",
            ingredients: [
                "2 cups Gram flour (Besan), coarse preferred",
                "1/2 cup Ghosh Dhara Traditional Ghee",
                "1 cup Powdered sugar (Boora)",
                "1/2 tsp Cardamom powder",
                "Chopped almonds and pistachios for garnish"
            ],
            steps: [
                "Melt ghee in a heavy-bottomed pan on low heat. Add the besan.",
                "Roast continuously on low heat for 20-25 minutes until the besan turns golden and releases a nutty aroma.",
                "Turn off the heat and let the mixture cool slightly until warm to the touch (not entirely cold).",
                "Add powdered sugar, cardamom, and nuts. Mix thoroughly by hand.",
                "Take small portions and roll them tightly into smooth round ladoos."
            ],
            gheeMoment: "The slow roasting process relies entirely on the quality of the ghee. As the besan cooks, the ghee separates slightly, creating the signature melt-in-the-mouth texture."
        },
        {
            id: 6,
            category: "Festive Cooking",
            filterId: "festive-cooking",
            title: "Nolen Gur Payesh",
            time: "40 min",
            difficulty: "Medium",
            servings: "4-6",
            img: "Payes.png",
            desc: "Creamy rice pudding with the deep caramel notes of nolen gur and the richness of traditional ghee.",
            ingredients: [
                "1 litre Full-fat milk",
                "1/4 cup Gobindobhog rice, washed and dried",
                "1 tbsp Ghosh Dhara Traditional Ghee",
                "1/2 cup Nolen Gur (Date Palm Jaggery), crushed",
                "Cashews and raisins for garnish"
            ],
            steps: [
                "Smear the washed and air-dried rice grains thoroughly with the ghee.",
                "In a heavy-bottomed pan, bring the milk to a boil. Reduce heat and simmer until slightly thickened.",
                "Add the ghee-coated rice to the boiling milk. Stir frequently to prevent sticking.",
                "Cook on low heat until the rice is completely tender and the milk is reduced and creamy (about 25 mins).",
                "Turn off the heat. Let it cool for 2 minutes before stirring in the nolen gur (to prevent curdling). Garnish with nuts."
            ],
            gheeMoment: "Coating the fragrant raw rice in ghee before cooking prevents the grains from breaking down into mush, giving the pudding a superior, luxurious texture."
        },
        {
            id: 12,
            category: "Festive Cooking",
            filterId: "festive-cooking",
            title: "Kheer Patishapta",
            time: "45 min",
            difficulty: "Medium",
            servings: "8 Crepes",
            img: "patisapta.png",
            desc: "Golden, lacy rice flour crepes filled with a rich milk fudge, pan-roasted to perfection in pure ghee.",
            ingredients: [
                "Batter: 1 cup Rice flour, 1/2 cup All-purpose flour (Maida), 1/4 cup Semolina (Sooji), Milk to mix",
                "Filling: 1 cup Kheer/Khoa (reduced milk fudge), 3 tbsp Nolen Gur",
                "2-3 tbsp Ghosh Dhara Traditional Ghee for roasting"
            ],
            steps: [
                "Mix the rice flour, maida, sooji, and milk to create a smooth, lump-free pouring batter. Let it rest for 30 minutes.",
                "In a small pan, gently heat the kheer and fold in the nolen gur until it forms a sticky, sweet filling.",
                "Heat a flat non-stick or iron tawa and generously brush it with ghee.",
                "Pour a ladle of batter and spread it into a thin circular crepe. Cook until the edges lift slightly.",
                "Place a cylindrical spoonful of the filling on one edge, roll the crepe tightly, and toast it in the pan for one more minute."
            ],
            gheeMoment: "Brushing the hot iron tawa with our traditional ghee gives the patishapta its signature golden-brown, slightly crisp edges while keeping the inside melt-in-the-mouth soft."
        }
    ];
    // 4. Render Grid
    const grid = document.getElementById('recipe-grid');
    
    function renderCards(filter = 'all') {
        grid.innerHTML = '';
        const filtered = filter === 'all' 
            ? recipesData 
            : recipesData.filter(r => r.filterId === filter);

        filtered.forEach((recipe, index) => {
            const delay = index * 0.1;
            const cardHtml = `
                <div class="recipe-card reveal-up in-view" style="transition-delay: ${delay}s">
                    <div class="card-category-ribbon">${recipe.category}</div>
                    <div class="card-img-wrapper">
                        <img src="${recipe.img}" alt="${recipe.title}" loading="lazy">
                    </div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${recipe.time}</span>
                            <span><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${recipe.difficulty}</span>
                        </div>
                        <h3>${recipe.title}</h3>
                        <p>${recipe.desc}</p>
                        <button class="btn-text" onclick="openModal(${recipe.id})">
                            View Recipe 
                            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    // Initialize Grid
    renderCards();

    // 5. Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-pill');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-render
            const filterValue = btn.getAttribute('data-filter');
            renderCards(filterValue);
        });
    });

    // 6. Modal Logic
    const modal = document.getElementById('recipe-modal');
    const closeBtn = document.querySelector('.close-modal');

    window.openModal = function(id) {
        const recipe = recipesData.find(r => r.id === id);
        if (!recipe) return;

        // Populate Data
        document.getElementById('modal-image').src = recipe.img;
        document.getElementById('modal-image').alt = recipe.title;
        document.getElementById('modal-title').textContent = recipe.title;
        document.getElementById('modal-desc').textContent = recipe.desc;
        document.getElementById('modal-prep').textContent = "10 min"; // Standardized for simplicity based on provided data
        document.getElementById('modal-cook').textContent = recipe.time;
        document.getElementById('modal-servings').textContent = recipe.servings;
        document.getElementById('modal-diff').textContent = recipe.difficulty;
        document.getElementById('modal-ghee-moment').textContent = recipe.gheeMoment;

        // Populate Lists
        const ingList = document.getElementById('modal-ingredients');
        ingList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
        
        const stepsList = document.getElementById('modal-steps');
        stepsList.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');

        // Show Modal and lock body scroll
        modal.showModal();
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modal.close();
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeModal();
        }
    });

    // Close on ESC (natively supported by dialog, but handling scroll unlock)
    modal.addEventListener('cancel', () => {
        document.body.style.overflow = '';
    });
});