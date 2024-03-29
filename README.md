# nes-service
A service for providing NES data with data persistency using SQLite database.

<br/>

# Execution

To run the project locally, clone the repo, open the directory

* Install dependencies with `npm install`
* Use `npm start` to start the service
* Access the end point at `http://localhost:4321`

<br/>

To run the project locally with Docker, clone the repo, open the directory

* Use `npm run docker:dev` to build the container and start it locally
* Access the end point at `http://localhost:4321`

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

Data are stored in a SQLite database.

## Table **games**

The **games** table contains the list of NES games along with the information that is important about the game.  

| Field | Data Type | Description |
|---|---|---|
| catalog_id | string | Game identifier - The id is the identifier that Nintendo gave to a licensed game and is promenently displayed on the sticker of the cataridge, otherwise a unique identifier that is generated |
| class | string | Indicates Licensed or Unlicensed game |
| name | string | The name of the game |
| system | string | System for the game |
| region | integer | the region the game was released |
| publisher | integer | The company that published the game |
| developer | integer | The company that developed the game |
| releaseDate | date | The date the game was released |
| players | int | The number of players that can play the game |
| board | string | PCB board used for cartridge |
| upc | string | UPC code for game |
| category | string | Category for the game |
| esrb | string | Rating for game |

<br/>

## Table **region**
The **region** table contains the list of regions that were targets for NES games.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID for the region |
| name | string | Region name |

<br/>

## Table **developer**
The **deveoper** table contains the list of developers that created the NES games.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID |
| name | string | Developer name |

<br/>

## Table **publisher**
The **publisher** table contains the list of publishers that were allowed to publish NES games.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID |
| name | string | Publisher name |

<br/>

## Table **systems**
The **systems** table contains the list of systems that games were made for.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID |
| name | string | System name |

<br/>

## Table **categories**
The **categories** table contains the list of categories to mark for the NES games.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID |
| name | string | Category name |

<br/>

## Table **boards**
The **boards** table contains the list of boards that were used to distribute NES games.

| Field | Data Type | Description |
|---|---|---|
| id | integer | Auto-generated ID |
| name | string | Board name |

<br/>


## Where did the data come from?

Many data sources were used to build the information.

- https://en.wikipedia.org/wiki/List_of_Nintendo_Entertainment_System_games - list with most games and publisher details
- https://nesdir.github.io/ - for board details and the catalog id
- https://nes.fandom.com/wiki/List_of_Nintendo_Entertainment_System_games - Some additional details like release date
- https://www.lukiegames.com/nintendo-nes-video-games.html - Used to fill in the blanks
- http://bootgod.dyndns.org:7777/contrib.php - cartdb datasource

Data are imported into a spreadsheet to combine data and to make adjustments.  Other data points were researched and added manually.  Data are convert to JSON and added to the project for the data source.

<br/>

## What about images?

Box art images can be downloaded from http://www.ubernes.com/nesboxart.html.  The names must be mapped to the Catalog ID and will need to be hosted elsewhere.  To access the resource, the application will provide the base URI with the Catalog ID.


## Sources

Used this to get Docker local environment setup:
https://towardsdev.com/docker-for-local-node-js-development-164844df5cb6

Used this to determine the IP address for the calling application:
https://stackfame.com/get-ip-address-node