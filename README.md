# nes-service
A service for providing NES data


# Execution

Use `npm start` to start the service

# End Points

## GET Games
The Games route returns a list of games based upon filtering.  Filtering is supported for the properties `id`, `name`, `developer`, `publisher`, `category`, `esrb`, and `upc`.  You can combine the filters together to get to a smaller set.  The supplied values match a pattern and are case-insensitive.  

`./games?name=mario&category=platform`
Returns games that contain "mario" in the name and has catagory containing "platoform". 


# Data
Currently data are maintained in an Excel spreadsheet.  I use the tool https://www.aconvert.com/document/xls-to-json/ to convert the Excel to JSON to be used for the mock data