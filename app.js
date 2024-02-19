//------------------------------------------------------------------------------------------------------------------------------------------------------
//Global Variables
//------------------------------------------------------------------------------------------------------------------------------------------------------

let overlay;
let board;
let context;
let mapTerrain; //Unused?
let layers = []; //Unused?
let boardWidth = 700;
let boardHeight = 700;
let fps = 60;
let winds = [];

let pixes = 3;
let globalAnimationCycle = 0;
let animatedZones = [];
let animationsList = [];
let moverList = [];

let eventQueue = [];
let repeatQueue = [];
let blockedAreas = [];

let gameActive = true; //Unused?

let gridSize = [70, 70, 0, 0]; //Unused?
let totalTiles; //Unused?
let grid = []; //Unused?
let selected = -1; //Unused?
let mouseSpot = [];

let HPs = []; //Unused?
let pathfinder = []; //Unused?
let weather = []; //Unused?

let quizResults = [];
let quizQuestions = [];
let quizCurrent = -1;
//let quizUsesSlider = false; //Potential Future Development
let quizParent;
let quizWin = [];
let quizResWin = [];

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Startup Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Initial Load
window.onload = function () {
    makeFoundationalElements();
    //makeGrid();
    //makeHPs();

    quizQuestions = quizQuestionInfo(-2);
    newGame();
    requestAnimationFrame(update);
}

//Foundational Element Log and Creation
function makeFoundationalElements() {

    overlay = document.getElementById("contents");
    overlay.width = boardWidth;
    overlay.height = boardHeight;
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    quizParent = document.getElementById("majority");
    addAnimationZone(context);

    //let board2 = document.getElementById("board2");
    //board2.width = board.width;
    //board2.height = board.height;
    //board2.width = boardWidth;
    //board2.height = boardHeight;
    //mapTerrain = board2.getContext("2d");

    overlay.addEventListener("mousemove", mouseMoved);
    document.addEventListener("keydown", presser);

}

//Starts a New Program
function newGame() {
    resetGame();
    quizMakeQuestion(quizCurrent);
}

//Resets Information for Restarting a Quiz
function resetGame() {
    quizCurrent = -1;
    quizResults = [];
    for (let i = 0; i < quizResultCategoryInfo(-2, true); i++) {
        quizResults[i] = 0;
    }
    if (quizResWin.length > 0) {
        for (let i = 0; i < quizResWin.length; i++) {
            destroyWin(quizResWin[i]);
        }
        quizResWin = [];
    }
}

//Determines Colors for HP Values
function makeHPs() {
    let max = 100;
    let current = [max, 0, 0];
    let topics = 7;
    let diff = 5;
    let change = [2, -1, 3, -2, 1, 2, 0];

    for (let i = 0; i < topics; i++) {
        let cycles = max / diff;
        if (i == topics - 1) cycles += 1;
        for (let i2 = 0; i2 < cycles; i2++) {

            //Setting Current
            let result = "#";
            let comp = [];
            for (let i3 = 0; i3 < current.length; i3++) {
                if (current[i3] >= 100) {
                    comp[i3] = "ff";
                } else if (current[i3] <= 9) {
                    comp[i3] = "0" + current[i3].toString();
                } else {
                    comp[i3] = current[i3];
                }
                result += comp[i3];
            }

            HPs[HPs.length] = result;

            //Modifying Next
            if (change[i] != 0) {
                let mod = Math.abs(change[i]) - 1;
                if (change[i] < 0) {
                    current[mod] -= diff;
                } else {
                    current[mod] += diff;
                }
            } else {
                for (let i3 = 0; i3 < current.length; i3++) {
                    current[i3] -= diff;
                }
            }
        }
    }
}

//A Test Run Each Frame
function testFrameOne() {

    //Single-Instance Test(s)
    if (globalAnimationCycle == 1) {
        //astartesTestAnimation(19);
        console.log(astartesCategorySummary());
        //console.log(quizAstartesLegions(-1));
        console.log(quizGetPossibleCategoryPoints(-1));
    }
}

//Creates a Test Animation for the Astartes
function astartesTestAnimation(legion) {
    //let colorz = ["none", "#000000", "#ffffff", "#881111", "#cc2222", "#33aa11", "#666666", "#bbaa33", "#aa8833"];
    let origDist = 150;
    let wrapDist = origDist + 300;
    let locPix = 5;
    let colorz = quizAstartesColor(legion);
    let lastAnim = makeAnimation(quizAstartes(colorz, -1, "stand"), -1, origDist, 300, context, locPix, "astartes", 55);
    let dist = (lastAnim.art[0].width * locPix) + (3 * locPix) + origDist;
    let dist2 = 300;
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "point"), -1, dist, dist2, context, locPix, "astartes", 10);
    dist += (lastAnim.art[0].width * locPix) + (3 * locPix);
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "bolter"), -1, dist, dist2, context, locPix, "astartes", 30);
    dist += (lastAnim.art[0].width * locPix) + (3 * locPix);
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "sword"), -1, dist, dist2, context, locPix, "astartes", 5);
    dist += (lastAnim.art[0].width * locPix) + (3 * locPix);
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "berserk"), -1, dist, dist2, context, locPix, "astartes", 5);
    dist += (lastAnim.art[0].width * locPix) + (3 * locPix);
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "walk"), -1, dist, dist2, context, locPix, "astartes", 10);
}

//Compiles a list of Category Points
function astartesCategorySummary() {
    let result = [];
    let legs = quizAstartesLegions(-1);
    let point = quizGetPossibleCategoryPoints(-1);

    for (let i = 0; i < legs.length; i++) {
        result[i] = i + ". " + legs[i] + ": " + point[i];
    }

    return result;
}

