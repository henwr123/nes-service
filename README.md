# nes-service
A service for providing NES data


# Execution

Use `npm start` to start the service

# End Points

## GET Games
The Games route returns a list of games based upon filtering.  Filtering is supported for the properties `id`, `name`, `developer`, `publisher`, `category`, `esrb`, and `upc`.  You can combine the filters together to get to a smaller set.  The supplied values match a pattern and are case-insensitive.  

`./games?name=mario&category=platform`
Returns games that contain "mario" in the name and has catagory containing "platoform". 

## GET Games/id
The Games route with an is, a single record that matches the id will be returned.

`./games/NES-XX-USA`
Returns the game that has the provided identifier.


# Data

## Data Source
Currently data are maintained in an Excel spreadsheet.  I use the tool https://www.aconvert.com/document/xls-to-json/ to convert the Excel to JSON to be used for the mock data.  Data will be moved to a database in a future release (perhaps CouchDB).

The key to the data is the Catalgo ID (or id in the result).  The id is the identifier that Nintendo gave to a licensed game and is promenently displayed on the sticker of the cataridge.  This service is currently limited to the US release to avoid "duplicates" when the Japan and European markets are added.  Unlicensed games will not be included.

## Where did the data come from?
Many data sources were used to build the information.

- https://en.wikipedia.org/wiki/List_of_Nintendo_Entertainment_System_games - list with most games and publisher details
- https://nesdir.github.io/ - for board details and the catalog id
- https://nes.fandom.com/wiki/List_of_Nintendo_Entertainment_System_games - Some additional details like release date
- https://www.lukiegames.com/nintendo-nes-video-games.html - Used to fill in the blanks
- http://bootgod.dyndns.org:7777/contrib.php - cartdb datasource

Data are imported into a spreadsheet to combine data and to make adjustments.  Other data points were researched and added manually.  Data are convert to JSON and added to the project for the data source.

## What about images?
Box art images can be downloaded from http://www.ubernes.com/nesboxart.html.  The names must be mapped to the Catalog ID and will need to be hosted elsewhere.  To access the resource, the application will provide the base URI with the Catalog ID.