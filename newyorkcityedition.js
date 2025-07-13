function Square(name, pricetext, color, price, groupNumber, baserent, rent1, rent2, rent3, rent4, rent5) {
	this.name = name;
	this.pricetext = pricetext;
	this.color = color;
	this.owner = 0;
	this.mortgage = false;
	this.house = 0;
	this.hotel = 0;
	this.groupNumber = groupNumber || 0;
	this.price = (price || 0);
	this.baserent = (baserent || 0);
	this.rent1 = (rent1 || 0);
	this.rent2 = (rent2 || 0);
	this.rent3 = (rent3 || 0);
	this.rent4 = (rent4 || 0);
	this.rent5 = (rent5 || 0);
	this.landcount = 0;

	if (groupNumber === 3 || groupNumber === 4) {
		this.houseprice = 50;
	} else if (groupNumber === 5 || groupNumber === 6) {
		this.houseprice = 100;
	} else if (groupNumber === 7 || groupNumber === 8) {
		this.houseprice = 150;
	} else if (groupNumber === 9 || groupNumber === 10) {
		this.houseprice = 200;
	} else {
		this.houseprice = 0;
	}
}

function Card(text, action) {
	this.text = text;
	this.action = action;
}

function corrections() {
	document.getElementById("cell24name").textContent = "blooming...";
}

function utiltext() {
	return '&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.';
}

function transtext() {
	return '<div style="font-size: 14px; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Transportations are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>';
}

function citytax() {
	var p = player[turn];

	if (p.human) {

		buttonAonclick = 'hide("popupbackground"); hide("popupwrap"); var p=player[turn]; addalert(p.name+" paid $200 for landing on City Tax."); p.pay(200, 0);';
		buttonBonclick = ' hide("popupbackground"); hide("popupwrap"); var p=player[turn]; var cost=p.money; for(var i=0; i<40; i++){sq=square[i]; if(sq.owner==turn) { if(sq.mortgage) { cost+=sq.price*0.5; } else { cost+=sq.price; } cost+=(sq.house*sq.houseprice); } } cost*=0.1; cost=Math.round(cost); addalert(p.name+" paid $"+cost+" for landing on City Tax."); p.pay(cost,0);';

		popup("You landed on City Tax. You must pay $200 or ten percent of your total worth.<div><input type='button' value='Pay $200' onclick='" + buttonAonclick + "' /><input type='button' value='Pay 10%' onclick='" + buttonBonclick + "' /></div>", false);
	} else {
		addalert(p.name + " paid $200 for landing on City Tax.");
		p.pay(200, 0);
	}
}

function luxurytax() {
	addalert(player[turn].name + " paid $75 for landing on Luxury Tax.");
	player[turn].pay(75, 0);

	$("landed").show().text("You landed on Luxury Tax. Pay $75.");
}

function loadPropertiesSync() {
    const request = new XMLHttpRequest();
    request.open('GET', 'data/properties.json', false); // false makes the request synchronous
    request.send(null);
    
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error('Failed to load properties.json');
    }
}

// Usage:
var square = [];
try {
    const properties = loadPropertiesSync();
    properties.forEach(prop => {
        square.push(new Square(
            prop.name,
            prop.pricetext,
            prop.color,
            prop.price,
            prop.groupNumber,
            prop.baserent,
            prop.rent1,
            prop.rent2,
            prop.rent3,
            prop.rent4,
            prop.rent5
        ));
    });
} catch (e) {
    console.error('Error loading properties:', e);
}

var communityChestCards = [];