//Primary Update Function (AnimationFrame) Applying "Update Support Functions"
function update() {
    globalAnimationCycle += 1;
    makeEvents();
    makeRepeats();
    animationUpdate();

    //Pathfinding
    //if (selected != -1) learnPath(pathfinder);
    applyPathfinder();

    //Testing
    if (globalAnimationCycle % 1 == 0) {
        testFrameOne();
    }

    //Final
    requestAnimationFrame(update);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Potential To-Dos
//------------------------------------------------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------------------------------------------------
//Astartes Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns a Color Spectrum for an Astartes Legion
function quizAstartesColor(legion) {
    if (typeof legion == "string") legion = quizAstartesLegions(legion);
    //                      Blank, Black Trim, Pauldrons, D. Primary, L. Primary, Helm Eyes, Gray Metal, Aquila, Torso Center
    if (legion == 0) return ["none", "#000000", "#ddcc77", "#004400", "#206420", "#905050", "#554444", "#cccc88", "#aaaa77"]; //Dark Angels
    if (legion == 2) return ["none", "#000000", "#eeee88", "#991199", "#cc22cc", "#eeeecc", "#666666", "#ddcc33", "#cc9911"]; //Emperor's Children
    if (legion == 3) return ["none", "#000000", "#303050", "#404050", "#606070", "#dd6622", "#777777", "#504040", "#403030"]; //Iron Warriors
    if (legion == 4) return ["none", "#000000", "#cc9955", "#cccccc", "#eeeeee", "#9999dd", "#887777", "#aa6655", "#dd7777"]; //White Scars
    if (legion == 5) return ["none", "#000000", "#997722", "#7777aa", "#ccccff", "#ff5555", "#555566", "#ff7700", "#ff8800"]; //Space Wolves
    if (legion == 6) return ["none", "#000000", "#bb9944", "#bb5500", "#ff8800", "#3366cc", "#666666", "#cc3030", "#bb2020"]; //Imperial Fists
    if (legion == 7) return ["none", "#000000", "#eeb9a0", "#404080", "#6060aa", "#bb2000", "#222222", "#202030", "#501010"]; //Night Lords
    if (legion == 8) return ["none", "#000000", "#ffffff", "#881111", "#cc2222", "#33aa11", "#666666", "#ddcc33", "#aa8833"]; //Blood Angels
    if (legion == 9) return ["none", "#000000", "#aaaaaa", "#606060", "#303030", "#997777", "#aaaaaa", "#bbbbcc", "#9999bb"]; //Iron Hands
    if (legion == 11) return ["none", "#000000", "#ddaa99", "#772211", "#dd3300", "#33cc00", "#553333", "#dd7755", "#660000"]; //World Eaters
    if (legion == 12) return ["none", "#000000", "#dddd66", "#4444dd", "#6666ff", "#cc88aa", "#777777", "#ddcc33", "#aa8833"]; //Ultramarines
    if (legion == 13) return ["none", "#000000", "#443300", "#334400", "#bbaa66", "#151010", "#554444", "#cccc88", "#aaaa77"]; //Death Guard
    if (legion == 14) return ["none", "#000000", "#dddd66", "#ddbb77", "#6666ff", "#aa9933", "#663333", "#aa9933", "#cc5533"]; //Thousand Sons
    if (legion == 15) return ["none", "#000000", "#aa7733", "#ccbb99", "#ddddee", "#301010", "#555555", "#ddcc33", "#bbaa11"]; //Luna Wolves
    if (legion == 16) return ["none", "#000000", "#ccbb22", "#cc0000", "#aa9988", "#101050", "#553333", "#ddcc33", "#ccbb22"]; //Word Bearers
    if (legion == 17) return ["none", "#000000", "#303030", "#334433", "#44bb44", "#ff3030", "#555555", "#ddcc33", "#aa8833"]; //Salamanders
    if (legion == 18) return ["none", "#000000", "#994444", "#454545", "#151520", "#773333", "#bbbbbb", "#bfbfcc", "#aaaabb"]; //Raven Guard
    if (legion == 19) return ["none", "#000000", "#aaaaaa", "#008899", "#33aacc", "#dd4466", "#888888", "#aaaabb", "#888899"]; //Alpha Legion

    //Failsafe
    //return ["none", "#000000", "#ffffff", "#881111", "#cc2222", "#33aa11", "#666666", "#bbaa33", "#aa8833"];
    return ["none", "#000000", "#aaaaaa", "#303030", "#505050", "#ee2020", "#887766", "#bbaa33", "#aa8833"]; //Placeholder ~ Deathwatch?
}

//Returns a Name or Number for a Legion
function quizAstartesLegions(legion) {
    let lost = "[Redacted]";
    let result = lost;
    let legions = ["Dark Angels", lost, "Emperor's Children", "Iron Warriors", "White Scars", "Space Wolves", "Imperial Fists", "Night Lords", "Blood Angels", "Iron Hands", lost,
        "World Eaters", "Ultramarines", "Death Guard", "Thousand Sons", "Luna Wolves", "Word Bearers", "Salamanders", "Raven Guard", "Alpha Legion"];
    if (typeof legion == "string") {
        for (let i = 0; i < legions.length; i++) {
            if (legion == legions[i]) result = i;
        }
    } else if (typeof legion == "number") {
        if (legion < legions.length) result = legions[legion];
        if (legion < 0 || legion > legions.length) result = legions;
    }

    return result;
}

//Returns the Minimum Width for a Legion's Namesake Box
function quizAstartesNamesakeLength(id) {
    let size = 100;
    if (id == 0) size = 80;
    if (id == 1 || id == 10) size = 75;
    if (id == 2) size = 135;
    if (id == 4) size = 90;
    if (id == 7) size = 80;
    if (id == 8) size = 95;
    if (id == 9) size = 75;
    if (id == 11) size = 95;
    if (id == 12) size = 95;
    if (id == 13) size = 95;
    if (id == 15) size = 85;
    if (id == 16) size = 95;
    if (id == 18) size = 90;
    if (id == 19) size = 95;

    let result = size.toString();
    result += "px";

    return result;
}

//Returns Result Info for Astartes Legions
function quizAstartesResults(id, part) {
    let legion = 0;
    let legions = [];
    let pers = [];
    let cult = [];
    let prim = [];
    let prim2 = [];
    let hist = [];
    let misc = [];

    //Legion-Specific Info

    //Dark Angels
    pers[legion] = "Dark Angels are often paranoid and withdrawn. \n\nYou are slow to trust others and only confide in a small group of likeminded individuals. ";
    pers[legion] += "Forgiveness does not come easily once trust is broken. \n\nYou see the harmful actions of those close to you as your personal failings. ";
    pers[legion] += "When you or those close to you make mistakes, you take drastic measures to cover-them-up and avoid outside help. ";
    pers[legion] += "This can leave you endlessly trying to prove your value or loyalty to those who already trust and appreciate you. ";
    pers[legion] += "\n\nYou are probably a \"cat person\" and view your pets as family. ";
    pers[legion] += "\n\nYou will find common goals with Space Wolves, but often disagree on how you view and pursue those goals. ";
    pers[legion] += "\n\nOther Dark Angels are usually either trusted friends or people you hate, and rarely anything in-between. ";

    cult[legion] = "1. Thematically embody medieval knights ";
    cult[legion] += "\n\n2. Individuals specialize in specific roles, making the group suited to most tasks ";
    cult[legion] += "\n\n3. Primarily hunt \"The Fallen\" Dark Angels that turned traitor in an ancient war ";
    cult[legion] += "\n\n4. May abruptly abandon friends and goals to pursue one of \"The Fallen\" that surfaces ";
    cult[legion] += "\n\n5. Keep knwoledge of \"The Fallen\" secret, fearing their existence would mark the entire legion as traitors ";
    cult[legion] += "\n\n6. Have an allied rivalry with the Space Wolves and often disagree with them ";
    cult[legion] += "\n\n7. Assisted by small, enigmatic creatures known as \"The Watchers\" ";

    prim2[legion] = "2. Initially mistaken for a wild monster, but raised as a knight ";
    prim2[legion] += "\n\n3. Name translates to \"Son of the Forest\" ";
    prim2[legion] += "\n\n4. Has traces of DNA from lions, shown in his fangs and ferocious nature ";
    prim2[legion] += "\n\n5. Described as \"a beast pretending to be a man\" ";
    prim2[legion] += "\n\n6. One of only two loyalist primarchs active in the galaxy ";
    prim2[legion] += "\n\n7. Has grown from ruthless to humble and forgiving ";

    legion += 1;

    //Lost 2nd
    pers[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    cult[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    prim[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    prim2[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    hist[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    misc[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    legion += 1;

    //Emperor's Children
    pers[legion] = "Emperor's Children are proud perfectionists driven by recognition. ";
    pers[legion] += "\n\nYour elevated sense of self leads you to look down on those less accomplished than you and resent those more accomplished. ";
    pers[legion] += "Correcting any personal shortcoming or failure, however small, often becomes an obsession. ";
    pers[legion] += "\n\nYou may amuse yourself with pranks and similar shenanigans for laughs or breaks from monotony -- especially after being starved of attention. ";
    pers[legion] += "Boredom is your greatest enemy and you will go to extreme lengths to find new and exciting pastimes. ";
    pers[legion] += "\n\nMost of your self-image stems from genuine talent in multiple fields, at least one of which is often a form of art. ";
    pers[legion] += "\n\nYour personality is most opposite the Iron Hands, but you will often enjoy their company and find your skills compliment each other. ";

    cult[legion] = "1. Formerly collaborative in pursuit of perfection ";
    cult[legion] += "\n\n2. Have grown individualistic, hedonistic, and depraved ";
    cult[legion] += "\n\n3. Quickly grow bored and pursue increasingly extreme forms of stimuli ";
    cult[legion] += "\n\n4. Mostly serve Chaos, focusing on experiences of pain and pleasure ";
    cult[legion] += "\n\n5. Use \"For The Emperor!\" for their battle-cry as a jibe at Imperial forces ";
    cult[legion] += "\n\n6. Rare loyalists are known for charismatic, legendary displays of valor ";

    prim2[legion] = "2. Rebuilt his homeworld's society so art could thrive again ";
    prim2[legion] += "\n\n3. Started with fewer astartes, but accomplished as much as the other legions ";
    prim2[legion] += "\n\n4. Had a friendly rivalry with Ferrus Manus, primarch of the Iron Hands ";
    prim2[legion] += "\n\n5. Was corrupted by a possessed sword and exposure to the art of daemonic xenos ";
    prim2[legion] += "\n\n6. Killed the primarch of the Iron Hands and nearly killed the primarch of the Iron Warriors ";
    prim2[legion] += "\n\n7. Under the Chaos God of Excess, he ascended to daemonhood and took a form resembling a serpent ";

    legion += 1;

    //Iron Warriors
    pers[legion] = "Iron Warriors are stubborn, short-tempered, and industrious. \n\nYou are ruthless when it comes to achieving your goals. ";
    pers[legion] += "You can be jealous of others with similar jobs or interests to your own -- especially those more celebrated or successful. ";
    pers[legion] += "You will find series of small details and sleights to slowly wear-down those that disagree with you. ";
    pers[legion] += "\n\nDespite this, you are competent and capable when you put your mind to a subject you value. ";
    pers[legion] += "This earned confidence in your own judgment makes you unlikely to give ground in discussions or acknowledge the merits of others' points. ";
    pers[legion] += "\n\nFaith may not come easily to you, and you will be especially critical of those who do not share such beliefs. ";
    pers[legion] += "You seek your validation from others, even those you dislike. ";
    pers[legion] += "\n\nYou have a lot in common with the Imperial Fists, but will rarely get along with them. They specialize in building towards their ";
    pers[legion] += "personal goals, where you are better at tearing-down those of your competitors. ";

    cult[legion] = "1. Prioritize siege warfare and brutal combat efficiency ";
    cult[legion] += "\n\n2. Use any force or tool at their disposal, even ones they morally reject ";
    cult[legion] += "\n\n3. Reject Chaos, despite betraying the rest of humanity ";
    cult[legion] += "\n\n4. Have influences from Greek culture -- including the practice of decimation ";

    prim2[legion] = "2. Born with the ability to see a galactic scar left by Chaos corruption ";
    prim2[legion] += "\n\n3. Runiting with his legion and learning of recent defeats, his first order was to decimate his astartes ";
    prim2[legion] += "\n\n4. Disliked (and was disliked by) many other primarchs -- especially Rogal Dorn of the Imperial Fists ";
    prim2[legion] += "\n\n5. Loved architecture but was only allowed to destroy, never create for himself ";
    prim2[legion] += "\n\n6. Betrayed humanity, but abandoned his allies when they did not meet his standards ";
    prim2[legion] += "\n\n7. Disappeared 10,000 years ago and may have become a daemon prince (against his own beliefs) ";
    prim2[legion] += "\n\n8. Has been described as a \"petulant man-child\" that is also extremely competent ";

    legion += 1;

    //White Scars
    pers[legion] = "White Scars are observant, swift, efficient, and humble. ";
    pers[legion] += "\n\nYou rarely demand credit for your successes. ";
    pers[legion] += "Many will overlook you -- sometimes by design, sometimes for reasons outside of your control. Despite this, you ";
    pers[legion] += "always uphold the promises you make. Those that get to know you will see you as quiet and humble but know that, when ";
    pers[legion] += "needed, you have a deceptively sharp tongue. ";
    pers[legion] += "\n\nYou rarely rush into things, waiting to act until you fully understand a situation. ";
    pers[legion] += "After starting a task, you are usually one of the first to finish and one of the most successful among your peers. ";
    pers[legion] += "\n\nYou may keep track of important events in the form of physical reminders or sentimental objects. ";
    pers[legion] += "Your likely have tattoos or hang posters in your room. ";
    pers[legion] += "\n\nYou find no specific legions difficult or likable. ";

    cult[legion] = "1. Have influences from Mongolian culture ";
    cult[legion] += "\n\n2. Revere speed in natural and mechanical forms -- mostly as wind, lightning, and specialized vehicles ";
    cult[legion] += "\n\n3. After a battle, they rub colored dirt into shallow cuts on their skin. These form scars: dark wounds for defeats, white ones for victories ";
    cult[legion] += "\n\n4. Formerly known as the \"Star Hunters\" ";

    prim2[legion] = "2. Swore an oath of loyalty to The Imperium that he refused to break ";
    prim2[legion] += "\n\n3. Had the foresight to foster psychic talents and promote their study ";
    prim2[legion] += "\n\n4. Was often underestimated by other primarchs ";
    prim2[legion] += "\n\n5. Once told Fulgrim (primarch of the Emperor's Children) that \"I hear you do strange things to your men\" ";
    prim2[legion] += "\n\n6. When other primarchs rebelled, he chose to watch events unfold and understand the chaotic situation before acting ";
    prim2[legion] += "\n\n7. Vanished pursuing Dark Eldar raiders 10,000 years ago, leaving his fate unknown ";

    legion += 1;

    //Space Wolves
    pers[legion] = "Space Wolves are rowdy and festive, but also kind and fiercely loyal. \n\nYou take interest in the stories your friends tell you about ";
    pers[legion] += "their lives and will want to share about your own. ";
    pers[legion] += "You are fiercely loyal and will go to great lengths to help friends and family in need. ";
    pers[legion] += "When those friends and family are not threatened, your friendly nature will extend to strangers that show you kindness. ";
    pers[legion] += "\n\nGrowing-up you likely played sports, enjoyed working with animals, or both. ";
    pers[legion] += "You are probably a \"dog person\" if you own pets. ";
    pers[legion] += "\n\nYou will find rivalries with the Dark Angels that range from friendly to borderline hostile, and you will likely share their goals and interests. ";
    pers[legion] += "\n\nMost of your interactions with the Thousand Sons will devolve into open hostility, and you are unlikely to enjoy their hobbies. ";

    cult[legion] = "1. Have cultural influences from vikings and werewolf myths ";
    cult[legion] += "\n\n2. Enjoy oral tradition and large feasts celebrating victories or special occasions ";
    cult[legion] += "\n\n3. Astartes cannot get drunk on simple alcohol, but the Space Wolves brew a toxin powerful enough to simulate alcohol (and kill a normal human) ";
    cult[legion] += "\n\n4. Place elevated value on mortal life ";
    cult[legion] += "\n\n5. Mistake psychic abilities for spiritual practices ";
    cult[legion] += "\n\n6. Ride and battle alongside giant wolves ";

    prim2[legion] = "2. Raised by a wolf-like species before integrating into human society ";
    prim2[legion] += "\n\n3. Has traces of canine DNA, giving him fangs and a natural bond with wolves ";
    prim2[legion] += "\n\n4. Earned the title of \"Emperor's Executioner\" through unknown means ";
    prim2[legion] += "\n\n5. Was tricked into battling Magnus of the Thousand Sons, and inadvertently causing that primarch's fall to chaos ";
    prim2[legion] += "\n\n6. Described as \"a noble man masquarading as a beast\" ";
    prim2[legion] += "\n\n7. Disappeared 10,000 years ago and is believing to be searching for a way to heal The Emperor ";

    legion += 1;

    //Imperial Fists
    pers[legion] = "Imperial Fists are honest and straightforward, sometimes to a fault. You will not want to lie, even about simple things. ";
    pers[legion] += "\n\nYou will enjoy architecture, mapmaking, and similar opportunities to either build or design physical spaces. ";
    pers[legion] += "Despite this, you may not consider yourself creative or artistic. ";
    pers[legion] += "\n\nDuring conflicts, you are at your best when allowing your opponent to take the offensive. During verbal debates, you may ";
    pers[legion] += "lay logical traps or interject witty responses while your opposition speaks. You struggle if these roles are reversed, as you lack talent ";
    pers[legion] += "as an instigator and flounder on the offensive. ";
    pers[legion] += "\n\nWhen you find a worthwhile cause, you will devote yourself to building-it-up. ";
    pers[legion] += "This may take the form of faith, but can easily be an Earthly ambition. ";
    pers[legion] += "\n\nYou rarely get along with Iron Warriors, even though you share interests. They ignore your moral codes and directly oppose ";
    pers[legion] += "your social tendencies. You are both incredibly stubborn when you make-up your minds, but hate when others compare you. ";
    pers[legion] += "\n\nYou will feel uneasy around Alpha Legion astartes, sensing you cannot fully trust them. ";
    
    cult[legion] = "1. Love architecture -- especially fortifications and defensive structures ";
    cult[legion] += "\n\n2. Accept physical pain as a way to sharpen their focus and clear their mind ";
    cult[legion] += "\n\n3. Individual groups heavily diverge from their cultural heritage ";
    cult[legion] += "\n\n4. Some remain grounded in conventional views and their legion's original appreciation for building-up a society's foundations ";
    cult[legion] += "\n\n5. Others utterly denounce foreign entities and cultures, embracing their status as demigods in service to an even higher power ";

    prim2[legion] = "2. Never lied ";
    prim2[legion] += "\n\n3. Usually took the most straightforward approach to tasks and conversations ";
    prim2[legion] += "\n\n4. Harsh upbringing taught him all social classes must work equally hard to survive ";
    prim2[legion] += "\n\n5. Was responsible for building humanity's most impressive structures ";
    prim2[legion] += "\n\n6. Found The Emperor dying after an ancient war and was the one to carry his body to the throne room ";
    prim2[legion] += "\n\n7. Killed a primarch from the Alpha Legion, but it is unclear whether it was Alpharius or Omegon ";
    prim2[legion] += "\n\n8. Only his severed hand was recovered after a battle, and he is presumed dead ";

    legion += 1;

    //Night Lords
    pers[legion] = "Night Lords show pressimism, an unsettling nature, and a personal sense of justice. ";
    pers[legion] += "\n\nIn conversation, you say things to intentionally shock and unnerve others -- either for the sake of ";
    pers[legion] += "attention from friends and family or to put strangers off guard. ";
    pers[legion] += "\n\nYou find yourself thinking ahead to future events and accurately predicting poor outcomes. ";
    pers[legion] += "This does not lead to paranoia because you see these events as grim inevitabilities, not the actions of those \"out to get you.\" ";
    pers[legion] += "\n\nDuring disagreements, you make headway by wearing-down the weakest members of your opposition. ";
    pers[legion] += "When met with significant resistance, you are more likely to change tactics or leave a confrontation than stand for your beliefs. ";
    pers[legion] += "\n\nYou have your own sense of justice and often feel the guilty are not sentenced harshly enough. ";
    pers[legion] += "Punishment serves as an example and deterrant to other would-be offenders. ";
    pers[legion] += "\n\nYou will find it difficult to get along with most legions. Blood Angels are especially difficult for you, as their optimism ";
    pers[legion] += "will conflict with your nihilistic disposition to fate. ";

    cult[legion] = "1. Always sociopathic, having only grown cruler and more disorganized over time ";
    cult[legion] += "\n\n2. Originally meant to incite fear that ended conflicts without significant loss of life ";
    cult[legion] += "\n\n3. Enjoy torture and public mutilation in place of conventional warfare ";
    cult[legion] += "\n\n4. Wear the Flayed Skins of Their Enemies ";
    cult[legion] += "\n\n5. Mostly criminals that began crime at a young age ";
    cult[legion] += "\n\n6. Have (limited) influences from Russian culture and mannerisms ";

    prim2[legion] = "2. His first memory was fighting-off a starving cannibal as an infant ";
    prim2[legion] += "\n\n3. Grew-up brutally killing criminals to encourage lawfulness ";
    prim2[legion] += "\n\n4. Had visions of horrible futures that he saw as inevitabilities ";
    prim2[legion] += "\n\n5. Betrayed humanity but contributed little, preferring to target civilians ";
    prim2[legion] += "\n\n6. Destroyed his homeworld when it returned to gang-rule in his absence ";
    prim2[legion] += "\n\n7. Was the only primarch to be killed by a mortal human after he foresaw his death at the hands of an assassin ";
    prim2[legion] += "\n\n8. May Have Been Initially Intended as a Noble Judge ";

    legion += 1;

    //Blood Angels
    pers[legion] = "Blood Angels are defined by their charisma, optimism, and compassion for others. ";
    pers[legion] += "\n\nYou are in-tune with the emotions of those around you, ";
    pers[legion] += "keeping conversations level-headed and facilitating cooperation. ";
    pers[legion] += "You encourage success as a group, but are also very capable on your own and happy to let others ";
    pers[legion] += "showcase their individual strengths. ";
    pers[legion] += "\n\nYou see the best in people -- not necessarily in who they are at present, but in who they can become. ";
    pers[legion] += "These predictions are often validated, especially when you push others towards self-improvement. ";
    pers[legion] += "\n\nThese traits vanish if you are hurt by someone close to you. You will start to feel ";
    pers[legion] += "everyone is against you -- even those that support you. ";
    pers[legion] += "In this state, you hurt those around you out of spite, gaining emotional fulfillment from others' struggles. ";
    pers[legion] += "\n\nYou will get along well with most legions, but your compassion naturally bonds with the Luna Wolves' leadership skills. ";
    pers[legion] += "\n\nYou will rarely get along with Night Lords, who embody the pessimistic antithesis of your world views. ";

    cult[legion] = "1. Thematically use Catholic imagery and vampiric tropes ";
    cult[legion] += "\n\n2. Must fight the risk of being overtaken by a psychic lust for violence revenge ";
    cult[legion] += "\n\n3. Individual groups heavily diverge from their cultural heritage ";
    cult[legion] += "\n\n4. Some try to embody paladin-like honor and integrity, atoning for non-virtuous acts in various ways ";
    cult[legion] += "\n\n5. Others become butchers, ferociously spilling and drinking the blood of their enemies (or sometimes allies) ";

    prim2[legion] = "2. Had angelic wings and is often represented by a hawk or dove ";
    prim2[legion] += "\n\n3. Often settled disagreements and was trusted by the other primarchs ";
    prim2[legion] += "\n\n4. Had psychic visions of prosperous futures he could work towards ";
    prim2[legion] += "\n\n5. Foresaw his potential death at the hands of Horus, primarch of the Luna Wolves, but chose to confront him anyway ";
    prim2[legion] += "\n\n6. Created a psychic backlash through his death that instills a lust for vengeance in his legion ";
    prim2[legion] += "\n\n7. Has the legacies of a martyr and the paragon of virtue ";

    legion += 1;

    //Iron Hands
    pers[legion] = "Iron Hands embrace technology, but are often as cold and calculating as machines.  ";
    pers[legion] += "\n\nYou value end goals over their means. ";
    pers[legion] += "You have no patience for small-talk, sticking to important talking-points. ";
    pers[legion] += "\n\nAny percieved weakness should be overcome, never accepted. ";
    pers[legion] += "You frequently grow apart from friends that refuse to fix their personal faults and withdraw ";
    pers[legion] += "from friends and family while you work to fix your own. ";
    pers[legion] += "You fear the mistakes of older generations are somehow your own, seeking to prove you are \"better.\" ";
    pers[legion] += "\n\nYou only value artistic and creative talents as tools towards other ends. ";
    pers[legion] += "Your hobbies and careers usually have objective outcomes of success and failure. ";
    pers[legion] += "\n\nOthers may call you \"stubborn\" because they fail to consider issues as thoroughly. ";
    pers[legion] += "You are rarely mistaken, but acknowledge when you are so you can learn and improve. ";
    pers[legion] += "\n\nYour personality is most opposite the Emperor's Children, but you will often enjoy their company and find your skills compliment each other. ";
    pers[legion] += "\n\nLegions such as the Space Wolves, Blood Angels, Salamanders, and Raven Guard may conflict with you over the treatment of others, including strangers. ";

    cult[legion] = "1. Believe \"The Flesh is Weak\" and replace their limbs and organs with bionics ";
    cult[legion] += "\n\n2. Keep close ties with the overseers of humanity's technology ";
    cult[legion] += "\n\n3. Have heightened technical knowledge and top-of-the-line gear ";
    cult[legion] += "\n\n4. See their primarch's loss as a failure and sign of weakness, trying to prove they are better than he was ";
    cult[legion] += "\n\n5. Place little value in mortal life and freely accept civilian casualties ";

    prim2[legion] = "2. Known as \"The Gorgon\" for his ugliness and stony disposition ";
    prim2[legion] += "\n\n3. Killed a metallic creature and had its melted flesh cover his hands, enhancing his strength and resilience ";
    prim2[legion] += "\n\n4. Had a friendly rivalry with Fulgrim, primarch of the Emperor's Children ";
    prim2[legion] += "\n\n5. Resolved to end his legion's obsession with bionics, but died before doing so ";
    prim2[legion] += "\n\n6. Was beheaded by Fulgrim, primarch of the Emperor's children ";
    prim2[legion] += "\n\n7. Rumored to still serve humanity as part of the spectral \"Legion of the Damned\" ";

    legion += 1;

    //Lost 11th
    pers[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    cult[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    prim[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    prim2[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    hist[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    misc[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    legion += 1;

    //World Eaters
    pers[legion] = "World Eaters are angry and aggressive. ";
    pers[legion] += "\n\nYou often start arguments and voice frustrations. ";
    pers[legion] += "Your catalysts for confrontation can be random and insignificant, but you will consistently protect a sense of personal honor. ";
    pers[legion] += "Disagreements with friends and family are just as common as those with strangers. ";
    pers[legion] += "You argue to blow-off steam, not intellectual debate or to hurt others. ";
    pers[legion] += "\n\nYou often fight without goals in mind, using conflict to vicariously lash-out at larger problems in life. ";
    pers[legion] += "Consciously, you may not be aware you enjoy heated exchanges. ";
    pers[legion] += "\n\nYou justify hostility with unrelated wrongs comitted against you. ";
    pers[legion] += "If an event caused you to \"see the world differently,\" there are moments where you forget its damage and ";
    pers[legion] += "lapse into a previous, kinder headspace. These are uncommon and pass quickly. ";
    pers[legion] += "\n\nDespite your disagreeable nature, you easily fall to peer pressure -- even when you know you are making bad decisions. ";
    pers[legion] += "\n\nYour argumentative nature makes it difficult for you to get along with other legions. ";
    pers[legion] += "Word Bearers often pity you, acting friendly towards you and forgiving your temper. ";

    cult[legion] = "1. Serve Chaos through violence and warfare ";
    cult[legion] += "\n\n2. Venerate melee combat and despise all other forms of engagement ";
    cult[legion] += "\n\n3. Do not break from war to erect temples or craft new weapons ";
    cult[legion] += "\n\n4. Turn on each other if they go too long without finding an external foe ";
    cult[legion] += "\n\n5. Only desire to kill and take skulls, not torture or cause lasting pain ";
    cult[legion] += "\n\n6. Mandate surgical implants that force aggression under threat of pain ";

    prim2[legion] = "2. Forced to compete in the arena and eventually kill his mentor ";
    prim2[legion] += "\n\n2. Was initially able to heal others by taking their pain onto himself ";
    prim2[legion] += "\n\n4. Was given surgical implants that forced aggression under threat of pain while slowly killing him ";
    prim2[legion] += "\n\n5. Never forgave The Emperor for taking him away from a gladiator uprising, leaving his allies to be massacred ";
    prim2[legion] += "\n\n6. Betrayed humanity and was \"saved\" by Lorgar, primarch of the Word Bearers, who forced him to ascend to daemonhood ";
    prim2[legion] += "\n\n7. Serves the Chaos God of battle, reforming six days after each death and only wanting an end to his existence ";

    legion += 1;

    //Ultramarines
    pers[legion] = "Ultramarines have an innately virtuous moral code and knack for logistics. ";
    pers[legion] += "\n\nYou try to do what is right, even under pressure. ";
    pers[legion] += "Despite this, your lawful nature lets authority figures override any personal sense of right and wrong. ";
    pers[legion] += "\n\nYou may use nicknames because yours is difficult to pronounce or embarassing. ";
    pers[legion] += "\n\nGiven a task, you see priorities that others overlook. ";
    pers[legion] += "Your successes are not flashy, but you consistently succeed where others fail. ";
    pers[legion] += "Incredibly efficient, you bring a level of bureaucracy to any challenge. ";
    pers[legion] += "You a leader for your abilities, rather than charisma. ";
    pers[legion] += "Outside of this role you can handle any responsibility, but rarely outperform your peers. ";
    pers[legion] += "\n\nStepping-back from projects and returning to find them unsuccessful makes you feel unaccomplished. ";
    pers[legion] += "You do not necessarily blame others or even yourself, so much as wish things were different. ";
    pers[legion] += "\n\nYou get along with most legions, excluding Word Bearers. They tend to value tradition over efficiency, making it difficult to see eye-to-eye. ";
    pers[legion] += "\n\nOther legions value your contributions but become weary of your successes, sensing ulterior motives when you have none. ";

    cult[legion] = "1. Most numerous, successful, and generalized legion ";
    cult[legion] += "\n\n2. Have a culture centered on the 500-planet sub-sector of \"Ultramar\" ";
    cult[legion] += "\n\n3. Ensure a high quality of life for the systems they oversee ";
    cult[legion] += "\n\n4. Heavily value the \"Codex Astartes,\" rules their primarch encouraged to avoid future rebellions ";
    cult[legion] += "\n\n5. Retain hints of Roman culture ";

    prim2[legion] = "2. United a sub-sector of 500 planets before reuniting with his legion ";
    prim2[legion] += "\n\n3. Described as \"if Microsoft Excel were a superpower\" ";
    prim2[legion] += "\n\n4. Given nicknames because his actual name is weird ";
    prim2[legion] += "\n\n5. Arrived after the primarch rebellion ended, leaving him with minimal casualties ";
    prim2[legion] += "\n\n6. Was later left on the brink of death by Fulgrim and kept in stasis for 10,000 years ";
    prim2[legion] += "\n\n7. One of only two loyalist primarchs to return to humanity ";
    prim2[legion] += "\n\n8. Initially rejected the 41st-millenium's notion that The Emperor was a god, but now genuinely questions that reality ";

    legion += 1;

    //Death Guard
    pers[legion] = "Deathguard are measured, consistent, and resilient.";
    pers[legion] += "\n\nYour choices must consider an allergy, condition, or frequent illness. ";
    pers[legion] += "Feeling at your worst, a beloved hobby can distract you from pain and discomfort. ";
    pers[legion] += "Some of your favorite shows involve zombies ";
    pers[legion] += "or are simple, fun, long-running series with minimal changes across seasons. ";
    pers[legion] += "\n\nYou are weary when people leverage intellectural talents to influence others. ";
    pers[legion] += "You may intentionally downplay your own talents in this area. ";
    pers[legion] += "\n\nYou are physically and emotionally resilient. ";
    pers[legion] += "When bad things happen, you smile and draw comfort from the good still in your life. ";
    pers[legion] += "You are not overly optimistic or pessimistic, simply able to process and accept the present. ";
    pers[legion] += "You still avoid change when possible, taking comfort in consistency and predictability. ";
    pers[legion] += "\n\nYou will find yourself at-odds with Thousand Sons, as they champion change and intellectual superiority. ";
    pers[legion] += "\n\nYou may find surface-level commonality with Space Wolves, but spending time with them reveals incompatable differences. ";

    cult[legion] = "1. Serve the Chaos God of disease and stagnation ";
    cult[legion] += "\n\n2. Find happiness in nihilism, seeing the worst of the universe and appreciating their ability to survive it ";
    cult[legion] += "\n\n3. Rarely see change as for the better ";
    cult[legion] += "\n\n4. Sport a high rate of gruesome mutations, but are numbed to the pain of their disfigurement ";
    cult[legion] += "\n\n5. Use slow, methodical tactics favoring their resilient physiology ";

    prim2[legion] = "2. Rebelled against the planet's psychic overlords, but was interrupted by The Emperor before he was victorious ";
    prim2[legion] += "\n\n3. Vocally despised psychic talents, opposing their study and restricting their use ";
    prim2[legion] += "\n\n4. Betrayed humanity and was stricken with disease, forcing him to swear himself and his legion to the Chaos God of plague ";
    prim2[legion] += "\n\n5. Ascended to daemonhood, awakening his inherent psychic abilities ";
    prim2[legion] += "\n\n6. Resents the Chaos God he serves; is now trapped and tortured by his Chaos God after failures following the traitors' defeat ";

    legion += 1;

    //Thousand Sons
    pers[legion] = "Thousand Sons are intelligent and recklessly curious. ";
    pers[legion] += "\n\nYou thrive in academia and enjoy learning for the sake of it, even when it provides no practical skills. ";
    pers[legion] += "You tend to believe others think as you do and can be misled by frauds. ";
    pers[legion] += "Others manipulate you under the pretense of proving value in your skills and beliefs. ";
    pers[legion] += "\n\nYou make major decisions without fully considering their impacts. ";
    pers[legion] += "This is a driving source of progress, but can also backfire to create large and unexpected problems. ";
    pers[legion] += "You can admit you are wrong and feel compelled to correct mistakes that hurt people you value -- ";
    pers[legion] += "though you can also use those opportunities to end harmful relationships. ";
    pers[legion] += "\n\nYou enjoy the fantasy genre and often wish the world was more like such stories. ";
    pers[legion] += "At a young age, you may have struggled to accept that magic wasn't real. ";
    pers[legion] += "As an adult, you can better distinguish fact from fiction, but find life to be dull as a result. ";
    pers[legion] += "\n\nMany legions, such as the White Scars, silently share your views. You rarely communicate well enough to get along as well as you could. ";
    pers[legion] += "\n\nYou will not get along with Space Wolves, who dismiss your values and hobbies. ";
    pers[legion] += "\n\nYou rarely cooperate with Death Guard, who are weary of your sharp mind and prefer predictability to progress. ";

    cult[legion] = "1. Retain thematic elements of Egyptian culture ";
    cult[legion] += "\n\n2. Mastered forms of psychic sorcery ";
    cult[legion] += "\n\n3. Kept in small numbers by horrific mutations ";
    cult[legion] += "\n\n4. Were forced to serve the Chaos God of change ";
    cult[legion] += "\n\n5. Accidentally stripped all non-psychic astartes from free will and physical form; ";
    cult[legion] += "now seek to undo this horrible mistake ";

    prim2[legion] = "2. Was the most psychically gifted primarch ";
    prim2[legion] += "\n\n3. Nicknamed \"The Red\" for his copper skin and \"The Cyclops\" after losing an eye ";
    prim2[legion] += "\n\n4. Fought to prove the value of psychic powers after they were outlawed ";
    prim2[legion] += "\n\n5. Became manipulated by the Chaos God of change, causing him to accidentally destroy humanity's psychic protection ";
    prim2[legion] += "\n\n6. Wanted to remain loyal and atone for his mistake, but turned traitor when his world was needlessly burned ";
    prim2[legion] += "\n\n7. Was nearly killed by Leman Russ of the Space Wolves; he lost an eye in this battle ";
    prim2[legion] += "\n\n8. Ascended to daemonhood to save himself, his libraries of knowledge, and his legion ";

    legion += 1;

    //Luna Wolves
    pers[legion] = "Luna wolves are rebellious, inspiring, assertive, and inclusive. ";
    pers[legion] += "\n\nYou can get unruly groups to work together towards a common goal. ";
    pers[legion] += "Even your superiors look to you for direction, making you a natural leader. ";
    pers[legion] += "\n\nYou gladly challenge authority and are often the first to speak on a group's behalf. ";
    pers[legion] += "Your priority is your own success and the success of those closest to you. ";
    pers[legion] += "Individuals outside of this circle rarely matter and may be viewed as \"the problem\" -- ";
    pers[legion] += "but you are willing to grow this circle with time. ";
    pers[legion] += "You likely agree that \"If I can't have it, no one can!\" ";
    pers[legion] += "\n\nDark angels, Space Wolves, Imperial Fists, Iron Hands, Ultramarines, Salamanders, and Raven Guard ";
    pers[legion] += "often view you as callous and disruptive, making cooperation challenging. ";
    pers[legion] += "\n\nYou will get along well with White Scars and Blood Angels in the short-term, but rifts often form between you over time. ";
    pers[legion] += "\n\nEmperor's Children, Iron Warriors, Night Lords, World Eaters, Death Guard, Thousand Sons, and Word Bearers will often ";
    pers[legion] += "hesitate to open-up to you, but can form long-lasting friendships once they do. ";

    cult[legion] = "1. Have hints of Egyptian cultural influence ";
    cult[legion] += "\n\n2. Named after being \"The Emperor's dogs\" that reclaimed Earth's moon ";
    cult[legion] += "\n\n3. Originally meant as an offensive assault force ";
    cult[legion] += "\n\n4. Led the betrayal of humanity to become \"The Black Legion\" ";
    cult[legion] += "\n\n5. Accept members of other legions into their ranks ";
    cult[legion] += "\n\n6. Now led by Abaddon the Despoiler, an Astartes almost as powerful as a primarch ";

    prim2[legion] = "2. Was the first primarch found and The Emperor's \"favorite son\" ";
    prim2[legion] += "\n\n3. Was originally a charismatic leader among his siblings ";
    prim2[legion] += "\n\n4. Betrayed humanity after concluding the primarchs were made as disposable tools ";
    prim2[legion] += "\n\n5. Served all four Chaos Gods equally ";
    prim2[legion] += "\n\n6. Was utterly destroyed by The Emperor and denounced by his surviving legion ";
    prim2[legion] += "\n\n7. Remembered as the \"Arch Traitor\" and face of rebellion ";

    legion += 1;

    //Word Bearers
    pers[legion] = "Word Bearers are faithful and zealous.";
    pers[legion] += "\n\nYou serve some form of higher power -- either religious or earthly. ";
    pers[legion] += "This devotion serves as a basis for your identity and moral compass. ";
    pers[legion] += "Otherwise objectively terrible things become \"good\" if justified through this lens. ";
    pers[legion] += "Given a task for such a cause, you intentionally take your time to ensure it is done right. ";
    pers[legion] += "\n\nYou view yourself as a scholar or intellectual. ";
    pers[legion] += "Art, history, and psychology come easier to you and are preferred over primary maths and sciences. ";
    pers[legion] += "\n\nWhen you discover a passion, you devote yourself to it completely. ";
    pers[legion] += "You will never renounce your beliefs, defending them against any odds. ";
    pers[legion] += "Friends, family, and even strangers that lack your values will often be pressured to adopt them. ";
    pers[legion] += "\n\nYou value truth and uphold tradition. ";
    pers[legion] += "A person's trength and ability are driven by who and what they know as much as practical, individual skill. ";
    pers[legion] += "\n\nWord Bearers are often looked-down-upon by other legions. ";
    pers[legion] += "Ultramarines disregard tradition, making interactions with them especially unpleasant. ";
    pers[legion] += "\n\nRaven Guard will hound you relentlessly if you antagonize them. ";

    cult[legion] = "1. Revered The Emperor as a god until he rejected their worship ";
    cult[legion] += "\n\n2. Took longer to unite human worlds by religiously converting their populations ";
    cult[legion] += "\n\n3. Had their homeworld bombed by Ultramarines as punishment ";
    cult[legion] += "\n\n4. Now serve all four Chaos Gods equally ";
    cult[legion] += "\n\n5. Summon daemonic allies and allow themselves to be possessed ";
    cult[legion] += "\n\n6. Looked-down-upon by other legions and considered weak ";

    prim2[legion] = "2. Described himself as a scholar, not a warrior ";
    prim2[legion] += "\n\n3. Worshipped The Emperor instead of his homeworld's pantheon ";
    prim2[legion] += "\n\n4. Wanted to know the true nature of faith ";
    prim2[legion] += "\n\n5. Became the first primarch to worship the Chaos Gods ";
    prim2[legion] += "\n\n6. Ascended to daemonhood in service of all four Chaos Gods ";
    prim2[legion] += "\n\n7. Remains trapped in a daemonic realm by Corvus Corax ";

    legion += 1;

    //Salamanders
    pers[legion] = "Salamanders are strong, artistic, and kind. ";
    pers[legion] += "\n\nYou have talent or appreciation for some form of visual art. ";
    pers[legion] += "Subjects involving dragons, fire, and volcanism may especially speak to you. ";
    pers[legion] += "Your favorite examples of art also serve a practical purpose. ";
    pers[legion] += "\n\nYou have strong ties to friends and family. ";
    pers[legion] += "Your bonds are strengthened through tradition, common goals, and random acts of kindness. ";
    pers[legion] += "These may also extend to strangers, expanding your social circle over time. ";
    pers[legion] += "New people warm-up to you quickly, but rarely the very first time you meet. ";
    pers[legion] += "\n\nAfter a loss, you may grieve more and longer than others. ";
    pers[legion] += "Losing someone will never break you, but you will always remember and miss those no longer with you. ";
    pers[legion] += "\n\nYou exercise regularly or are naturally strong. ";
    pers[legion] += "You are also likely tall or have a physical quality that makes you stand-out in a crowd. ";
    pers[legion] += "\n\nYou have no especially easily or difficult interactions with other astartes, ";
    pers[legion] += "tending to get along reasonably well with all other legions. ";

    cult[legion] = "1. Become accomplished blacksmiths and metalworkers ";
    cult[legion] += "\n\n2. Use dragon imagery and fire-based weaponry ";
    cult[legion] += "\n\n3. Are the only astartes allowed to keep ties with their mortal families ";
    cult[legion] += "\n\n4. Care the most for civilian life and others' wellbeing ";
    cult[legion] += "\n\n5. Some of the physically largest astartes ";
    cult[legion] += "\n\n6. Believe collecting their primarch's lost works will allow him to return ";
    cult[legion] += "\n\n7. Have low numbers after taking heavy losses from the traitor legions ";

    prim2[legion] = "2. Is a \"perpetual\" that (allegedly) cannot truly die ";
    prim2[legion] += "\n\n3. Stands the tallest of all primarchs ";
    prim2[legion] += "\n\n4. Has a menacing appearance, but is incredibly kind ";
    prim2[legion] += "\n\n5. Made many of humanity's greatest weapons ";
    prim2[legion] += "\n\n6. Was vaporized in a battle with orks and has not returned ";

    legion += 1;

    //Raven Guard
    pers[legion] = "Raven Guard are artistic, subtle, and patient. ";
    pers[legion] += "\n\nYou have a talent for writing in some form. ";
    pers[legion] += "Your favorite stories have darker tones and deal with myths or the supernatural. ";
    pers[legion] += "\n\nIn a personal space, you prefer dim or indirect lighting. ";
    pers[legion] += "You are not an unwelcome presence, but others are often initially unaware you have entered a room. ";
    pers[legion] += "\n\nYou remain cool-headed, even in tense situations. ";
    pers[legion] += "You genuinely care for others' wellbeing and pay special attention to the legacies they leave. ";
    pers[legion] += "\n\nYou may blame yourself for a past failure and seek to atone for it. ";
    pers[legion] += "Any help or advice you offer to others is carefully considered so it will not lead to misfortune. ";
    pers[legion] += "\n\nYou get along well with most legions, excluding the Word Bearers and Alpha Legion. ";
    pers[legion] += "Word Bearers are frustratingly ignorant to the suffering their rigid traditions cause. ";
    pers[legion] += "The Alpha Legion repeatedly takes advantage of your kind nature. ";
    pers[legion] += "Both create unhealthy relationships that often end in hostility. ";

    cult[legion] = "1. Use stealth and surprise to catch foes off guard ";
    cult[legion] += "\n\n2. Feature avian imagery, including beak-like helmets ";
    cult[legion] += "\n\n3. Appreciate poetry and literary arts ";
    cult[legion] += "\n\n4. Took heavy losses when humanity was betrayed ";
    cult[legion] += "\n\n5. Have limited cultural influences from early American and Native Americans ";
    cult[legion] += "\n\n6. Originally nicknamed the \"Pale Nomads\" and the \"Dust Clad\" ";

    prim2[legion] = "2. Unified his homeworld with guerilla warfare and hit-and-run tactics ";
    prim2[legion] += "\n\n3. Had shadow-based psychic powers ";
    prim2[legion] += "\n\n4. Attempted to accelerate astartes creation after taking heavy losses, disfiguring many of his legion ";
    prim2[legion] += "\n\n5. Left after the rebellion in penance for his shame and perceived failures ";
    prim2[legion] += "\n\n6. Has allegedly become a sort of \"Imperial daemon\" resembling a raven ";
    prim2[legion] += "\n\n7. Keeps Lorgar of the Word Bearers trapped in a daemonic realm ";

    legion += 1;

    //Alpha Legion
    pers[legion] = "The Alpha Legion are deceptive, cunning, manipulative, and enigmatic. ";
    pers[legion] += "\n\nIt is easy for you to mask your emotions and hide your deeper feelings. ";
    pers[legion] += "You have multiple, radically different personalities that you tailor to different settings. ";
    pers[legion] += "Your \"true self\" is whatever a given group wants or needs you to be. ";
    pers[legion] += "\n\nYou are adaptive to social and practical situations. ";
    pers[legion] += "The ability to fill any role and find social success may gradually lead to a superiority complex. ";
    pers[legion] += "\n\nYou prefer to reap the rewards of your actions over time, rather than settling for immediate payouts. ";
    pers[legion] += "Plans may take months or years to fully materialize. ";
    pers[legion] += "Over time, you are also able to erode others views and reshape them to fit your own. ";
    pers[legion] += "Your motivation in doing so is as much for others' benefit as your own. ";
    pers[legion] += "\n\nImperial Fists and Ultramarines will often sense your manipulation, refusing to trust you or follow your lead. ";
    pers[legion] += "\n\nRaven Guard will usually only fall for your manipulations once before growing hostile towards you. ";

    cult[legion] = "1. Have an unclear allegiance, helping both loyalists and traitors ";
    cult[legion] += "\n\n2. Represented by a many-headed hydra ";
    cult[legion] += "\n\n3. Have bald, taller astartes that resemble their primarch ";
    cult[legion] += "\n\n4. Most claim to be their primarch, Alpharius ";
    cult[legion] += "\n\n5. Are talented liars and impersonators ";
    cult[legion] += "\n\n6. Maintain extensive spy networks ";
    cult[legion] += "\n\n7. Rarely take credit for their actions ";
    cult[legion] += "\n\n8. Are the only legion to have twin primarchs; most only know of Alpharius ";

    prim2[legion] = "2. Had the psychic ability to be mentally undetected and be perceived as other individuals ";
    prim2[legion] += "\n\n3. Swapped places after a point, with Omegon claiming to be Alpharius ";
    prim2[legion] += "\n\n4. Turned traitor as part of a prophecy to eradicate both humanity and the Chaos Gods ";
    prim2[legion] += "\n\n5. Seemingly had the original Alpharius side with humanity and Omegon side with Chaos ";
    prim2[legion] += "\n\n6. One twin disappeared and the other was killed by Rogal Dorn of the Imperial Fists; it is unclear which died ";

    legion += 1;

    //Compile Info
    for (let i = 0; i < legion; i++) {
        //Constant Info
        if (i != 1 && i != 10) prim2[i] = "1. " + quizAstartesHomeworld(i, true, true) + "\n\n" + prim2[i];
        prim[i] = "";
        misc[i] = "";
        
        //Visible Info
        legions[i] = [];
        legions[i][legions[i].length] = pers[i];
        legions[i][legions[i].length] = cult[i];
        //legions[i][legions[i].length] = prim[i];
        legions[i][legions[i].length] = prim2[i];
        //legions[i][legions[i].length] = hist[i];
        //legions[i][legions[i].length] = misc[i];
    }

    //Final Returns
    if (id < 0 || id >= legions.length) return legions;
    if (part < 0 || part >= quizResultReadTitles(-1).length) return legions[id];
    return legions[id][part];
}

//Returns the Name of a Legion's Primarch
function quizAstartesPrimarchName(id) {
    let names = [];

    names[names.length] = "Lion El'Jonson";
    names[names.length] = "[Redacted]";
    names[names.length] = "Fulgrim";
    names[names.length] = "Perturabo";
    names[names.length] = "Jaghatai Khan";
    names[names.length] = "Leman Russ";
    names[names.length] = "Rogal Dorn";
    names[names.length] = "Konrad Curze";
    names[names.length] = "Sanguinius";
    names[names.length] = "Ferrus Manus";
    names[names.length] = "[Redacted]";
    names[names.length] = "Angron";
    names[names.length] = "Roboute Guilliman";
    names[names.length] = "Mortarion";
    names[names.length] = "Magnus the Red";
    names[names.length] = "Horus Lupercal";
    names[names.length] = "Lorgar";
    names[names.length] = "Vulkan";
    names[names.length] = "Corvus Corax";
    names[names.length] = "Alpharius / Omegon";

    if (id < 0 || id >= quizResults.length) return names;
    return names[id];
}

//Returns the Name of a Legion's Allegiance
function quizAstartesAllegiance(id) {
    let names = [];

    names[names.length] = "Loyalist (Mostly)";
    names[names.length] = "[Redacted]";
    names[names.length] = "Traitor";
    names[names.length] = "Traitor";
    names[names.length] = "Loyalist";
    names[names.length] = "Loyalist";
    names[names.length] = "Loyalist";
    names[names.length] = "Traitor";
    names[names.length] = "Loyalist";
    names[names.length] = "Loyalist";
    names[names.length] = "[Redacted]";
    names[names.length] = "Traitor";
    names[names.length] = "Loyalist";
    names[names.length] = "Traitor";
    names[names.length] = "Traitor";
    names[names.length] = "Traitor";
    names[names.length] = "Traitor";
    names[names.length] = "Loyalist";
    names[names.length] = "Loyalist";
    names[names.length] = "Traitor (Probably)";

    if (id < 0 || id >= quizResults.length) return names;
    return names[id];
}

//Returns the Name of a Legion's Allegiance
function quizAstartesHomeworld(id, nameOnly, makeDesc) {
    let names = [];
    let desc = [];

    names[names.length] = "Caliban";
    names[names.length] = "[Redacted]";
    names[names.length] = "Chemos";
    names[names.length] = "Olympia";
    names[names.length] = "Mundus Planus";
    names[names.length] = "Fenris";
    names[names.length] = "Inwit";
    names[names.length] = "Nostramo";
    names[names.length] = "Baal";
    names[names.length] = "Medusa";
    names[names.length] = "[Redacted]";
    names[names.length] = "Nuceria";
    names[names.length] = "Macragge";
    names[names.length] = "Barbarus";
    names[names.length] = "Prospero";
    names[names.length] = "Cthonia";
    names[names.length] = "Colchis";
    names[names.length] = "Nocturne";
    names[names.length] = "Kiavahr";
    names[names.length] = "Terra*";

    desc[desc.length] = "the feudal, forested world of";
    desc[desc.length] = "[Redacted]";
    desc[desc.length] = "the resource-poor mining world of";
    desc[desc.length] = "the feudal, mountainous world of";
    desc[desc.length] = "the primitive grasslands of";
    desc[desc.length] = "the icy death-world of";
    desc[desc.length] = "the icy, resource-poor world of";
    desc[desc.length] = "the dim, cruel world of";
    desc[desc.length] = "an irradiated moon of the planet";
    desc[desc.length] = "the polluted, unnerving world of";
    desc[desc.length] = "[Redacted]";
    desc[desc.length] = "the brutal, gladiatorial world of";
    desc[desc.length] = "the beautiful, mountainous world of";
    desc[desc.length] = "the toxic, mountainous world of";
    desc[desc.length] = "the enlightened, desert world of";
    desc[desc.length] = "the feral, impoverished, former mining world of";
    desc[desc.length] = "the arid, religious world of";
    desc[desc.length] = "the irradiated, volcanic world of";
    desc[desc.length] = "Lycaeus, a former prison-moon of the planet";
    desc[desc.length] = "Omegon's homeworld is unknown; Alpharius claims to have been raised on Terra";

    if (makeDesc) {
        for (let i = 0; i < names.length; i++) {
            if (i != 1 && i != 10) names[i] = "Raised on " + desc[i] + " " + names[i];
        }
        names[19] = desc[19];
    }

    if (nameOnly) {
        if (id < 0 || id >= quizResults.length) return names;
        return names[id];
    }

    if (id < 0 || id >= quizResults.length) return desc;
    return desc[id];
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Quiz Content Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns Info for a Specific Question
function quizQuestionInfo(id) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(true);
    if (id >= quizQuestions.length) return quizResultInfo(quizCalcResult(), true);
    //Add Additional Function NEEDED for Getting Results Info

    let qs = []; //Modify Individual Questions Below

    qs[qs.length] = "In a social setting, you are the one MOST likely to:";
    qs[qs.length] = "Which flaws have others use to describe you?";
    qs[qs.length] = "What quality do you have that others praise?";
    qs[qs.length] = "What flaw would you assign to yourself?";
    qs[qs.length] = "How do you improve player performance in a game?";
    qs[qs.length] = "What family interaction is MOST important to you?";
    qs[qs.length] = "People who dislike you often judge you by what?";
    qs[qs.length] = "Which culture do you find MOST interesting?";
    qs[qs.length] = "Which of these vacations sounds the MOST enjoyable?";
    qs[qs.length] = "Which of these pets did you want as a child?";
    qs[qs.length] = "After making a mistake, you...";
    qs[qs.length] = "Which superpower would you want?";
    qs[qs.length] = "You consider most of your family to be:";
    qs[qs.length] = "Which fictional universe would you want to be a part of?";
    qs[qs.length] = "Your notes in class often contained:";
    qs[qs.length] = "In a story, the BEST character motivation is:";
    qs[qs.length] = "Which would you prefer?";
    qs[qs.length] = "A friend writes terrible poetry and asks your opinion. How do you respond?";
    qs[qs.length] = "What role would others use to define you?";
    qs[qs.length] = "The smartest student in a class is usually:";
    qs[qs.length] = "Which scene has the best atmosphere?";
    qs[qs.length] = "You prefer friends who are...";
    qs[qs.length] = "What is the BEST description of your wardrobe?";
    qs[qs.length] = "How would you label your career?";
    qs[qs.length] = "What is MOST impactful on your daily life?";
    qs[qs.length] = "How do others describe you?";
    qs[qs.length] = "What helps shape your sense of morality?";
    qs[qs.length] = "What solves most of the world's problems?";
    qs[qs.length] = "Which activity is MOST common for you?";
    qs[qs.length] = "At a social event, you are:";
    qs[qs.length] = "Which ideal is the MOST important?";
    qs[qs.length] = "People like me are:";
    qs[qs.length] = "It is MOST difficult for you to:";
    qs[qs.length] = "I have:";
    qs[qs.length] = "I fondly remember when I:";
    qs[qs.length] = "How would you summarize your emotions?";
    qs[qs.length] = "Which movie deserves to be a cultural icon?";
    qs[qs.length] = "It is better to be:";
    qs[qs.length] = "Which job requirement would be the LEAST pleasant?";
    qs[qs.length] = "In group projects, you:";
    qs[qs.length] = "Which historic figure is the MOST heroic?";
    qs[qs.length] = "What do others notice in your living space?";
    qs[qs.length] = "You have gotten or would consider getting:";
    qs[qs.length] = "You would consider...";
    qs[qs.length] = "Which activity would be most common or interesting for you?";
    qs[qs.length] = "You could see yourself being:";
    qs[qs.length] = "Justice is best served...";
    qs[qs.length] = "When traveling, you...";
    qs[qs.length] = "You often feel:";
    qs[qs.length] = "Which social activity sounds the most fun?";
    qs[qs.length] = "What is your most admirable trait?";
    qs[qs.length] = "What are you LEAST likely to do?";
    qs[qs.length] = "In a long-term survival situation, what is MOST important?";
    qs[qs.length] = "Punishment should be...";
    qs[qs.length] = "You are MOST likely to avoid...";
    qs[qs.length] = "Your vision of \"success\" includes:";
    qs[qs.length] = "You struggle to get along with people who are...";
    qs[qs.length] = "Which is MOST annoying?";
    qs[qs.length] = "Who is the MOST respectable author?";
    qs[qs.length] = "Which philosphy should people live-by?";
    //qs[qs.length] = "";

    //Prep Final
    let max = qs.length;
    for (let i = 0; i < max; i++) {
        //Remove Efficiency Helper if Errors Occur ~ Future Self: Please Test!
        if (id > 0 && id != -2 && id != -3) {
            i = id;
            max = i + 1;
        }

        let answ = quizAnswerInfo(i, -1);

        qs[i] = { "txt": qs[i], "answ": answ };
    }

    //Final
    if (id == -2) return qs;
    return qs[id];
}

//Returns Info for a Question's Specific Answer(s)
function quizAnswerInfo(id, answ) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(false);
    //Add Additional Function NEEDED for Getting Results Info

    let univWt = 1; //Universal Weight for Answers' Values ~ Modify Individually for Variance
    let txt;
    let res = [];
    let qs = []; //Modify Individual Question/Answer Blocks Below

    txt = ["Start an Argument", "Give a Compliment", "Decide the Activity", "Remain Quiet", "Accidentally Make Others Uncomfortable"];
    res = [[3, 11], [5, 8, 17], [12, 15], [4, 18], [7, 9, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Stubborn", "Gullible", "Dishonest", "Angry"];
    res = [[3, 6, 9, 13], [5, 14, 16], [19], [8, 11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Patience", "Curiosity", "Commitment", "Optimism"];
    res = [[4, 13, 18, 19], [2, 14], [5, 6, 16], [8]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Reclusive", "Reckless", "Jealous", "Judgmental"];
    res = [[0, 4, 18], [5, 11, 14], [2, 3], [6, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Add a Timer", "Form a Community Around it", "Create a Public Leaderboard", "Better Explain the Rules"];
    res = [[4], [8, 15, 16, 17], [2, 3], [9, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Sharing Life Advice", "Practicing Traditions", "Playing Boardgames", "Stopping them from Embarassing You"];
    res = [[18], [4, 16, 17], [5], [0, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Your Appearance", "Your Friends", "Your Beliefs", "Your Ego"];
    res = [[9, 13, 17], [0, 15], [6, 16], [2, 3, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["19th Century America", "Medieval Europe", "European Renaissance", "Ancient Greece / Rome", "Ancient China", "Ancient Egypt"];
    res = [[18], [0, 16], [8], [3, 11, 12], [4], [14, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Visiting the Pyramids of Giza", "Camping in the Rocky Mountains", "Riding the Trans Siberian Railway in Summer", "Seeing an Active Volcano in Iceland",
        "Touring the Holy Land of Jerusalem"];
    res = [[14, 15], [3, 12, 13], [4, 7], [5, 6, 17], [6, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Cat", "Dog", "Snake", "Bird", "Horse"];
    res = [[0], [5], [2, 19], [8, 18], [4]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Try to Fix it Yourself", "...Learn from it to Better Yourself", "...Blame Someone Else", "...Keep Doing Things as Normal"];
    res = [[0, 14, 18], [2, 9, 12], [3, 7, 19], [11, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Flight", "Controlling the Weather", "Regeneration", "Invisibility", "Shapeshifting"];
    res = [[8], [4, 5], [13], [18], [19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Embarassing", "Affectionate", "Successful", "Frustrating"];
    res = [[0, 9], [5, 8, 17], [2, 12], [3, 7, 11, 13, 14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Conan the Barbarian", "Game of Thrones", "Twilight", "The Walking Dead"];
    res = [[11], [0, 19], [5, 8], [7, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["No Organizational Structure", "Doodles", "Complex Diagrams", "Unnecessary Detail"];
    res = [[5, 7, 11], [2, 17, 18], [6, 9, 12], [14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Revenge", "Survival", "Glory", "Chivalry"];
    res = [[8, 11, 15, 18], [0, 13, 14], [2, 5], [16, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Being Sick and Staying Home from School / Work", "Cancelling a Vacation to Save Money", "Staying Up Late to Study for a Test", "Going Door-to-Door to Campaign"];
    res = [[13], [9, 12], [14], [6, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Be Brutally Honest", "Cut-Them-Off to Avoid Listening", "Offer Constructive Criticism", "Say What They Need to Hear", "Share Your Own Writing"];
    res = [[6], [3, 9, 11], [12, 14], [8, 17, 19], [2, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Athlete", "Scholar", "Actor", "Coordinator", "Independent"];
    res = [[5, 6, 11], [14, 16], [2, 19], [12, 15], [0, 3, 4, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["The Only Who Studies the Most", "The One Who Finishes Tests First", "The One Who Gets Away with Misbehaving", "The Teacher's Favorite"];
    res = [[9, 12, 14], [4], [7, 13], [15, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Moonlit Walk", "A Warm Fireplace", "Familiar Voices in a Bar", "A Bustling City Street"];
    res = [[7, 18], [17], [5], [6, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Competent", "...Loyal", "...Artistic", "...Hard Working"];
    res = [[3, 9], [0, 5, 8], [2, 17, 18], [6, 15]]; //Change Iron Hands to 'Aristic' due to Emp. Ch. connection?
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["I Often Wear the Same Few Shirts", "I Regularly Buy Replacements for Old Clothes", "I Am Interested in Function over Form", "I Dress for Attention"];
    res = [[13], [14], [3, 6, 9], [2, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Technology", "Management", "Service", "Labor", "Entertainment"];
    res = [[9], [12, 15], [16, 17], [3, 6], [2, 5]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Grudge", "An Allergy", "Family Disagreements", "A Past Failure"];
    res = [[3, 11, 15], [13], [6, 7, 9], [0, 14, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Tall", "Unkempt", "Attractive", "Generic"];
    res = [[17, 19], [5, 13], [2, 8], [12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Higher Authority", "Current, Changing Circumstances", "Personal Sense of Justice", "Views of Friends and Family"];
    res = [[6, 12, 16], [14, 19], [7], [11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Violence", "Economics", "Hard Work", "New Technology"];
    res = [[11, 15], [12], [6], [9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Rearranging Household Furniture", "Rewatching Your Favorite Shows with Friends", "Finding a Reason to Avoid a Social Event", "Doing Most of the Work in a Group Project"];
    res = [[2, 6, 14], [6, 13], [0, 18, 19], [3, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Mostly on Your Phone", "The First to Leave", "The First to Arrive", "Offering to Help the Host with Cleanup", "The Life of the Party"];
    res = [[9, 18], [0], [4], [6, 8, 12], [2, 5]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Truth", "Justice", "Honor", "Cooperation"];
    res = [[6, 14, 16], [7], [11], [0, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Rare", "Undervalued", "Necessary", "Justified"];
    res = [[2, 14, 17, 18], [3, 4], [6, 9, 19], [7, 11, 15, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Forgive Others", "Find Satisfaction", "Accept Change", "Stand-Out"];
    res = [[0, 8, 11, 15, 18], [2], [13], [3, 4, 12, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Nicknames", "Allergies", "Secrets", "Hopes", "Traditions"];
    res = [[12, 14], [13], [0, 19], [8], [16, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Played Outdoor Sports", "Earned a Degree", "Overcame an Injury or Disease", "Created a Work of Art"];
    res = [[5], [14, 16], [13], [2, 17, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["I Feel More Strongly than Others", "I Try Not to Show Them", "They are Suppressed so I Can Focus", "They are Often Mixed on a Topic"];
    res = [[2, 17], [0, 19], [3, 9], [8, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["How to Train Your Dragon (2010)", "RoboCop (1987)", "Dracula (1931)", "Friday the 13th (1980)"];
    res = [[5, 17], [9, 12], [8], [7, 11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Feared", "Ignored", "Disrespected", "Hurt"];
    res = [[7], [4, 19], [16], [13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Drug Test", "A Polygraph Test", "Mandatory Community Service", "Mandatory Vaccinations"];
    res = [[2, 5], [0, 19], [3, 7, 9, 11, 15], [13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Do Most of the Work", "Focus on Parts Best Suited to You", "Assign Each Member's Tasks", "Leave Others the Biggest Roles", "Do As You are Told"];
    res = [[3], [0, 9], [12, 15], [2, 7, 19], [11, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Joan of Arc", "Genghis Khan", "Julius Caesar", "Vladimir Lenin"];
    res = [[0, 8, 16], [4, 11], [3, 12], [7, 15, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Hanging Posters", "Pets", "Frequent Changes", "Clutter"];
    res = [[4], [0, 5], [14, 19], [13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Tattoo", "Forklift Certified", "Unconventional Piercings", "A CPA License"];
    res = [[4], [3, 6, 9], [2], [12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Owning a Pet", "...Reading a Fantasy Novel", "...Making Illegal Graffiti", "...Overclocking Your Computer"];
    res = [[0, 5], [14, 18], [2, 7, 15], [3, 4, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Hiking in a National Forest", "Mountain Climbing", "Storm Chasing", "Competitive Boxing"];
    res = [[0], [3, 12, 13], [4], [5, 11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Professional Welder", "A Pet Groomer", "A Nascar Driver", "A Film Critic", "A Preacher", "A Data Analyst", "A Vascular Surgeon"];
    res = [[17], [0, 5], [4], [2, 18], [16], [9, 14], [8, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...In a Court of Law", "...On the Street", "...Through Riots and Protests", "...Without Fanfare"];
    res = [[12], [7, 11], [15], [0, 4, 18, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Seek-Out New Experiences", "...Often Revisit the Same Places", "...Make Your Group's Itinerary", "...Never Visit the Same Place Twice"];
    res = [[2], [13], [12, 15], [14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Bored", "Uneasy", "Angry", "Optimistic", "In Charge", "Productive"];
    res = [[2], [0], [11], [8], [12, 15], [6, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Drinking at a Bonfire", "Racing Go Karts", "Building a Treehouse", "Visiting a Science Museum", "Being Part of a Haunted House"];
    res = [[5, 17], [4], [6], [14], [7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Empathy", "Versatility", "Adaptability", "Practicality"];
    res = [[5, 8, 17, 18], [0, 12], [19], [3, 6, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Make Fun of Your Own Low Test Scores", "Walk Slower to Let Someone Pass You", "Replace an Old but Functioning Appliance", "Apologize When Someone Else Bumps into You"];
    res = [[2, 3, 14], [4], [12, 13], [11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Fire", "Shelter", "Ecological Knowledge", "The Right Attitude"];
    res = [[17], [3, 6], [14], [8, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Retribution", "...A Deterrent", "...A Matter of Perspective", "...Physical"];
    res = [[0, 3, 8, 11, 15, 18], [7], [2], [6, 11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Confronting a Friend about a Difficult Truth", "...Driving Under the Speed Limit", "...Sharing an Embarassing Secret", "...Outright Lying to Make Someone Feel Better"];
    res = [[19], [4], [0], [6]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Public Validation", "A Positive Mental State", "Objective Results", "A Sense of Justice"];
    res = [[2, 3], [8, 13], [9], [7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Manipulative", "...Loud and Rowdy", "...Overly Optimistic", "...Cartoonishly Altruistic", "...Keen on Flaunting their Intelligence", "...Disrepectful of Tradition"];
    res = [[6, 18], [0, 14], [7], [9], [5, 13], [16, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Making Small-Talk", "Being Stuck Behind a Crowd of Slow Walkers", "Listening to Someone You Know is Lying to You", "Working Around an Allergy"];
    res = [[9], [4], [6], [13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Edgar Allan Poe", "Isaac Asmiov", "J.R.R. Tolkien", "Dante Alighieri"];
    res = [[18], [9], [14], [16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["\"The Truth Shall Set You Free\"", "\"Don't Stress About What You Can't Change\"", "\"Do a Good Turn Daily\"", "\"A Tyrant Only Fears Overwhelming Force\""];
    res = [[6, 16], [13], [5, 8, 17, 18], [11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    //---

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    //Final
    if (id == -2) return qs;
    if (answ < 0) return qs[id];
    return qs[id][answ];
}

//Returns Title Info
function quizTitleInfo(getTitle) {
    //Change to Desired Opening Title
    let title = "Introduction";
    //Change to Include Desired Opening Explanation
    let writeup = "In the grim darkness of the far future, there is only war."
    //writeup += "\nForget the promise of progress and understanding, for in the grim dark future there is only war."
    writeup += "\nThere is no peace amongst the stars, only an eternity of carnage and slaughter, and the laughter of thirsting gods.";
    writeup += "\n\nHumanity's dying empire is maintained by legions of genetically augmented space marines: the Adeptus Astartes.";
    writeup += "\n\nEach of their original legions has unique traditions and behavioral tendencies. ";
    writeup += "Some are from collective culture. Others originate with the genetic template (\"primarch\") from which the legion was founded.\n\n\n";
    writeup += "Take this quiz to determine which legion would best suit your talents and personality!";
    writeup += " Choose the most accurate answer for each question, even if none directly apply.\n\n";

    if (getTitle) return title;
    return writeup;
}

//Returns Info for Initial Result Categories
function quizResultCategoryInfo(id, titleOnly) {
    let astartesLegions = 20;
    let result = [];
    let details = [];

    //Modify different Result/Detail Blocks Below

    for (let i = 0; i < astartesLegions; i++) {
        result[i] = quizAstartesLegions(i);
    }

    for (let i = 0; i < result.length; i++) {
        if (titleOnly) i = result.length;
        details[i] = quizAstartesResults(i, 0);
    }

    //Final
    if (id < 0 && id != -2 && id != -3 && titleOnly) return result;
    if (id < 0 && id != -2 && id != -3 && titleOnly == false) return details;
    if (id == -2 && titleOnly) return result.length;
    if (id == -2) return details.length;
    if (titleOnly) return result[id];
    return details[id];
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Unused Astartes Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns Result Info for Astartes Legions -- Now Unused, Kept for Records, Goes to Legion #14 (0-13 in Order)
function quizAstartesOriginalResults(id, part) {
    let legion = 0;
    let legions = [];
    let pers = [];
    let cult = [];
    let prim = [];
    let prim2 = [];
    let hist = [];
    let misc = [];

    //Sample Legion Creation

    /*pers[legion] = "";
    cult[legion] = "";
    prim[legion] = "";
    hist[legion] = "";
    misc[legion] = "";
    legion += 1;*/

    //Legion-Specific Info

    //Dark Angels
    pers[legion] = "Dark Angels are often paranoid and withdrawn. \n\nYou may be slow to trust anyone or may only confide in a small group of likeminded individuals. ";
    pers[legion] += "You are slow to forgive and often see the harmful actions of those close to you as your personal failings. ";
    pers[legion] += "When you or those close to you make mistakes, you take drastic measures to cover-them-up and avoid outside help. ";
    pers[legion] += "This leaves you endlessly trying to prove your value and loyalty to those who already trust and appreciate you. ";
    pers[legion] += "\n\nYou will find common goals with Space Wolves, but often disagree on how you view and pursue them. ";

    cult[legion] = "Dark Angels are the 1st legion and resemble a loyalist order of medieval knights. Considered \"Generalists,\" individuals often specialize in specific tasks, ";
    cult[legion] += "leaving the collective legion prepared for any challenge. Their primary motivation is finding \"The Fallen\" -- a group of Dark Angels that turned traitor ";
    cult[legion] += "in an ancient war. This leads them to abandon allies and objectives without warning, so as to keep their motives secret. ";
    cult[legion] += "If the wider galaxy learns of their fellows' betrayal, the legion is concerned they will all be marked as traitors. ";

    prim[legion] = "Lion El'Jonson is the primarch of the Dark Angels and the first primarch to have ever been created. ";
    prim[legion] += "When the Chaos Gods scattered the primarchs throughout the galaxy, The Lion landed in the warp-tainted forests of Caliban. ";
    prim[legion] += "The knights that found him considered slaying him as a wild monster, but were swayed to raise him as one of their own. ";
    prim[legion] += "His name translates to \"Son of the Forest\" and, even as he united his world and rose as a knightly figure, part of him remained ";
    prim[legion] += "the feral child found in the jungle. The Lion has been described as \"a beast pretending to be a man,\" passing his often ";
    prim[legion] += "callous outlook towards the lives and wellbeing of mortals onto his sons. In the 41st millenium, he is one of only two primarchs to ";
    prim[legion] += "return and become active within the galaxy. Since returning, he has been shown as humbled and more forgiving. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "Originally the \"Angels of Death,\" the Dark Angels were renamed after Lion El'Jonson became the 11th primarch to reunite with The Emperor. ";
    hist[legion] += "During the Horus Heresy, they remained loyalist and divided their forces: one group to aid the Imperium, the other to remain protecting Caliban. ";
    hist[legion] += "After the war ended, the survivors returned home to find its defenders had predicted defeat and turned traitor. ";
    hist[legion] += "The resulting battle utterly destroyed Caliban and let Chaos scatter surviving traitors across time and space. ";
    hist[legion] += "A fortress monastery was built from the planet's remains and at its heart, unknown to the legion, their primarch remained in stasis for ";
    hist[legion] += "over 10,000 years. Most of that time has been spent hunting \"The Fallen,\" but Lion El'Jonson's return may offer hope for their redemption. ";

    misc[legion] = "1. It is rumored Lion El'Jonson had lion DNA spliced into his creation, evidenced by his elongated canines.";
    misc[legion] += "\n\n2. The Dark Angels and the Space Wolves are allied rivals, generally disliking and arguing with one another. ";

    legion += 1;

    //Lost 2nd
    pers[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    cult[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    prim[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    prim2[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    hist[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    misc[legion] = "All information regarding the 2nd legion has been purged from Imperial records. ";
    legion += 1;

    //Emperor's Children
    pers[legion] = "Emperor's Children are proud perfectionists driven by recognition. ";
    pers[legion] += "\n\nYour elevated sense of self leads you to look down on those less accomplished than you and resent those more accomplished. ";
    pers[legion] += "Correcting any personal shortcoming or failure, however small, often becomes an obsession. ";
    pers[legion] += "\n\nYou may amuse yourself with pranks and similar shenanigans for laughs or breaks from monotony -- especially after being starved of attention. ";
    pers[legion] += "Boredom is your greatest enemy and you will go to extreme lengths to find new and exciting pastimes. ";
    pers[legion] += "\n\nMost of your self-image stems from genuine talent in multiple fields, at least one of which is often a form of art. ";
    pers[legion] += "\n\nYour personality is most opposite the Iron Hands, but you will often enjoy their company and find your skills compliment each other. ";

    cult[legion] = "Emperor's Children were once united and collaborative in their pursuit of perfection, but have since grown individualistic and depraved. ";
    cult[legion] += "Most grow bored with the status quo and form small bands in pursuit of increasingly extreme forms of stimuli. ";
    cult[legion] += "The majority of this legion fell to Chaos and now serve Slaanesh, the hedonistic prince of pain and pleasure. ";
    cult[legion] += "Those few who loyal to humanity, such as Rylanor, often carry extreme charisma and become famous for memorable displays of valor. ";

    prim[legion] = "Fulgrim is the primarch of the Emperor's Children. He was raised on a desolate mining world and endeavored to rebuild its society so that ";
    prim[legion] += "art could thrive again. A friendly rivalry quickly formed between Fulgrim and Ferrus Manus, primarch of the Iron Hands. ";
    prim[legion] += "His love of beauty eventually led him to wield a possessed sword and turn to Chaos, killing his fellow primarch in the process. ";
    prim[legion] += "Most of the Horus Heresy saw him become more depraved and keen on reveling in the spoils of war, rather than winning battles. ";
    prim[legion] += "Eventually, he ascended to daemonhood under the control of Slaanesh - nearly killing Perturabo, primarch of the Iron Warriors, in the process. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "Originally having no formal title, the Emperor's Children were reduced to only a few hundred marines when they reunited with Fulgrim. ";
    hist[legion] += "Giving an impassioned speech and swearing to accomplish as much as the other legions, even with fewer numbers, Fulgrim had his legion's ";
    hist[legion] += "name awarded by The Emperor himself. While loyalist, they were the only ones permitted to wear the Imperial Aquilla. ";
    hist[legion] += "Exposure to the daemonic cultures, art, and music of xenos races eventually turned the legion towards Chaos. ";
    hist[legion] += "They continue yelling \"For The Emperor\" for their battle-cry as a jibe at Imperial forces. ";

    misc[legion] = "1. Fulgrim was considered the most physically attractive primarch and was the only primarch to ever marry. ";
    misc[legion] += "\n\n2. Fulgrim's daemon form resembles the serpentine xenos (\"Laer\") that crafted his possessed sword. ";

    legion += 1;

    //Iron Warriors
    pers[legion] = "Iron Warriors are stubborn, short-tempered, and industrious. \n\nYou are ruthless when it comes to achieving your goals. ";
    pers[legion] += "You can be jealous of others with similar jobs or interests to your own -- especially if they are more celebrated or successful than you. ";
    pers[legion] += "You will often find series of small details and sleights to slowly wear-down those that disagree with you. ";
    pers[legion] += "\n\nDespite all of this, you are competent and capable when you put your mind to a subject you value. ";
    pers[legion] += "This earned confidence in your own judgment makes you unlikely to give ground in discussions or acknowledge the merits of others' points. ";
    pers[legion] += "\n\nFaith may not come easily to you, and you will be especially critical of those who do not share such beliefs. ";
    pers[legion] += "\n\nYou have a lot in common with the Imperial Fists, but will rarely get along with them. They specialize in building towards their ";
    pers[legion] += "personal goals, where you are better at tearing-down those of your competitors. ";

    cult[legion] = "Iron warriors prioritize siege warfare and brutal efficiency in combat. They will use any force or tool at their disposal, even if ";
    cult[legion] += "they morally disagree with it. Despite betraying The Imperium, they reject Chaos and most daemonic influences. ";
    cult[legion] += "Hints of Greek culture still exist among their ranks, including barbaric practices such as the decimation of their army after a failed assault. ";

    prim[legion] = "Perturabo was raised on the largely fuedal planet of Olympia, where he helped his adopted father rise to a seat of power. ";
    prim[legion] += "Upon reuniting with his legion and learning of their recent defeats, his first orders were for his army to be decimated: ";
    prim[legion] += "1 out of every 10 marines was beaten to death by his fellows as pitance. He disliked (and was disliked by) many of his siblings -- ";
    prim[legion] += "especially Rogan Dorn, who was assigned impressive architectural work compared to Perturabo. ";
    prim[legion] += "He joined in rebellion against The Imperium and ensured initial success, but abandoned his allies after they failed to meet his standards. ";
    prim[legion] += "Not seen in over 10,000 years, Perturabo is believed to have ascended to become a daemon prince -- though this debated, as it would go against his beliefs. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "Originally the \"Corpse Grinders,\" the Iron Warriors would be given their name and brutal tendencies upon reuniting with their primarch. ";
    hist[legion] += "Few ever developed a respect for mortals or their fellow astartes. ";
    hist[legion] += "During the Horus Heresy, they were known to eagerly bomb their allies' troops to ensure they would catch any enemies they had engaged. ";
    hist[legion] += "After the traitors' defeat, most fled and remained anti-Imperium -- though few have embraced the Ruinous Powers of Chaos. ";

    misc[legion] = "1. Perturabo is often described as a \"petulant man-child.\"";
    misc[legion] += "\n\n2. Perturabo hates Fulgrim, who tried to sacrifice him in a bid to achieve daemonhood. ";
    misc[legion] += "\n\n3. Perturabo was born able to see a scar Chaos left on material space. None of his legion have been documents with this ability. ";

    legion += 1;

    //White Scars
    pers[legion] = "White Scars are swift and efficient in all they do, but rarely choose to take credit for their successes. ";
    pers[legion] += "\n\nMany will overlook you -- sometimes by design, sometimes for reasons outside of your control. Despite this, you ";
    pers[legion] += "always uphold the promises you make. Those that get to know you will see you as quiet and humble but, when ";
    pers[legion] += "needed, you have a deceptively sharp tongue. \n\nYou may keep track of important events in the form of physical ";
    pers[legion] += "reminders or sentimental objects. \n\nYou find no specific legions difficult or likable. ";

    cult[legion] = "Mongolian cultural influences are present throughout White Scars' traditions. They put special emphasis on speed in natural and mechanical forms,";
    cult[legion] += "often represented through wind, lightning, and specialized vehicles. After a battle, they make shallow cuts on their skin and rub them ";
    cult[legion] += "with colored dirt. These then form scars: dark wounds for defeats, white ones for victories. ";

    prim[legion] = "Jaghatai Khan grew-up on the planet Mundus Planus, known for its strong winds and open plains. ";
    prim[legion] += "After reuniting with The Emperor and taking charge of his legion, he swore an oath of loyalty to The Imperium. ";
    prim[legion] += "He would have the foresight to foster psychic talents and sided with Magnus the Red when the legality of such arts were challenged. ";
    prim[legion] += "During the Horus Heresy, while he felt closest to Horus, he chose to uphold this oaths and remain loyal. ";
    prim[legion] += "Unlike many of his brothers, he chose to wait and watch events unfold, rather than be caught-up in the confusion ";
    prim[legion] += "that caused so much in-fighting. After the traitors were defeated, he would vanish chaising Dark Eldar raiders ";
    prim[legion] += "After the traitors were defeated, he would vanish chaising Dark Eldar raiders and remain missing for over 10,000 years. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "The White Scars were the 15th legion to find and reunite with their primarch. ";
    hist[legion] += "Originally, they were called the \"Star Hunters.\" ";
    hist[legion] += "Humility has simplified much of the White Scars' history. Arguably the least changed of any loyalist legion they ";
    hist[legion] += "quickly accepted (and now maintain) the practices and values instilled by their primarch. ";
    hist[legion] += "They remained loyal during the Horus Heresy and have had notable conflicts with orks, dark eldar, and necrons. ";

    misc[legion] = "1. Many primarchs did not want to give Jaghatai Khan control of his legion, believing that he could not ";
    misc[legion] += "easily transition from a society of horseback riders to the commander of futuristic soldiers. These concerns amounted to nothing. ";
    misc[legion] += "\n\n2. Jaghatai Khan's most famous line was in response to Fulgrim. When he was told \"I hear you do strange things to your ships,\" ";
    misc[legion] += "he told the primarch of the Emperor's Children that \"I hear you do strange things to your men.\"";

    legion += 1;

    //Space Wolves
    pers[legion] = "Space Wolves are rowdy and festive, but also kind and fiercely loyal. \n\nYou take interest in the stories your friends tell you about ";
    pers[legion] += "their lives and will want to share about your own. ";
    pers[legion] += "You are fiercely loyal and will go to great lengths to help friends and family in need. ";
    pers[legion] += "When those friends and family are not threatened, your friendly nature will extend to strangers that show you kindness. ";
    pers[legion] += "\n\nYou are likely a \"dog person\" if you own pets. ";
    pers[legion] += "\n\nYou will find rivalries with the Dark Angels that range from friendly to borderline hostile, and you will likely share their goals and interests. ";
    pers[legion] += "\n\nMost of your interactions with the Thousand Sons will devolve into open hostility, and you are unlikely to enjoy their hobbies. ";

    cult[legion] = "Wolves and vikings entirely summarize Space Wolf culture. They enjoy oral tradition and large feasts to celebrate their victories. ";
    cult[legion] += "Astartes cannot get drunk on simple alcohol, but the Space Wolves brew a toxin powerful enough to simulate alcohol (and kill a normal human). ";

    prim[legion] = "Leman Russ was raised by a wolf-like species on the icy planet Fenris before being taken-in by the local human population. ";
    prim[legion] += "After reuniting with his legion, he became \"The Emperor's Executioner.\" It is believed he earned this title in association ";
    prim[legion] += "with the lost legions. Just before the Horus Heresy, he was tricked into battling Magnus, the primarch of the Thousand Sons, ";
    prim[legion] += "and inadvertently caused his fall to Chaos. During the Heresy, he remained loyal and nearly killed Horus before the traitor was fully taken by Chaos. ";
    prim[legion] += "He disappeared shortly after the traitors were defeated and is believed to be searching for a way to heal The Emperor. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "Informally called \"The Rout\" prior to their reunion with Leman Russ, the Space Wolves quickly embraced Fenrisian culture. ";
    hist[legion] += "They remained loyal through the Horus Heresy and are one of the few legions to place elevated value on the life of the common citizen. ";
    hist[legion] += "The legion has entered conflict with the rest of The Imperium over the safeguarding of human life, leaving many distrustful of them. ";

    misc[legion] = "1. Many members of Leman Russ's warrior lodge successfully became space marines, despite being beyond the normal age limit. ";
    misc[legion] += "\n\n2. A tank is named after this legion's primarch, which is a source of humor and confusion. ";
    misc[legion] += "\n\n3. All Space Wolves have canine DNA spliced into their genomes, causing sharp teeth and giving some werewolf-like features. ";
    misc[legion] += "\n\n4. Leman Russ has been described as \"a noble man masquarading as a beast.\" ";

    legion += 1;

    //Imperial Fists
    pers[legion] = "Imperial Fists are honest and straightforward, sometimes to a fault. You will not want to lie, even about simple things. ";
    pers[legion] += "\n\nYou will enjoy architecture, mapmaking, and similar opportunities to either build or design physical spaces. ";
    pers[legion] += "\n\nDuring conflicts, you are at your best when allowing your opponent to take the offensive. During verbal debates, this often takes the form of ";
    pers[legion] += "laying logical traps or interjecting witty responses while your opposition speaks. You will struggle if these roles are reversed, as you lack talent ";
    pers[legion] += "as an instigator or when you are forced to directly pressure others. ";
    pers[legion] += "\n\nYou rarely get along with Iron Warriors, as they will ignore your moral codes and directly oppose your social tendencies. ";
    pers[legion] += "Despite wanting to distance yourself from the Iron Warriors' habits, you are also incredibly stubborn when you make-up your mind. ";
    pers[legion] += "\n\nYou will feel uneasy around an Alpha Legion astartes, sensing you can never fully trust them. ";

    cult[legion] = "Imperial Fists unite around the love of architecture -- especially fortifications and defensive structures. ";
    cult[legion] += "While most wanted to remain united under a common culture, an ancient conflict has left them fragmented and highly varied. ";
    cult[legion] += "Some utterly denounce foreign entities and cultures, embracing their status as demigods in service to an even higher power. ";
    cult[legion] += "Others remain grounded in conventional views and their legion's original appreciation for building-up a society's foundations. ";
    cult[legion] += "All accept physical pain as a way to sharpen their focus and clear their mind, as was first shown by their primarch. ";

    prim[legion] = "Rogal Dorn was raised on the icy world of Inwit. Traces of advanced technology were present across the world, but its population had ";
    prim[legion] += "devolved to the point it had to be relearned. Harsh conditions forced all classes of society to work equally hard to survive, and that ";
    prim[legion] += "same ethic was instilled in Dorn's legion when they were reunited. ";
    prim[legion] += "This dedication to his craft quickly earned dorn prestigious assignments, such as designing the Imperial Palace. ";
    prim[legion] += "After the Horus Heresy, Rogal Dorn disappeared facing over a hundred Iron Warriors so his sons could escape. ";
    prim[legion] += "Only one severed hand was recovered, and he is presumed dead. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "The Imperial Fists were the 7th legion to reunite with their primarch. ";
    hist[legion] += "They remained loyal during the Horus Heresy and strove to remain united by a common culture in its aftermath. ";
    hist[legion] += "Despite this, after losing their primarch, their individual chapters have become fragmented and incohesive. ";

    misc[legion] = "1. Rogal Dorn wields a two-handed chainsword named \"Storm's Teeth.\"";
    misc[legion] += "\n\n2. Rogal Dorn killed a primarch from the Alpha Legion, but it is unclear whether it was Alpharius or Omegon. ";
    misc[legion] += "\n\n3. The most famous astartes from this legion are the Black Templars, who are described as \"like your really racist, religious uncle.\" ";

    legion += 1;

    //Night Lords
    pers[legion] = "Night Lords are defined by their pressimism and unsettling nature. ";
    pers[legion] += "\n\nIn conversation, you will say things to intentionally shock and unnerve others -- either for the sake of ";
    pers[legion] += "attention from friends and family or to put potential adversaries off guard. ";
    pers[legion] += "\n\nYou often find yourself thinking ahead to future events and accurately predicting poor outcomes. ";
    pers[legion] += "This does not lead to paranoia, as you see these events as grim inevitabilities, not the actions of those \"out to get you.\" ";
    pers[legion] += "\n\nDuring disagreements, you will often try to wear-down the weakest member of your opposition until you make headway. ";
    pers[legion] += "When met with significant resistance, you are more likely to change tactics or leave a confrontation than stand for your beliefs. ";
    pers[legion] += "\n\nYou will find it difficult to get along with most legions. Blood Angels are especially difficult for you, as their optimism ";
    pers[legion] += "will conflict with your nihilistic disposition to fate. ";

    cult[legion] = "Night Lords were always sociopathic, becoming even crueler and disorganized over time. ";
    cult[legion] += "Their original purpose was using fear to end conflicts without significant loss of life, using torture and public mutilation ";
    cult[legion] += "in place of conventional warfare. Hints of Russian influence is present across their mannerisms and abandoned traditions. ";

    prim[legion] = "Konrad Curze grew-up on the dark planet of Nostramo: a den of criminals, poverty, and gang warfare. ";
    prim[legion] += "He used cruelty to bring the world into a more manageable state prior to The Emperor's arrival. ";
    prim[legion] += "Visions of cruel and twisted futures often came to Konrad and, on reuniting with The Emperor, he saw something ";
    prim[legion] += "horrible enough that he attempted to gouge-out his eyes. He has never revealed the details of this prediction. ";
    prim[legion] += "Resentful of the other primarchs' gifts, he readily joined in rebellion against The Emperor -- though his forces contributed little. ";
    prim[legion] += "Having foreseen his death at the hands of an assassin after the traitors lost, he welcomed his death so his prophecy would be upheld. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "1. Konrad Curze is the only primarch to have been killed by a mortal.";
    misc[legion] += "\n\n2. Nostramo was destroyed by orbital bombardment after Konrad learned it had devolved back to gang-rule in his absence. ";
    misc[legion] += "\n\n3. Most Night Lords were criminals from a young age. ";
    misc[legion] += "\n\n4. Konrad's first memory was as an infant, when he had to fight-off a starving man attempting to cannibalize him. ";

    legion += 1;

    //Blood Angels
    pers[legion] = "Blood Angels are all defined by their charisma, optimism, and genuine compassion for others. ";
    pers[legion] += "\n\nYou will often try to understand and remain in-tune with the emotions of those around you, using that ";
    pers[legion] += "insight to keep conversations level-headed and facilitate cooperation. ";
    pers[legion] += "Despite encouraging success as a group, you are also very capable on your own and happy to allow those around you ";
    pers[legion] += "to showcase their individual strengths. ";
    pers[legion] += "\n\nYou tend to see the best in people -- not necessarily in who they are at present, but in who they will become. ";
    pers[legion] += "These predictions are often validated, especially when you push others towards self-improvement. ";
    pers[legion] += "\n\nAll these traits become reversed if you harbor vengeful thoughts towards an individual, ";
    pers[legion] += "and you can often see the whole world (even those that support you) as being no better than someone who has wronged you. ";
    pers[legion] += "In this state, you are likely to hurt those around you out of spite, gaining emotional fulfillment from others' struggles. ";
    pers[legion] += "\n\nYou will get along well with most legions, but your compassion naturally bonds with Luna Wolves' leadership skills. ";
    pers[legion] += "\n\nYou will rarely get along with Night Lords, who embody the pessimistic mirror to your world views. ";

    cult[legion] = "Blood Angels showcase a mix of catholic imagery and vampiric tendencies. ";
    cult[legion] += "Originally paragons of virtue and heroism, Blood Angel successors are now an incredibly mixed group. ";
    cult[legion] += "Some still try to embody paladin-like honor and integrity, atoning for non-virtuous acts in various ways. ";
    cult[legion] += "Others become butchers, ferociously spilling and drinking the blood of their enemies (or sometimes allies). ";
    cult[legion] += "All run the risk of being overtaken by a psychic lust for vengeance called \"The Black Rage.\" ";

    prim[legion] = "Sanguinius spent his early life on a moon of the planet Baal, where his hawk-like wings left him mistaken for a mutant.";
    prim[legion] += "After being accepted by the population, his time was spent reclaiming the irradiated surface. ";
    prim[legion] += "When reunited with The Imperium, he quelled the vampiric urges of his legion and worked to settle differences among the primarchs. ";
    prim[legion] += "During the Horus Heresy, he psychically foresaw his potential death at the hands of Horus of the Luna Wolves, but chose to confront him anyway. ";
    prim[legion] += "Sanguinius failed to redeem Horus and was killed, the psychic backlash instilling a lust for vengeance in the Blood Angels. ";
    prim[legion] += "His legacy is that of a martyr and a genuine paragon of virtue. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "1. Many believed Sanguinius should have been a leader for the primarchs, rather than Horus of the Luna Wolves. ";
    misc[legion] += "\n\n2. Hawks and doves are seen as holy symbols in The Imperium because of their associate with Sanguinius. ";
    misc[legion] += "\n\n3. Sanguinius was one of the few primarchs to showcase and embrace psychic gifts, including the gift of foresight. ";

    legion += 1;

    //Iron Hands
    pers[legion] = "Iron Hands embrace technology, but are often as cold and calculating as machines.  ";
    pers[legion] += "\n\nYou value end results over their means and can be known to overlook how their pursuit impacts others. ";
    pers[legion] += "When talking with others, you rarely humor small-talk and are more likely to jump to the most important points. ";
    pers[legion] += "\n\nAny percieved weakness in yourself or others is something to be overcome, not accepted or even truly acknowledged. ";
    pers[legion] += "You may find yourself frequently growing apart from friends that refuse to fix their personal faults or withdrawing ";
    pers[legion] += "from friends and family while you work to fix your own. ";
    pers[legion] += "You also percieve the faults of older generations as your own, seeking to prove that you are \"better.\" ";
    pers[legion] += "\n\nYou may have artistic or creative talents, but you only use them as a tool towards other ends -- not out of enjoyment or appreciation for art itself. ";
    pers[legion] += "You will prefer hobbies and careers where problems have objective successes and failures. ";
    pers[legion] += "\n\nOthers may call you \"stubborn\" because, unlike you, they fail to properly consider issues. ";
    pers[legion] += "You see being wrong as being weak and avoid mistakes with advanced planning behind-the-scenes -- work undone by lesser minds rushing to conclusions. ";
    pers[legion] += "When your planning fails, you can accept your mistakes and fix them. ";
    pers[legion] += "\n\nYour personality is most opposite the Emperor's Children, but you will often enjoy their company and find your skills compliment each other. ";
    pers[legion] += "\n\nLegions such as the Space Wolves, Blood Angels, and Salamanders may conflict with you over the treatment of others, including strangers. ";

    cult[legion] = "Iron Hands abide by the mantra \"The Flesh is Weak.\" ";
    cult[legion] += "They replace parts of their bodies with bionics whenever possible, perceiving even their superhuman forms as flawed. ";
    cult[legion] += "They have close ties to the Adeptus Mechanicus, who supply The Imperium with their technology and equipment. ";
    cult[legion] += "Iron Hands maintain better technical knowledge and top-of-the-line gear through this connection. ";
    cult[legion] += "Most see their primarch's loss as a failure and sign of weakness, and thus they try to prove they are better than he was. ";

    prim[legion] = "Ferrus Manus was raised on the world of Medusa, becoming known as \"The Gorgon\" for his ugliness and stony disposition. ";
    prim[legion] += "Prior to reuniting with his legion, he killed a \"silver\" creature by plunging it into a pool of molten rock. ";
    prim[legion] += "The creature's skin melted to cover his hands, making them appear metallic. These only enhanced his strength and resilience. ";
    prim[legion] += "With his legion, he initially instilled the need to purge weakness in all forms. Their interpretation led many to emulate ";
    prim[legion] += "his strength with metallic bionics, and he resolved to find a way of removing his \"iron hands\" to end the pratice. ";
    prim[legion] += "Before he could, his legion was ambushed to begin the Horus Heresy, and Ferrus Manus became the first primarch to be killed ";
    prim[legion] += "when Fulgrim (Emperor's Children) beheaded him. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "The Iron Hands were originally called the \"Storm Walkers.\"";
    hist[legion] += " ";

    misc[legion] = "1. Ferrus Manus may lead the \"Legion of the Damned,\" a corps of spectral marines that appear on certain battlefields. ";
    misc[legion] += "\n\n2. Making \"head\" jokes on the Iron Hands Discord server will get you banned. ";
    misc[legion] += "\n\n3. Iron Hands do not value civilian lives and are therefore considered \"jerks\" by many legions. ";

    legion += 1;

    //Lost 11th
    pers[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    cult[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    prim[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    prim2[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    hist[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    misc[legion] = "All information regarding the 11th legion has been purged from Imperial records. ";
    legion += 1;

    //World Eaters
    pers[legion] = "World Eaters are angry and aggressive. ";
    pers[legion] += "\n\nYou are often the person to start an argument and the first to voice frustration over percieved sleights. ";
    pers[legion] += "Catalysts for confrontation can be random and insignificant, but you will consistently protect your sense of personal honor. ";
    pers[legion] += "Disagreements with friends and family are just as common as those with strangers, and you rarely pull punches. ";
    pers[legion] += "\n\nYou may lack long-term goals for confrontations, using conflict to vicariously lash-out at larger problems in life. ";
    pers[legion] += "Consciously, you may not even realize you take joy in these exchanges. ";
    pers[legion] += "You fight with others because you are mad and wanting to blow-off steam, not ";
    pers[legion] += "because want intellectual debates or to see others suffer. ";
    pers[legion] += "\n\nWhen you need a reason, you justify outbursts and hostility with past wrongs others have comitted against you. ";
    pers[legion] += "If an event caused you to \"see the world differently,\" there may be moments where you forget its damage and ";
    pers[legion] += "lapse into a previous, kinder headspace. These moments pass quickly and may become less common as you get older. ";
    pers[legion] += "\n\nDespite being disagreeable by nature, you are also quick to fall to peer pressure -- even when you know you are making a bad decision from it. ";
    pers[legion] += "\n\nYour argumentative nature makes it difficult for you to get along with other legions. ";
    pers[legion] += "Word Bearers will often take pity on you, becoming friendly towards you and more forgiving of your temper. ";

    cult[legion] = "World Eaters are a traitorous legion devoted to Khorne, Chaos God of blood and skulls. ";
    cult[legion] += "They do not erect temples or craft powerful weapons, and they have disdain for non-melee combat in all its forms. ";
    cult[legion] += "Their gear is taken from battlefields and their only goal is bloodshed. ";
    cult[legion] += "If too much time passes without finding an enemy to engage, groups of World Eaters will often turn on each other. ";
    cult[legion] += "They do not torture their enemies or leave lasting pain, only desiring killing blows and the taking of skulls. ";
    cult[legion] += "Originally honorable warriors, the legion now mandates surgical implants that force aggression under threat of pain. ";

    prim[legion] = "Angron was raised as a gladiator on the planet Nuceria. ";
    prim[legion] += "The world retained traces of advanced technology which were poorly understood and restricted to the ruling class. ";
    prim[legion] += "After refusing to kill a friend in the arena, Angron had \"Butcher's Nails\" implanted in his brain. ";
    prim[legion] += "These caused him to feel extreme pain when he was not feeling anger or participating in extreme violence. ";
    prim[legion] += "Killing his friend in a fit of rage, he waged open rebellion against the ruling elite only to be found and taken ";
    prim[legion] += "by The Emperor on the eve of their final battle. His forces were slaughtered, and he never forgave The Emperor for interfering. ";
    prim[legion] += "Slowly dying from the implants driving him to anger, he rebelled during the Horus Heresy and was \"saved\" ";
    prim[legion] += "by Lorgar, primarch of the Word Bearers, who helped him ascend to daemonhood. ";
    prim[legion] += "He now longs for a true death that will never come, his form reconstituting every 6 days so he may fight again. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "This legions were originally called the \"War Hounds.\" ";
    hist[legion] += " ";

    misc[legion] = "1. Angron may have been designed as a compassionate healer, as he showed the ability to take others' injuries and pain onto himself. ";
    misc[legion] += "\n\n2. Theories pose the \"lost\" legions may have had similar circumstances to Angron that \"ruined\" their primarchs. ";
    misc[legion] += "This would mean the World Eaters were nearly a third \"lost\" legion. ";
    misc[legion] += "\n\n3. World Eaters were originally portrayed as simplistic berserkers, but are now seen as tragic figures for the setting. ";

    legion += 1;

    //Ultramarines
    pers[legion] = "Ultramarines have an innately virtuous moral code and knack for logistics. ";
    pers[legion] += "\n\nYou often try to do what is right, even under pressure, and may have the nickname \"Boy Scout.\" ";
    pers[legion] += "Despite this, your lawful nature allows authority figures to override your personal sense of right and wrong. ";
    pers[legion] += "\n\nWhen given a task, you prioritize peripheral aspects that may be overlooked by others. ";
    pers[legion] += "Your path to success may be boring compared to some legions, but you more consistently succeed where others fail. ";
    pers[legion] += "You are incredibly efficient, bringing a level of bureaucracy to any challenge. ";
    pers[legion] += "\n\nOthers may consider you a natural leader for your reliable abilities, rather than charisma. ";
    pers[legion] += "Outside of leadership and planning, you are generally good at any role you are given, but are rarely the very best among your peers. ";
    pers[legion] += "\n\nAfter stepping-back from a project and returning later to find it has not thrived in your absence, you may become depressed and feel unaccomplished. ";
    pers[legion] += "You will not necessarily blame failures on others or take personal responsibility in these cases, so much as wish things were different. ";
    pers[legion] += "\n\nYou can get along with most legions, excluding Word Bearers. They tend to value tradition over efficiency, making it difficult to see eye-to-eye. ";
    pers[legion] += "\n\nOther legions will value your contributions but may become weary of your success, sensing ulterior motives when you have none. ";

    cult[legion] = "The Ultramarines are the most numerous, successful, and generalized legion. ";
    cult[legion] += "Their culture is centered on a domain of 500 planets that serves as a political entity within The Imperium. ";
    cult[legion] += "Quality of life here is high, and the marines work to both protect these systems and serve the wider forces of humanity across the galaxy. ";
    cult[legion] += "Most groups prioritize the \"Codex Asartes,\" which are rules suggested by their primarch to avoid future rebellions. ";

    prim[legion] = "Roboute Guilliman was raised on the planet Macragge, which had maintained much of its advanced technology. ";
    prim[legion] += "Prior to reuniting with The Emperor, he had not only united his individual planet, but a collection of nearly 500 worlds. ";
    prim[legion] += "The Ultramar sub-sector has been left nearly unchanged over 10,000 years due to his forethought and planning. ";
    prim[legion] += "During the Horus Heresy, he failed to arrive in time to help The Emperor, leaving his forces with minimal casualties. ";
    prim[legion] += "Shortly after the traitors were defeated, he battled his brother, Fulgrim, and was left on the brink of death. ";
    prim[legion] += "Guilliman remained in stasis for over 10,000 years before the means to heal him were revealed, allowing him to return to the galaxy. ";
    prim[legion] += "He initially rejected the 41st-millenium's notion that The Emperor was a god, but now genuinely questions that notion. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "The legion was originally known as the \"War-Born.\"";
    hist[legion] += "When their primarch was found, The Emperor was so impressed by how he'd managed his worlds that he left them all but unchanged. ";
    hist[legion] += " ";

    misc[legion] = "1. Roboute Guilliman is a stupid name. He has more community nicknames than any other character in the setting. ";
    misc[legion] += "\n\n2. This legion were originally Mary-Sues and became hated by a majority of the Warhammer community. ";
    misc[legion] += "Modern writers have scaled-back their accomplishments and make them likable through humbled members of their legion. ";
    misc[legion] += "\n\n3. At the time of writing, Roboute is one of only two loyalist primarchs to return to the setting. ";
    misc[legion] += "\n\n4. Roboute Guilliman has been described to newcomers as \"if Microsoft Excel were a superpower.\" ";

    legion += 1;

    //Death Guard
    pers[legion] = "Deathguard are slow, methodical, and resilient.";
    pers[legion] += "\n\nYou should not dread getting sick as an excuse to be out of work or school. ";
    pers[legion] += "Even when you are feeling at your worst, a beloved hobby or pastime can distract you from pain and discomfort. ";
    pers[legion] += "\n\nYour life can easily become shaped around an innate condition, chronic disease, or lingering injury -- physical or mental. ";
    pers[legion] += "For all the problems it causes, knowing the worst of such a state will let you make peace with other parts of life and find joy in the day-to-day. ";
    pers[legion] += "\n\nYou are weary of those whose above-average abilities grant them power over others -- especially those that leverage their intelligence. ";
    pers[legion] += "You may intentionally downplay or avoid subjects where you excel to \"bring yourself down\" to the level of the common man. ";
    //pers[legion] += "You do not see those with disabilities as being less capable, just having a different distribution of talents. ";
    //pers[legion] += "Despite this, you may catch yourself judging others in ways otherwise hypocritical to these views. ";
    pers[legion] += "\n\nYou likely enjoy movies and television shows involving zombies. ";
    pers[legion] += "You may also enjoy simple, fun, long-running cartoons that see minimal change to writing, setting, and characters over multiple seasons. ";
    pers[legion] += "\n\nYou will find yourself physically and emotionally resilient. ";
    pers[legion] += "When bad things happen to you and those around you, you can still smile and find comfort in good that remains in your life. ";
    pers[legion] += "This does not make you optimistic for the future, but rather simply able to process and accept the present. ";
    pers[legion] += "\n\nYou are unlikely to cope well with large-scale changes. You will find comfort in consistency and, at times, even predictability. ";
    pers[legion] += "\n\nYou will find yourself at-odds with Thousand Sons, as they champion change and intellectual superiority. ";
    pers[legion] += "\n\nYou may find surface-level commonality with Space Wolves, but trying to collaborate with them will often reveal incompatable differences. ";

    cult[legion] = "Deathguard were originally meant to be resilient to forms of toxin and illness, which drew the attention of the Chaos God of Disease. ";
    cult[legion] += "After falling to chaos, they prioritize the spread of plague and the stagnation of the galaxy. ";
    cult[legion] += "They nihilistic but surprisingly happy, seeing the worst of the universe and appreciating their ability to survive through it. ";
    cult[legion] += "They value the rot of stagnation, as change is rarely for the better. ";

    prim[legion] = "Mortarion was raised on the planet Barbarus -- a world controlled by psychic, alien overlords that ruled humanity from atop mountains wreathed in ";
    prim[legion] += "poisonous fog. Unable to succeed in uprising on hiw own, he resented The Emperor after he arrived and dispatched the overlords without Mortarion. ";
    prim[legion] += "This resentment caused him to rebel during the Horus Heresy, only for the Chaos God, Nurgle, to leave his legion stricken with horrific disease. ";
    prim[legion] += "Despite his resentment for the affliction and all psychic abilities, he pledged himself and his legion to Nurgle in exchange for survival. ";
    prim[legion] += "After ascending to daemonhood, he remained bitter towards the Chaos Gods and forced to embrace the psychic gifts he'd previously suppressed. ";
    prim[legion] += "A series of personal failures following the Horus Heresy has left him to be trapped and tortured within Nurgle's realm. ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "This legion was first known as the \"Dusk Raiders.\"";
    hist[legion] += " ";

    misc[legion] = "1. Mortarion is one of two daemon primarchs to resent the Chaos God controlling them. ";
    misc[legion] += "\n\n2. The Death Guard sport the highest number of physical mutations among Chaos Space Marines. ";

    legion += 1;

    //Thousand Sons
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Luna Wolves
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Word Bearers
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Salamanders
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Raven Guard
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Alpha Legion
    pers[legion] = "";
    pers[legion] += " ";

    cult[legion] = "";
    cult[legion] += " ";

    prim[legion] = "";
    prim[legion] += " ";

    prim2[legion] = " ";
    prim2[legion] += " ";

    hist[legion] = "";
    hist[legion] += " ";

    misc[legion] = "";
    misc[legion] += " ";

    legion += 1;

    //Compile Info
    for (let i = 0; i < legion; i++) {
        //Constant Info
        if (i != 1 && i != 10) prim2[i] = quizAstartesHomeworld(i, true, true) + "\n\n" + prim2[i];

        //Visible Info
        legions[i] = [];
        legions[i][legions[i].length] = pers[i];
        legions[i][legions[i].length] = cult[i];
        //legions[i][legions[i].length] = prim[i];
        legions[i][legions[i].length] = prim2[i];
        //legions[i][legions[i].length] = hist[i];
        legions[i][legions[i].length] = misc[i];
    }

    //Final Returns
    if (id < 0 || id >= legions.length) return legions;
    if (part < 0 || part >= quizResultReadTitles(-1).length) return legions[id];
    return legions[id][part];
}

//Returns Info for a Specific Question -- Now Unused, Kept for Records
function quizQuestionInfoOriginal(id) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(true);
    if (id >= quizQuestions.length) return quizResultInfo(quizCalcResult(), true);
    //Add Additional Function NEEDED for Getting Results Info

    let qs = []; //Modify Individual Questions Below

    qs[qs.length] = "Which culture do you find most interesting?";
    qs[qs.length] = "Which of the following animals makes the best pet?";
    qs[qs.length] = "What quality do others most associate with you?";
    qs[qs.length] = "What personal flaw often causes issues for you?";
    qs[qs.length] = "What is the best way to solve your most critical problems?";
    qs[qs.length] = "How do you approach debates?";
    qs[qs.length] = "What makes a successful employee?";
    qs[qs.length] = "Which of these would you most appreciate?";
    qs[qs.length] = "If at first you don't succeed...";

    //Prep Final
    let max = qs.length;
    for (let i = 0; i < max; i++) {
        //Remove Efficiency Helper if Errors Occur ~ Future Self: Please Test!
        if (id > 0 && id != -2 && id != -3) {
            i = id;
            max = i + 1;
        }

        let answ = quizAnswerInfo(i, -1);

        qs[i] = { "txt": qs[i], "answ": answ };
    }

    //Final
    if (id == -2) return qs;
    return qs[id];
}

//Returns Info for a Question's Specific Answer(s) -- Now Unused, Kept for Records
function quizAnswerInfoOriginal(id, answ) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(false);
    //Add Additional Function NEEDED for Getting Results Info

    let univWt = 1; //Universal Weight for Answers' Values ~ Modify Individually for Variance
    let txt;
    let res = [];
    let qs = []; //Modify Individual Question/Answer Blocks Below

    qs[qs.length] = [];
    txt = "19th Century America";
    res = [18];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Medieval Europe";
    res = [0, 16];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "European Renaissance";
    res = [8];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Ancient Greece / Rome";
    res = [3, 11, 12];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Ancient China";
    res = [4];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Ancient Egypt";
    res = [14, 15];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Cat";
    res = [0];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Dog";
    res = [4];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Snake";
    res = [2];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Bird";
    res = [8, 18];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Selfless";
    res = [4, 5, 17];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Ambitious";
    res = [2, 3, 14];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Careful";
    res = [0, 7, 18];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Welcoming";
    res = [8, 15];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Calculating";
    res = [9, 16, 19];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Awkwardness";
    res = [4, 7, 13];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Stubbornness";
    res = [3, 6];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Recklessness";
    res = [5];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Perfectionism";
    res = [2];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Quickly and Directly";
    res = [5, 11, 14, 15];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Calmly and Methodically";
    res = [6, 12, 16];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Gradually and Cautiously";
    res = [7, 13];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Patiently and Discretely";
    res = [0, 18, 19];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "I Avoid Conflict or Try to Compromise";
    res = [4, 7, 8, 14];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "I Never Change My Position";
    res = [3, 6, 13];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "I Let Others Speak on My Behalf";
    res = [16, 19];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "I Am Not Interested in Arguing Just to Argue";
    res = [11, 17];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Technical Skill";
    res = [2, 9];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Personal Connections";
    res = [16, 19];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Solid Work-Ethic";
    res = [3, 12];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Collaborative Attitude";
    res = [5, 8, 18];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "Getting a Cold and Not Having to Go to Work / School";
    res = [13];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Realizing You Have an Extra $20 in Your Bank Account";
    res = [12];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Being Praised by a Superior in Front of the Class / Office";
    res = [2, 3, 16];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "Having a Timid Pet Make a Gesture of Affection";
    res = [5, 17];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    qs[qs.length] = [];
    txt = "... Keep Trying";
    res = [6, 11, 12, 13];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "... Change Your Approach";
    res = [14];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "... Try Working on Something Else";
    res = [7, 15];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };
    txt = "... It Was Because I Wasn't Trying";
    res = [2];
    qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": txt, "res": res, "wt": univWt };

    //Final
    if (id == -2) return qs;
    if (answ < 0) return qs[id];
    return qs[id][answ];
}

//Returns Info for a Specific Question -- Now Unused, Kept for Records
function quizQuestionInfoDraft1(id) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(true);
    if (id >= quizQuestions.length) return quizResultInfo(quizCalcResult(), true);
    //Add Additional Function NEEDED for Getting Results Info

    let qs = []; //Modify Individual Questions Below

    qs[qs.length] = "A friend writes terrible poetry and asks your opinion. How do you respond?"; //Used
    qs[qs.length] = "Which culture do you find most interesting?"; //Used
    qs[qs.length] = "Which of these flaws do others use to describe you?"; //Used
    qs[qs.length] = "Which of these pets did you want as a child?"; //Used
    qs[qs.length] = "What quality do you have that others praise?"; //Used
    qs[qs.length] = "How do you improve player performance in a game?"; //Used
    qs[qs.length] = "What role would others use to define you?"; //Used
    qs[qs.length] = "Which of these vacations sounds the most enjoyable?"; //Used
    qs[qs.length] = "After making a mistake, you..."; //Used
    qs[qs.length] = "Which superpower would you want?"; //Used
    qs[qs.length] = "In a social setting, you are the one most likely to:"; //Used
    qs[qs.length] = "Which would you prefer?"; //Used
    qs[qs.length] = "You consider your family to be:"; //Used
    qs[qs.length] = "Which is most integral to your identity?"; //Not Used
    qs[qs.length] = "Which fictional universe would you want to be a part of?"; //Used
    qs[qs.length] = "Your notes in class often contained:"; //Used
    qs[qs.length] = "Which element do you feel best represents you?"; //Not Used
    qs[qs.length] = "What is the strongest motivating force?"; //Not Used
    qs[qs.length] = "Which superhero is most admirable?"; //Not Used
    qs[qs.length] = "How do you start a task?"; //Not Used
    qs[qs.length] = "Which supernatural creature's existence is the most believable?"; //Not Used
    qs[qs.length] = "The smartest student in a class is usually:"; //Used
    qs[qs.length] = "Which scene has the best atmosphere?"; //Used
    qs[qs.length] = "You prefer friends who are..."; //Used
    qs[qs.length] = "In a story, the best character motivation is:"; //Used
    qs[qs.length] = "How would you label your career?"; //Used
    qs[qs.length] = "Your social circle is:"; //Not Used
    qs[qs.length] = "What is your spirit animal?"; //Not Used
    qs[qs.length] = "Which sound is the most soothing?"; //Not Used
    qs[qs.length] = "What is most impactful on your daily life?";
    qs[qs.length] = "Which game do you enjoy the most?"; //Not Used
    //qs[qs.length] = "What is the funniest?"; //Originally Unused
    qs[qs.length] = "What is the best description of your wardrobe?"; //Used
    qs[qs.length] = "When two friends fight, I..."; //Not Used
    qs[qs.length] = "My secrets are..."; //Not Used

    //Prep Final
    let max = qs.length;
    for (let i = 0; i < max; i++) {
        //Remove Efficiency Helper if Errors Occur ~ Future Self: Please Test!
        if (id > 0 && id != -2 && id != -3) {
            i = id;
            max = i + 1;
        }

        let answ = quizAnswerInfo(i, -1);

        qs[i] = { "txt": qs[i], "answ": answ };
    }

    //Final
    if (id == -2) return qs;
    return qs[id];
}

//Returns Info for a Question's Specific Answer(s) -- Now Unused, Kept for Records
function quizAnswerInfoDraft1(id, answ) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(false);
    //Add Additional Function NEEDED for Getting Results Info

    let univWt = 1; //Universal Weight for Answers' Values ~ Modify Individually for Variance
    let txt;
    let res = [];
    let qs = []; //Modify Individual Question/Answer Blocks Below

    txt = ["Be Brutally Honest", "Refuse to Waste Your Time Listening", "Offer Constructive Criticism", "Say What They Need to Hear", "Share Your Own Writing"];
    res = [[6], [3, 9, 11], [12, 14], [8, 17, 19], [2, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["19th Century America", "Medieval Europe", "European Renaissance", "Ancient Greece / Rome", "Ancient China", "Ancient Egypt"];
    res = [[18], [0, 16], [8], [3, 11, 12], [4], [14, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Gullible", "Stubborn", "Reckless", "Dishonest", "Reclusive"];
    res = [[14, 16], [3, 6, 9, 13], [5, 11], [19], [0, 4, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Cat", "Dog", "Snake", "Bird", "Horse"];
    res = [[0], [5], [2], [8, 18], [4]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Patience", "Imagination", "Kindness", "Efficiency"];
    res = [[4, 13, 19], [2, 18], [5, 8, 17], [3, 9, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Add a Timer", "Form a Community Around it", "Create a Public Leaderboard", "Better Explain the Rules"];
    res = [[4], [8, 15, 16, 17], [2, 3], [9, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Athlete", "Scholar", "Actor", "Coordinator", "Independent"];
    res = [[5, 6, 11], [14, 16], [2, 19], [12, 15], [0, 3, 4, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Visiting the Pyramids of Giza", "Camping in the Rocky Mountains", "Riding the Trans Siberian Railway in Summer", "Seeing an Active Volcano in Iceland",
        "Touring the Holy Land of Jerusalem"];
    res = [[14, 15], [3, 12, 13], [4, 7], [5, 6, 17], [6, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Try to Fix it Yourself", "...Learn from it to Better Yourself", "...Blame Someone or Something Else", "...Keep Doing Things as Normal"];
    res = [[0, 14, 18], [2, 9, 12], [3, 7, 16, 19], [11, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Flight", "Controlling the Weather", "Regeneration", "Invisibility", "Shapeshifting"];
    res = [[8], [4, 5], [13], [18], [19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Start an Argument", "Give a Compliment", "Choose the Activity", "Remain Quiet", "Accidentally Make Others Uncomfortable"];
    res = [[3, 11], [5, 8, 17], [12, 15], [4, 18], [7, 9, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Being Sick and Staying Home from School / Work", "Cancelling a Vacation to Save Money", "Staying Up Late to Study for a Test", "Going Door-to-Door to Campaign"];
    res = [[13], [12], [14], [16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Embarassing", "Affectionate", "Successful", "Misguided", "Frustrating"];
    res = [[0, 9], [5, 8, 17], [2, 12], [6, 15], [3, 7, 11, 13, 14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Being Inclusive", "Being Tall", "Being Edgy", "Being Intelligent"];
    res = [[8, 15], [17, 19], [7, 18], [14, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Harry Potter", "Game of Thrones", "Twilight", "The Walking Dead"];
    res = [[14], [0, 19], [5, 8, 18], [7, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["No Organizational Structure", "Doodles", "Complex Diagrams", "Unnecessary Detail"];
    res = [[5, 7, 11], [2], [6, 9, 12], [14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Fire", "Ice", "Wind", "Stone"];
    res = [[17], [5], [4], [3, 6]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Recognition", "Fear", "Hatred", "Redemption"];
    res = [[2, 3], [7], [11], [0, 14, 16, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Batman", "Superman", "Spider-Man", "Iron Man"];
    res = [[7, 18], [8, 12], [5, 17], [4, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Willing to Shift Focus as Needed", "Carefully Planning Ahead of Time", "Quickly and Efficienctly", "Adding it to My Ongoing List", "Making it My Sole Priority"];
    res = [[0], [12, 19], [3, 4, 9, 12], [13], [11, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Dragon", "Angel / Demon", "Werewolf", "Vampire"];
    res = [[17, 19], [6, 16], [5], [8]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["The Only Who Studies the Most", "The One Who Finishes Tests First", "The One Who Gets Away with Misbehaving", "The Teacher's Favorite"];
    res = [[9, 12, 14], [4], [7, 13], [15, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Moonlit Walk", "A Warm Fireplace", "Familiar Voices in a Bar", "A Bustling City Street"];
    res = [[0, 7, 18], [17], [5, 14], [3, 6, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Competent", "...Loyal", "...Artistic", "...Hard Working"];
    res = [[3, 9], [0, 5, 8, 12], [2, 17, 18], [6, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Revenge", "Survival", "Glory", "Chivalry"];
    res = [[8, 11, 15], [0, 13, 14], [2, 5], [16, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Technology", "Management", "Service", "Labor", "Entertainment"];
    res = [[9], [12, 15], [16, 17], [3, 6], [2, 5]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Relatively Consistent", "Always Changing", "Steadily Growing", "Not a Priority"];
    res = [[0, 13, 16], [14, 19], [5, 15], [4, 7, 11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Lion", "Panther", "Wolf", "Heyena", "Hawk", "Raven"];
    res = [[0], [7], [5], [11], [8], [18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Crackling Fire", "Wind and Rain", "Turning Pages", "Your Favorite Song"];
    res = [[17], [4], [14, 16], [2]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Grudge", "An Allergy", "Family Disagreements", "A Past Failure"];
    res = [[3, 11, 15], [13], [6, 7, 9], [0, 14, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Settlers of Catan", "Minecraft", "Poker", "Call of Duty", "Magic: The Gathering"];
    res = [[12], [6], [19], [5, 11], [14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    /*txt = ["Witty One-Liners", "Recurring Inside-Jokes", "Public Insults", "Dead-Pan Humor"];
    res = [[4, 18], [5, 13], [2, 3, 7, 11], [6, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);*/

    txt = ["I Often Wear the Same Few Shirts", "I Regularly Buy Replacements for Old Clothes", "I Am Interested in Function over Form", "I Dress for Attention"];
    res = [[13], [14], [3, 6, 9], [2, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Try to Return the Status Quo", "...Try to See Both Sides", "...Side with Whoever is in-the-Right", "...Am Usually One of the Ones Fighting"];
    res = [[8, 13, 15], [19], [4, 6], [11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Unnecessary Among Friends", "...Tricks for Others to Gain Interest", "...Kept for Others' Safety", "...Another Word for \"Regrets\""];
    res = [[5, 6], [2], [7, 17, 19], [0, 14, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    //Final
    if (id == -2) return qs;
    if (answ < 0) return qs[id];
    return qs[id][answ];
}

//Returns Info for a Specific Question -- Now Unused, Kept for Records
function quizQuestionInfoDraft2(id) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(true);
    if (id >= quizQuestions.length) return quizResultInfo(quizCalcResult(), true);
    //Add Additional Function NEEDED for Getting Results Info

    let qs = []; //Modify Individual Questions Below

    qs[qs.length] = "In a social setting, you are the one most likely to:";
    qs[qs.length] = "Which flaws have others use to describe you?";
    qs[qs.length] = "What quality do you have that others praise?";
    qs[qs.length] = "What flaw would you assign to yourself?";
    qs[qs.length] = "How do you improve player performance in a game?";
    qs[qs.length] = "What family interaction is most important to you?";
    qs[qs.length] = "People who dislike you often judge you by what?";
    qs[qs.length] = "Which culture do you find most interesting?";
    qs[qs.length] = "Which of these vacations sounds the most enjoyable?";
    qs[qs.length] = "Which of these pets did you want as a child?";
    qs[qs.length] = "After making a mistake, you...";
    qs[qs.length] = "Which superpower would you want?";
    qs[qs.length] = "You consider most of your family to be:";
    qs[qs.length] = "Which fictional universe would you want to be a part of?";
    qs[qs.length] = "Your notes in class often contained:";
    qs[qs.length] = "In a story, the best character motivation is:";
    qs[qs.length] = "Which would you prefer?";
    qs[qs.length] = "A friend writes terrible poetry and asks your opinion. How do you respond?";
    qs[qs.length] = "What role would others use to define you?";
    qs[qs.length] = "The smartest student in a class is usually:";
    qs[qs.length] = "Which scene has the best atmosphere?";
    qs[qs.length] = "You prefer friends who are...";
    qs[qs.length] = "What is the best description of your wardrobe?";
    qs[qs.length] = "How would you label your career?";
    qs[qs.length] = "What is most impactful on your daily life?";
    qs[qs.length] = "How do others describe you?";
    qs[qs.length] = "What helps shape your sense of morality?";
    qs[qs.length] = "What solves most of the world's problems?";
    qs[qs.length] = "My anger and frustration are usually directed towards...";
    qs[qs.length] = "Transported back in time, which scenario would be the easiest for you to survive?";
    qs[qs.length] = "You enjoy working with people who are...";
    //qs[qs.length] = "";

    //Prep Final
    let max = qs.length;
    for (let i = 0; i < max; i++) {
        //Remove Efficiency Helper if Errors Occur ~ Future Self: Please Test!
        if (id > 0 && id != -2 && id != -3) {
            i = id;
            max = i + 1;
        }

        let answ = quizAnswerInfo(i, -1);

        qs[i] = { "txt": qs[i], "answ": answ };
    }

    //Final
    if (id == -2) return qs;
    return qs[id];
}

//Returns Info for a Question's Specific Answer(s) -- Now Unused, Kept for Records
function quizAnswerInfoDraft2(id, answ) {
    if (id < 0 && id != -2 && id != -3) return quizTitleInfo(false);
    //Add Additional Function NEEDED for Getting Results Info

    let univWt = 1; //Universal Weight for Answers' Values ~ Modify Individually for Variance
    let txt;
    let res = [];
    let qs = []; //Modify Individual Question/Answer Blocks Below

    txt = ["Start an Argument", "Give a Compliment", "Decide the Activity", "Remain Quiet", "Accidentally Make Others Uncomfortable"];
    res = [[3, 11], [5, 8, 17], [12, 15], [4, 18], [7, 9, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Stubborn", "Gullible", "Dishonest", "Angry"];
    res = [[3, 6, 9, 13], [5, 14, 16], [19], [8, 11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Patience", "Curiosity", "Commitment", "Charisma"];
    res = [[4, 13, 18, 19], [2, 14], [5, 6, 16], [8, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Reclusive", "Reckless", "Jealous", "Judgmental"];
    res = [[0, 4, 18], [5, 11, 14], [2, 3], [6, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Add a Timer", "Form a Community Around it", "Create a Public Leaderboard", "Better Explain the Rules"];
    res = [[4], [8, 15, 16, 17], [2, 3], [9, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Sharing Life Advice", "Practicing Traditions", "Playing Games", "Using Them as a Standard for Improvement"];
    res = [[18], [4, 16, 17], [5], [0, 9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Your Appearance", "Your Friends", "Your Beliefs", "Your Ego"];
    res = [[9, 17], [0, 15], [6, 16], [2, 3, 19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["19th Century America", "Medieval Europe", "European Renaissance", "Ancient Greece / Rome", "Ancient China", "Ancient Egypt"];
    res = [[18], [0, 16], [8], [3, 11, 12], [4], [14, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Visiting the Pyramids of Giza", "Camping in the Rocky Mountains", "Riding the Trans Siberian Railway in Summer", "Seeing an Active Volcano in Iceland",
        "Touring the Holy Land of Jerusalem"];
    res = [[14, 15], [3, 12, 13], [4, 7], [5, 6, 17], [6, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Cat", "Dog", "Snake", "Bird", "Horse"];
    res = [[0], [5], [2, 19], [8, 18], [4]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Try to Fix it Yourself", "...Learn from it to Better Yourself", "...Blame Someone Else", "...Keep Doing Things as Normal"];
    res = [[0, 14, 18], [2, 9, 12], [3, 7, 19], [11, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Flight", "Controlling the Weather", "Regeneration", "Invisibility", "Shapeshifting"];
    res = [[8], [4, 5], [13], [18], [19]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Embarassing", "Affectionate", "Successful", "Misguided", "Frustrating"];
    res = [[0, 9], [5, 8, 17], [2, 12], [6, 15], [3, 7, 11, 13, 14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Harry Potter", "Game of Thrones", "Twilight", "The Walking Dead"];
    res = [[14], [0, 19], [5, 8, 18], [7, 13]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["No Organizational Structure", "Doodles", "Complex Diagrams", "Unnecessary Detail"];
    res = [[5, 7, 11], [2, 17, 18], [6, 9, 12], [14]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Revenge", "Survival", "Glory", "Chivalry"];
    res = [[8, 11, 15, 18], [0, 13, 14], [2, 5], [16, 17]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Being Sick and Staying Home from School / Work", "Cancelling a Vacation to Save Money", "Staying Up Late to Study for a Test", "Going Door-to-Door to Campaign"];
    res = [[13], [9, 12], [14], [6, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Be Brutally Honest", "Cut-Them-Off to Avoid Listening", "Offer Constructive Criticism", "Say What They Need to Hear", "Share Your Own Writing"];
    res = [[6], [3, 9, 11], [12, 14], [8, 17, 19], [2, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Athlete", "Scholar", "Actor", "Coordinator", "Independent"];
    res = [[5, 6, 11], [14, 16], [2, 19], [12, 15], [0, 3, 4, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["The Only Who Studies the Most", "The One Who Finishes Tests First", "The One Who Gets Away with Misbehaving", "The Teacher's Favorite"];
    res = [[9, 12, 14], [4], [7, 13], [15, 16]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Moonlit Walk", "A Warm Fireplace", "Familiar Voices in a Bar", "A Bustling City Street"];
    res = [[0, 7, 18], [17], [5], [3, 6, 12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Competent", "...Loyal", "...Artistic", "...Hard Working"];
    res = [[3, 9], [0, 5, 8], [2, 17, 18], [6, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["I Often Wear the Same Few Shirts", "I Regularly Buy Replacements for Old Clothes", "I Am Interested in Function over Form", "I Dress for Attention"];
    res = [[13], [14], [3, 6, 9], [2, 7]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Technology", "Management", "Service", "Labor", "Entertainment"];
    res = [[9], [12, 15], [16, 17], [3, 6], [2, 5]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Grudge", "An Allergy", "Family Disagreements", "A Past Failure"];
    res = [[3, 11, 15], [13], [6, 7, 9], [0, 14, 18]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Tall", "Unkempt", "Attractive", "Generic"];
    res = [[17, 19], [5, 13], [2, 8], [12]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["A Higher Authority", "Current, Changing Circumstances", "Personal Sense of Justice", "Views of Friends and Family"];
    res = [[6, 12, 16], [14, 19], [7], [11, 15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["Violence", "Economics", "Hard Work", "New Technology"];
    res = [[11, 15], [12], [6], [9]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...People", "...Institutions", "...General Circumstances", "...Everything and Everyone"];
    res = [[0], [7, 15], [12], [8, 11]];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["The First Eruption of Pompeii (79 A.D.)", "The Salem Witch Trials", "The Black Plague", "The Sacking of Rome (410 A.D.)"];
    res = [[17], [19], [13], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["...Tolerant and Patient with You", "...Proudly Artistic", "...Efficiently Practical", "...Ambitiously Rebellious"];
    res = [[11], [9], [2], [15]];
    qs = quizCompileAnswer(txt, res, univWt, qs);


    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    txt = ["", "", "", ""];
    res = [[], [], [], []];
    qs = quizCompileAnswer(txt, res, univWt, qs);

    //Final
    if (id == -2) return qs;
    if (answ < 0) return qs[id];
    return qs[id][answ];
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Quiz Foundation Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Makes a Scene for a Question, Intro, or Result
function quizMakeQuestion(id) {
    if (quizWin.length > 0) {
        for (let i = 0; i < quizWin.length; i++) {
            destroyWin(quizWin[i]);
        }
        quizWin = [];
    }
    let displayRes;
    let answers;
    let title;
    let content;
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    let w = 400;
    let h = 50 - 1;
    let c = "none";
    let p = 5;
    let b = "none";
    let r = 4;
    let m = "auto";
    let t = "center";
    let tp = p + 1;
    let f = 36;
    let mt = 10;
    let mb;

    quizMakeQuestionSprites();

    let isQuestion = true;
    if (id < 0 || id >= quizQuestions.length) isQuestion = false;
    if (isQuestion == false) {
        title = quizQuestionInfo(quizCurrent);
        if (id < 0) content = quizAnswerInfo(quizCurrent, 0);
        if (quizResWin.length > 0) {
            displayRes = (id - (quizQuestions.length));
            content = quizResultInfo(displayRes, false);
            title = quizResultInfo(displayRes, true);
        }
        if (id >= quizQuestions.length && quizResWin.length <= 0) {
            displayRes = quizCalcResult();
            //displayRes = quizResultsHighLow[quizCalcResult()];
            content = quizResultInfo(displayRes, false);
            quizCurrent = quizQuestions.length + quizCalcResult();
        }
    } else {
        title = "Question " + (id + 1) + " of " + (quizQuestions.length);
        let item = quizQuestionInfo(id);
        content = item.txt;
        answers = item.answ;
    }

    if (id >= quizQuestions.length && quizResWin.length <= 0) {
        quizMakeAllResults();
        quizResultDisplayUpdate(true);
    } else if (id >= quizQuestions.length) {
        quizResultDisplayUpdate(false);
    }

    winDisplay = title;

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, mt];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(quizParent, "quizWin", "div", winStyling);
    quizWin[quizWin.length - 1].innerText = winDisplay;

    if (id >= quizQuestions.length) {
        /*let term1 = "point";
        let term2 = "point";
        let points1 = quizResults[displayRes];
        let points2 = quizCalcTotalPoints();
        if (points1 != 1) term1 += "s";
        if (points2 != 1) term2 += "s";
        winDisplay = "( " + points1 + " " + term1 + " out of " + points2 + " " + term2 + " )";*/

        w = 400;
        h = "auto";
        c = "none";
        p = 5;
        b = "none";
        r = 0;
        m = "auto";
        t = "center";
        tp = p + 1;
        f = 24;
        mt = -10;
        mb = 20;

        //winDisplay = "( " + quizResultToPercent(displayRes, false) + " )";
        winDisplay = "( " + quizResults[displayRes] + " out of " + quizGetPossibleCategoryPoints(displayRes) + " Answers )";

        winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top", "margin-bottom"];
        winValues = [w, h, c, p, b, r, m, t, tp, f, mt, mb];
        winStyling = cssMake(winValues, winTerms);
        quizWin[quizWin.length] = createWin(quizParent, "quizWin", "div", winStyling);
        quizWin[quizWin.length - 1].innerText = winDisplay;

        quizResultHolder(displayRes);


    } else {

        w = "90%";
        h = "auto";
        c = "none";
        p = 5;
        b = "none";
        r = 0;
        m = "auto";
        t = "center";
        tp = p + 1;
        f = 24;
        mt = 5;

        winDisplay = content;

        winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top"];
        winValues = [w, h, c, p, b, r, m, t, tp, f, mt];
        winStyling = cssMake(winValues, winTerms);
        quizWin[quizWin.length] = createWin(quizParent, "quizWin", "div", winStyling);
        quizWin[quizWin.length - 1].innerText = winDisplay;

    }

    if (isQuestion == false) {
        if (id < 0) quizMakeAnswer(-1, 0);
        if (id >= quizQuestions.length) quizMakeAnswer(-2, 0);  
        return;
    }

    if (answers.length <= 0) {
        quizMakeAnswer(-1, 0);
    } else {
        for (let i = 0; i < answers.length; i++) {
            quizMakeAnswer(id, i);
        }
    }

    quizAdjustAnswWidth();
    return;
}

//Makes Random Legion Animations During Questions
function quizMakeQuestionSprites() {
    let numProxy = 2;
    for (let i = 0; i < numProxy; i++) {
        let rmvd = "proxy" + i;
        removeAnimation(rmvd);
    }
    if (quizCurrent < quizQuestions.length && quizCurrent > -1) {
        let arts = ["stand", "point", "berserk", "sword", "bolter", "walk"];
        let aTimers = [55, 10, 5, 5, 30, 10];
        let style = rng(0, arts.length - 1);
        let legion = rng(0, 19);
        let locPix = 3;
        let x = [50, 650];
        let y = [100, 100];
        let colorz = quizAstartesColor(legion);

        for (let i = 0; i < x.length; i++) {
            let titled = "proxy" + i;
            let anim = makeAnimation(quizAstartes(colorz, -1, arts[style]), -1, x[i], y[i], context, locPix, titled, aTimers[style]);
            if (i % 2 != 0) {
                anim.x = parseInt(anim.x) - (anim.art[0].width * locPix);
                anim = flipAnim(anim, true);
            }
        }
    }
}

//Makes a DIV Element Containing Quiz Results -- Added for WHQ
function quizResultHolder(id) {

    let winTerms;
    let winValues;
    let winStyling;
    //let winDisplay = "";
    let w = 650;
    let h = 360;
    //let c = "rgba(15,15,15,0.9)";
    let c = "rgba(150,150,175,0.9)";
    let p = 5;
    let b = "3px solid black";
    let r = 4;
    let m = "auto";
    let t = "center";
    let tp = p;
    let f = 36;
    let mt = 10;
    let dis = "flex";
    let ox = "hidden";
    let oy = "scroll";
    let ff = "\'Gill Sans\'";
    let d = "block";

    //winDisplay = title;

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top", "display", "overflow-x",
        "overflow-y", "font-family", "display"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, mt, dis, ox, oy, ff, d];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(quizParent, "resHolder", "div", winStyling);
    let parent = quizWin[quizWin.length - 1];

    quizResultArt(id, parent);

    let parent2;
    let components = quizAstartesResults(id, -1);
    for (let i = 0; i < components.length; i++) {
        parent2 = quizResultBox(i, parent);
        quizResultReadout(i, quizResultReadTitles(i), parent2, "title");
        if (i == 1) quizResultReadout(i, quizAstartesAllegiance(id), parent2, "header");
        if (i == 2) quizResultReadout(i, quizAstartesPrimarchName(id), parent2, "header");
        quizResultReadout(i, quizAstartesResults(id, i), parent2, "description");
    }

}

//Makes a Visual Box for Result Art
function quizResultArt(id, parent) {
    let arts = ["stand", "point", "berserk", "sword", "bolter", "walk"];
    let aTimers = [55, 10, 5, 5, 30, 10];
    let bothRows = true;
    let winTerms;
    let winValues;
    let winStyling;
    let w = 550;
    let h = 250;
    let c = "none";
    let p = 5;
    let b = "none";
    let r = 4;
    let m = "auto";
    let t = "center";
    let f = 24;
    let ff = "Fantasy";
    let wType = "canvas";
    let z = 9;
    /*if (bothRows) {
        w = 450;
        h = 150;
    }*/

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "font-size",
        "font-family", "z-index"];
    winValues = [w, h, c, p, b, r, m, t, f, ff, z];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(parent, ("resDraw"), wType, winStyling);
    //let drawImg = quizWin[quizWin.length - 1];
    let drawImg = document.getElementById("resDraw");
    let drawSpace = drawImg.getContext("2d");
    if (animatedZones.length > 1) animatedZones.pop();
    addAnimationZone(drawSpace);

    for (let i = 0; i < arts.length; i++) {
        let rmvd = ("astartes" + i).toString();
        removeAnimation(rmvd);
    }

    //makeAnimation(quizAstartes(quizAstartesColor(id), -1, "stand"), -1, 1, 1, drawSpace, 3, "astartes6", 55);

    let legion = id;
    //let origDist = 38;
    let origDist = 1;
    let locPix = 2;
    let artSpacer = 2 * locPix;
    //let wrapper = 26 * locPix;
    //let wrapDist = w - (wrapper + 1);
    //let wrapDist = 254;
    let wrapDist = 700;
    let colorz = quizAstartesColor(legion);
    let lastAnim = makeAnimation(quizAstartes(colorz, -1, "stand"), -1, origDist, 0, drawSpace, locPix, "astartes0", aTimers[0]);
    let dist = (lastAnim.art[0].width * locPix) + artSpacer + origDist;
    let dist2 = 0;
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "point"), -1, dist, dist2, drawSpace, locPix, "astartes1", aTimers[1]);
    dist += (lastAnim.art[0].width * locPix) + artSpacer;
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    lastAnim = makeAnimation(quizAstartes(colorz, -1, "berserk"), -1, dist, dist2, drawSpace, locPix, "astartes2", aTimers[2]);
    dist += (lastAnim.art[0].width * locPix) + artSpacer;
    if (dist >= wrapDist) {
        dist = origDist;
        dist2 += lastAnim.art[0].height * locPix;
    }
    if (bothRows) {
        lastAnim = makeAnimation(quizAstartes(colorz, -1, "sword"), -1, dist, dist2, drawSpace, locPix, "astartes3", aTimers[3]);
        dist += (lastAnim.art[0].width * locPix) + artSpacer;
        if (dist >= wrapDist) {
            dist = origDist;
            dist2 += lastAnim.art[0].height * locPix;
        }
        lastAnim = makeAnimation(quizAstartes(colorz, -1, "bolter"), -1, dist, dist2, drawSpace, locPix, "astartes4", aTimers[4]);
        dist += (lastAnim.art[0].width * locPix) + artSpacer;
        if (dist >= wrapDist) {
            dist = origDist;
            dist2 += lastAnim.art[0].height * locPix;
        }
        lastAnim = makeAnimation(quizAstartes(colorz, -1, "walk"), -1, dist, dist2, drawSpace, locPix, "astartes5", aTimers[5]);
    }

}

//Makes a Visual Box to Contain a Section of Info
function quizResultBox(id, parent) {
    let winTerms;
    let winValues;
    let winStyling;
    //let winDisplay = "";
    let w = 575;
    let h = "auto";
    let c = "rgba(25,25,25,0.9)";
    //let c = "rgba(225,225,215,0.9)";
    let p = 5;
    //let b = "3px solid rgba(225,205,180,1.0)";
    let b = "3px solid rgba(245,225,190,1.0)";
    let r = 4;
    let m = "auto";
    let t = "center";
    let tp = p;
    let f = 36;
    let mt = 10;
    let ox = "hidden";
    let ml = "auto";
    let oy = "visible";
    let ff = "\'Gill Sans\'";
    let d = "block";

    if (id == 0) {
        //mt = -125;
        mt = -190;
    }

    //winDisplay = title;

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top", "overflow-x",
        "margin-left", "overflow-y", "font-family", "display"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, mt, ox, ml, oy, ff, d];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(parent, ("resBox" + id), "div", winStyling);

    return quizWin[quizWin.length - 1];
}

//Makes an Element Displaying Part of a Quiz Result -- Added for WHQ
function quizResultReadout(id, content, parent, style) {

    let suffix = stringToCharArray(style);
    suffix = suffix[0];
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    let w = "auto";
    let h = "auto";
    let c = "none";
    let p = 5;
    let b = "none";
    let r = 4;
    let m = "auto";
    let t = "center";
    let tp = p;
    let f = 24;
    let mt = m;
    let ox = "hidden";
    let oy = "hidden";
    let ff = "Fantasy";
    let wType = "div";
    let fc = "white";

    if (style == "description") {
        ff = "\'Gill Sans\'";
        f = 16;
        mt = 2;
        t = "left";
    }

    if (style == "header") {
        ff = "\'Gill Sans\'";
        f = 20;
        mt = 0;
    }

    winDisplay = content;

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "overflow-x",
        "overflow-y", "font-family", "color", "margin-top"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, ox, oy, ff, fc, mt];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(parent, ("resPart" + id + suffix), wType, winStyling);
    quizWin[quizWin.length - 1].innerText = winDisplay;
}

//Returns a List of One or More Result-Read Titles
function quizResultReadTitles(id) {
    let titles = [];

    titles[titles.length] = "Personality";
    titles[titles.length] = "Culture";
    titles[titles.length] = "Primarch";
    //titles[titles.length] = "Primarch II";
    //titles[titles.length] = "History";
    //titles[titles.length] = "Miscellaneous";

    if (id < 0 || id >= titles.length) return titles;
    return titles[id];
}

//Makes a Clickable Answer for the Quiz
function quizMakeAnswer(q, a) {
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    let winId = "answ" + a;
    let w = "fit-content";
    let h = "auto";
    let c = quizAnswBoxStyle("background-color", 0);
    let p = 10;
    let b = "1px dotted black";
    let r = 8;
    let m = "auto";
    let t = "center";
    let f = 20;
    let mt = 10;
    let fc = quizAnswBoxStyle("color", 0);

    if (q >= 0 && q < quizQuestions.length) {
        winDisplay = quizAnswerInfo(q, a).txt;
    } else if (q < 0 && q != -2 && q != -3) {
        winDisplay = "Click to Begin";
    } else if (q == -2) {
        winDisplay = "Click to Restart";
        winId = "restB";
    }
    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "font-size", "margin-top", "color"];
    winValues = [w, h, c, p, b, r, m, t, f, mt, fc];
    winStyling = cssMake(winValues, winTerms);
    quizWin[quizWin.length] = createWin(quizParent, winId, "div", winStyling);
    quizWin[quizWin.length - 1].innerText = winDisplay;
    quizWin[quizWin.length - 1].addEventListener("click", clicked);
    quizWin[quizWin.length - 1].addEventListener("mouseenter", highlight);
    quizWin[quizWin.length - 1].addEventListener("mouseleave", unhighlight);
}

//Makes a Clickable Readout of Quiz Results
function quizMakeAllResults() {
    //let winner = quizResultsHighLow()[quizCalcResult()];
    let winner = quizCalcResult();
    let parent = quizMakeResParent();
    let res = quizResultsHighLow();
    //let displayRes = quizCurrent - (quizQuestions.length - 1);

    for (let i = 0; i < res.length; i++) {
        let best = false;
        //let cur = false;
        if (winner == res[i]) best = true;
        //if (displayRes == i) cur = true;
        quizResWin[quizResWin.length] = quizMakeResult(res[i], parent, best);

    }
}

//Makes a View Button for Possible Quiz Results
function quizMakeResult(id, parent, best) {
    let result;

    //let ab = "pt";
    //let points = quizResults[id];
    //if (points != 1) ab += "s";
    let points = quizResultToPercent(id, false);
    let ab = "";

    let winId = "resWin" + id;
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    //let w = "auto";
    //let h = "auto";
    let w = "auto";
    let h = 40;
    let c = quizAnswBoxStyle("res-bc", 0);
    let p = 5;
    let b = "1px solid black";
    let r = 4;
    let m = 10;
    let t = "center";
    let tp = p;
    let f = 16;
    let mt = m;
    let ox = "hidden";
    let fc = quizAnswBoxStyle("res-fc", 0);
    let oy = "hidden";
    let mw = quizAstartesNamesakeLength(id);

    //if (quizCalcResult() == quizResNum(id)) winId += "Best";
    if (best) winId += "Best";
    winDisplay = quizResultInfo(id, true) + "\n( " + points + " " + ab + " )";

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top", "overflow-x", "color", "overflow-y", "min-width"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, mt, ox, fc, oy, mw];
    winStyling = cssMake(winValues, winTerms);
    result = createWin(parent, winId, "div", winStyling);
    result.innerText = winDisplay;
    result.addEventListener("click", clicked);
    result.addEventListener("mouseenter", highlight);
    result.addEventListener("mouseleave", unhighlight);

    return result;
}

//Makes a Parent Item to Contain Quiz Results
function quizMakeResParent() {
    let winTerms;
    let winValues;
    let winStyling;
    //let winDisplay = "";
    let w = 650;
    let h = 80;
    let c = "rgba(230,230,230,0.3)";
    let p = 5;
    let b = "3px solid black";
    let r = 4;
    let m = "auto";
    let t = "center";
    let tp = p;
    let f = 36;
    let mt = 10;
    let dis = "flex";
    let ox = "scroll";
    //let ml = -3;
    let ml = "auto";
    let oy = "hidden";
    let ff = "fantasy";

    //winDisplay = title;

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size", "margin-top", "display", "overflow-x",
        "margin-left", "overflow-y", "font-family"];
    winValues = [w, h, c, p, b, r, m, t, tp, f, mt, dis, ox, ml, oy, ff];
    winStyling = cssMake(winValues, winTerms);
    quizResWin[quizResWin.length] = createWin(quizParent, "resPar", "div", winStyling);
    //quizResWin[quizResWin.length - 1].innerText = winDisplay;

    //quizResWin[quizREsWin.length - 1];

    return quizResWin[quizResWin.length - 1];
}

//Updates Static Displays for Result Buttons
function quizResultDisplayUpdate(override) {
    let cur = quizCurrent - quizQuestions.length;
    let tally = -1;
    for (let i = 0; i < quizResWin.length; i++) {
        let win = quizResWin[i];
        if (isQuizResult(win.id)) {
            let box = win;
            let pattern = 0;
            tally += 1;
            if (tally == cur && override == false) pattern = 1;
            box.style["background-color"] = quizAnswBoxStyle("res-bc", pattern);
            box.style["color"] = quizAnswBoxStyle("res-fc", pattern);
            if (isQuizResultBest(box)) {
                box.style["color"] = quizAnswBoxStyle("res2-fc", pattern);
            }
            if (isQuizResultCur(box)) {
                box.style["background-color"] = quizAnswBoxStyle("res2-bc", pattern);
            }
        }
    }
}

//Calculates the Result of the Quiz
function quizCalcResult() {
    //Highest Points Method -- 100% Works, Currently Using Alternative
    /*let tally = quizResults[0];
    let result = 0;
    if (quizResults.length > 1) {
        for (let i = 1; i < quizResults.length; i++) {
            if (quizResults[i] > tally) {
                result = i;
                tally = quizResults[result];
            }
        }
    }*/

    //Highest Percent Method
    let tally = quizResultToPercent(0, true);
    let result = 0;

    if (quizResults.length > 1) {
        for (let i = 1; i < quizResults.length; i++) {
            if (quizResultToPercent(i, true) > tally) {
                result = i;
                tally = quizResultToPercent(i, true);
            }
        }
    }

    return result;
}

//Compiles an Answer from Given Info
function quizCompileAnswer(text, result, weight, qs) {
    qs[qs.length] = [];
    for (let i = 0; i < text.length; i++) {
        qs[qs.length - 1][qs[qs.length - 1].length] = { "txt": text[i], "res": result[i], "wt": weight };
    }

    return qs;
}

//Returns the Number of the Chosen Answer
function quizAnswerNum(id) {
    let result;
    if (typeof id == "string") {
        let check = stringToCharArray(id);
        result = check[4];
    }

    return result;
}

//Returns the Element for a Quiz's # Answer
function quizAnswerId(id) {
    let result;
    if (typeof id == "number") {
        id = Math.floor(id);
        result = getElementById("answ" + id);
    }

    return result;
}

//Returns the Number of the Chosen Result Button
function quizResNum(id) {
    let result = "";
    if (typeof id == "string") {
        let check = stringToCharArray(id);
        for (let i = 6; i < check.length; i++) {
            result += check[i]
        }
        //result = check[6];
    }

    return parseInt(result);
}

//Returns if an Element is a Quiz Answer
function isQuizAnswer(id) {
    if (typeof id == "object") id = id.id;
    let answ = id.toString();

    return answ.includes("answ");
}

//Returns if an Element is a Quiz Result
function isQuizResult(id) {
    if (typeof id == "object") id = id.id;
    let answ = id.toString();

    return answ.includes("resWin");
}

//Returns if an Element is "Best" Quiz Result
function isQuizResultBest(id) {
    let result = false;
    if (typeof id == "object") id = id.id;
    let answ = id.toString();

    if (isQuizResult(id) && answ.includes("Best")) result = true;

    return result;
}

//Returns if an Element is "Current" Quiz Result
function isQuizResultCur(id) {
    let result = false;
    if (typeof id == "object") id = id.id;
    let cur = quizCurrent - (quizQuestions.length);
    let isCur = false;
    if (quizResNum(id) == cur) isCur = true;

    if (isQuizResult(id) && isCur) result = true;

    return result;
}

//Makes All Quiz Answer Elements the Same Width
function quizAdjustAnswWidth() {
    let answs = quizGetAllCurrentAnswers();
    let result = answs[0].offsetWidth;
    for (let i = 1; i < answs.length; i++) {
        if (answs[i].offsetWidth > result) result = answs[i].offsetWidth;
    }

    for (let i = 0; i < answs.length; i++) {
        answs[i].style.width = result + "px";
    }
}

//Gets All Answer-Based Elements for Question
function quizGetAllCurrentAnswers() {
    let result = [];
    for (let i = 0; i < quizWin.length; i++) {
        let answ = (quizWin[i].id).toString();
        if (answ.includes("answ")) result[result.length] = quizWin[i];
    }

    return result;
}

//Returns a Style for a Quiz Box
function quizAnswBoxStyle(style, setting) {
    let styled = style.toString();
    styled = styled.toLowerCase();

    if (styled == "background-color" || styled == "bg") {
        if (setting == 0) return "rgba(105,105,105,0.2)";
        if (setting == 1) return "rgba(175,175,175,0.5)";
    }

    if (styled == "color" || styled == "c") {
        if (setting == 0) return "black";
        if (setting == 1) return "#200000";
    }

    if (styled == "res-bc") {
        if (setting == 0) return "rgba(105,105,105,0.2)";
        if (setting == 1) return "rgba(175,175,175,0.5)";
    }

    if (styled == "res-fc") {
        if (setting == 0) return "black";
        if (setting == 1) return "#200000";
    }
    if (styled == "res2-bc") {
        //if (setting == 0) return "rgba(40,40,50,0.2)";
        //if (setting == 1) return "rgba(80,80,100,0.5)";
        if (setting == 0) return "rgba(175,105,175,0.4)";
        if (setting == 1) return "rgba(225,165,225,0.6)";
    }

    if (styled == "res2-fc") {
        //if (setting == 0) return "#ffcc22";
        //if (setting == 1) return "#ffffcc";
        if (setting == 0) return "#ffffcc";
        if (setting == 1) return "#eeeeaa";
    }
}

//Applies an Answer Choice to Results
function quizApplyAnswer(id) {
    if (quizCurrent < 0 || quizCurrent >= quizQuestions.length) return;

    if (typeof id == "object") id = id.id;
    let answNum = parseInt(quizAnswerNum(id));
    let answ = quizQuestions[quizCurrent].answ[answNum];
    for (let i = 0; i < answ.res.length; i++) {
        quizChangeRes(answ.res[i], answ.wt);
    }
}

//Modifies Quiz Final Result Tallies 
function quizChangeRes(res, wt) {
    quizResults[res] += wt;
}

//Returns Info for a Result's Specific Details
function quizResultInfo(id, getTitle) {
    let title = [];
    let content = [];

    for (let i = 0; i < quizResultCategoryInfo(-2); i++) {
        title[i] = quizResultCategoryInfo(i, true);
        content[i] = quizResultCategoryInfo(i, false);
    }

    if (id < 0 || id >= quizResults.length) {
        if (getTitle) return title;
        return content;
    }

    if (getTitle) return title[id];
    return content[id];
}

//Calculates the Total Points Distributed Across the Quiz
function quizCalcTotalPoints() {
    let result = 0;
    for (let i = 0; i < quizQuestions.length; i++) {
        let cur = quizAnswerInfo(i, -1);
        let tally = cur[0].wt;
        for (let i2 = 1; i2 < cur.length; i2++) {
            if (cur[i2].wt > tally) tally = cur[i2].wt;
        }
        result += tally;
    }

    return result;
}

//Returns a Percentage of Total Points for a Result
function quizResultToPercent(res, numOnly) {
    let result = quizResults[res];
    //result = result / quizCalcTotalPoints(); //Total Points Method
    //result = result / quizQuestions.length; //Total Questions Method
    result = result / quizGetPossibleCategoryPoints(res); //Category's Points Method
    result *= 100;
    result = Math.floor(result);

    if (isNaN(result)) result = 0;

    if (numOnly) return parseInt(result);

    result = result + "%";
    return result;
}

//Returns an Array of Total Available Points for Each Result
function quizGetPossibleCategoryPoints(specific) {
    let results = [];
    let start = 0;
    let max = quizResults.length;

    if (specific > -1 && specific < quizResults.length) {
        start = specific;
        max = start + 1;
    }

    for (let i = start; i < max; i++) {
        results[i] = 0;
        for (let i2 = 0; i2 < quizQuestions.length; i2++) {
            for (let i3 = 0; i3 < quizQuestions[i2].answ.length; i3++) {
                if (doesInclude(quizQuestions[i2].answ[i3].res, i)) results[i] += quizQuestions[i2].answ[i3].wt;
            }
        }
    }

    if (specific > -1 && specific < quizResults.length) return results[start];
    return results;
}

//Returns an Array of Results from Highest to Lowest
function quizResultsHighLow() {
    let result = [];
    let pending = [];

    for (let i = 0; i < quizResults.length; i++) {
        pending[i] = i;
    }

    let max = pending.length;

    for (let i = 0; i < max; i++) {
        let check = 0;
        let tally = quizResultToPercent([pending[check]], true);
        for (let i2 = 1; i2 < pending.length; i2++) {
            if (quizResultToPercent([pending[i2]], true) > tally) {
                tally = quizResultToPercent([pending[i2]], true);
                check = i2;
            }
        }
        result[result.length] = pending[check] + 0;
        let fix = [];
        for (let i2 = 0; i2 < pending.length; i2++) {
            if (i2 != check) fix[fix.length] = pending[i2];
        }
        pending = fix;
    }

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Player Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Applied Results for Clicking a Designated Window
function clickResults(id) {

    if (isQuizAnswer(id)) {
        quizApplyAnswer(id);
        quizCurrent += 1;
        quizMakeQuestion(quizCurrent);
    } else if (id == "restB") {
        newGame();
    } else if (isQuizResult(id)) {
        //quizCurrent = parseInt((quizQuestions.length)) + quizResultsHighLow()[parseInt(quizResNum(id))];
        quizCurrent = parseInt((quizQuestions.length)) + parseInt(quizResNum(id));
        quizMakeQuestion(quizCurrent);
    }

}

//Changes the Weather
function presser(e) {

}

//Window Interactions for Hovering and Clicking -- Modified for Quiz Maker
function highlight() {
    if (gameActive == false) return;
    let pattern = 1;
    let box = document.getElementById(this.id);

    if (isQuizAnswer(box) || this.id == "restB") {
        box.style["background-color"] = quizAnswBoxStyle("background-color", pattern);
        box.style["color"] = quizAnswBoxStyle("color", pattern);
    }

    if (isQuizResult(box)) {
        box.style["background-color"] = quizAnswBoxStyle("res-bc", pattern);
        box.style["color"] = quizAnswBoxStyle("res-fc", pattern);
        if (isQuizResultBest(box)) {
            box.style["color"] = quizAnswBoxStyle("res2-fc", pattern);
        }
        if (isQuizResultCur(box)) {
            box.style["background-color"] = quizAnswBoxStyle("res2-bc", pattern);
        }
    }
}

function unhighlight() {
    if (gameActive == false) return;
    let pattern = 0;
    let box = document.getElementById(this.id);

    if (isQuizAnswer(box) || this.id == "restB") {
        box.style["background-color"] = quizAnswBoxStyle("background-color", pattern);
        box.style["color"] = quizAnswBoxStyle("color", pattern);
    }

    if (isQuizResult(box)) {
        box.style["background-color"] = quizAnswBoxStyle("res-bc", pattern);
        box.style["color"] = quizAnswBoxStyle("res-fc", pattern);
        if (isQuizResultBest(box)) {
            box.style["color"] = quizAnswBoxStyle("res2-fc", pattern);
        }
        if (isQuizResultCur(box)) {
            box.style["background-color"] = quizAnswBoxStyle("res2-bc", pattern);
        }
    }
}

function mouseMoved(e) {
    let primaryArea = board;

    let rect = e.target.getBoundingClientRect();
    let evt = primaryArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = e.pageX - evt.left;
    y = e.pageY - evt.top;

    mouseSpot = [x, y];
}

function clicked() {
    if (gameActive == false) return;

    clickResults(this.id);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Simple Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//(De)activate User Input
function activate(state) {
    gameActive = state;
}

//Returns a Random Value Between Specified Values
function rng(min, max) {
    max += 1 - min;
    let result = Math.floor(Math.random() * max);
    result += min;
    return result;
}

//Randomly Returns a Positive or Negative for the Value
function plusMinus(value) {
    let change = rng(0, 1);
    if (change == 0) {
        return value;
    } else {
        return value * -1;
    }
}

//Randomly Returns True or False
function trueFalse() {
    let result = plusMinus(1);
    if (result > 0) {
        return true;
    } else {
        return false;
    }
}

//Determines if Objects' Spaces Overlap
function checkCollision(ax, ay, aw, ah, bx, by, bw, bh) {
    let hits = false;
    if (ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by) {
        hits = true;
    }
    return hits;
}

//Returns if an Array Includes a Value
function doesInclude(batch, value) {
    let result = false;
    for (let i = 0; i < batch.length; i++) {
        if (batch[i] == value) result = true;
    }

    return result;
}

//Returns the Number of Times an Array Includes a Value
function timesIncluded(batch, value) {
    let result = 0;
    for (let i = 0; i < batch.length; i++) {
        if (batch[i] == value) result += 1;
    }

    return result;
}

//Returns a Random Item from a List and the (Potentially) Modified List
function randomFromList(list, doesModifyList) {
    let rand;
    let important = list;
    if (typeof list != "object") return important;

    if (list.length <= 1) {
        rand = 0;
    } else {
        rand = rng(0, list.length - 1);
    }
    important = list[rand];


    if (doesModifyList) {
        for (let i = rand; i < list.length; i++) {
            if (i != list.length - 1) list[i] = list[i + 1];
        }
        list.pop();
    }


    //return result;
    return important;
}

//Returns an Array that Overrides Values from a Point and Removes Last Element
function deleteElement(list, num) {
    if (typeof list != "object") return list;
    if (list.length <= 0) return [];
    for (let i = num; i < list.length; i++) {
        if (i != list.length - 1) list[i] = list[i + 1];
    }
    list.pop();

    return list;
}

//Determines if a Space is on its Artwork's Border
function isOnBorder(id, w, h, yesNoOnly, horzRead) {
    //Left, Right, Top, Bottom
    let result = [false, false, false, false];
    if (horzRead) {
        if (id % h == 0) result[0] = true;
        if ((id + 1) % h == 0) result[1] = true;
        if (id < w) result[2] = true;
        if (id >= (w * (h - 1))) result[3] = true;
    } else {
        if (id < w) result[0] = true;
        if (id >= (w * (h - 1))) result[1] = true;
        if (id % h == 0) result[2] = true;
        if ((id + 1) % h == 0) result[3] = true;
    }

    if (yesNoOnly) {
        for (let i = 0; i < result.length; i++) {
            if (result[i] == true) return true;
        }
        return false;
    }

    return result;
}

//Returns the Column or Row # for a Place on a Grid
function getLineNum(id, w, h, getCol) {
    let result;

    if (getCol) {
        result = Math.floor(id / h);
    } else {
        result = Math.floor(id % w);
    }

    return result;
}

//Returns an Array with Max & Min Values of a Line on a Grid
function getLineEnds(id, w, h, getCol) {
    let result = [];

    if (getCol) {
        result[0] = id * h;
        result[1] = result[0] + (h - 1);
    } else {
        result[0] = id;
        result[1] = ((w * h) - h) + result[0];
    }

    return result;
}

//Sets a Number to the Max or Min in a Range if Outside that Range
function rangeNum(num, min, max) {
    if (num > max) num = max;
    if (num < min) num = min;
    return num;
}

//Increases or Decreases a Number by an Amount Until it is Within a Range
function nudgeNum(num, change, min, max) {
    let result = num;
    if (min > max || max - min < change) {
        if (change == 1 && min == max) {

        } else {
            return result;
        }
    }
    if (num >= min && num <= max) return result;
    if (num > max) result -= change;
    if (num < min) result += change;

    if (result < min || result > max) return nudgeNum(result, change, min, max);
    return result;
}

//Returns if a Compared Set of Arrays is Identical -- Added for Seeker
function compArrays(comped) {
    if (comped.length <= 1) return true;
    for (let i = 1; i < comped.length; i++) {
        if (comped[0].length > comped[i].length) return false;
        for (let i2 = 0; i2 < comped[0].length; i2++) {
            if (comped[i][i2] != comped[0][i2]) return false;
        }
    }

    return true;
}

//Returns Part of the Current Time -- Added for Seeker
function checkTime(unit) {
    let part = unit.toLowerCase();
    let timez = new Date();
    let result = [timez.getSeconds(), timez.getMinutes(), timez.getHours(), timez.getFullYear(), timez.getTime(),
        timez.getDay(), timez.getMonth(), timez.getDate(), nameWeekday(timez.getDay(), false), timez.getTimezoneOffset(), nameTimezone(timez)];

    if (part == "second" || part == "seconds" || part == "s") return result[0];
    if (part == "minute" || part == "minutes" || part == "m") return result[1];
    if (part == "hour" || part == "hours" || part == "h") return result[2];
    if (part == "year" || part == "years" || part == "y") return result[3];
    if (part == "timestamp" || part == "timestamps" || part == "stamp") return result[4];
    if (part == "day" || part == "days" || part == "d") return result[5];
    if (part == "months" || part == "month" || part == "mo") return result[6];
    if (part == "monthday" || part == "md" || part == "monthly") return result[7];
    if (part == "weekday" || part == "wd" || part == "wkd" || part == "nameday" || part == "nmd" || part == "name") return result[8];
    if (part == "timezoneoffset" || part == "offset" || part == "tzo") return result[9];
    if (part == "zone" || part == "timezone" || part == "tz") return result[10];
    if (part == "all") return result;

    return timez;
}

//Returns a Named Weekday from Provided Number or Number from Provided Name -- Added for Seeker
function nameWeekday(day, abbreviated) {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let abrevs = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    if (typeof day == "string") {
        for (let i = 0; i < days.length; i++) {
            if (days[i] == day || abrevs[i] == day) {
                return i;
            }
        }
        return -1;
    }

    if (day < 0 || day >= days.length) {
        if (abbreviated) return abrevs;
        return days;
    } else {
        if (abbreviated) return abrevs[day];
        return days[day];
    }
}

//Returns a Named Timezone -- Added for Seeker
function nameTimezone(zone) {
    let breakdown = zone.toString();
    breakdown = Array.from(breakdown);
    let result = [];
    let reading = false;
    for (let i = 0; i < breakdown.length; i++) {
        if (reading == false) {
            if (breakdown[i] == "(") reading = true;
        } else {
            if (breakdown[i] == ")") {
                reading = false;
            } else {
                result[result.length] = breakdown[i];
            }
        }
    }

    let final = [];
    for (let i = 0; i < result.length; i++) {
        final = final + result[i];
    }

    return final;
}

//Returns an Array of Characters Converted from a String or String-Like Object -- Added for Seeker
function stringToCharArray(text) {
    let result = text.toString();
    result = Array.from(result);

    return result;
}

//Returns an New Array with Contents of Passed Arrays -- Added for Calendar Marker
function combineArrays(primary, secondary) {
    let result = [];
    for (let i = 0; i < primary.length; i++) {
        result[result.length] = primary[i];
    }
    for (let i = 0; i < secondary.length; i++) {
        result[result.length] = secondary[i];
    }

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Primary Window Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Deletes a Specified Document Element -- Added for Quiz Maker
function destroyWin(win) {
    win.parentNode.removeChild(win);
}

//Deletes a Specified Document Element
function clearWin(win, killHelper) {
    let box;
    let log;
    let logNum;
    let support;

    if (typeof win == "string") {
        box = document.getElementById(win);
        log = checkWinLog(win, false);
        logNum = checkWinLog(win, true);
    } else if (typeof win == "object") {
        box = document.getElementById(win.id);
        log = checkWinLog(document.getElementById(win.id), false);
        logNum = checkWinLog(box, true);
    }

    if (log.title != undefined && log.title != false) {
        support = document.getElementById(log.title);
        support.parentNode.removeChild(support);
    }
    if (log.helper != undefined && log.helper != false && killHelper == true) {
        support = document.getElementById(log.helper);
        support.parentNode.removeChild(support);
    }

    if (box.nodeName.toLowerCase() == "canvas" || log.canvas != false) {
        let checked;
        if (box.nodeName.toLowerCase() != "div") {
            checked = box.getContext("2d");
        } else {
            checked = log.canvas.getContext("2d");
        }

        for (let i = 0; i < animatedZones.length; i++) {
            if (animatedZones[i] == checked) {
                animatedZones[i] = animatedZones[animatedZones.length - 1];
                animatedZones.pop();
                i -= 1;
            }
        }
    }

    box.parentNode.removeChild(box);
    winds[logNum] = winds[winds.length - 1];
    winds.pop();
}

//Modifies an Existing Window's CSS Style
function styleWin(win, styling, part) {
    win.style[part] = styling;
}

//Creates and Returns a New Window
function createWin(parent, id, type, styling) {
    let newWindow = parent.appendChild(document.createElement(type));
    newWindow.id = id;
    styleWin(newWindow, styling, "cssText");
    return newWindow;
}

//Determines if px Should be Added After a Number
function addPX(checked, topic) {
    let result = "; ";
    let attempt = isNaN(parseInt(checked));
    if (attempt != true && isException(checked, topic) == false) {
        result = "px" + result;
    }
    return result;
}

//Determines if an Exception Should be Made to Adding px After a Number
function isException(checked, topic) {
    if (checked.toString().includes("px")) return true;
    if (cssAbb(topic) == "z-index") return true;
    if (cssAbb(topic).includes("opacity")) return true;
    return false;
}

//Deduces Abbreviations for Common CSS Terms
function cssAbb(term) {
    if (term == "br") return "border";
    if (term == "brr") return "border-radius";
    if (term == "brt") return "border-top";
    if (term == "brb") return "border-bottom";
    if (term == "brl") return "border-left";
    if (term == "brdr") return "border-right";
    if (term == "brtl") return "border-top-left-radius";
    if (term == "brtr") return "border-top-right-radius";
    if (term == "brbl") return "border-bottom-left-radius";
    if (term == "brbr") return "border-bottom-right-radius";
    if (term == "z") return "z-index";
    if (term == "t") return "top";
    if (term == "l") return "left";
    if (term == "w") return "width";
    if (term == "h") return "height";
    if (term == "c") return "color";
    if (term == "txt") return "text-align";
    if (term == "user") return "user-select";
    if (term == "fs") return "font-size";
    if (term == "pos") return "position";
    if (term == "mar") return "margin";
    if (term == "mart") return "margin-top";
    if (term == "marl") return "margin-left";
    if (term == "pad") return "padding";
    if (term == "padl") return "padding-left";
    if (term == "padt") return "padding-top";
    if (term == "bg") return "background";
    if (term == "op") return "opacity";
    return term;
}

//Creates a Component of CSS Text
function cssCombine(value, term) {
    let result = cssAbb(term) + ": " + value + addPX(value, term);
    return result;
}

//Uses Arrays to Form CSS Text
function cssMake(values, terms) {
    let result = "";
    let cycles = terms.length;
    if (values.length > terms.length) cycles = values.length;

    for (let i = 0; i < cycles; i++) {
        result += cssCombine(values[i], terms[i]);
    }
    return result.toString();
}

//Adds a New Window with Specified Properties to the Global List
function logWin(parent, id, type, styling, colors, hoverable, clickable, centered, canvased) {
    let winNum = winds.length;
    let newWin = createWin(parent, id, type, styling);
    if (colors != "none") styleWin(newWin, colors[1], "background-color");
    let newCanvas = false;

    //Specialized Properties
    if (hoverable) {
        newWin.addEventListener("mouseover", highlight);
        newWin.addEventListener("mouseout", unhighlight);
    }

    if (clickable) {
        newWin.addEventListener("click", clicked);
    }

    if (centered) {
        let area = [getParentInfo(parent, "w"), getParentInfo(parent, "h")];
        styleWin(newWin, centerWin(newWin.style.width, newWin.style.height, area[0], area[1])[0], "margin-left");
        styleWin(newWin, centerWin(newWin.style.width, newWin.style.height, area[0], area[1])[1], "margin-top");
    }

    if (canvased) {
        let cstyle = [];
        cstyle[0] = ["pos", "br", "bg", "w", "h", "l", "t"];
        cstyle[1] = ["absolute", "none", "none", getParentInfo(newWin, "w"), getParentInfo(newWin, "h"), 0, 0];
        let cstyling = cssMake(cstyle[1], cstyle[0]);
        newCanvas = createWin(newWin, id + "-canvas", "canvas", cstyling);
    }

    //Final
    winds[winNum] = {
        "win": newWin, "id": id, "colors": colors, "hover": hoverable, "title": false, "helper": false, "buttons": false,
        "canvas": newCanvas, "info": ""
    };
    return winds[winNum];
}

//Determines Which Window's Log is Present
function checkWinLog(id, numOnly) {
    for (let i = 0; i < winds.length; i++) {
        if (typeof id == "object") {
            if (winds[i].win == id) {
                if (numOnly == false) {
                    return winds[i]; //Returns the entire object
                } else {
                    return i; //Returns only the object's ID#
                }
            }
        } else {
            if (winds[i].id == id) {
                if (numOnly == false) {
                    return winds[i]; //Returns the entire object
                } else {
                    return i; //Returns only the object's ID#
                }
            }
        }
    }

    return false;
}

//Creates Companion Windows for a Primary Window
function makeSupportWin(id, type, text) {
    let winNum = checkWinLog(id, true);
    let parent = winds[winNum].win;
    let parentLog = winds[winNum];
    let winPendingId;
    let winTerms;
    let winValues;
    let winStyling;
    let base = parent;
    let newColors = ["lightgray", "darkgray"];
    let details = [false, false, false, false];
    let newW;
    let newH;

    //Detail Support Window
    if (type == "helper") {
        base = overlay;
        winPendingId = parent.id + "-helper";
        newColors = parentLog.colors;
        newW = getParentInfo(parent, "w");
        newH = getParentInfo(parent, "h");
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart"];
        winValues = ["absolute", "1px solid black", 3, 5, newW, newH, "none", 18, newColors[1],
            "center", getParentInfo(parent, "marl"), getParentInfo(parent, "mart")];
    } else if (type == "title") {
        base = overlay;
        winPendingId = parent.id + "-title";
        //newColors = parentLog.colors;
        newColors = ["#171717", "#171717"];
        newW = getParentInfo(parent, "w");
        newH = 38;
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart", "opacity", "color", "padt"];
        winValues = ["absolute", "1px solid black", getParentInfo(parent, "brr"), 5, newW, newH, "none", 28, "black",
            "center", getParentInfo(parent, "marl"), getParentInfo(parent, "mart"), 0.95, "white", 2];
    } else {
        details = [true, true, true, false];
        if (winds[winNum].buttons == false) {
            winPendingId = parent.id + "-button" + 0;
        } else {
            winPendingId = parent.id + "-button" + winds[winNum].buttons.length;
        }
        newW = 100;
        newH = 28;
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "l", "t", "opacity"];
        winValues = ["absolute", "1px solid #505050", 1, 6, newW, newH, "none", 24, newColors[1],
            "center", 0, 0, 0.9];
    }

    //Create Support Window
    winStyling = cssMake(winValues, winTerms);
    let supportLog = logWin(base, winPendingId, "div", winStyling, newColors, details[0], details[1], details[2], details[3]);
    let supportWin = supportLog.win;
    let modStyle = supportWin.style;
    let supportId = supportWin.id;

    //Update Support Window Logs
    if (type == "helper") {
        winds[winNum].helper = supportId;

        let modMarl = (propMin(modStyle[cssAbb("marl")]) - propMin(modStyle[cssAbb("w")]) * 1.1) + "px";
        styleWin(supportWin, modMarl, cssAbb("marl"));
    } else if (type == "title") {
        winds[winNum].title = supportId;
        supportWin.innerText = text;

        let modMart = (propMin(modStyle[cssAbb("mart")]) - (propMin(modStyle[cssAbb("h")]) + propMin(modStyle[cssAbb("padt")]))) + "px";
        styleWin(supportWin, modMart, cssAbb("mart"));
        styleWin(parent, "0px", cssAbb("brtl"));
        styleWin(parent, "0px", cssAbb("brtr"));
        styleWin(supportWin, "0px", cssAbb("brbl"));
        styleWin(supportWin, "0px", cssAbb("brbr"));
        styleWin(supportWin, parent.style["border"], "border");
        styleWin(parent, "none", cssAbb("border-top"));
        styleWin(supportWin, "none", cssAbb("border-bottom"));
    } else {
        supportWin.innerText = text;
        let lower = propMin(getParentInfo(parent, "h")) - (10 + newH);

        if (winds[winNum].buttons == false) {
            winds[winNum].buttons = [];
            winds[winNum].buttons[0] = supportId;
            styleWin(document.getElementById(winds[winNum].buttons[0]), lower + "px", cssAbb("mart"));
        } else {
            winds[winNum].buttons[winds[winNum].buttons.length] = supportId;

            let spaces = getSpacing(propMin(getParentInfo(parent, "w")), false, newW, winds[winNum].buttons.length);
            for (let i = 0; i < winds[winNum].buttons.length; i++) {
                let buttonWin = document.getElementById(winds[winNum].buttons[i]);
                styleWin(buttonWin, spaces[i] + "px", cssAbb("marl"));
                styleWin(buttonWin, lower + "px", cssAbb("mart"));
                checkWinLog(buttonWin.id, false).info = buttonWin.innerText + "!"; //Placeholder Default Info
                checkWinLog(buttonWin.id, false).helper = parentLog.helper;
            }
        }

    }
}

//Removes Stray Info from Window Properties
function propMin(value) {
    let result = value.replace("px", "");
    result = parseFloat(result);
    return result;
}

//Returns Coordinates for Centering a Window within a Space
function centerWin(winW, winH, areaW, areaH) {
    winW = parseInt(winW);
    winH = parseInt(winH);
    areaW = parseInt(areaW);
    areaH = parseInt(areaH);
    let result = [(areaW / 2 - winW / 2).toString() + "px", (areaH / 2 - winH / 2).toString() + "px"];
    return result;
}

//Gets Valid Information from Parent Window
function getParentInfo(parent, term) {
    term = cssAbb(term);
    let result = parent[term];
    if (result == undefined) {
        result = parent.style[term];
    }
    return result;
}

//Generates an Array of Spacing Based on Given Data
function getSpacing(area, buffer, object, count) {
    let result = [];
    let space;

    if (buffer == false) {
        space = area / (object * count);
        buffer = (area % (object * count)) / (count + 1);
    } else {
        space = (area - (buffer * (count + 1))) / (object * count);
    }

    for (let i = 0; i < count; i++) {
        result[i] = ((space + object) * i) + (buffer * (i + 1));
    }
    return result;
}

//Returns a Window Scaling Ratio for Uniform Boxes
function getRatio(value, isX) {
    let ratio = boardWidth / boardHeight;
    let result = value * ratio;
    if (isX) {
        return result;
    } else {
        return value;
    }
}

//Returns Centered Animation Coordinates
function centerAnim(target, anim, parent, x, y, alt) {
    let ar = getAnimRatio(anim, false);
    let ps = [propMin(parent.style.width), propMin(parent.style.height)];
    let result = centerWin(ar[0], ar[1], ps[0], ps[1]);
    let part = "mar";
    if (alt) part = "";
    let suffix;

    if (x) {
        suffix = part + "l";
        styleWin(target, result[0], cssAbb(suffix));
    }
    if (y) {
        suffix = part + "t";
        styleWin(target, result[1], cssAbb(suffix));
    }

    return result;
}

//Returns Orientation Based on Animation Scale
function getAnimRatio(anim, px) {
    let tilesX = anim.art[0].width - 1;
    let tilesY = anim.art[0].height - 1;

    let stillCheck = true;
    for (let i = 0; i < anim.art[0].width; i++) {
        if (checkBlank(i, anim.art[0], false) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }
    stillCheck = true;
    for (let i = anim.art[0].width - 1; i >= 0; i -= 1) {
        if (checkBlank(i, anim.art[0], false) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }

    stillCheck = true;
    for (let i = 0; i < anim.art[0].height; i++) {
        if (checkBlank(i, anim.art[0], true) && stillCheck) {
            tilesY -= 1;
        } else {
            stillCheck = false;
        }
    }
    stillCheck = true;
    for (let i = anim.art[0].height - 1; i >= 0; i -= 1) {
        if (checkBlank(i, anim.art[0], true) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }

    let x = tilesX * anim.localPixes;
    let y = tilesY * anim.localPixes;
    if (px) {
        x = x.toString() + "px";
        y = y.toString() + "px";
    }
    let results = [x, y];

    return results;
}

//Destroys Buttons Associated with a Window Log
function destroyButtons(log) {
    if (log.buttons != false) {
        if (log.buttons.length > 0) {
            for (let i = 0; i < log.buttons.length; i++) {
                let box = document.getElementById(log.buttons[i]);
                clearWin(box.id, false);
            }
            log.buttons = false;
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Update Support Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Clears and Animates
function animationUpdate() {

    if (animatedZones.length > 0) {
        for (let i = 0; i < animatedZones.length; i++) {
            if (animatedZones[i] != undefined) {
                animatedZones[i].clearRect(0, 0, boardWidth, boardHeight);
            } else {
                console.log("undefined animation zone");
                animatedZones[i] = animatedZones[animatedZones.length - 1];
                animatedZones.pop();
                i -= 1;
            }
        }
    }

    if (animationsList.length > 0) {
        for (let i = 0; i < animationsList.length; i++) {
            drawAnimation(animationsList[i]);
        }
    }

    if (moverList.length > 0) {
        for (let i = 0; i < moverList.length; i++) {
            moveMover(moverList[i]);
        }
    }

    updateCleanup();
}

//Cleans Up Spent Animations
function updateCleanup() {
    if (animationsList.length > 0) {
        for (let i = 0; i < animationsList.length; i++) {
            if (animationsList[i].looping == 0) {
                removeAnimation(animationsList[i]);
                /*if (animationsList.length <= 1) {
                    animationsList = [];
                } else {
                }*/
            }
        }
    }

    if (moverList.length > 0) {
        for (let i = 0; i < moverList.length; i++) {
            if (moverList[i].current >= moverList[i].frames) {
                removeMover(moverList[i]);
                /*if (moverList.length <= 1) {
                    moverList = [];
                } else {
                }*/
            }
        }
    }

    //if (moverList.length < 1) moverList = [];
    //if (animationsList.length < 1) animationsList = [];
}

//Shows Focused Tiles
function gridFocusUpdate() {
    for (let i = 0; i < totalTiles; i++) {
        let tile = grid[i];
        if (tile.focused == true) {
            focusGridTile(i);
        } else {
            tile.back.win.style[cssAbb("op")] = gridOpacity();
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Grid Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Creates the Initial Objects and Elements for the Game's Grid
function makeGrid() {
    makeGridSize();
    for (let i = 0; i < sizeGrid("r"); i++) {
        for (let i2 = 0; i2 < sizeGrid("c"); i2++) {
            let x = sizeGrid("w") * i;
            let y = sizeGrid("h") * i2;
            let id = (i * sizeGrid("r")) + i2;

            let borders = [false, true, false, true]; //left, right, top, bottom
            if (i == 0) borders[0] = false;
            if (i == sizeGrid("r") - 0) borders[1] = false;
            if (i2 == 0) borders[2] = false;
            if (i2 == sizeGrid("c") - 0) borders[3] = false;

            let newSpace = makeGridSpace(x, y, id, borders);
            grid[id] = newSpace;
        }
    }

    makeGridTerrain(mapTerrain);
}

//Returns Values for Grid Sizes and Spacing
function sizeGrid(value) {
    if (value == "r" || value == "rows") {
        return gridSize[2];
    } else if (value == "c" || value == "columns") {
        return gridSize[3];
    } else if (value == "w" || value == "width") {
        return gridSize[0];
    } else if (value == "h" || value == "height") {
        return gridSize[1];
    } else {
        return 0;
    }

}

//Determines the Dimensions of a Grid Space
function makeGridSize() {
    gridSize[2] = boardHeight / sizeGrid("h");
    gridSize[3] = boardWidth / sizeGrid("w");
    totalTiles = gridSize[2] * gridSize[3];
}

//Makes a Space within the Grid
function makeGridSpace(x, y, id, borders) {
    x -= 0; //For Parsing Problems, return to "x -= 1"
    y -= 0; //For Parsing Problems, return to "y -= 1"
    let finalSpace;
    let winPendingId;
    let winTerms;
    let winValues;
    let winStyling;
    let winLogs = [];
    let defC = "none";
    let actC = changeGridColors("default");
    let op = gridOpacity();
    //let bd = "1px solid rgba(145,165,145,0.45)";
    let bd = "1px solid rgba(115,135,115,0.95)";
    let bb = ["brl", "brdr", "brt", "brb"];
    let bs = [bd, bd, bd, bd];
    if (borders[0] == false) bs[0] = "none"; //Left
    if (borders[1] == false) bs[1] = "none"; //Right
    if (borders[2] == false) bs[2] = "none"; //Top
    if (borders[3] == false) bs[3] = "none"; //Bottom
    let brr = ["brr", 0];
    let spbr = 5;
    if (id == 0) brr = ["brtl", spbr]; //Top-Left
    if (id == sizeGrid("r") - 1) brr = ["brbl", spbr]; //Bottom-Left
    if (id == (sizeGrid("r") - 1) * sizeGrid("c")) brr = ["brtr", spbr]; //Top-Right
    if (id == ((sizeGrid("r") - 1) * sizeGrid("c")) + (sizeGrid("c") - 1)) brr = ["brbr", spbr]; //Bottom-Right
    let smd = 0;
    let smd2 = 0;
    if (id >= (sizeGrid("c") * sizeGrid("r")) - sizeGrid("r")) smd = 2;
    if ((id + 1) % sizeGrid("c") == 0 && id != 1) smd2 = 2;

    //Clickable Div
    winPendingId = "GridSpace-D" + id;
    winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart"];
    winValues = ["absolute", "none", 0, 4, sizeGrid("w") - smd, sizeGrid("h") - smd2, "none", 18, "none", "center", x, y];
    winStyling = cssMake(winValues, winTerms);
    winLogs[0] = logWin(overlay, winPendingId, "div", winStyling, [defC, defC], false, true, false, false);

    //Modified Values for Spacing
    let pvals = [];
    pvals[0] = propMin(getParentInfo(winLogs[0].win, "marl")) + 1;
    pvals[1] = propMin(getParentInfo(winLogs[0].win, "mart")) + 1;
    pvals[2] = sizeGrid("w") - 1 - (smd / 2);
    pvals[3] = sizeGrid("h") - 1 - (smd2 / 2);

    //Outlined Canvas
    winPendingId = "GridSpace-CA" + id;
    winTerms = ["pos", "bg", "w", "h", "marl", "mart", "z", "op", brr[0], bb[0], bb[1], bb[2], bb[3]];
    winStyling = cssMake(winValues, winTerms);
    winValues = ["absolute", "none", pvals[2], pvals[3], pvals[0], pvals[1], 1, op, brr[1], bs[0], bs[1], bs[2], bs[3]];
    winStyling = cssMake(winValues, winTerms);
    winLogs[1] = logWin(overlay, winPendingId, "canvas", winStyling, actC, false, false, false, false);

    finalSpace = {"id": id, "win": winLogs[0], "back": winLogs[1], "role": "none", "focused": false};

    return finalSpace;
}

//Determines if a Grid is Occupied
function checkGridOccupied(id) {
    if (typeof id == "string") id = getGridSpace(id, false);
    if (id.role == "none") return false;
    return true;
}

//Gets the ID for the GridSpace
function getGridSpaceId(id, numOnly) {
    if (typeof id == "number" && id < grid.length && numOnly == false) return grid[id];
    if (typeof id == "number" && id < grid.length && numOnly) return id;
    if (typeof id == "object") id = (id.id).toString();
    if (id.toString().includes("GridSpace-")) id = id.toString().replace("GridSpace-", "");
    if (id.toString().includes("D")) id = id.toString().replace("D", "");
    if (id.toString().includes("CA")) id = id.toString().replace("CA", "");
    if (id.toString().includes("CB")) id = id.toString().replace("CB", "");

    for (let i = 0; i < grid.length; i++) {
        if (id == grid[i].id || id == grid[i].win.win.id || id == grid[i].back.win.id) {
            if (numOnly) {
                return i;
            } else {
                return grid[i];
            }
        }
    }

    return "none";
}

//Returns the Default Selection Opacity for a Grid Space
function gridOpacity() {
    return 0.25;
}

//Returns the Selection Animation Cycle Details for the Selected Grid Space
function focusGridTile(id) {
    if (id != -1) {
        let box = grid[id].back.win;
        let incr = 0.002;
        let duration = fps * 2;
        let pivot = (duration / 2) + 0.5;
        let aStage = globalAnimationCycle % duration;
        let result = gridOpacity();

        if (aStage > pivot) {
            result = result + (incr * pivot) - (incr * (aStage - pivot));
        } else {
            result += (incr) * (aStage);

        }
        styleWin(box, result, "opacity");
    }
}

//Changes the Grid Selection
function changeGridSelection(id) {
    let space = getGridSpaceId(id, true);
    let tile = getGridSpaceId(id, false);
    let colors;
    let box;

    if (selected != -1) {
        box = grid[selected].back.win;
        colors = checkWinLog(box.id, false).colors;
        styleWin(box, colors[1], "background");
        //styleWin(box, gridOpacity(), "opacity");
        grid[selected].focused = false;
    }

    if (selected != space) {
        box = getGridSpaceId(id, false).back.win;
        colors = checkWinLog(box.id, false).colors;
        styleWin(box, colors[0], "background");
        selected = space;
        tile.focused = true;
    } else {
        selected = -1;
    }
        
}

//Returns a Set of Colors for a Grid's Status
function changeGridColors(status) {
    let result = ["lightyellow", "none"]; //Default

    return result;
}

//Resets the Colors of All Grid Spaces
function resetGridColors() {
    for (let i = 0; i < totalTiles; i++) {
        let tile = grid[i];
        tile.colors = changeGridColors("default");
    }
}

//Gets a Centered Point for the Grid Space, Optionally Including Parent Object
function centerGridSpace(space, size, includePrimary) {
    let spot = grid[space].win.win;
    let x = (propMin(spot.style[cssAbb("marl")]) + (propMin(spot.style[cssAbb("w")]) / 2)) - Math.floor(size / 2);
    let y = (propMin(spot.style[cssAbb("mart")]) + (propMin(spot.style[cssAbb("h")]) / 2)) - Math.floor(size / 2);

    if (includePrimary == false) {
        x -= propMin(spot.style[cssAbb("marl")]);
        y -= propMin(spot.style[cssAbb("mart")]);
    }

    return [x, y];
}

//Returns the Distance Between Grid Spaces with Non-Diagonal Movement
function getDist(a, b) {
    if (typeof a == "object") a = a.id;
    if (typeof b == "object") b = b.id;
    let r = sizeGrid("r");
    let c = sizeGrid("c");
    let as = [Math.floor(a / c), a % r];
    let bs = [Math.floor(b / c), b % r];

    let result = Math.abs(as[0] - bs[0]) + Math.abs(as[1] - bs[1]);
    if (a == b) result = 0;

    //Special for Blocked Spaces -- Enable if Needed
    //if (result != 0) result = blockSpaceDistCheck(result, a, b, r, c, as, bs);

    return result;
} 

//Returns Whether or Not a Space is on the Grid's Edge
function isOnGridEdge(id) {
    if (id < sizeGrid("c")) return true;
    if (id > grid.length - sizeGrid("c")) return true;
    if (id % sizeGrid("r") == 0) return true;
    if ((id + 1) % sizeGrid("r") == 0) return true;
    return false;
}

//Returns Which Grid Edges a Space Touches
function getGridEdges(id) {
    //Left, Right, Top, Bottom
    let touches = [false, false, false, false];
    if (isOnGridEdge(id) != true) return touches;

    if (id < sizeGrid("c")) touches[0] = true;
    if (id > grid.length - sizeGrid("c")) touches[1] = true;
    if (id % sizeGrid("r") == 0) touches[2] = true;
    if ((id + 1) % sizeGrid("r") == 0) touches[3] = true;

    return touches;
}

//Returns if the Grid Space Touches a Corner
function getGridCorner(id) {
    //None, Top-Left, Bottom-Left, Top-Right, Bottom-Right
    let corner = 0;
    let edges = getGridEdges(id);
    if (edges[0] && edges[2]) corner = 1;
    if (edges[0] && edges[3]) corner = 2;
    if (edges[1] && edges[2]) corner = 3;
    if (edges[1] && edges[3]) corner = 4;

    return corner;
}

//Gets Neighboring Spaces on a Grid (Left, Right, Top, Bottom)
function getGridNeighbors(id, w, h, max) {
    let result = [-1, -1, -1, -1];
    let edges = isOnBorder(id, w, h, false, false);

    let tally = 0; //Left
    if (edges[tally] == false) {
        result[tally] = id - w;
    }
    tally += 1; //Right
    if (edges[tally] == false) {
        result[tally] = id + w;
    }
    tally += 1; //Top
    if (edges[tally] == false) {
        result[tally] = id - 1;
    }
    tally += 1; //Bottom
    if (edges[tally] == false) {
        result[tally] = id + 1;
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] > max) result[i] = -1;
        if (result[i] < 0) result[i] = -1;
    }

    return result;
}

//Returns an Array of Surrounding Spaces on the Grid
function getGridSurrounding(id, distance, includeDiagonal, includeOrigin) {
    let max = grid.length - 1;
    let w = sizeGrid("c");
    let h = sizeGrid("r");
    let result = [];

    for (let i = 1; i <= distance; i++) {
        if (doesInclude(result, id - (w * i) == false)) result[result.length] = id - (w * i);
        if (doesInclude(result, id + (w * i) == false)) result[result.length] = id + (w * i);
        if (doesInclude(result, id - i == false)) result[result.length] = id - i;
        if (doesInclude(result, id + i == false)) result[result.length] = id + i;
        if (includeDiagonal) {
            let xs = [];
            let ys = [];
            xs[0] = nudgeNum(getLineNum(id, w, h, true) - 2, 1, 0, w - 1);
            xs[1] = nudgeNum(getLineNum(id, w, h, true) + 2, 1, 0, w - 1);
            ys[0] = nudgeNum(getLineNum(id, w, h, false) - 2, 1, 0, h - 1);
            ys[1] = nudgeNum(getLineNum(id, w, h, false) + 2, 1, 0, h - 1);
            let min = 0;
            let maxi = grid.length;

            for (let i2 = min; i2 < maxi; i2++) {
                let x = getLineNum(i2, w, h, true);
                let y = getLineNum(i2, w, h, false);
                if (x <= xs[1] && x >= xs[0]) {
                    if (y <= ys[1] && y >= ys[0]) {
                        if (doesInclude(result, i2) == false) {
                            result[result.length] = i2;
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] > max || result[i] < 0 || (includeOrigin == false && result[i] == id)) {
            result[i] = result[result.length - 1];
            result.pop();
            i -= 1;
        }
    }

    result.sort((a, b) => a - b);

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Terrain Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Creates Terrain Types for the Grid
function makeGridTerrain(region) {
    let dim = [sizeGrid("w"), sizeGrid("h")];
    let spaces = grid.length;

    for (let i = 0; i < spaces; i++) {
        grid[i].role = randomTerrain(true);
    }

    drawAllGridTerrain(region);
}

//Draws All Grid Terrains
function drawAllGridTerrain(region) {
    region.clearRect(0, 0, boardWidth, boardHeight);
    let dim = [sizeGrid("w"), sizeGrid("h")];
    let spaces = grid.length;

    for (let i = 0; i < spaces; i++) {
        let x = Math.floor(i / sizeGrid("c")) * dim[0];
        let y = (i % sizeGrid("r")) * dim[1];
        drawTerrain(region, i, grid[i].role, x, y, dim[0], dim[1]);
    }
}

//Draws Terrain in an Area
function drawTerrain(region, id, ter, x, y, w, h) {
    if (typeof ter == "number") ter = tType(ter);
    let colors = tColors(ter);
    let neighbors = getGridNeighbors(id, sizeGrid("c"), sizeGrid("r"), grid.length - 1);
    let borUsed = [0, 2];
    let artSpread = [];

    for (let i = 0; i < h; i++) {
        artSpread[i] = [];
        for (let i2 = 0; i2 < w; i2++) {
            let i3 = (i * h) + i2;
            artSpread[i][i2] = colors[0];
            if (isOnBorder(i3, w, h, true, true)) {
                let bordered = isOnBorder(i3, w, h, false, true);
                for (let i4 = 0; i4 < borUsed.length; i4++) {
                    if (sameNeighborTerrain(id, neighbors[borUsed[i4]]) == false && bordered[borUsed[i4]]) {
                        artSpread[i][i2] = colors[1];
                    }
                }
            }
        }
    }
    let art = makeDrawing(artSpread, false);
    drawSprite(region, art, x, y, 1);
}

//Checks if a Neighbor is the Same Terrain Type
function sameNeighborTerrain(a, b) {
    if (typeof a == "object") a = a.id;
    if (typeof b == "object") b = b.id;
    if (a > grid.length || b > grid.length) return true;
    if (a < 0 || b < 0) return true;
    if (grid[a].role == grid[b].role) return true;
    return false;
}

//Gets a List of Colors for a Terrain Type
function tColors(id) {
    //Format -- Area, Border, Special
    let terrains = tType(-1);
    if (typeof id == "number") id = tType(id);
    let result = ["", "", ""];

    if (id == terrains[0]) result = ["tan", "brown", "navajowhite"];
    if (id == terrains[1]) result = ["skyblue", "darkblue", "blue"];
    if (id == terrains[2]) result = ["", "", ""];

    return result;
}

//Returns a Specific Terrain Type or List of Terrain Types
function tType(id) {
    let terrains = ["ground", "water"];
    if (id < 0 || id > terrains.length) return terrains;
    return terrains[id];
}

//Returns a Random Terrain Type
function randomTerrain(useName) {
    let terrains = tType(-1);
    let rand = rng(0, terrains.length - 1);
    if (useName) return terrains[rand];
    return rand;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Pathing Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns the Values of a Common Pathing Type -- Added for Seeker
function patherPathingType(id) {
    let types = ["walking", "swimming", "flying"];
    if (id < 0) return types;
    let paths = [];
    paths[paths.length] = [0];
    paths[paths.length] = [1];
    paths[paths.length] = [0, 1];

    for (let i = 0; i < paths.length; i++) {
        for (let i2 = 0; i2 < paths[i].length; i2++) {
            paths[i][i2] = tType(paths[i][i2]);
        }
    }

    for (let i = 0; i < types.length; i++) {
        if (id == i || id == types[i]) {
            return paths[i];
        }
    }

    return -1;
}

//Determines a Pather's Common Pathing Type -- Added for Seeker
function checkPatherCommonType(pather) {
    let types = patherPathingType(-1);
    for (let i = 0; i < types.length; i++) {
        if (compArrays([pather.walkable, patherPathingType(i)])) {
            return types[i];
        }
    }

    return -1;
}

//Returns a Pather with Walkable Terrain from a Specified Pattern -- Added for Seeker
function patherCommonWalkable(pather, type) {
    let walks = {"walkable": []};
    switch (type) {
        case "walking":
            walks = addWalkable(walks, 0);
            break;
        case "swimming":
            walks = addWalkable(walks, 1);
            break;
        case "flying":
            let allTs = tType(-1);
            for (let i = 0; i < allTs.length; i++) {
                walks = addWalkable(walks, i);
            }
            break;
        default:
            walks.walkable = pather.walkable;
            break;
    }
    pather.walkable = walks.walkable;
    pather = turnPather(pather);
    return pather;
}

//Returns an Array of Colors for the Pather -- Modified for Seeker
function patherColors(walks) {
    let tWalk = { "walkable": walks };
    let types = patherPathingType(-1);
    let actual = checkPatherCommonType(tWalk);

    if (actual == types[0]) return ["none", "#ffffff", "#000000", "#992222", "#303030"];
    if (actual == types[1]) return ["none", "#004466", "#006699", "#ffaaaa", "#0000ff"];
    if (actual == types[2]) return ["none", "#000055", "#444455", "#ffffcc", "#aa6600"];

    return ["none", "#ffffff", "#000000", "#992222", "#303030"];
}

//Console Prints the Distances to All Other Spaces
function consoleLogAllDistances(origin, current) {
    let distances = [];
    console.log("Entering Space #" + current);
    console.log("Distances from Space #" + origin + ":");
    for (let i = 0; i < grid.length; i++) {
        if (i != origin) {
            distances[i] = getDist(i, origin);
            //let txt = i + " => " + origin + ": " + distances[i] + " blocks";
            //console.log(txt);
        }
    }

    let pool = [];

    for (let i2 = 0; i2 < grid.length; i2++) {
        if (i2 == current + 10) pool[pool.length] = i2;
        if (i2 == current + 1) pool[pool.length] = i2;
        if (i2 == current - 10) pool[pool.length] = i2;
        if (i2 == current - 1) pool[pool.length] = i2;
    }

    for (let i2 = 0; i2 < pool.length; i2++) {
        let i = pool[i2];
        let txt = i + " => " + distances[i] + " blocks";
        if (grid[i].role == "blocked") txt = i + " => BLOCKED";
        console.log(txt);
    }

    /*for (let i4 = 0; i4 < pool.length; i4++) {
        let i = pool[i4];
        if (i != origin && grid[i].role != "blocked") {
            let shortest = true;
            let longest = true;

            for (let i2 = 0; i2 < pool.length; i2++) {
                let i3 = pool[i2];
                if (i3 != i && i3 != origin) {
                    if (distances[i] < distances[i3]) longest = false;
                    if (distances[i] > distances[i3]) shortest = false;
                }
            }
            if (shortest) console.log("Shortest = #" + i + " @ " + distances[i] + " blocks");
            if (longest) console.log("Longest = #" + i + " @ " + distances[i] + " blocks");
        }
    }

    for (let i = 0; i < grid.length; i++) {
        if (grid[i].role == "blocked") distances[i] = "BLOCK";
    }

    console.log(distances);*/

    console.log("-----");
}

//Causes Pathfinder(s) to Walk to Goal(s)
function applyPathfinder() {

    for (let i = 0; i < pathfinder.length; i++) {
        pathfinder[i] = changePathGoal(pathfinder[i], selected);
        learnPath(pathfinder[i]);
    }

}

//Creates a Test Character for Pathfinding
function makePathfinder() {
    let anSize = 22;
    let anPix = 2;
    let defaultSpeed = 2;
    let spaced = [rng(0, sizeGrid("c") - 1), rng(0, sizeGrid("r") - 1)];
    let space = drawSpot(spaced[0], spaced[1], sizeGrid("r"));
    //let spot = grid[space].win.win;
    let xy = centerGridSpace(space, anSize * anPix, true);
    let id = pathfinder.length;

    removeAnimation("pathfinder");
    let anim = makeAnimation(animationBird(patherColors([tType(0)]), -1), -1, xy[0], xy[1], context, anPix, "pather" + pathfinder.length, 60);
    let recent = [];

    pathfinder[pathfinder.length] = {
        "id": id, "space": space, "loc": xy, "art": anim, "size": anSize * anPix, "speed": defaultSpeed, "recent": recent, "goal": -1,
        "dir": 0, "oob": [], "walkable": []
    };

    pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], grid[pathfinder[pathfinder.length - 1].space].role);
    pathfinder[pathfinder.length - 1].art.art = getPatherAnimation(pathfinder[pathfinder.length - 1]);

    let minimumMoves = getGridSurrounding(pathfinder[pathfinder.length - 1].space, 2, true, false);
    for (let i = 0; i < minimumMoves.length; i++) {
        grid[minimumMoves[i]].role = grid[pathfinder[pathfinder.length - 1].space].role;
    }
    drawAllGridTerrain(mapTerrain);

    /*pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], 0);
    pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], 1);
    pathfinder[pathfinder.length - 1] = removeWalkable(pathfinder[pathfinder.length - 1], 1);*/
}

//Returns a List of Spaces with a Specific Role
function getSpaceRoles(roleName) {
    let result = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].role == roleName) result[result.length] = i;
    }

    return result;
}

//Returns the Current Space Based on Provided Coordinates
function checkCurrentSpace(x, y) {
    let r = sizeGrid("r");
    let c = sizeGrid("c");

    let loc = [-1, -1];

    for (let i = 0; i < c; i++) {
        if (x <= (i + 1) * sizeGrid("w") && loc[0] == -1) loc[0] = i;
    }

    for (let i = 0; i < r; i++) {
        if (y <= (i + 1) * sizeGrid("h") && loc[1] == -1) loc[1] = i;
    }

    return drawSpot(loc[0], loc[1], sizeGrid("r"));
}

//Begins Walking Towards the Goal
function learnPath(pather) {
    //Initial Checks and Orientation
    let goal = pather.goal;
    if (goal < 0) return;
    let scope = [pather.loc[0], pather.loc[1]];
    let longDest = centerGridSpace(goal, pather.size, true);
    if (goal < pather.space) {
        for (let i = 0; i < scope.length; i++) {
            scope[i] += pather.size;
            longDest[i] += pather.size;
        }
    }
    pather.space = checkCurrentSpace(scope[0], scope[1]);
    if (doesInclude(pather.recent, pather.space) == false) pather.recent[pather.recent.length] = pather.space;
    if (pather.loc[0] == longDest[0] && pather.loc[1] == longDest[1]) return;
    if (canPath(goal, [pather.space], [pather.space], goal, pather.recent, pather.walkable) != true) return;

    let shortDest = startPathing(pather, true);
    if (shortDest < 0) return;
    if (pather.space == goal) shortDest = goal;
    let dest = centerGridSpace(shortDest, pather.size, true);
    let cur = pather.loc;
    let x = dest[0] - cur[0];
    let y = dest[1] - cur[1];

    if (Math.abs(x) > pather.speed) {
        if (x > 0) {
            x = pather.speed;
        } else {
            x = -1 * pather.speed;
        }
    }
    if (Math.abs(y) > pather.speed) {
        if (y > 0) {
            y = pather.speed;
        } else {
            y = -1 * pather.speed;
        }
    }

    pather.loc = [pather.loc[0] + x, pather.loc[1] + y];
    pather.art.x = pather.loc[0];
    pather.art.y = pather.loc[1];
    pather.dir = patherFacing(pather.space, shortDest, pather.dir);
    pather = turnPather(pather);
}

//Returns a List of Available Options for Travel
function assignSpaceOption(current) {
    let options = [];

    if (current >= sizeGrid("r")) options[options.length] = current - sizeGrid("c");
    if (current < (sizeGrid("r") * sizeGrid("c")) - sizeGrid("r")) options[options.length] = current + sizeGrid("c");
    if (current != 0 && current % sizeGrid("r") != 0) options[options.length] = current - 1;
    if ((current + 1) % sizeGrid("r") != 0) options[options.length] = current + 1;

    return options;
}

//Returns a List of Pathable Spaces
function assignSpaceAvailable(options, journey) {
    let available = [];
    let goal = journey.goal;
    let traveled = [];
    let denied = [];
    let bonusDenied = [];

    for (let i = 0; i < options.length; i++) {
        available[i] = canPath(options[i], traveled, denied, goal, bonusDenied, journey.walkable);
    }

    return available;
}

//Returns a Score for a Location Based on Distance from Start and Goal
function scoreSpace(space, goal, priorMoves) {
    let f = getDist(space, goal) + priorMoves;

    return f;
}

//Creates an Object Reflecting a Pathing Space's Characteristics
function makePathNode(prior, id) {
    let moves;
    if (prior == "none") {
        moves = 0;
    } else {
        moves = prior.moves + 1;
    }

    let node = { "prior": prior, "id": id, "moves": moves };

    return node;
}

//Returns Whether a Space is Already Assessed
function isNodeIncluded(id, nodes) {
    let checks = [];

    for (let i = 0; i < nodes.length; i++) {
        checks[i] = nodes[i].id;
    }

    return doesInclude(checks, id);
}

//Returns the Shortest Path from Available Nodes
function getShortestPath(nodes, excluded, goal) {
    let threshold = grid.length;
    let winner = -1;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].moves < threshold && isNodeIncluded(nodes[i].id, excluded) == false) {
            threshold = scoreSpace(nodes[i], goal, countPriorMoves(nodes[i]));
            winner = i;
        }
    }

    if (winner != -1) return nodes[winner];
    return -1;
}

//Determines the Number of Prior Moves for a Space
function countPriorMoves(node, tally) {
    if (node.prior != "none") {
        tally += 1;
        tally = countPriorMoves(node.prior, tally);
    }

    return tally;

}

//Creates a List of Nodes from Valid Options
function makeLocalNodes(options, available, prior) {
    let nodes = [];

    for (let i = 0; i < options.length; i++) {
        if (available[i]) {
            nodes[nodes.length] = makePathNode(prior, options[i]);
        }
    }

    return nodes;
}

//Adds a Set of Nodes to the Journey and Returns the Journey
function addJourneyNodes(journey, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if (isNodeIncluded(nodes[i].id, journey.nodes) == false) {
            journey.nodes[journey.nodes.length] = nodes[i];
        }
    }

    return journey;
}

//Returns a List of All Nodes Excluded from the Journey -- Mostly for Testing Purposes
function verifyNodes(journey) {
    let nodez = [];
    let excluded = [];
    for (let i = 0; i < journey.nodes; i++) {
        nodez[nodez.length] = journey.nodes[i].id;
    }

    for (let i = 0; i < grid.length; i++) {
        if (doesInclude(nodez, i) == false) excluded[excluded.length] = i;
    }

    if (excluded.length > 0) return excluded;
    return -1;
}

//Attempts to Move from a Space and Return a Path
function scoutNode(current, journey) {
    if (current == null) return -1;
    if (current.id == null) return -1;
    let result;
    let options = assignSpaceOption(current.id);
    let available = assignSpaceAvailable(options, journey);

    if (isDeadEnd(available)) return -1;

    let nodes = makeLocalNodes(options, available, current);
    journey = addJourneyNodes(journey, nodes);

    let breakCycle = false;

    while (breakCycle == false) {
        let short = getShortestPath(journey.nodes, journey.excluded, journey.goal);

        if (short.id == journey.goal) {
            result = short;
            breakCycle = true;
        } else {
            if (short != -1) journey.excluded[journey.excluded.length] = short;

            //let ceaseThreshold = available.length - 1;
            let ceaseThreshold = 10;
            let cease = false;
            if (remainingPaths(journey)) {
                journey.blocked = 0;
            } else {
                if (journey.blocked >= ceaseThreshold) {
                    cease = true;
                } else {
                    journey.blocked += 1;
                }
            }

            if (cease == false) {
                result = scoutNode(short, journey);
            } else {
                result = -1;
                breakCycle = true;
            }
        }
    }

    //Failsafe
    return result;
}

//Returns Number of Available Paths for Scouting After Excluded Removal
function remainingPaths(journey) {
    let remaining = journey.nodes.length - journey.excluded.length;
    if (remaining > 0) return true;
    return false;
}

//Returns an Array Reflecting the Walked Path
function formPath(path, node) {
    path[path.length] = node.id;

    if (node.prior != "none") {
        return formPath(path, node.prior);
    }

    //path[path.length] = goal;

    return path.reverse();
}

//Establishes an A* Algorithm Variant to Return Part of Whole of Available Path
function startPathing(pather, nextOnly) {
    let path = -1;
    let current = pather.space;

    if (checkOutOfBounds(pather)) return path;
    if (isUnreachable(pather.goal, pather)) return path;

    if (isUnreachable(pather.goal, pather) != true) {
        let node = makePathNode("none", current);
        let journey = { "nodes": [node], "goal": pather.goal, "excluded": [], "blocked": 0, "walkable": pather.walkable };
        let dest = scoutNode(node, journey);
        if (typeof dest == "object") path = formPath([], dest);
    }


    //Final
    if (typeof path == "number") {
        if (checkOutOfBounds(pather) == false) pather = addOutOfBounds(pather.goal, pather);
        if (path < 0) return path;
        if (isNaN(path)) return -1;
    }
    if (typeof path != "object") return -1;
    if (nextOnly) return path[1];
    return path;
}

//Determines if a Location is a Dead-End
function isDeadEnd(options) {
    let result = true;

    for (let i = 0; i < options.length; i++) {
        if (options[i] == true) result = false;
    }

    return result;
}

//Determines if a Course is Traversible
function canPath(id, traveled, denied, goal, bonusDenied, walkable) {
    if (isNaN(id)) return false;
    if (id < 0) return false;
    if (id >= grid.length) return false;

    walkable = { "walkable": walkable };
    let result = true;

    for (let i = 0; i < traveled.length; i++) {
        if (traveled[i] == id) result = false;
    }

    for (let i = 0; i < denied.length; i++) {
        if (denied[i] == id) result = false;
    }

    for (let i = 0; i < bonusDenied.length; i++) {
        if (bonusDenied[i] == id) result = false;
    }

    if (grid[id].role == "blocked") result = false;

    if (grid[id].role != "blocked" && id == goal) result = true;

    if (checkWalkable(walkable, grid[id].role) == false) result = false;

    return result;
}

//Determines if a Terrain Type is Walkable
function checkWalkable(pather, ter) {
    if (ter == "object") ter = ter.role;
    let result = doesInclude(pather.walkable, ter);
    return result;
}

//Adds a Walkable Terrain and Returns a Pathfinder
function addWalkable(pather, ter) {
    if (typeof ter == "number") ter = tType(ter);
    pather.walkable[pather.walkable.length] = ter;
    return pather;
}

//Removes a Walkable Terrain and Returns a Pathfinder
function removeWalkable(pather, ter) {
    if (typeof ter == "number") ter = tType(ter);
    if (pather.walkable.length <= 0) return pather;

    for (let i = 0; i < pather.walkable.length; i++) {
        if (pather.walkable[i] == ter) {
            pather.walkable = deleteElement(pather.walkable, i);
            i -= 1;
        }
    }

    return pather;
}

//Determines if an Optional Space is the Goal
function optionalPathGoal(options, goal) {
    let result = -1;
    for (let i = 0; i < options.length; i++) {
        if (options[i] == goal) result = options[i];
    }

    if (result > -1) options = [result];
    return options;
}

//Identifies Extra Walking Distance Based on Blocked Spaces
function blockSpaceDistCheck(total, a, b, r, c, as, bs) {
    let greater;
    let lesser;
    let result = total + 0;
    let gBlocks = getSpaceRoles("blocked");

    if (as[0] == bs[0]) {
        greater = a;
        lesser = b;
        if (bs[1] > as[1]) {
            greater = b;
            lesser = a;
        }
        for (let i = lesser; i < greater; i += r) {
            if (doesInclude(gBlocks, i)) result += 2;
        }
    }

    if (as[1] == bs[1]) {
        greater = a;
        lesser = b;
        if (bs[0] > as[0]) {
            greater = b;
            lesser = a;
        }
        for (let i = lesser; i < greater; i += c) {
            if (doesInclude(gBlocks, i)) result += 2;
        }
    }

    return result;
}

//Assigns a Space to be Blocked
function makePathBlock(id) {
    let iconSize = 15;
    let iconScale = 3;
    let art = blockPathImage(["none", "red", "black"], -1);
    let xy = centerGridSpace(id, iconSize * iconScale, true);
    makeAnimation(art, -1, xy[0], xy[1], context, iconSize, "block-" + id, 55);
    grid[id].role = "blocked";
}

//Adjusts the Goal for a Pather, returning the pather
function changePathGoal(pather, newGoal) {
    if (pather.goal != newGoal) {
        pather.goal = newGoal;
        pather.recent = [];
        pather.oob = [];
    }

    //Final
    return pather;
}

//Returns the Facing Direction of the Pathfinder
function patherFacing(current, goal, base) {
    //0 Down, 1 Right, 2 Up, 3 Left
    if (goal < 0 || goal > grid.length || current == goal) return base;
    //let r = sizeGrid("r");
    let c = sizeGrid("c");

    if (current % c == goal % c) {
        if (current > goal) return 1;
        return 3;
    }
    if (current > goal) return 2;
    return 0;
}

//Alters the Pathfinder's Animation
function turnPather(pather) {
    let anim = getPatherAnimation(pather);
    pather.art.art = anim;
    if (pather.dir > 0) {
        for (let i = 0; i < pather.dir; i++) {
            pather.art = rotateAnim(pather.art);
        }
    }

    return pather;
}

//Returns the Animation for the Pather Based on Walkable Terrain Types -- Modified for Seeker
function getPatherAnimation(pather) {
    let result;
    let types = patherPathingType(-1);
    let actual = checkPatherCommonType(pather);

    if (actual == types[0]) result = animationBug(patherColors(pather.walkable), -1);
    if (actual == types[1]) result = animationFish(patherColors(pather.walkable), -1);
    if (actual == types[2]) result = animationBird(patherColors(pather.walkable), -1);

    return result;
}

//Checks if a Space is Unreachable
function isUnreachable(space, pather) {
    let options = assignSpaceOption(space);
    let available = assignSpaceAvailable(options, pather);

    if (isDeadEnd(available)) return true;
    if (checkWalkable(pather, grid[space].role) == false) return true;
    return false;

}

//Adds to the Out of Bounds List
function addOutOfBounds(space, pather) {
    if (typeof space == "object") space = space.id;
    pather.oob[pather.oob.length] = space;
    //outOfBounds[outOfBounds.length] = space;
    return pather;
}

//Checks if a Space Id is Out of Bounds
function checkOutOfBounds(pather) {
    let space = pather.goal;
    let outOfBounds = pather.oob;
    if (outOfBounds.length <= 0) return false;
    if (typeof space == "object") space = space.id;
    if (doesInclude(outOfBounds, space)) return true;
    return false;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Weather Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Displays All Weather Effects
function displayAllWeather() {
    for (let i = 0; i < weather.length; i++) {
        weather[i] = displayWeather(weather[i]);
        if (weather[i].ends == true && weather[i].drops.length <= 0) {
            destroyWeather(i, false);
            i -= 1;
        }
    }
}

//Displays a Weather Effect
function displayWeather(storm) {
    let weatherZone = context;
    let dropPix = 1;

    //Draw Droplets
    for (let i = 0; i < storm.drops.length; i++) {
        storm.drops[i].y += storm.speed;
        if (storm.drops[i].y >= boardHeight) {
            storm.drops[i] = storm.drops[storm.drops.length - 1];
            storm.drops.pop();
            i -= 1;
        } else {
            let dropart = [];
            for (let i2 = 0; i2 < storm.drops[i].size; i2++) {
                dropart[i2] = [];
                for (let i3 = 0; i3 < storm.drops[i].size; i3++) {
                    dropart[i2][i3] = "none";
                    if (i3 <= storm.size[0]) dropart[i2][i3] = storm.color;
                }
            }
            let droplet = makeDrawing(dropart, true);
            drawSprite(weatherZone, droplet, storm.drops[i].x, storm.drops[i].y, dropPix);
        }
    }

    //Make Droplets
    if (globalAnimationCycle % storm.freq == 0 && storm.ends == false) {
        storm.drops = createWeatherDrops(storm.drops, storm.batch, storm.size, storm.prox);
    }

    return storm;
}

//Options for Typical Weather Types
function commonWeather(storm) {

    if (storm == "light rain" || storm == "rain") {
        createWeather(storm, boardWidth / 28, 30, boardWidth / 56, "#8080ee", 2, [1, 7], boardWidth / 14);
    }

    if (storm == "heavy rain") {
        createWeather(storm, boardWidth / 7, 5, boardWidth / 14, "#5050aa", 3, [1, 5], boardWidth / 7);
    }

    if (storm == "light snow" || storm == "snow") {
        createWeather(storm, boardWidth / 28, 30, boardWidth / 56, "#cceeff", 1, [1, 2], boardWidth / 14);
    }

    if (storm == "heavy snow") {
        createWeather(storm, boardWidth / 7, 10, boardWidth / 14, "#cceeff", 1, [1, 2], boardWidth / 5);
    }
}

//Creates a Weather Effect
function createWeather(name, start, freq, batch, color, speed, size, prox) {
    let drops = [];
    drops = createWeatherDrops(drops, start, size, prox);
    let storm = { "id": name, "start": start, "freq": freq, "batch": batch, "color": color, "speed": speed, "size": size, "drops": drops, "prox": prox, "ends": false };

    //Final
    weather[weather.length] = storm;
}

//Creates Opening Weather Drops
function createWeatherDrops(drops, num, size, prox) {
    if (typeof size == "number") size = [size, size];
    let y = 0;
    let spacing = 0;
    for (let i = 0; i < num; i++) {
        let scale = rng(size[0], size[1]);
        spacing += rng(size[1], boardWidth - prox);
        if (spacing >= boardWidth - size[1]) {
            spacing -= boardWidth;
            y += size[1];
        }
        drops[drops.length] = { "x": spacing, "y": y, "size": scale };
    }

    return drops;
}

//Destroys a Weather Effect
function destroyWeather(storm, isGradual) {
    if (typeof storm == "number") {
        if (isGradual) {
            weather[storm].ends = true;
        } else {
            weather[storm] = weather[weather.length - 1];
            weather.pop();
        }
    } else if (typeof storm == "string") {
        for (let i = 0; i < weather.length; i++) {
            if (weather[i].id == storm) {
                if (isGradual) {
                    weather[i].ends = true;
                } else {
                    weather[i] = weather[weather.length - 1];
                    weather.pop();
                    i -= 1;
                }
            }
        }
    }
}

//Returns if a Specific Weather Type Exists -- Added for Seeker
function checkWeather(type, ignoreEnds) {
    if (weather.length <= 0) return result;

    for (let i = 0; i < weather.length; i++) {
        if (weather[i].id == type) {
            if (ignoreEnds) {
                if (weather[i].ends == false) return true;
            } else {
                return true;
            }
        }
    }

    return false;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Animation Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Draws an Image on a Canvas Using Color Blocks
function drawSprite(region, draws, artX, artY, localPixes) {
    if (localPixes == false) localPixes = pixes;
    let width = draws.width;
    let height = draws.height;
    let art = draws.art;

    for (let i = 0; i < height; i++) {
        for (let i2 = 0; i2 < width; i2++) {
            let i3 = (i2 * width) + i;
            if (art[i3] != 0 && art[i3] != "none") {
                region.fillStyle = art[i3];
                let x = artX + (i * localPixes);
                let y = artY + (i2 * localPixes);
                region.fillRect(x, y, localPixes, localPixes);
            }
        }
    }
}

//Returns an Ojbect to be Drawn
function makeDrawing(drawn, equalized) {
    let result = { "art": false, "width": drawn[0].length, "height": drawn.length, "original": drawn };
    result.art = drawnArray(drawn, result.width, result.height);
    if (equalized) result = equalizeDrawing(result, "none");
    return result;
}

//Returns an Animated Series of Objects
function makeAnimation(drawings, looping, x, y, region, localPixes, id, frequency) {
    let result = {
        "art": drawings, "cycles": drawings.length, "looping": looping, "x": x, "y": y, "region": region, "localPixes": localPixes, "id": id, "frequency": frequency,
        "current": -1, "special": "none"
    };
    addAnimation(result);
    return result;
}

//Draws an Animation
function drawAnimation(animation) {
    if (globalAnimationCycle % animation.frequency == 0) animation.current += 1;
    if (animation.current <= -1) animation.current = 0;

    if (animation.looping > 0 || animation.looping == -1) {
        if (animation.current >= animation.cycles) {
            if (animation.looping != -1) animation.looping -= 1;
            animation.current -= animation.cycles;
        }

        if (animation.looping != 0) {
            drawSprite(animation.region, animation.art[animation.current], animation.x, animation.y, animation.localPixes);
        }
    }
}

//Returns an Array Converting an Image from Drawn Spots
function drawnArray(drawn, width, height) {
    let result = [];
    for (let i = 0; i < height; i++) {
        for (let i2 = 0; i2 < width; i2++) {
            result[drawSpot(i, i2, height)] = drawn[i][i2];
        }
    }
    return result;
}

//Returns Index # for a Drawning Location
function drawSpot(x, y, height) {
    return (x * height) + y;
}

//Returns if a Row or Column is Blank in a Drawing
function checkBlank(id, drawn, isRow) {
    let art = drawn.original;
    let result = true;
    let checks = art.length;
    if (isRow) {
        checks = art[id].length;
    }

    for (let i = 0; i < checks; i++) {
        let checked = art[i][id];
        if (isRow) checked = art[id][i];
        if (checked != "none") result = false;
    }

    return result;
}

//Returns if an Element is Already Moving
function checkMover(elem) {
    let result = false;

    for (let i = 0; i < moverList.length; i++) {
        if (moverList[i].elem.id == elem) {
            result = true;
        }
    }

    return result;
}

//Makes an Element Mobile
function makeMover(elem, frames, distX, distY, frequency, alt) {
    let mx = distX / frames;
    let my = distY / frames;
    let result = { "elem": elem, "frames": frames, "distX": mx, "distY": my, "frequency": frequency, "alt": alt, "current": 0 };
    addMover(result);
    return result;
}

//Moves a Mobile Element -- Edited for Animations
function moveMover(moved) {
    if (globalAnimationCycle % moved.frequency == 0 && moved.current < moved.frames) {
        let mover = moved.elem;
        let propX = cssAbb("marl");
        let propY = cssAbb("mart");
        if (moved.alt == true) {
            propX = cssAbb("l");
            propY = cssAbb("t");
        }
        let newX = propMin(mover.style[propX]) + moved.distX;
        let newY = propMin(mover.style[propY]) + moved.distY;
        newX += addPX(newX, propX);
        newY += addPX(newY, propY);
        newX = newX.replace(";", "");
        newY = newY.replace(";", "");

        moved.current += 1;
        if (moved.current <= -1) moved.current = 0;
        styleWin(mover, newX, propX);
        styleWin(mover, newY, propY);

        //Moves Titles for Windows with Them
        let moveLog = checkWinLog(mover.id, false);
        if (moveLog != false) {
            if (moveLog.title != false) {
                let moveTitle = document.getElementById(moveLog.title);
                propX = cssAbb("marl");
                propY = cssAbb("mart");
                if (moved.alt == true) {
                    propX = cssAbb("l");
                    propY = cssAbb("t");
                }
                newX = propMin(moveTitle.style[propX]) + moved.distX;
                newY = propMin(moveTitle.style[propY]) + moved.distY;
                newX += addPX(newX, propX);
                newY += addPX(newY, propY);
                newX = newX.replace(";", "");
                newY = newY.replace(";", "");
                styleWin(moveTitle, newX, propX);
                styleWin(moveTitle, newY, propY);
            }
        }
    }
}

//Returns an Altered Sprite Based on Input
function alterArt(drawn, type, full) {
    let template = drawn.original;
    let height = drawn.height;
    let width = drawn.width;
    let scope = template.length - 1;
    let result = [];
    let w = width - 1;
    let h = height - 1;

    for (let i = 0; i < height; i++) {
        result[i] = [];
        for (let i2 = 0; i2 < width; i2++) {
            let x = i;
            let y = i2;

            if (type == "rotate") {
                x = scope - i2;
                y = i;
            } else if (type == "flip") {
                let base = (i + 1) * w;
                let counter = (i * w) + i2;

                y = base - counter;
                x = i;
            }
            
            result[i][i2] = template[x][y];
        }
    }

    if (full) {
        result = makeDrawing(result, true);
    }

    return result;
}

//Returns Sprite Art Rotated by 90 Degrees
function rotateArt(drawn) {
    return alterArt(drawn, "rotate", true);
}

//Returns Sprite Art Flipped Across Y-Axis
function flipArt(drawn) {
    return alterArt(drawn, "flip", true);
}

//Returns an Art Sprite with Additional Columns and Rows Mirrored Across the X-Axis or Y-Axis
function mirrorArt(drawn, useX) {
    let template = drawn.original;
    let height = drawn.height;
    let width = drawn.width;
    let result = [];
    let w = width - 1;
    let h = height - 1;

    if (useX) {
        for (let i = 0; i < height; i++) {
            result[i] = [];
            let scope = template[i].length - 1;
            for (let i2 = 0; i2 < width; i2++) {
                result[i][i2] = template[i][i2];
            }
            for (let i2 = 0; i2 < width; i2++) {
                let bonus = width + i2;
                if (template.length % 2 != 0 && i2 != (parseInt(template.length / 2) + (template.length % 2))) {
                } else {
                    result[i][bonus] = template[i][scope - i2];
                }
            }
        }
        let totalParts = result[0].length;
        let addedParts = totalParts - width;
        for (let i = 0; i < addedParts; i++) {
            let truePart = height + i;
            result[truePart] = [];
            for (let i2 = 0; i2 < totalParts; i2++) {
                result[truePart][i2] = "none";
            }
        }
    } else {
        for (let i = 0; i < (height * 2); i++) {
            result[i] = [];
        }
        for (let i2 = 0; i2 < width; i2++) {
            for (let i = 0; i < height; i++) {
                result[i][i2] = template[i][i2];
            }
            for (let i = 0; i < height; i++) {
                let scope = template[i].length - 1;
                let bonus = height + i;
                if (template[0].length % 2 != 0 && i2 != (parseInt(template[0].length / 2) + (template[0].length % 2))) {
                } else {
                    result[bonus][i2] = template[scope - i][i2];
                }
            }
        }
        let totalParts = result.length;
        let addedParts = totalParts - width;
        for (let i2 = 0; i2 < addedParts; i2++) {
            let truePart = width + i2;
            for (let i = 0; i < totalParts; i++) {
                result[i][truePart] = "none";
            }
        }
    }

    result = makeDrawing(result, true);

    return result;
}

//Returns Animation Drawing Array Rotated by 90 Degrees
function rotateAnim(drawn) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = rotateArt(drawn.art[i]);
    }
    return drawn;
}

//Returns Animation Drawing Array Flipped Across Y-Axis
function flipAnim(drawn) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = flipArt(drawn.art[i]);
    }
    return drawn;
}

//Returns Animation Drawing Array Rotated Mirrored Across the X-Axis or Y-Axis
function mirrorAnim(drawn, useX) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = mirrorArt(drawn.art[i], useX);
    }
    return drawn;
}

//Adds an Animated Area to the Global List of Cleared Contexts
function addAnimationZone(region) {
    animatedZones[animatedZones.length] = region;
}

//Adds an Animation to the Global List
function addAnimation(animation) {
    animationsList[animationsList.length] = animation;
}

//Adds a Moved Element to the Global List
function addMover(mover) {
    moverList[moverList.length] = mover;
}

//Removes a Moved Element from the Global List
function removeMover(mover) {
    let id = "none";
    for (let i = 0; i < moverList.length; i++) {
        if (moverList[i] == mover) id = i;
    }

    if (id != "none") {
        if (id != moverList.length - 1) {
            moverList[id] = moverList[moverList.length - 1];
        }
        moverList.pop();
    }
}

//Removes an Animation from the Global List -- Modified for WHQ
function removeAnimation(animation) {
    let id = "none";
    for (let i = 0; i < animationsList.length; i++) {
        if (typeof animation == "string") {
            if (animationsList[i].id == animation) id = i;
        } else {
            if (animationsList[i] == animation) id = i;
        }
    }

    if (id != "none") {
        if (id != animationsList.length - 1) {
            animationsList[id] = animationsList[animationsList.length - 1];
        }
        animationsList.pop();
    }
}

//Returns a Drawing with Equal Width and Height -- Updated for WHQ
function equalizeDrawing(drawn, value) {
    let result = drawn;
    let template = result.original;

    if (drawn.width != drawn.height) {
        let diff = Math.abs(drawn.width - drawn.height);
        if (drawn.width > drawn.height) {
            for (let i = 0; i < diff; i++) {
                template[template.length] = [];
                for (let i2 = 0; i2 < template[i].length; i2++) {
                    template[template.length - 1][i2] = value;
                }
            }
        } else {
            for (let i = 0; i < template.length; i++) {
                for (let i2 = 0; i2 < diff; i2++) {
                    template[i][template[i].length] = value;
                }
            }
        }
    }
    result.art = drawnArray(template, template[0].length, template.length);
    result.width = template[0].length;
    result.height = template.length;
    result.original = template;

    return result;
}

//Returns the True Width and Height Recognizing Blank Space for a Drawing
function trueDrawDimensions(drawn) {
    let checklist = drawn.original;
    let trueWidth = drawn.width;
    let trueHeight = drawn.height;
    let h = drawn.height - 1;
    let w = drawn.width - 1;

    let checking = true;
    //Height Test
    for (let i = 0; i < drawn.height; i++) {
        let checked = h - i;
        let valid = true;
        for (let i2 = 0; i2 < drawn.width; i2++) {
            if (checking) {
                if (checklist[checked][i2] != "none") {
                    valid = false;
                    checking = false;
                }
            }
        }
        if (valid && checking) trueHeight -= 1;
    }

    //Width Test
    checking = true;
    for (let i2 = 0; i2 < drawn.width; i2++) {
        let checked = w - i2;
        let valid = true;
        for (let i = 0; i < trueHeight; i++) {
            if (checking) {
                if (checklist[i][checked] != "none") {
                    valid = false;
                    checking = false;
                }
            }
        }
        if (valid && checking) trueWidth -= 1;
    }

    //Final
    return [trueWidth, trueHeight];
}

//Returns the True Width and Height Recognizing Blank Space for an Animation
function trueAnimDimensions(drawn) {
    let trueWidth = trueDrawDimensions(drawn.art[0])[0];
    let trueHeight = trueDrawDimensions(drawn.art[0])[1];

    if (drawn.art.length > 1) {
        for (let i = 1; i < drawn.art.length; i++) {
            let sizes = trueDrawDimensions(drawn.art[i]);

            if (sizes[0] > trueWidth) {
                trueWidth = sizes[0];
            }

            if (sizes[1] > trueHeight) {
                trueHeight = sizes[1];
            }
        }
    }

    return [trueWidth, trueHeight];
}

//Adds Rows or Columns to an Array of Arrays (ex. "Original" of a Drawing)
function addRowColumn(type, num, list, value, equalized) {
    let rem = num;
    while (rem > 0) {
        let temp = [];
        let leng = 0;
        if (type == "row") {
            leng = list[0].length;
            for (let i = 0; i < leng; i++) {
                temp[i] = value;
            }
            list.unshift(temp);
            rem -= 1;

            if (equalized && rem > 0) {
                temp = [];
                leng = list[0].length;
                for (let i = 0; i < leng; i++) {
                    temp[i] = value;
                }
                list.push(temp);
                rem -= 1;
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                list[i].unshift(value);
            }
            rem -= 1;
            if (equalized && rem > 0) {
                for (let i = 0; i < list.length; i++) {
                    list[i].push(value);
                }
            }
            rem -= 1;
        }
    }

    return list;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Queued Event Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Applies Global Events
function makeEvents() {
    if (eventQueue.length > 0) {
        for (let i = 0; i < eventQueue.length; i++) {
            if (eventQueue[i].when == globalAnimationCycle) {
                eventQueue[i].action.apply(this, eventQueue[i].params);
                eventQueue[i] = eventQueue[eventQueue.length - 1];
                eventQueue.pop();
                i -= 1;
            }
        }
    }
}

//Queues an Event for a Future Frame
function queueEvent(delay, action, params) {
    let when = globalAnimationCycle + delay;
    let result = { "when": when, "action": action, "params": params };
    addEventQueue(result);
}

//Adds an Event to the Global Queue
function addEventQueue(event) {
    eventQueue[eventQueue.length] = event;
}

//Applies Global Repeats
function makeRepeats() {
    if (repeatQueue.length > 0) {
        for (let i = 0; i < repeatQueue.length; i++) {
            if (globalAnimationCycle % repeatQueue[i].when == 0) {
                repeatQueue[i].action.apply(this, repeatQueue[i].params);
            }
        }
    }
}

//Queues a Repeat for a Future Frame
function queueRepeat(id, when, action, params) {
    //let result = { "when": when, "action": action, "params": params };
    let result = { "id": id, "when": when, "action": action, "params": params };
    addRepeatQueue(result);
}

//Adds a Repeat to the Global Queue
function addRepeatQueue(repeat) {
    repeatQueue[repeatQueue.length] = repeat;
}

//Removes a Repeat from the Global Queue
function removeRepeatQueue(repeat) {
    let id = "ignore";
    for (let i = 0; i < repeatQueue.length; i++) {
        if (repeatQueue[i].id == repeat) {
            id = i;
        }
    }

    if (id != "ignore") {
        if (id != repeatQueue.length - 1) {
            repeatQueue[id] = repeatQueue[repeatQueue.length - 1];
        }
        repeatQueue.pop();
        //if (repeatQueue.length < 1) repeatQueue = [];
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Blocked Area Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Makes a Blocked Area
function makeBlockedArea(id, x, y, w, h) {
    return { "id": id, "x": x, "y": y, "w": w, "h": h };
}

//Adds a Blocked Area to the List
function addBlockedArea(newBlock) {
    blockedAreas[blockedAreas.length] = newBlock;
}

//Removes a Blocked Area from the List
function removeBlockedArea(id) {
    let result = "none";
    for (let i = 0; i < blockedAreas.length; i++) {
        if (typeof id == "string") {
            if (blockedAreas[i].id == id) result = i;
        } else {
            if (id == blockedAreas[i]) result = i;
        }
    }

    if (result != "none") {
        blockedAreas[result] = blockedAreas[blockedAreas.length - 1];
        blockedAreas.pop();
    }
}

//Checks if a Point is Within Blocked Area
function checkAllBlocks(x, y, w, h, seeWindows) {
    let result = false;

    if (blockedAreas.length > 0) {
        for (let i = 0; i < blockedAreas.length; i++) {
            if (checkBlock(x, y, w, h, blockedAreas[i])) {
                result = true;
            }
        }
    }

    if (seeWindows && winds.length > 0) {
        for (let i = 0; i < winds.length; i++) {
            let tempBlock = windowToBlock(winds[i], false);
            if (checkBlock(x, y, w, h, tempBlock)) {
                result = true;
            }
        }
    }

    return result;
}

//Checks if a Point is Within a Specific Blocked Areas
function checkBlock(x, y, w, h, block) {
    let result = checkCollision(x, y, w, h, block.x, block.y, block.w, block.h);
    return result;
}

//Converts a Window into a Blocked Area
function windowToBlock(log, useAlt) {
    let win = log.win;
    let id = win.id;
    let x = propMin(win.style[cssAbb("marl")]);
    let y = propMin(win.style[cssAbb("mart")]);
    let w = propMin(win.style[cssAbb("w")]);
    let h = propMin(win.style[cssAbb("h")]);

    if (log.title != false) {
        h += propMin(document.getElementById(log.title).style[cssAbb("h")]);
    }

    if (x == undefined || y == undefined) {
        useAlt = true;
    }

    if (useAlt) {
        x = propMin(win.style[cssAbb("l")]);
        y = propMin(win.style[cssAbb("t")]);
    }

    return makeBlockedArea(id, x, y, w, h);
}

//Converts an Animation to a Blocked Area
function animToBlock(drawn) {
    let dimensions = trueAnimDimensions(drawn);
    let w = dimensions[0] * drawn.localPixes;
    let h = dimensions[1] * drawn.localPixes;
    let id = drawn.id;
    return makeBlockedArea(id, drawn.x, drawn.y, w, h);
}

//Checks if a Drawing is Blocked
function checkDrawBlock(drawn, x, y, localPixes, seeWindows) {
    let dimensions = trueDrawDimensions(drawn);
    let w = dimensions[0] * localPixes;
    let h = dimensions[1] * localPixes;
    return checkAllBlocks(x, y, w, h, seeWindows);
}

//Checks if an Animation is Blocked
function checkAnimationBlock(drawn, seeWindows) {
    let result = false;
    for (let i = 0; i < drawn.art.length; i++) {
        if (checkDrawBlock(drawn.art[i], drawn.x, drawn.y, drawn.localPixes, seeWindows)) {
            result = true;
        }
    }
    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Unique Art Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns Value Based on Variable Input Art
function retrieveArt(style, colors, frame, options, searches) {
    for (let i = 0; i < options.length; i++) {
        if (style == options[i]) {
            return searches[i].apply(this, [colors, frame]);
        }
    }

}

//Compiles the Normal Animation for an Image's Style -- Fixed for WHQ
function compileArtStyle(images, colors, frame) {
    let results = [];

    for (let i = 0; i < images.length; i++) {
        for (let i2 = 0; i2 < images[i].length; i2++) {
            for (let i3 = 0; i3 < images[i][i2].length; i3++) {
                if (typeof images[i][i2][i3] == "number") images[i][i2][i3] = colors[images[i][i2][i3]];
                //if (typeof images[i][i2][i3] == "string") images[i][i2][i3] = colors[images[i][i2][i3]];
            }
        }
        results[i] = makeDrawing(images[i], true);
    }

    if (frame < 0) {
        return results;
    } else {
        return results[frame];
    }
}

//WHQ Results
function quizAstartes(colors, frame, style) {
    if (style == "stand") return quizAstartesStand(colors, frame);
    if (style == "point") return quizAstartesBolter(colors, frame);
    if (style == "bolter") return quizAstartesBolter(colors, frame);
    if (style == "sword") return quizAstartesSword(colors, frame);
    if (style == "berserk") return quizAstartesBerserk(colors, frame);
    if (style == "walk") return quizAstartesWalk(colors, frame);

    //Failsafe
    return quizAstartesStand(colors, frame);
}

function quizAstartesStand(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    //images[shows] = rotateArt(rotateArt(makeDrawing(images[shows - 1], false))).original;
    images[shows] = flipArt(makeDrawing(images[shows - 1], false)).original;

    return compileArtStyle(images, colors, frame);
}

function quizAstartesPoint(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 3, 1, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 3, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [1, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [1, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 1, 0, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 3, 1, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 0, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 0, images[shows], 0, true);
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 1, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 0, 0, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[4], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[4], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[3], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[2], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[1], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[0], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[0], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[0], false))).original;

    let revPoint = shows + 1;
    for (let i = 0; i < revPoint; i++) {
        shows += 1;
        images[shows] = flipArt(makeDrawing(images[i], true)).original;
    }

    return compileArtStyle(images, colors, frame);
}

function quizAstartesBolter(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 6, 6, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 6, 6, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 6, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 1, images[shows], 0, false);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 6, 1, 3, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 6, 6, 1, 6, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 6, 6, 6, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 6, 6, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 6, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = addRowColumn("col", 1, images[shows], 0, false);

    /*shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 6, 6, 6, 1, 1, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [6, 6, 6, 1, 3, 3, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 6, 6, 1, 1, 1, 1, 0, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];*/

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [6, 6, 6, 6, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 6, 1, 3, 3, 1, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];

    for (let i = 0; i < shows + 1; i++) {
        images[i] = makeDrawing(images[i], true).original;
    }

    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[2], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[1], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[0], false))).original;
    shows += 1;
    images[shows] = flipArt(flipArt(makeDrawing(images[0], false))).original;

    return compileArtStyle(images, colors, frame);
}

function quizAstartesSword(colors, frame) {
    let shows = -1;
    let images = [];
    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];

    for (let i = 0; i < shows + 1; i++) {
        images[i] = makeDrawing(images[i], true).original;
    }

    return compileArtStyle(images, colors, frame);
}

function quizAstartesBerserk(colors, frame) {
    let shows = -1;
    let images = [];
    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < shows + 1; i++) {
        images[i] = makeDrawing(images[i], true).original;
    }

    return compileArtStyle(images, colors, frame);
}


function quizAstartesWalk(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows] = makeDrawing(images[shows], true).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 1, 4, 1, 4, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 5, 5, 4, 3, 4, 5, 5, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 4, 1, 1, 1, 4, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 3, 4, 1, 3, 3, 3, 1, 4, 4, 3, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 3, 4, 1, 3, 4, 3, 1, 4, 4, 3, 4, 1, 1, 0];
    images[shows][images[shows].length] = [1, 3, 3, 1, 1, 3, 1, 3, 4, 3, 1, 4, 1, 1, 1, 3, 3, 1];
    images[shows][images[shows].length] = [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 3, 1, 7, 7, 7, 3, 7, 7, 7, 4, 1, 4, 2, 1, 0];
    images[shows][images[shows].length] = [0, 1, 1, 1, 1, 3, 4, 7, 8, 7, 4, 4, 4, 1, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 3, 3, 3, 4, 4, 4, 4, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 3, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 4, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 1, 1, 3, 4, 4, 1, 1, 1, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 4, 6, 3, 6, 3, 4, 4, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows] = makeDrawing(images[shows], true).original;

    return compileArtStyle(images, colors, frame);
}

//Miscellaneous and Unused
function crystalArt(style, colors, frame) {
    let options = ["stand", "attack"];
    let searches = [crystalStand, crystalStand];

    return retrieveArt(style, colors, frame, options, searches);
}

function crystalStand(colors, frame) {
    let shows = -1;
    let images = [];
    //none, darkred, red, indianred, #400000
    //blank, edge, primary, secondary, tertiary

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 2, 3, 3, 3, 4, 4, 2, 2, 2, 2, 1, 0];
    images[shows][images[shows].length] = [1, 2, 3, 3, 3, 4, 2, 3, 4, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 4, 3, 2, 4, 3, 3, 3, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    //images[shows][images[shows].length] = [];

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    return compileArtStyle(images, colors, frame);
}

function blockPathImage(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [1, 0, 1];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [1, 0, 1];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [2, 0, 2];
    images[shows][images[shows].length] = [0, 2, 0];
    images[shows][images[shows].length] = [2, 0, 2];

    return compileArtStyle(images, colors, frame);
}

function testAnimation(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 1];
    images[shows][images[shows].length] = [1, 2, 1];
    images[shows][images[shows].length] = [1, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [1, 0, 0];
    images[shows][images[shows].length] = [1, 1, 2];
    images[shows][images[shows].length] = [0, 1, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1];

    return compileArtStyle(images, colors, frame);
}

function testAnimation2(colors, frame) {
    let shows = -1;
    let images = [];
    //none, darkred, red, indianred, #400000
    //blank, edge, primary, secondary, tertiary

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 2, 3, 3, 3, 4, 4, 2, 2, 2, 2, 1, 0];
    images[shows][images[shows].length] = [1, 2, 3, 3, 3, 4, 2, 3, 4, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 4, 3, 2, 4, 3, 3, 3, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    //images[shows][images[shows].length] = [];

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    return compileArtStyle(images, colors, frame);
}

function testAnimation3(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0];

    return compileArtStyle(images, colors, frame);
}

//Pathers
function animationBird(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return compileArtStyle(images, colors, frame);
}

function animationFish(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [2, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [2, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);


    return compileArtStyle(images, colors, frame);
}

function animationBug(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 1, 3, 3, 3, 3, 1, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 1, 3, 3, 3, 3, 1, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = alterArt(makeDrawing(images[shows], false), "flip", false);

    //images[shows] = flipArt(images[shows]).original;

    return compileArtStyle(images, colors, frame);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Miscellaneous Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------





