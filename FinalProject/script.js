/* Config */
const CONFIG = {
  transitions: { landingFade: 600, scroll: 450 },
  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
};

/* Elements */
const landing     = document.getElementById("landing");
const enterBtn    = landing?.querySelector(".enter-btn");
const home        = document.getElementById("home");

const vibeTrack   = document.querySelector(".vibe-track");
const arrowLeft   = document.querySelector(".carousel-arrow.left");
const arrowRight  = document.querySelector(".carousel-arrow.right");

const vibePage     = document.getElementById("vibe-page");
const vibeGrid     = document.getElementById("vibe-grid");
const previewPanel = document.querySelector(".preview-panel");
const previewClose = previewPanel?.querySelector(".preview-close");
const previewMedia = document.getElementById("preview-media");
const previewTitle = document.getElementById("preview-title");
const previewMeta  = document.getElementById("preview-meta");
const previewDesc  = document.getElementById("preview-desc");
const previewLink  = document.getElementById("preview-link");
const previewMap   = document.getElementById("preview-map");

const chooseAnotherButtons = document.querySelectorAll(".choose-another");

/* Landing transition */
function enterSite() {
  const showHome = () => {
    landing.style.display = "none";
    home.style.display = "block";
    // Show #map only if it exists
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.style.display = "block";

    home.scrollIntoView({ behavior: "smooth" });

    if (window.gsap) {
      gsap.from("#home .hero, #home .section", {
        opacity: 0, y: 16, duration: 0.8, stagger: 0.12, ease: "power2.out"
      });
      gsap.to(window, { duration: 0.6, scrollTo: "#home", ease: "power2.out" });
    }

  };

  if (window.gsap) {
    gsap.to("#landing", {
      opacity: 0,
      duration: CONFIG.transitions.landingFade / 1000,
      ease: "power2.out",
      onComplete: showHome
    });
  } else {
    landing.style.transition = `opacity ${CONFIG.transitions.landingFade}ms ${CONFIG.easing}`;
    landing.style.opacity = "0";
    setTimeout(showHome, CONFIG.transitions.landingFade + 50);
  }
}
enterBtn?.addEventListener("click", enterSite);

/* Carousel scroll */
function scrollTrack(direction = "right") {
  if (!vibeTrack) return;
  const scrollBy = vibeTrack.clientWidth * 0.7;
  const target = direction === "left"
    ? vibeTrack.scrollLeft - scrollBy
    : vibeTrack.scrollLeft + scrollBy;
  vibeTrack.scrollTo({ left: target, behavior: "smooth" });
}
arrowLeft?.addEventListener("click", () => {
  scrollTrack("left");
  setTimeout(updateArrows, 300); // update after scroll animation
});

arrowRight?.addEventListener("click", () => {
  scrollTrack("right");
  setTimeout(updateArrows, 300);
});

// Also update when user scrolls manually
vibeTrack?.addEventListener("scroll", updateArrows);

// Run once on page load
updateArrows();


function updateArrows() {
  if (!vibeTrack) return;

  // Hide left arrow if at start
  if (vibeTrack.scrollLeft <= 0) {
    arrowLeft.style.visibility = "hidden";
  } else {
    arrowLeft.style.visibility = "visible";
  }

  // Only hide right arrow if content overflows
  if (vibeTrack.scrollWidth > vibeTrack.clientWidth &&
      vibeTrack.scrollLeft + vibeTrack.clientWidth >= vibeTrack.scrollWidth) {
    arrowRight.style.visibility = "hidden";
  } else {
    arrowRight.style.visibility = "visible";
  }
}


