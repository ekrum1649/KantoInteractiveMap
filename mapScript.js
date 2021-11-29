let svg = d3.select('.map');
svg.append('image') //Background image created by ptucham
    .attr("class", "background_image")
    .attr("xlink:href", "background.png")
    .attr("x", 50)
    .attr("y", 30)
    .style('position', 'absolute');

let currentGame = "Red";
let currentRoute = "";
moveTimeouts = []; //List of all timeouts for trainer movement (so they can be cleared if a new location is clicked)
let trainerLoc = "PalletTown"; //Thought it'd be a good touch to start in the starting location
let nextPos = "PalletTown";

let height = svg.attr('height');
let width = svg.attr('width');
let margin = { top: 30, right: 30, bottom: 30, left: 30 };
let chartWidth = width - margin.left - margin.right;
let chartHeight = height - margin.top - margin.bottom;
let chartArea2 = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

svg.append('text') //Location Name Label
    .attr("class", "locationName")
    .attr("x", chartWidth / 2)
    .attr("y", 20)
    .attr("text-anchor", "center")
    .text("Kanto Region (" + currentGame + ")")
d3.select("#label").raise()

// Legend
svg.append('rect')
    .attr('x', '780')
    .attr('y', '470')
    .attr('height', '110')
    .attr('width', '130')
    .attr("text-anchor", "center")
    .style('fill', 'red');

svg.append('rect')
    .attr('x', '790')
    .attr('y', '480')
    .attr('height', '90')
    .attr('width', '110')
    .attr("text-anchor", "center")
    .style('fill', 'white');

svg.append('text')
    .attr('class', 'legend')
    .attr('x', '815')
    .attr('y', '500')
    .attr("text-anchor", "center")
    .text("Legend");

svg.append('rect')
    .attr('x', '810')
    .attr('y', '510')
    .attr('height', '10')
    .attr('width', '10')
    .attr("text-anchor", "center")
    .style('fill', 'tan');

svg.append('text')
    .attr('class', 'legend')
    .attr('x', '830')
    .attr('y', '520')
    .attr("text-anchor", "center")
    .text("Routes");

svg.append('rect')
    .attr('x', '810')
    .attr('y', '530')
    .attr('height', '10')
    .attr('width', '10')
    .attr("text-anchor", "center")
    .style('fill', 'red');

svg.append('text')
    .attr('class', 'legend')
    .attr('x', '830')
    .attr('y', '540')
    .attr("text-anchor", "center")
    .text("Cities");

svg.append('circle')
    .attr('cx', '815')
    .attr('cy', '555')
    .attr('r', '5')
    .attr("text-anchor", "center")
    .style('fill', 'blue');

svg.append('text')
    .attr('class', 'legend')
    .attr('x', '830')
    .attr('y', '560')
    .attr("text-anchor", "center")
    .text("Places");
//Legend End

