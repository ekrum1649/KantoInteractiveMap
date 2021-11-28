from bs4 import BeautifulSoup
import requests
import pandas as pd
import time

def get_site(game):
    #Generation using game names: (i.e. Red,_Blue_and_Yellow or Ruby_and_Sapphire)
    url = "https://bulbapedia.bulbagarden.net/wiki/Category:"+game+"_locations"
    site = requests.get(url)
    soup = BeautifulSoup(site.content,"html.parser")
    return soup

def location_list(site_data):
    locationDiv = site_data.find(class_ = "mw-category")
    locations = []
    for loc in locationDiv.find_all('a'):
        locations.append(loc.get('href'))
    return locations

def location_pokemon(location,generation,version):
    #Generation format uses roman numerals
    #Version as in R, B, FR, etc.
    pokeList = pd.DataFrame({'Pokemon Name':[],'Pokemon ID':[],'Route':[],'Catch Method':[],'Levels':[],'Encounter Chance':[]})
    baseUrl = 'https://bulbapedia.bulbagarden.net'
    newUrl = baseUrl+location
    newSite = requests.get(newUrl)
    newSoup = BeautifulSoup(newSite.content,"html.parser")
    try:
        pokeSection = newSoup.find(id="Pok.C3.A9mon")
        tableTitle = pokeSection.parent.findNext(text=generation)
    
    # currentFloor = ""
    
    
        floorCheck = tableTitle.next_element.findNext('span',class_="mw-headline")
        # print(floorCheck)
        # print(floorCheck != None)
        # print("_" not in floorCheck.text)
        # print("here1")
        if (floorCheck != None and "_" not in floorCheck.text and ("F" in floorCheck.text or "Area" in floorCheck.text)):
            # print("here2")
            counter = 0
            while True:
                # print("here3")
                if counter != 0:
                    floorCheck = floorCheck.next_element.findNext('span',class_="mw-headline") 
                    # print(floorCheck)
                    if (floorCheck == None or "_" in floorCheck.text or not ("F" in floorCheck.text or "Area" in floorCheck.text)):
                        break
                # print("here4")
                counter += 1
                # print(floorCheck)
                pokeTable = floorCheck.parent.findNext('table')
                for poke in pokeTable.find_all("tr",attrs={"style":"text-align:center;"}):
                    inGame = poke.find(text=version).parent.parent.get("style")
                    if inGame == None:
                        inGame = poke.find(text=version).parent.parent.parent.get("style")
                    if inGame == "background:#FFF;":
                        continue
                    pokeName = poke.find("a").get("title")
                    pokeID = poke.find("img").get("src").split("/")[-1][:-7]
                    route = location.split('/')[-1].replace('_',' ').replace("&nbsp;"," ").replace("%C3%A9","e").replace("%27","\'").replace('Underground Path (Kanto Routes 5-6)','Saffron City').replace('Celadon Condominiums','Celadon City').replace('Cinnabar Lab','Cinnabar Island').replace('Fighting Dojo','Saffron City').replace('Kanto ','').replace('.','').replace('(Kanto)','').replace('Professor Oak\'s Laboratory','Pallet Town').replace('Sea Cottage','Bill\'s House').strip()
                    route += "#"+floorCheck.text.strip()
                    method = ""
                    levels = ""
                    chance = ""
                    count = 0
                    for td in poke.find_all("td",attrs={"style":"background:#FFF;"}):
                        if count == 0:
                            try:
                                method = td.find("small").text.strip()
                            except:
                                method = td.text.strip()
                        elif count == 1:
                            levels = td.text.strip()
                            
                        elif count == 2:
                            chance = td.text.strip()
                            
                        count += 1
                    method = method.replace(u'\xa0'," ").strip()
                    pokeList.loc[len(pokeList)]=[pokeName,pokeID,route,method,levels,chance]
        else:

            pokeTable = tableTitle.parent.findNext('table')
            for poke in pokeTable.find_all("tr",attrs={"style":"text-align:center;"}):
                inGame = poke.find(text=version).parent.parent.get("style")
                if inGame == None:
                    inGame = poke.find(text=version).parent.parent.parent.get("style")
                if inGame == "background:#FFF;":
                    continue
                pokeName = poke.find("a").get("title")
                pokeID = poke.find("img").get("src").split("/")[-1][:-7]
                route = location.split('/')[-1].replace('_',' ').replace("&nbsp;"," ").replace("%C3%A9","e").replace("%27","\'").replace('Silph Co.','Saffron City').replace('Underground Path (Kanto Routes 5-6)','Saffron City').replace('Celadon Condominiums','Celadon City').replace('Cinnabar Lab','Cinnabar Island').replace('Fighting Dojo','Saffron City').replace('Kanto ','').replace('.','').replace('(Kanto)','').replace('Professor Oak\'s Laboratory','Pallet Town').replace('Sea Cottage','Bill\'s House')
                method = ""
                levels = ""
                chance = ""
                count = 0
                for td in poke.find_all("td",attrs={"style":"background:#FFF;"}):
                    if count == 0:
                        try:
                            method = td.find("small").text.strip()
                        except:
                            method = td.text.strip()
                    elif count == 1:
                        levels = td.text.strip()
                        
                    elif count == 2:
                        chance = td.text.strip()
                        
                    count += 1
                # print(method)
                method = method.replace(u"\xa0"," ").strip()
                # print(method)
                pokeList.loc[len(pokeList)]=[pokeName,pokeID,route,method,levels,chance]
    except:
        try:
            prizeSection = newSoup.find(id="Prize_corner")
            tableTitle = prizeSection.parent.findNext(text=generation)
            pokeTable = tableTitle.parent.findNext("table")
            versions = ['R','B','Y']
            vExtrap = ["Pokémon Red","Pokémon Blue","Pokémon Yellow"]
            vInd = versions.index(version)
            newV = vExtrap[vInd]
            for window in pokeTable.find_all("span",text=newV):
                tbody = window.parent.parent.parent.parent
                for pokemon in tbody.find_all("small"):
                    poke = pokemon.parent.text.strip()
                    cost = pokemon.parent.parent.findNext("tr").text.strip()
                    topList = poke.split('(')
                    pokeName = topList[0].strip()
                    level = topList[1][3:-1]
                    route = "Game Corner"
                    chance = ""
                    pokeLink = pokemon.parent.findNext("a")
                    # print(pokeLink.link))
                    pokeUrl = baseUrl+pokeLink.get("href")
                    time.sleep(1) #Crawl Delay (from robot.txt)
                    pokeSite = requests.get(pokeUrl)
                    pokeSoup = BeautifulSoup(pokeSite.content,"html.parser")
                    pokeID = pokeSoup.find("small",text=generation).findNext("small").text.split("#")[1]
                    pokeList.loc[len(pokeList)]=[pokeName,pokeID,route,chance,level,cost]
        except:
            return pokeList
        return pokeList
    return pokeList


