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
    tableTitle = newSoup.find(id=generation)
    # currentFloor = ""
    
    try:
        # floorCheck = tableTitle.parent.next_element.findNext('span',class_="mw-headline")
        # print(floorCheck)
        # if (floorCheck != None and floorCheck.index('_')<0):
        #     counter = 0
        #     while True:
        #         if counter != 0:
        #             floorCheck = floorCheck.next_element.findNext('span',class_="mw-headline") 
                    
        #             if (floorCheck == None or floorCheck.index('_')>=0):
        #                 break
        #         counter += 1
        #         pokeTable = floorCheck.findNext('table')
        #         for poke in pokeTable.find_all("tr",attrs={"style":"text-align:center;"}):
        #             inGame = poke.find(text=version).parent.parent.get("style")
        #             if inGame == None:
        #                 inGame = poke.find(text=version).parent.parent.parent.get("style")
        #             if inGame == "background:#FFF;":
        #                 continue
        #             pokeName = poke.find("a").get("title")
        #             pokeID = poke.find("img").get("src").split("/")[-1][:-7]
        #             route = location.split('/')[-1].replace('_',' ').replace('Underground Path (Kanto Routes 5-6)','Saffron City').replace('Celadon Condominiums','Celadon City').replace('Cinnabar Lab','Cinnabar Island').replace('Fighting Dojo','Saffron City').replace('Kanto ','').replace('.','').replace('(Kanto)','').replace('Professor Oak\'s Laboratory','Pallet Town').replace('Sea Cottage','Bill\'s House').strip()
        #             route += "#"+floorCheck.text.strip()
        #             method = ""
        #             levels = ""
        #             chance = ""
        #             count = 0
        #             for td in poke.find_all("td",attrs={"style":"background:#FFF;"}):
        #                 if count == 0:
        #                     try:
        #                         method = td.find("small").text.strip()
        #                     except:
        #                         method = td.text.strip()
        #                 elif count == 1:
        #                     levels = td.text.strip()
                            
        #                 elif count == 2:
        #                     chance = td.text.strip()
                            
        #                 count += 1
        #             pokeList.loc[len(pokeList)]=[pokeName,pokeID,route,method,levels,chance]
        # else:

        pokeTable = tableTitle.parent.findNext('table')
        for poke in pokeTable.find_all("tr",attrs={"style":"text-align:center;"}):
            inGame = poke.find(text=version).parent.parent.get("style")
            if inGame == None:
                inGame = poke.find(text=version).parent.parent.parent.get("style")
            if inGame == "background:#FFF;":
                continue
            pokeName = poke.find("a").get("title")
            pokeID = poke.find("img").get("src").split("/")[-1][:-7]
            route = location.split('/')[-1].replace('_',' ').replace('Silph Co.','Saffron City').replace('Underground Path (Kanto Routes 5-6)','Saffron City').replace('Celadon Condominiums','Celadon City').replace('Cinnabar Lab','Cinnabar Island').replace('Fighting Dojo','Saffron City').replace('Kanto ','').replace('.','').replace('(Kanto)','').replace('Professor Oak\'s Laboratory','Pallet Town').replace('Sea Cottage','Bill\'s House')
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
            pokeList.loc[len(pokeList)]=[pokeName,pokeID,route,method,levels,chance]
    except:
        return pokeList
    return pokeList


if __name__ == "__main__":
    #Still need to manually add in Game Corner Pokemon
    version = "R"
    site_data = get_site("Red,_Blue_and_Yellow")
    df = pd.DataFrame({'Pokemon Name':[],'Pokemon ID':[],'Route':[],'Catch Method':[],'Levels':[],'Encounter Chance':[]})
    locations = location_list(site_data)
    for loc in locations:
        time.sleep(1) #Following bulbapedia's robot.txt guidelines for crawl speed
        df = pd.concat([df,location_pokemon(loc,"Generation_I","R")])
    df.to_excel("PokemonRouteDataSetFinal"+version+".xlsx", index=False)
    