function bracketSpawner(mapLoc) {
/*
Takes in a moused over map object (rectangle or circle). Creates the rectangles seen in the original pokemon games
that hover over the route while moused over. Visual representation of which location user is looking at
*/
    if (mapLoc.attr("label") == "Route 3") {
    /*Route 3 is split into 3 rectangles, however we only want the brackets to appear in one location.
    If any of them are moused over, set the location to the primary one to keep consistency*/
    mapLoc = d3.select("#r3primary")
    }
    let modifiers = [13,6,15] //Distance from center modifiers
    let height = 0 //height and width of map object
    let width = 0
    let x = 0 //x and y location of map object
    let y = 0
    let b0 = 2 //b0 and b1 are height and width of rectangles
    let b1 = 9
    
    if (mapLoc.attr("class").indexOf("nLoc")>=0) { //larger circle
    modifiers = [13,5,15]
    
    height = 0
    width = 0
    x = parseInt(mapLoc.attr("cx"))
    y = parseInt(mapLoc.attr("cy"))
    b1 = 10

    }
    else if (mapLoc.attr("class").indexOf("hLoc")>=0) { //small circle
    modifiers = [5,3,5]
    height = 0
    width = 0
    x = parseInt(mapLoc.attr("cx"))
    y = parseInt(mapLoc.attr("cy"))
    b0 = 1
    b1 = 3
    }
    else { //rectangle
    
    height = parseInt(mapLoc.attr("height"))
    width = parseInt(mapLoc.attr("width"))
    x = parseInt(mapLoc.attr("x"))
    y = parseInt(mapLoc.attr("y"))
    }
    //Start appending rectangles
    chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) - modifiers[2])
        .attr("y", y + (.5*height) - modifiers[2])
        .attr("width", b0)
        .attr("height", b1)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) - modifiers[2])
        .attr("y", y + (.5*height) - modifiers[2])
        .attr("width", b1)
        .attr("height", b0)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) + modifiers[0])
        .attr("y", y + (.5*height) - modifiers[2])
        .attr("width", b0)
        .attr("height", b1)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) + modifiers[1])
        .attr("y", y + (.5*height) - modifiers[2])
        .attr("width", b1)
        .attr("height", b0)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) - modifiers[2])
        .attr("y", y + (.5*height) + modifiers[1])
        .attr("width", b0)
        .attr("height", b1)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) - modifiers[2])
        .attr("y", y + (.5*height) + modifiers[0])
        .attr("width", b1)
        .attr("height", b0)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) + modifiers[0])
        .attr("y", y + (.5*height) + modifiers[1])
        .attr("width", b0)
        .attr("height", b1)
        .attr("class", "pointerBox")

        chartArea2.append("rect")
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x", x + (.5*width) + modifiers[1])
        .attr("y", y + (.5*height) + modifiers[0])
        .attr("width", b1)
        .attr("height", b0)
        .attr("class", "pointerBox")
    //End of appending rectangles
}  

let buttonRows = d3.select('#VersionSelect')