const communityChestCardDefinitions = [
  {
    text: "Get out of Jail, Free. This card may be kept until needed or sold.",
    action: (p) => { p.communityChestJailCard = true; updateOwned(); }
  },
  {
    text: "You have won lifetime home delivery of the New York Times. Collect $10",
    action: () => { addamount(10, 'Community Chest'); }
  },
  {
    text: "From sale of Macy's stock, you get $45",
    action: () => { addamount(45, 'Community Chest'); }
  },
  {
    text: "Life insurance matures. Collect $100",
    action: () => { addamount(100, 'Community Chest'); }
  },
  {
    text: "Deloitte & Touche LLP tax return Collect $20",
    action: () => { addamount(20, 'Community Chest'); }
  },
  {
    text: "FAO Schwarz Xmas fund matures. Collect $100",
    action: () => { addamount(100, 'Community Chest'); }
  },
  {
    text: "You have won a United Airlines trip around the world! Collect $100",
    action: () => { addamount(100, 'Community Chest'); }
  },
  {
    text: "Performed a wedding at the Plaza Hotel. Receive $25",
    action: () => { addamount(25, 'Community Chest'); }
  },
  {
    text: "Pay hospital $100",
    action: () => { subtractamount(100, 'Community Chest'); }
  },
  {
    text: "You won the Lottery! Collect $200",
    action: () => { addamount(200, 'Community Chest'); }
  },
  {
    text: "Pay school tax of $150",
    action: () => { subtractamount(150, 'Community Chest'); }
  },
  {
    text: "Doctor's fee. Pay $50",
    action: () => { subtractamount(50, 'Community Chest'); }
  },
  {
    text: "Madison Square Garden opening tonight. Collect $50 from every player for opening night seats.",
    action: () => { collectfromeachplayer(50, 'Community Chest'); }
  },
  {
    text: "You have won kiss cash! Advance to GO (Collect $200)",
    action: () => { advance(0); }
  },
  {
    text: "You are assessed for street repairs. $40 per house. $115 per hotel.",
    action: () => { streetrepairs(40, 115); }
  },
  {
    text: "Go to Jail. Go directly to Jail. Do not pass GO. Do not collect $200.",
    action: () => { gotojail(); }
  }
];

communityChestCardDefinitions.forEach((def) => {
  communityChestCards.push(new Card(def.text, def.action));
});


var chanceCards = [];

const chanceCardDefinitions = [
  {
    text: "Get out of Jail free. This card may be kept until needed or sold.",
    action: (p) => { p.chanceJailCard = true; updateOwned(); }
  },
  {
    text: "Make general repairs on all your property. For each house pay $25. For each hotel $100.",
    action: () => { streetrepairs(25, 100); }
  },
  {
    text: "Pay poor tax of $15.",
    action: () => { subtractamount(15, 'Chance'); }
  },
  {
    text: "You have been elected chairman of Con Edison. Pay each player $50.",
    action: () => { payeachplayer(50, 'Chance'); }
  },
  {
    text: "Go back 3 spaces.",
    action: () => { gobackthreespaces(); }
  },
  {
    text: "Advance token to the nearest Con Edison utility. If UNOWNED you may buy it from the bank. If OWNED, throw dice and pay owner a total of ten times the amount thrown.",
    action: () => { advanceToNearestUtility(); }
  },
  {
    text: "Citibank pays you interest of $50.",
    action: () => { addamount(50, 'Chance'); }
  },
  {
    text: "Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled. If Transportation is unowned, you may buy it from the Bank.",
    action: () => { advanceToNearestRailroad(); }
  },
  {
    text: "Take a walk past The Essex House. Advance to GO. Collect $200.",
    action: () => { advance(0, 32); }
  },
  {
    text: "Take a ride to the Regency Hotel! If you pass GO collect $200.",
    action: () => { advance(31); }
  },
  {
    text: "Take a walk on fifth avenue. Advance token to Trump Tower.",
    action: () => { advance(39); }
  },
  {
    text: "Advance to thirteen.",
    action: () => { advance(13); }
  },
  {
    text: "Your Smith Barney mutual fund pays dividend. Collect $150.",
    action: () => { addamount(150, 'Chance'); }
  },
  {
    text: "Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled.\n\nIf Transportation is unowned, you may buy it from the Bank.",
    action: () => { advanceToNearestRailroad(); }
  },
  {
    text: "Catch a bus to Central Park. If you pass GO, collect $200.",
    action: () => { advance(9); }
  },
  {
    text: "You are arrested! Go directly to Jail. Do not pass GO, do not collect $200.",
    action: () => { gotojail(); }
  }
];

chanceCardDefinitions.forEach((def) => {
  chanceCards.push(new Card(def.text, def.action));
});