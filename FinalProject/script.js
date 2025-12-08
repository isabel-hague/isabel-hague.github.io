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
arrowLeft?.addEventListener("click", () => scrollTrack("left"));
arrowRight?.addEventListener("click", () => scrollTrack("right"));

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
    }
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
      location:"West Village",
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
      url:"https://rosemarysnyc.com/" // use correct site if desired
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
      location:"SoHo",
      tags:["cozy", "everyday"],
      description:"Bright, approachable Italian spot known for house-made pastas and a warm, social atmosphere",
      image:"https://d2dzi65yjecjnt.cloudfront.net/972832-7.jpeg",
      url:"https://www.lapecorabianca.com/"
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
      name:"Schmuck",
      slug:"Schmuck",
      location:"East Village",
      tags:["playful", "lounge"],
      description:"Chic East Village cocktail lounge mixing mid-century design, inventive drinks, and relaxed lounge vibes",
      image:"https://cdn.shopify.com/s/files/1/0146/0862/9808/files/schmuck_blog-01.jpg?v=1762385952",
      url:"https://www.schmucknyc.com/"
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
      image:"https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwCm3pBb6MHYIe5Uw2vkkETB9bZPEaYu9JiHCeIKtXMEk044njCg4be-2V6VXgPd8IKtXnOM2YLLw-ISlctym5znCzwBLTNlB2_0xHE60QgcSdWjpT9yZRl4tVhaeezXsjyOZ5lR-VQQ3E=s1360-w1360-h1020-rw",
      url:"https://www.dialogue.nyc/"
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
    }
  ],
  quick: [
    {
    }
  ],
  sweet: [
    {
    }
  ],
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