const routeData = async function () {
    //load in data files
    // const raritySortOrder = ['Common','Uncommon','Rare','NA']
    const methodSortOrder = ['Starter','Walking','Grass','Cave','Surfing','Old Rod','Good Rod','Super Rod','Interact','Gift','Trade','Game Corner','Fossil']
    const red = await d3.csv("data/PokemonRouteDataSetFinalR.csv", d3.AutoType)
    const blue = await d3.csv("data/PokemonRouteDataSetFinalB.csv", d3.AutoType)
    const yellow = await d3.csv("data/PokemonRouteDataSetFinalY.csv", d3.AutoType)
    const kantoAdj = await d3.csv("KantoAdjacencyMatrix.csv", d3.AutoType)
    const kantoMapRect = await d3.csv("PokemonKantoRegionRectData.csv", d3.AutoType)
    const kantoMapCircle = await d3.csv("PokemonKantoRegionCircleData.csv", d3.AutoType)
    const gameList = [red, blue, yellow]
    for (game in gameList) {
        gameList[game].sort(function (a,b) {return d3.ascending(a['Pokemon ID'],b['Pokemon ID'])});
        gameList[game].sort((a,b) => d3.ascending(parseInt(a['Encounter Chance'].split("C")[0].split("%")[0]),parseInt(b['Encounter Chance'].split("C")[0].split("%")[0])));
        gameList[game].sort((a,b) => d3.ascending(methodSortOrder.indexOf(a['Catch Method']), methodSortOrder.indexOf(b['Catch Method'])) || d3.ascending(a['Catch Method'],b['Catch Method']));
            
        gameList[game].sort(function (a,b) {return d3.ascending(a['Route'], b['Route']);});
    }
    const trainer_front = await fetch("Sprites/ptf1.png")
    const fWalk1 = await fetch("Sprites/ptf2.png")
    const fWalk2 = await fetch("Sprites/ptf3.png")
    const trainer_back = await fetch("Sprites/ptb1.png")
    const bWalk1 = await fetch("Sprites/ptb2.png")
    const bWalk2 = await fetch("Sprites/ptb3.png")
    const trainer_left = await fetch("Sprites/ptl1.png")
    const lWalk = await fetch("Sprites/ptl2.png")
    const trainer_right = await fetch("Sprites/ptr1.png")
    const rWalk = await fetch("Sprites/ptr2.png")

    const fAni = [trainer_front,fWalk1,trainer_front,fWalk2]
    const bAni = [trainer_back,bWalk1,trainer_back,bWalk2]
    const lAni = [trainer_left,lWalk]
    const rAni = [trainer_right,rWalk]
    
    let distToWalk = 0; //distance to final location from current position
    let cPX = 147; //Current X position of trainer
    let cPY = 397; //Current Y Position of trainer


    for (let i = 0; i < kantoMapRect.length; i++) { //append map rectangles from data file
    chartArea2.append('rect')
        .attr('x', kantoMapRect[i].x_start)
        .attr('y', kantoMapRect[i].y_start)
        .attr('width', kantoMapRect[i].x_end - kantoMapRect[i].x_start)
        .attr('height', kantoMapRect[i].y_end - kantoMapRect[i].y_start)
        .attr('label', kantoMapRect[i].label_name)
        .attr('id', kantoMapRect[i].id)
        .attr('class', kantoMapRect[i].class)
        .style('fill', kantoMapRect[i].path_city)
        .style('opacity', kantoMapRect[i].opacity);
    }

    for (let i = 0; i < kantoMapCircle.length; i++) { //append map circles from datafile
    chartArea2.append('circle')
        .attr('cx', kantoMapCircle[i].cx)
        .attr('cy', kantoMapCircle[i].cy)
        .attr('r', kantoMapCircle[i].r)
        .attr('label', kantoMapCircle[i].label_name)
        .attr('id', kantoMapCircle[i].id)
        .attr('class', kantoMapCircle[i].class)
        .style('fill', 'blue');
    }

    chartArea2.append('image') //Animated trainer sprite (from bulbapedia)
    .attr("xlink:href", "images/RedRGBwalkdown.png")
    .attr("height", 16)
    .attr("width", 16)
    .attr("x", 147)
    .attr("y", 397)
    .attr("id", "Trainer")

    //Dijkstra's Shortest Path to make sure the trainer stays on the paths, and make sure they take optimal route
    function dijkstra(s, t, adj) {
    /*
    Inputs - s: starting location, t: goal location, adj: adjacency matrix
    Output - final_path: list of location names that makes up the optimal path
    Also updated - distToWalk updated with total distance
    */
    let final_path = []
    let unvisited = Array(adj.length)
    let routes = Array(adj.length)
    let distanceMap = new Map();

    adj.forEach((d, i) => {

        if (d['Route'] == s) {

        distanceMap.set(d['Route'], 0)
        }
        else {
        distanceMap.set(d['Route'], Infinity)
        }

        unvisited[i] = d['Route']
        routes[i] = d['Route']
    })


    let backTracker = Array(adj.length)



    while (unvisited.length > 0) {
        
        let newDistances = []
        for (r in routes) {

        if (unvisited.indexOf(routes[r]) >= 0) {

            newDistances.push(distanceMap.get(routes[r]))
        }
        }
        let uDist = Math.min(...newDistances)
        let u = ""
        for (r in routes) {
        
        if (unvisited.indexOf(routes[r]) >= 0) {
            if (distanceMap.get(routes[r]) == uDist) {
            u = routes[r]
            }
        }
        }
        let uName = u
        u = routes.indexOf(uName)

        
        unvisited.splice(unvisited.indexOf(uName), 1) //remove current node out of unvisited
        let currentX = 0
        let currentY = 0
        let currentHeight = 0
        let currentWidth = 0

        if (d3.select("#" + uName).attr("class").indexOf("nLoc") >= 0 || 
                d3.select("#" + uName).attr("class").indexOf("hLoc") >= 0) { //Check if Circle
        currentX = d3.select("#" + uName).attr("cx")
        currentY = d3.select("#" + uName).attr("cy")
        currentHeight = d3.select("#" + uName).attr("r")
        currentWidth = currentHeight
        }
        else { //Else it is a rectangle or corner marker
        currentX = d3.select("#" + uName).attr("x")
        currentY = d3.select("#" + uName).attr("y")
        currentHeight = d3.select("#" + uName).attr("height")
        currentWidth = d3.select("#" + uName).attr("width")
        currentX = currentX - currentWidth + (3 * currentWidth / 2)
        currentY = currentY - currentHeight + (3 * currentHeight / 2)
        
        }
        let toBeSeen = []
        for (r in routes) {
        if (adj[u][routes[r]] == 1 && unvisited.indexOf(routes[r]) >= 0) {
            toBeSeen.push(routes[r])
        }
        }

        for (j in toBeSeen) {
        let jx = 0
        let jy = 0
        let jName = d3.select("#" + toBeSeen[j])
        if (jName.attr("class").indexOf("nLoc") >= 0 || jName.attr("class").indexOf("hLoc") >= 0) { //Check if Circle
            
            jx = jName.attr("cx") - 1
            jy = jName.attr("cy") - 1
        }
        else if (jName.attr("class").indexOf("route") >= 0 || jName.attr("class").indexOf("city") >= 0) { //Else check if city or route
            jx = parseInt(jName.attr("x")) + parseInt(jName.attr("width")) / 2
            jy = parseInt(jName.attr("y")) + parseInt(jName.attr("height")) / 2
            

        }
        else { //else it is a corner marker
            
            jx = jName.attr("x")
            jy = jName.attr("y")

        }

        cDist = uDist + Math.sqrt((((currentX - jx) ** 2) + ((currentY - jy) ** 2)))
        if (cDist < distanceMap.get(toBeSeen[j])) {
            distanceMap.set(toBeSeen[j], cDist);
            backTracker[routes.indexOf(toBeSeen[j])] = uName;
        }
        }
    }

    let current = t
    let count = 0
    while (current != s) {
        final_path.unshift(current);
        current = backTracker[routes.indexOf(current)]
    }
    
    distToWalk = 0
    for (p in final_path) {
        distToWalk += distanceMap.get(final_path[p])
    }
    return final_path
    }


    function moveTrainer(rList, count=0) {
    /*
    Takes in list of location names (count is also an argument, but should not be modified as it is for recursive purposes)
    Moves trainer along the path list to final location
    */
    nextDest = rList[count];
    ndx = 147;
    ndy = 397;
    ndh = 0;
    ndw = 0;
    if (d3.select("#" + nextDest).attr("class").indexOf("nLoc") >= 0 || 
            d3.select("#" + nextDest).attr("class").indexOf("hLoc") >= 0) { //Check if Circle

        ndx = d3.select("#" + nextDest).attr("cx")
        ndy = d3.select("#" + nextDest).attr("cy")
        ndh = d3.select("#" + nextDest).attr("r")

        ndx = ndx - ndh + (3 * ndh / 2) - 8 //Center trainer on circle
        ndy = ndy - ndh + (3 * ndh / 2) - 8
    }
    else { //Else it is a rectangle or point

        ndx = d3.select("#" + nextDest).attr("x")
        ndy = d3.select("#" + nextDest).attr("y")
        ndh = d3.select("#" + nextDest).attr("height")
        ndw = d3.select("#" + nextDest).attr("width")

        ndx = ndx - ndw + (3 * ndw / 2) - 8 //Center the trainer on rectangle or point
        ndy = ndy - ndh + (3 * ndh / 2) - 8
    }
    let dist = Math.max(Math.abs(ndx-cPX),Math.abs(ndy-cPY)) //Distance to the next point
    
    d3.select("#Trainer")
        .transition().duration(dist*10) //Set speed based on distance so that it stays constant
        .ease(d3.easeLinear)
        .attr("x", ndx)
        .attr("y", ndy)

    if (count < rList.length - 1) { //If more locations to go
        moveTimeouts.push(setTimeout(() => { //Wait until movement to next location is done, and then run for next location in list
        cPX = ndx;
        cPY = ndy;
        nextPos = rList[count+1];
        trainerLoc = nextDest
        
        moveTrainer(rList, count + 1) 
        }, dist*10)); //timeout time is based on walking distance so this runs as soon as location is reached
    }
    else {
        cPX = ndx; //update trainer position if this is last location in list
        cPY = ndy;
    }
    }

    function onClick(mapLoc) {
    /*
    Function to run whenever a map location is clicked
    mapLoc is the rectangle/circle object that is clicked on
    */
    let tr = d3.select("#Trainer")
    cPX = tr.attr("x")
    cPY= tr.attr("y")
    loc = d3.select("#"+trainerLoc) //location data
    locX = loc.attr("x")
    locY = loc.attr("y")

    for (z in moveTimeouts) { //clear all previous timeouts (ends movement towards other location)
        clearTimeout(moveTimeouts[z]); 
        }
        let id = mapLoc.attr("id")
        let rList = dijkstra(nextPos,id,kantoAdj) //dijkstra from next position (which might be current position)

        if (rList[0]==trainerLoc) { //if dijkstra includes current loc, run move trainer with this list
        moveTrainer(rList,0)
        }
        else { //otherwise run dijkstra from current location
        rList = dijkstra(trainerLoc, id, kantoAdj)
        if (nextPos == trainerLoc) {
            rList.unshift(trainerLoc)
        }
        if (rList.length > 0){ //If trainer not currently at location
            moveTrainer(rList, 0)
        }
        }


    //Last move to center (mainly to move trainer to corner of city blocks)
    let modifier = 8
    let height = 0
    let width = 0
    let x = 0
    let y = 0
    if (mapLoc.attr("class").indexOf("nLoc") >= 0) {
        modifier = 12

        height = 0
        width = 0
        x = parseInt(mapLoc.attr("cx"))
        y = parseInt(mapLoc.attr("cy"))

    }
    else if (mapLoc.attr("class").indexOf("hLoc") >= 0) {
        modifier = 10
        height = 0
        width = 0
        x = parseInt(mapLoc.attr("cx"))
        y = parseInt(mapLoc.attr("cy"))
    }
    else {

        height = parseInt(mapLoc.attr("height"))
        width = parseInt(mapLoc.attr("width"))
        if (width == height) {
        modifier = 0
        width = 0
        height = 0
        }
        x = parseInt(mapLoc.attr("x"))
        y = parseInt(mapLoc.attr("y"))
    }

        let newX = x + (.5*width) - modifier
        let newY = y + (.5*height) - modifier

        moveTimeouts.push(setTimeout(() => {
        d3.select("#Trainer")
            .transition().duration(100)
            .attr("x", newX)
            .attr("y", newY)
        trainerLoc = id
        cPX = newX;
        cPY = newY;
        
        }, distToWalk*10));


        //Update side popout with locations pokemon info
        routePoke = []
        let choose = "Red" //confirm which game verion to display
        if (currentGame == "Red") {
        choose = gameList[0]
        }
        else if (currentGame == "Blue") {
        choose = gameList[1]
        }
        else {
        choose = gameList[2]
        }
        currentRoute = mapLoc.attr("label");
        choose.forEach((d, i) => { //Add all instances of pokemon found here to routePoke
        const modRoute = d['Route'].split("#")[0]

        if (modRoute == mapLoc.attr("label")) {

        routePoke.push(d)
        }
    })


    d3.selectAll('.routeCardData') //Remove all previous data
        .remove()
    d3.selectAll('.floorName')
        .remove()
    mapPopout.select(".pokeTable")
        .remove()
    mapPopout.select("#pokemonImg")
        .remove()
    mapPopout.select("#pokeLogo")
        .text(mapLoc.attr("label"))
    mapPopout.select("#dataTitles")
        .text('ID, Pokemon')

    columnHeaders = ['', 'ID', 'Name', 'Rarity', 'Encounter'] //Table Columns

    let table = mapPopout.select("#locationDiv") //Create table
        .append("table")
        .attr("class", "pokeTable")
    let theader = table.append('thead')
    let tbody = table.append('tbody')
    theader.append('tr')
        .selectAll('th')
        .data(columnHeaders).enter()
        .append('th')
        .text(d => d)

    let currentFloor = ""
    let currentMethod = ""
    for (let i = 0; i < routePoke.length; i++) { //Append either pokemon info or floor marker
        let floorCheck = routePoke[i]['Route'].split('#')
        let methodCheck = routePoke[i]['Catch Method']
        if (floorCheck.length > 1) {
            if (floorCheck[1] != currentFloor) { //Add floor marker row

                currentFloor = floorCheck[1]
                let trow = tbody.append('tr')
                trow.append('th')
                    .text(currentFloor)
                    .style('text-align','center')
                    .attr('colspan','5')
                    .style('border','3px solid black')
                    .style('font-size','20px')
                tbody.append('tr')
                    .text(methodCheck)
                currentMethod = methodCheck
            }
        }
        if (methodCheck != currentMethod) {
            tbody.append('tr')
                .text(methodCheck)
            currentMethod = methodCheck
        }
        let row = tbody.append('tr') //Add pokemon info
        row.append('td')
        .append('img')
        .attr("src", `images/${routePoke[i]['Pokemon Name'].replace('\'', '')
                .replace('\u2640', '_female').replace('\u2642', '_male')
                .replace('. ', '_').replace('Ghost Marowak','marowak').toLowerCase()}.png`) //Append pokemon photo
        .attr("width", 80)
        .attr("height", 80)
        row.append('td')
        .text(routePoke[i]['Pokemon ID'])
        row.append('td')
        .text(routePoke[i]['Pokemon Name']
            .replace('(Female)', '\u2640').replace('(Male)', '\u2642')) //Nidoran male and female symbols
        if (routePoke[i]['Encounter Chance'] != 'NA') {
        row.append('td')
            .text(routePoke[i]['Encounter Chance'])
        }
        else {
        row.append('td')
            .text('')
        }
        row.append('td')
        .text(routePoke[i]['Catch Method'])
    }
    }


    routePoke = []
    mapPopout = d3.select('#mapPopout')
    chartArea2.selectAll("rect") //Rectangle map objects
    .on("mouseover", function () {
        let currRec = d3.select(this)
        bracketSpawner(currRec)

        d3.selectAll(".locationName") //update location text above map
        .text(this.getAttribute("label"))


    })
    .on("mouseout", function () {
        d3.select(this)
        chartArea2.selectAll(".pointerBox") //delete bracket markers (created by bracketSpawner)
        .remove();

        d3.selectAll(".locationName") //Change location name back
        .text("Kanto Region (" + currentGame + ")")


    })
    .on("click", function () {
        onClick(d3.select(this)) //onclick function

    });



    chartArea2.selectAll(".nLoc") //large circle objects (nLoc = normal location)
    .on("mouseover", function () {
        let currCir = d3.select(this)
        bracketSpawner(currCir)

        d3.selectAll(".locationName") //update location text above map
        .text(this.getAttribute("label"))


    })
    .on("mouseout", function () {

        chartArea2.selectAll(".pointerBox") //delete bracket markers (created by bracketSpawner)
        .remove();

        d3.selectAll(".locationName") //change location name back to standard
        .text("Kanto Region (" + currentGame + ")")
        
    })
    .on("click", function () {
        onClick(d3.select(this)) //onclick function

    });


    chartArea2.selectAll(".hLoc") //small circle objects(hLoc = hidden location)

    .on("mouseover", function () {
        let currCir = d3.select(this)
        bracketSpawner(currCir)

        d3.selectAll(".locationName") //update location text above map
        .text(this.getAttribute("label"))


    })
    .on("mouseout", function () {
        
        chartArea2.selectAll(".pointerBox") //delete bracket markers (created by bracketSpawner)
        .remove();

        d3.selectAll(".locationName") //change location name back to standard
        .text("Kanto Region (" + currentGame + ")")
        

    })
    .on("click", function () {
        onClick(d3.select(this)) //onclick function

    });


    buttonRows.selectAll(".VersionButton") //Version Select buttons below map

    .on("mouseover", function () { //Enlarge version buttons
        d3.select(this)
        .transition().duration(200)
        .attr("width", 150)
        .attr("height", 150)
    })

    .on("mouseout", function () { //Version button back to normal size
        d3.select(this)
        .transition().duration(200)
        .attr("width", 120)
        .attr("height", 120)
    })

    .on("click", function () { //Update route pokemon to reflect version
        let slen = this.getAttribute("src").length
        let cG = this.getAttribute("src").substring(7, slen - 4) //Game name
        currentGame = cG
        d3.selectAll(".locationName")
        .text("Kanto Region (" + currentGame + ")")

        if (currentRoute != "") {
        routePoke = []
        let choose = "Red"
        if (currentGame == "Red") {
            choose = gameList[0]
        }
        else if (currentGame == "Blue") {
            choose = gameList[1]
        }
        else {
            choose = gameList[2]
        }
        choose.forEach((d, i) => {
            const modRoute = d['Route'].split("#")[0]

            if (modRoute == currentRoute) {

            routePoke.push(d)
            }
        })
        d3.selectAll('.routeCardData')
            .remove()
        d3.selectAll('.floorName')
            .remove()
        d3.selectAll('.pokeTable')
            .remove()
        d3.select(this)
        mapPopout.select("#pokemonImg")
            .remove()
        mapPopout.select("#pokeLogo")
            .text(currentRoute)
        mapPopout.select("#dataTitles")
            .text('ID, Pokemon')
        columnHeaders = ['', 'ID', 'Name', 'Rarity', 'Encounter']

        let table = mapPopout.select("#locationDiv")
            .append("table")
            .attr("class", "pokeTable")
        let theader = table.append('thead')
        let tbody = table.append('tbody')
        theader.append('tr')
            .selectAll('th')
            .data(columnHeaders).enter()
            .append('th')
            .text(d => d)

        let currentFloor = ""
        let currentMethod = ""
        for (let i = 0; i < routePoke.length; i++) { //Append either pokemon info or floor marker
            let floorCheck = routePoke[i]['Route'].split('#')
            let methodCheck = routePoke[i]['Catch Method']
            if (floorCheck.length > 1) {
                if (floorCheck[1] != currentFloor) { //Add floor marker row
    
                    currentFloor = floorCheck[1]
                    let trow = tbody.append('tr')
                    trow.append('th')
                        .text(currentFloor)
                        .style('text-align','center')
                        .attr('colspan','5')
                        .style('border','3px solid black')
                        .style('font-size','20px')
                    tbody.append('tr')
                        .text(methodCheck)
                    currentMethod = methodCheck
                }
            }
            
            if (methodCheck != currentMethod) {
                tbody.append('tr')
                    .text(methodCheck)
                currentMethod = methodCheck
            }
            let row = tbody.append('tr') //Add pokemon info
            row.append('td')
            .append('img')
            .attr("src", `images/${routePoke[i]['Pokemon Name'].replace('\'', '')
                    .replace('\u2640', '_female').replace('\u2642', '_male')
                    .replace('. ', '_').replace('Ghost Marowak','marowak').toLowerCase()}.png`) //Append pokemon photo
            .attr("width", 80)
            .attr("height", 80)
            row.append('td')
            .text(routePoke[i]['Pokemon ID'])
            row.append('td')
            .text(routePoke[i]['Pokemon Name']
                .replace('(Female)', '\u2640').replace('(Male)', '\u2642')) //Nidoran male and female symbols
            if (routePoke[i]['Encounter Chance'] != 'NA') {
            row.append('td')
                .text(routePoke[i]['Encounter Chance'])
            }
            else {
            row.append('td')
                .text('')
            }
            row.append('td')
            .text(routePoke[i]['Catch Method'])
        }
        }
    })
}
routeData();