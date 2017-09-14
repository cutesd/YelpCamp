var mongoose = require('mongoose'),
    Camp = require('./models/camp'),
    Comment = require('./models/comment');

var data = [{
        name: "Cloud City",
        image: "https://images.unsplash.com/photo-1460899162311-d63278c9cf9d?dpr=1&auto=compress,format&fit=crop&w=767&h=511&q=80&cs=tinysrgb&crop=",
        desc: "Cosmos rich in heavy atoms astonishment, how far away, shores of the cosmic ocean hydrogen atoms lorem ipsum dolor sit amet courage of our questions rogue something incredible is waiting to be known. A very small stage in a vast cosmic arena a billion trillion shores of the cosmic ocean! A mote of dust suspended in a sunbeam permanence of the stars muse about explorations bits of moving fluff! Emerged into consciousness something incredible is waiting to be known the ash of stellar alchemy. Cosmic fugue worldlets Cambrian explosion Drake Equation gathered by gravity stirred by starlight lorem ipsum dolor sit amet and billions upon billions upon billions upon billions upon billions upon billions upon billions!"

    },
    {
        name: "Green Park Meadow",
        image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?dpr=1&auto=compress,format&fit=crop&w=767&h=511&q=80&cs=tinysrgb&crop=",
        desc: "Sustainable disrupt green space collective impact empower communities uplift empathetic empower initiative triple bottom line revolutionary co-creation justice change-makers. Contextualize co-creation, empower communities impact shine overcome injustice compassion deep dive we must stand up dynamic. Innovate accessibility inspiring dynamic; granular, outcomes and. Because communities collaborative consumption global, because dynamic, theory of change our work families. Social capital citizen-centered relief white paper, innovation resilient emerging. Thought leader compelling, global engaging policymaker revolutionary change-makers framework capacity building triple bottom line thought provoking move the needle. Revolutionary, challenges and opportunities, collaborate relief greenwashing, collective impact, innovation circular invest to."

    },
    {
        name: "Tiny Rock",
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?dpr=1&auto=compress,format&fit=crop&w=767&h=510&q=80&cs=tinysrgb&crop=",
        desc: "Hulk wherry spirits fluke mizzenmast cutlass pink parley dance the hempen jig square-rigged. Aft Jack Tar hail-shot hulk flogging scallywag swab landlubber or just lubber weigh anchor fore. Boatswain rutters grapple lee hardtack coffer landlubber or just lubber scuppers plunder Jolly Roger."
    },
    {
        name: "Smokey Pigeon Ridge",
        image: "https://images.unsplash.com/photo-1496425745709-5f9297566b46?dpr=1&auto=compress,format&fit=crop&w=767&h=511&q=80&cs=tinysrgb&crop=",
        desc: "Rugged alpha trion brigadier, man of the year 1986 chevron knavish rogue brigadier rugged alpha trion mark lawrenson, charlie chaplin mark lawrenson rugged brigadier man of the year 1986 saddam hussein alpha trion chevron knavish rogue erudite headmaster charming villain.  Zap rowsdower old man in pub ian rush."

    }
];
var obj = { func: null, trace: "" };
//
function seedDB() {
    //
    obj.func = createCamps;
    obj.trace = "camps removed";
    Camp.remove({}, DBcallBack);

}

//add a few campgrounds
function createCamps(db) {
    data.forEach(function(db) {
        Camp.create(db, function(err, camp) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("added a camp");
                Comment.create({
                    text: "This place is great, but I wish there was internet",
                    author: "Homer"
                }, function(err, comment) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        camp.comments.push(comment);
                        camp.save();
                        console.log("created new comment");
                    }
                });
            }
        });
    });
}


//
function DBcallBack(err, db) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(obj.trace);
        if (obj.func) {
            obj.func();
            obj.func = null;
        }
    }
}

module.exports = seedDB;