/* Vibe selection + Grid */
function loadVibe(vibeKey) {
  const vibeData = DATA[vibeKey] || [];
  vibePage.hidden = false;
  vibeGrid.innerHTML = "";

  vibeData.forEach((item) => {
    const li = document.createElement("li");
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.dataset.slug = item.slug;

    const media = document.createElement("div");
    media.className = "card-media";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    media.appendChild(img);

    const content = document.createElement("div");
    content.className = "card-content";

    const title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = item.name;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `${item.location} · ${item.tags.join(", ")}`;

    content.appendChild(title);
    content.appendChild(meta);
    card.appendChild(media);
    card.appendChild(content);
    li.appendChild(card);
    vibeGrid.appendChild(li);

    card.addEventListener("click", () => showPreview(item));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPreview(item);
      }
    });
  });

  if (window.gsap) {
    gsap.from(".vibe-grid .card", {
      opacity: 0,
      y: 14,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out"
    });
  }
}

/* Preview panel */
function showPreview(item) {
  previewPanel.hidden = false;
  previewMedia.style.backgroundImage = `url('${item.image}')`;
  previewTitle.textContent = item.name;
  previewMeta.textContent = `${item.location} · ${item.tags.join(", ")}`;
  previewDesc.textContent = item.description;
  previewLink.href = item.url;

  const q = encodeURIComponent(`${item.name} ${item.location}`);
  previewMap.src = `https://www.google.com/maps?q=${q}&output=embed`;

  if (window.gsap) {
    gsap.from(previewPanel, { opacity: 0, y: 10, duration: 0.38, ease: "power2.out" });
  }
}
previewClose?.addEventListener("click", () => { previewPanel.hidden = true; });

/* Exit actions reset vibe */
document.querySelector('.vibe-footer-actions a[href="#home"]')?.addEventListener("click", () => {
  clearFloatingEmojis(); // remove emojis
  previewPanel.hidden = true;
  vibePage.hidden = true;
  document.body.setAttribute("data-vibe", "default")

});
document.querySelector('.vibe-footer-actions a[href="#home"]')?.addEventListener("click", () => {
  clearFloatingEmojis();
  previewPanel.hidden = true;
  vibePage.hidden = true;
  document.body.setAttribute("data-vibe", "default");
  clearFloatingEmojis
});

/* Bind “Enter vibe” buttons: switch cursor + load data */
document.querySelectorAll(".vibe-enter").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.currentTarget.closest(".vibe-card");
    const vibeKey = card?.dataset?.vibe;
    if (!vibeKey) return;

    // clear old emojis
    clearFloatingEmojis();

    // set vibe state
    document.body.setAttribute("data-vibe", vibeKey);

    // load vibe data/cards
    loadVibe(vibeKey);

    // scroll into view
    document.getElementById("vibe-page")?.scrollIntoView({ behavior: "smooth" });

    // spawn new emojis for this vibe
    spawnFloatingEmojis(vibeKey);
  });
});