if __name__ == "__main__":
    #Still need to manually add in Game Corner Pokemon
    version = ["R","B","Y"]
    site_data = get_site("Red,_Blue_and_Yellow")
    dfr = pd.DataFrame({'Pokemon Name':[],'Pokemon ID':[],'Route':[],'Catch Method':[],'Levels':[],'Encounter Chance':[]})
    dfb = pd.DataFrame({'Pokemon Name':[],'Pokemon ID':[],'Route':[],'Catch Method':[],'Levels':[],'Encounter Chance':[]})
    dfy = pd.DataFrame({'Pokemon Name':[],'Pokemon ID':[],'Route':[],'Catch Method':[],'Levels':[],'Encounter Chance':[]})
    locations = location_list(site_data)
    for loc in locations:
        # if loc == '/wiki/Celadon_Game_Corner':
        time.sleep(1) #Following bulbapedia's robot.txt guidelines for crawl speed
        dfr = pd.concat([dfr,location_pokemon(loc,"Generation I",version[0])])
        time.sleep(1)
        dfb = pd.concat([dfb,location_pokemon(loc,"Generation I",version[1])])
        time.sleep(1)
        dfy = pd.concat([dfy,location_pokemon(loc,"Generation I",version[2])])
            
    dfr.to_csv("PokemonRouteDataSetFinal"+version[0]+".csv", index=False, encoding='utf-8')
    dfb.to_csv("PokemonRouteDataSetFinal"+version[1]+".csv", index=False,encoding='utf-8')
    dfy.to_csv("PokemonRouteDataSetFinal"+version[2]+".csv", index=False,encoding='utf-8')
    