/* Reveal effects */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* DATA */
const DATA = {
  cozy: [
    {
      name:"Gemma",
      slug:"Gemma",
      location:"Bowery",
      tags:["rustic", "warm"],
      description:"Candlelit Italian spot with rustic beams, handmade pastas, and an effortlessly chic downtown vibe.",
      image:"https://theboweryhotel.com/app/uploads/2017/09/16111_BH_Gemma_001-1024x683.jpg",
      url:"https://theboweryhotel.com/dinner-menu/"
    },
    {
      name:"Cafe Cluny",
      slug:"Cafe Cluny",
      location:"West Village",
      tags:["romantic", "cozy"],
      description: "Charming West Village café with soft lighting, French-inspired comfort dishes, and an easy neighborhood elegance",
      image:"CafeCluny.png",
      url:"https://www.cafecluny.com/menu/dinner/"
    },
    {
      name:"Tiny's & The Bar Upstairs",
      slug:"Tinys",
      location:"Tribeca",
      tags:["intimate", "upstairs-bar"],
      description:"Intimate spot with a cozy upstairs bar and a laid-back neighborhood feel",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/l0sySmX6dCXSXCnBV7NRrQ/348s.jpg",
      url:"https://www.tinysnyc.com/menus"
    },
    {
      name:"L’Artusi",
      slug:"L’Artusi",
      location:"West Village",
      tags:["elegant", "refined-bar"],
      description:"Modern Italian favorite known for sleek interiors, perfect pastas, and romantic, low-lit energy",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/aLyMhKrE5a-ch69vT5DJfQ/o.jpg",
      url:"https://www.lartusi.com/menu/"
    },
   {
      name:"Mono + Mono",
      slug:"Mono + Mono",
      location:"East Village",
      tags:["moody", "soulful"],
      description:"Dim, jazz-filled Korean fusion spot with vinyl-lined walls and a warm, atmospheric glow",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/5ZTkLfZMChmxCW-HoR5gjg/l.jpg",
      url:"https://www.monomonony.com/"
    },
    {
      name:"Lil Frankie’s",
      slug:"Lil Frankie’s",
      location:"Lower East Side",
      tags:["rustic", "homey"],
      description:"Cozy neighborhood Italian with thin-crust pizzas, twinkly lights, and a charming old-school feel",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/OLIqdw1apn4xWiX1HyVKVw/348s.jpg",
      url:"https://www.lilfrankies.com/"
    },
  ],
  trendy: [
    {
      name:"Sadelle's",
      slug:"Sadelle's",
      location:"SoHo",
      tags:["trendy", "iconic"],
      description:"Bright, stylish brunch spot known for sky-high bagel towers and effortlessly photogenic vibes",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/a8/6f/30/caption.jpg?w=1200&h=1200&s=1",
      url:"https://sadelles.com/new-york"
    },
    {
      name:"Little Ruby's",
      slug:"Little Rubys",
      location:"Multiple",
      tags:["aesthetic", "laid-back"],
      description:"Aussie-inspired café with chic minimal interiors and craveable burgers and pastas",
      image: "https://images.getbento.com/accounts/b1463c771efd7f54f15c8c2371390f1f/media/images/63451CJ6A1295.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5g",
      url: "https://www.rubyscafe.com/west-village-menu/"
    },
    {
      name:"Bar Bianchi",
      slug:"Bar Bianchi",
      location:"Lower East Side",
      tags:["sleek", "modern"],
      description:"Intimate Italian wine bar with marble accents and a polished, downtown-cool atmosphere",
      image:"https://i.pinimg.com/736x/a1/44/17/a144172a5c7d164161d4a1154d4b0605.jpg",
      url:"https://www.barbianchinyc.com/"
    },
    {
      name:"Café Maud",
      slug:"Café Maud",
      location:"Multiple",
      tags:["airy", "aesethic"],
      description:"Light-soaked café with a clean and minimalist visual",
      image: "https://images.squarespace-cdn.com/content/v1/66bcd2ed3e2df53e0a29c9f6/2ef58293-17b7-4667-9856-fdf3d3b5fd4c/Cafe+Maud+-+June+24+%40alexandroloayza-05464.jpg",
      url:"https://www.cafemaud.com/"
    },
    {
      name:"Banter",
      slug:"Banter",
      location:"Multiple",
      tags:["bright", "modern"],
      description:"Fresh, green-leaning brunch spot with cozy corners and an easy Sunday-morning aesthetic",
      image: "https://media.timeout.com/images/105989766/image.jpg",
      url: "https://www.banternyc.com/menu"
    },
    {
      name:"Par Pisellino",
      slug:"Par Pisellino",
      location:"West Village",
      tags:["sleek", "modern"],
      description:"Intimate Italian wine bar with marble accents and a polished, downtown-cool atmosphere",
      image:"https://images.squarespace-cdn.com/content/v1/5500b66be4b0f6069c5ebb84/1582824804494-W8VX7FI36IH2W5APYOIJ/Pisellino_Photography_Building_Grove_01_72dpi.jpg",
      url:"https://barpisellino.com/"
    }
  ],
  casual: [
    {
      name:"Rosemary's",
      slug:"Rosemarys",
      location:"West Village",
      tags:["casual", "fresh"],
      description:"Neighborhood Italian with airy farmhouse charm and pasta made from their rooftop garden",
      image:"https://images.getbento.com/accounts/0f2e7c1bd3b44ca78c260daa80d4cfb5/media/images/43180Rosemary-s_Communal_Table_copy.jpg?w=1000&fit=max&auto=compress,format&cs=origin&h=1000",
      url:"https://rosemarysnyc.com/" 
    },
    {
      name:"Roey's",
      slug:"Roeys",
      location:"West Village",
      tags:["relaxed", "sunny"],
      description:"Easygoing all-day café with light bites, spritzes, and a breezy West Village feel",
      image:"https://images.ctfassets.net/1aemqu6a6t65/6c7BAIM12AaldzBrKX8JmH/b4ddba1dd8ae6594384dda76501f8918/roeys-manhattan-nyc-courtesy__1___1_.jpg",
      url:"https://www.roeysnyc.com/dine-in/"
    },
    {
      name:"La Pecora Bianca",
      slug:"La Pecora Bianca",
      location:"Multiple",
      tags:["cozy", "everyday"],
      description:"Bright, approachable Italian spot known for house-made pastas and a warm, social atmosphere",
      image:"https://d2dzi65yjecjnt.cloudfront.net/972832-7.jpeg",
      url:"https://www.lapecorabianca.com/"
    },
    {
      name:"Bubby’s",
      slug:"Bubby’s",
      location:"Tribecca",
      tags:["comfort", "nostalgic"],
      description:"Classic comfort-food diner with big pancakes, friendly vibes, and an old-New-York feel",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/v1734118000/images/Photo_Oct_20_2022_1_40_59_PM_ajftf6.jpg",
      url:"https://www.bubbys.com/menus/" 
    },
    {
      name:"A10 Kitchen",
      slug:"RoA10 Kitchen",
      location:"East Village",
      tags:["simple", "chill"],
      description:"Low-key neighborhood spot with comforting appetziers, sandwiches, drinks, and reliable everyday food",
      image:"https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/e6/9c004cb656459dbcbea224b9dbd4fa/:original",
      url:"https://a10kitchen.com/"
    },
    {
      name:"Westville",
      slug:"Westville",
      location:"Multiple",
      tags:["clean", "simple"],
      description:"asual, veggie-forward café known for market sides and unfussy, healthy comfort dishes",
      image:"https://resizer.otstatic.com/v2/photos/large/3/57265402.jpg",
      url:"https://westville.com/"
    }
  ],
  drinks: [
    {
      name:"Ripple Room",
      slug:"Ripple Room",
      location:"Bowery",
      tags:["moody", "upscale"],
      description:"A polished cocktail lounge with dim lighting, velvet textures, and a sophisticated party energy",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/6ySo1h-fvZgw975Wjph8Ww/o.jpg",
      url:"https://www.instagram.com/therippleroomnyc"
    },
    {
      name:"Studio 151",
      slug:"Studio 151",
      location:"East Village",
      tags:["vibey", "nightlife"],
      description:"Low-lit sake bar and DJ hangout with eclectic music and late-night East Village energy",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/q_auto,f_auto/images/NYC_Studio151_TeddyWolff_072_hiajmo",
      url:"https://www.studioonefiftyone.com/"
    },
    {
      name:"Joyface",
      slug:"Joyface",
      location:"East Village",
      tags:["funky", "playful"],
      description:"Playful disco-bar energy with colorful interiors and a fun crowd",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/kU4a2ERzftxb7hTrqEZv1A/348s.jpg",
      url:"https://joyface.nyc/"
    },
    {
      name:"Schmuck.",
      slug:"Schmuck",
      location:"East Village",
      tags:["playful", "lounge"],
      description:"Chic East Village cocktail lounge mixing mid-century design, inventive drinks, and relaxed lounge vibes",
      image:"https://cdn.shopify.com/s/files/1/0146/0862/9808/files/schmuck_blog-01.jpg?v=1762385952",
      url:"https://www.schmucknyc.com/"
    },
    {
      name:"Verlaine",
      slug:"Verlaine",
      location:"Lower East Side",
      tags:["chill", "cocktails"],
      description:"East Asian–inspired lounge with cheap lychee martinis and relaxed group-hang vibes",
      image:"https://lh3.googleusercontent.com/p/AF1QipPtmAsMfsye0efg0UWpSFhaqjGYSNxTJDFg01DD=s1360-w1360-h1020-rw",
      url:"https://www.verlainenyc.com/"
    },
    {
      name:"Bar Valentina",
      slug:"Bar Valentina",
      location:"Lower East Side",
      tags:["sleek", "social"],
      description:"Intimate cocktail bar with modern lines, dim lighting, and a buzzy, date-night crowd",
      image:"https://static.where-e.com/United_States/Bar-Valentina_e014eff16f26b74c7b1498fafc657a2c.jpg",
      url:"https://barvalentinanyc.com/menu"
    }
  ],
  cafe: [
    {
      name:"Librae Bakery",
      slug:"Librae Bakery",
      location:"East Village",
      tags:["artisanal", "cozy"],
      description:"Middle Eastern–inspired bakery with inventive pastries and warm, buttery aromas",
      image:"Librae.png",
      url:"https://www.libraebakery.com/"
    },
    {
      name:"Thayer",
      slug:"Thayer",
      location:"East Village",
      tags:["serene", "minimal"],
      description:"Clean, modern café serving matcha, espresso, and pastries in a calm, design-forward space",
      image:"https://cdn.corner.inc/place-photo/AZose0n7aVHn5KWyXKi5ykI2UWVDrRQNdl4G9nOWuuQQ10CPlfv4Ehpk6wFuJTTnxLaEzDtBxHDH-LIThtT-_QlD0urziVe_WzmuSpQOimrzHQnrCBt1nIrfgTJ32SfrCLCOdpZeXzX4n_p3jj8KtYtGwxOhXPu3aJSggSoV7VhRfyLVACgc.jpeg",
      url:"https://www.thayer.press/coffee-hq"
    },
    {
      name:"Dialogue Coffee & Flowers",
      slug:"Dialogue Coffee & Flowers",
      location:"Lower East Side",
      tags:["floral", "aesthetic"],
      description:"Whimsical café-meets-flower-shop offering pretty lattes, fresh blooms, and a soft, romantic vibe",
      image:"https://cdn.corner.inc/place-photo/AelY_CshOpB4WiQuO0E85J_LaFTyyh9pHab7uvw3xFT8oWPRGic_VL4rN5rJOc203TXoHuMj5WslffUPO-u9cvkxJGHURYCYMKtc4Lw_M2d_rrQO28T1CYzT24qoTzGxAEM8FNA4wnOm5r8VzO0JH0QJXcDSR-O9kldntoeGzf9d6jQ5q8Hd.jpeg",
      url:"https://www.dialogue.nyc/"
    },
    {
      name:"Hungry Llama",
      slug:"Hungry Llama",
      location:"West Village",
      tags:["cute", "relaxed"],
      description:"Playful café offering creative drinks, pastries, and fun, colorful déco",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/4C1lRtgjs8LPRlspn8hjrA/348s.jpg",
      url:"https://www.hungryllamacafe.com/"
    },
    {
      name:"From Lucie",
      slug:"From Lucie",
      location:"East Village",
      tags:["quaint", "sweet"],
      description:"Whimsical bakery with golden lighting, vintage styling, and charming hand-made cakes",
      image:"https://www.insidehook.com/wp-content/uploads/2023/09/InlineImg2.jpg?w=1500&resize=1500%2C1000",
      url:"https://fromlucie.com/pages/cookbook"
    },
    {
      name:"The Elk NYC ",
      slug:"The Elk ",
      location:"Multiple",
      tags:["rustic", "cozy"],
      description:"Wood-accented café with warm latte culture, healthy bowls, and a relaxed village feel",
      image:"https://gourmadela.com/wp-content/uploads/2015/07/ELK5.jpg",
      url:"https://www.theelknyc.com/"
    }
  ],
  hungover: [
    {
      name:"Son Del North",
      slug:"Son Del North",
      location:"Lower East Side",
      tags:["hearty", "comforting"],
      description:"Mexican-American comfort spot with big burritos quintessential for recovery energy",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/v1751046732/images/NYC_SonDelNorthWV_BreakfastBurrito_KatePrevite_00003_iproha.jpg",
      url:"https://sondelnorth.com/menu",
    },
    {
      name:"Thai Villa",
      slug:"Thai Villa",
      location:"Flatiron",
      tags:["rich", "indulgent"],
      description:"Ornate Thai restaurant known for creamy curries, fried appetizers, and soothing heavy comfort food",
      image:"https://tb-static.uber.com/prod/image-proc/processed_images/cb285b9983e33d70dd0573af8b608b0b/885ba8620d45ab36746a0e8c7b85ee66.jpeg",
      url:"https://thaivillanyc.com/",
    },
    {
      name:"Danny & Coop’s",
      slug:"Danny & Coop’s",
      location:" East Village",
      tags:["messy", "satisfying"],
      description:"Late-night style cheesesteaks packed with gooey cheese and hangover-curing breadiness",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/f_auto/q_auto/v1742833925/images/NYC_DannyAndCoops_CheesesteakWithPeppers_KatePrevite_00002_zqjsfc.jpg",
      url:"https://dannyandcoops.com/",
    },
    {
      name:"7th Street Burger",
      slug:"7th Street Burger",
      location:"Multiple",
      tags:["greasy", "essential"],
      description:"Smashburger heaven pumping out simple, salty, ultra-satisfying burgers",
      image:"https://images.squarespace-cdn.com/content/v1/682bacb441031616bb58ae01/79ff640a-eb3f-42d6-87b6-2533dfa5e6d1/268944029_1275311789651061_240837092106861244_n.jpg",
      url:"https://www.7thstreetburger.com/menu",
    },
    {
      name:"Williamsburg Pizza",
      slug:"Williamsburg Pizza",
      location:"Multiple",
      tags:["cheesy", "classic"],
      description:"NYC favorite for thin-crust slices, big flavor, and no-nonsense hangover comfort",
      image:"https://images.squarespace-cdn.com/content/v1/637530210715007320223224/1681219133113-VCKMNL0N7CB6JMVKPVKZ/Screen+Shot+2023-04-11+at+8.18.26+AM.png",
      url:"https://www.williamsburgpizza.com/menu",
    },
    {
      name:"Electric Burrito",
      slug:"Electric Burrito",
      location:"Multiple",
      tags:["bold", "messy"],
      description:"LA-style burritos packed to the brim — cheesy, saucy, and unapologetically messy in the best way possible",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5UcrknbuuDAVon0a6KQwpqUcj_XGFkV8ibQ&s",
      url:"https://www.electricburritonyc.com/",
    }
  ],
quick:[
{
      name:"Tompkin’s Square Bagels",
      slug:"Tompkin’s Square Bagels",
      location:"Multiple",
      tags:["classic", "fast"],
      description:"Neighborhood staple serving giant, no-nonsense bagels perfect for grab-and-go mornings",
      image:"https://gloobles.com/storage/11206/conversions/eVwy2MeAdFL4TRScM2GOsYlqp9NCzv-metaSU1HXzM0OTE2MTJCMDA0Qy0xLmpwZw==--large.webp",
      url:"https://www.tompkinssquarebagels.com/",
    },
{
      name:"Sunny & Annie’s Deli",
      slug:"Sunny & Annie’s Deli",
      location:"East Village",
      tags:["iconic", "inventive"],
      description:"Beloved bodega known for creative sandwiches stacked with unexpected flavor combos",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/v1656121748/cms/reviews/sunny-annie-gourmet-deli/EmilyS_SunnyAndAnniesDeli_SummerGuide_Sandwiches_006.jpg",
      url:"https://www.yelp.com/biz/sunny-and-annies-new-york",
    },
{
      name:"Deluxe Green Bo",
      slug:"Deluxe Green Bo",
      location:"Chinatown",
      tags:["efficient", "comforting"],
      description:"Casual Shanghainese spot with fast service and reliably delicious dumplings + noodles",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/f_auto/q_auto/v1715861896/images/NYC_LiusShanghai_FoodGroup_KatePrevite_00001_hgi2d4.jpg",
      url:"https://deluxegreentogo.com/",
    },
{
      name:"Springbone Kitchen",
      slug:"Springbone Kitchen",
      location:"Multiple",
      tags:["clean", "simple"],
      description:"Healthy and quick bowls, broths, and proteins made for easy, no-frills nourishment",
      image:"https://springbone.com/wp-content/uploads/2024/11/Seasonal-Veg.jpg",
      url:"https://springbone.com/",
    },
{
      name:"Sushi Counter",
      slug:"Sushi Counter",
      location:"Mupltiple",
      tags:["speedy", "fresh"],
      description:"Tight, efficient sushi bar offering quick rolls and reliable quality for a fast bite",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/v1734034369/IMG_0363-Edit_cwh2jp.jpg",
      url:"https://sushicounternyc.com/",
    },
{
      name:"Pura Vida Miami",
      slug:"Pura Vida Miami",
      location:"Multiple",
      tags:["Clean", "Costal"],
      description:"Bright, fresh bowls and nourishing plates served in a breezy, beachy atmosphere that feels like effortless Miami wellness",
      image:"https://images.squarespace-cdn.com/content/v1/5fc6985aec917750a3ff0c92/8613ec2f-44d2-4e62-bdce-cc6b1740f7e6/UBER+EATS+COVER+2024.jpg",
      url:"https://www.puravidamiami.com/our-menu",
    },
],
sweet: [
{
      name:"Caffè Panna",
      slug:"Caffè Panna",
      location:"Multiple",
      tags:["creamy", "indulgent"],
      description:"Soft-serve and sundae shop known for swirled flavors, toppings, and long but worth-it lines",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/c_scale,w_1200,q_auto,f_auto/NYC_CaffePanna_RazzyBrownieAndMangoCoconutStickyRiceSundaes_KatePrevite_00004_floyxv",
      url:"https://www.caffepanna.com/",
    },
{
      name:"Madison Fare ",
      slug:"Madison Fare ",
      location:"Multiple",
      tags:["elegant", "sweet"],
      description:"Dessert-forward café offering refined pastries, pretty plates, and delicate flavors",
      image:"https://s3-media0.fl.yelpcdn.com/bphoto/WlBNh3K1ZG66ibx2xax3Qg/348s.jpg",
      url:"https://www.instagram.com/madisonfarenyc/",
    },
{
      name:"Mimi’s",
      slug:"Mimi’s",
      location:"SoHo",
      tags:["mdoern", "aussie"],
      description:"Creamy, customizable frozen yogurt with premium toppings",
      image:"https://res.cloudinary.com/the-infatuation/image/upload/v1759165420/images/MimisFrozenYogurt_003_v4agds.jpg",
      url:"https://mimis.nyc/",
    },
{
      name:"Funny Face ",
      slug:"Funny Face ",
      location:"Multiple",
      tags:["chunky", "cookies"],
      description:"Oversized, gooey cookies in playful designs—bold flavors, big bites, and the ultimate treat when you want something fun and indulgent",
      image:"https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=600,height=400,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/c5080da4-9b78-4412-951b-62cab86d06e3.jpg",
      url:"https://funnyfacebakery.com/?srsltid=AfmBOooiBR2BHhHkgCfg-Y2KT3-AKwwj9Hj_ZSLCHZqy54554E3JgB3T",
    },
{
      name:"Red Gate Bakery",
      slug:"Red Gate Bakery",
      location:"East Village",
      tags:["nostalgic", "baked"],
      description:"Homestyle bakery making gooey, rich bars and cakes with warm, old-school charm",
      image:"https://pyxis.nymag.com/v1/imgs/8ff/05e/90854714d2140af30150bded8218e11f65-RedGateBakery-LizClayman-041.rsocial.w1200.jpg",
      url:"https://redgatebakery.com/",
    },
{
      name:"Supermoon Bakehouse",
      slug:"Supermoon Bakehouse",
      location:"Lower East Side",
      tags:["unique", "pastries"],
      description:"Viral, over-the-top croissants and pastries with bold flavors and even bolder visuals—perfect for satisfying a sweet tooth with something extra",
      image:"https://carpecity.com/wp-content/uploads/2022/07/supermoon-bakeshop-LES-NYC.jpg",
      url:"https://www.supermoonbakehouse.com/",
    },

]
};
const VIBE_EMOJIS = {
  cozy: ["🍷", "🕯️", "🥰"],
  trendy: ["📱", "🔥", "✨"],
  casual: ["😎", "🍔", "🥗"],
  drinks: ["🍸", "🪩", "🕺🏻"],
  cafe: ["☕️", "💻", "🥐"],
  hungover: ["🫩", "💤", "🤰"],
  quick: ["⚡️", "🥡", "👌"],
  sweet: ["🍰 ","🍦", "🍫"],
};
function spawnFloatingEmojis(vibeKey) {
  const emojis = VIBE_EMOJIS[vibeKey] || [];
  const layer = document.getElementById("emoji-layer");
  for (let i = 0; i < 40; i++) {
    const emoji = emojis[i % emojis.length];
    const el = document.createElement("div");
    el.className = "floating-emoji";
    el.textContent = emoji;
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 10}s`;
    layer.appendChild(el);
  }
}
function clearFloatingEmojis() {
  document.getElementById("emoji-layer").innerHTML = "";
}

chooseAnotherButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    clearFloatingEmojis(); // remove emojis
    previewPanel.hidden = true;
    vibePage.hidden = true;
    document.body.setAttribute("data-vibe", "default");
    document.querySelector(".hero")?.scrollIntoView({ behavior: "smooth" });
  });
});
function setVibeTitle(vibeName) {
  const title = document.getElementById("vibe-title");
  if (title) {
    title.textContent = vibeName;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const vibePage = document.getElementById("vibe-page");
  const vibeTitle = document.querySelector(".vibe-title");
  const vibeButtons = document.querySelectorAll(".vibe-enter");
  const chooseAnotherBtn = document.querySelector(".choose-another");

  // Helper: remove emojis from a string
  function stripEmojis(str) {
    return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  }

  // Handle selecting a vibe
  vibeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".vibe-card-inner");
      const vibeNameRaw = card.querySelector(".vibe-name").textContent.trim();

      // Clean vibe name (no emojis)
      const vibeNameClean = stripEmojis(vibeNameRaw);

      // Replace the heading text
      vibeTitle.textContent = vibeNameClean;

      // Show the vibe page
      vibePage.hidden = false;
      vibePage.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Handle "Choose another vibe" button
  chooseAnotherBtn?.addEventListener("click", () => {
    vibeTitle.textContent = "City Taste Map";
    vibePage.hidden = true;
    document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
  });
});

