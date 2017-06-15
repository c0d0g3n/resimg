# Mappen
- `inputDir`: Locatie met afbeeldingen die van formaat veranderd moeten worden (tijdens commando `resize`)
- `outputDir`: Locatie waarin gemaakte afbeeldingen opgeslagen worden. De bestanden worden in mappen per afmeting geplaatst.
- `remoteDir`: Locatie op de ftp-server waar `outputDir` geüpload zal worden. (tijdens commando `upsync`)

# Commando's (typ in cmd/terminal)
- `./resimg resize`: Maak afbeeldingen met nieuwe afmetingen.
- `./resimg upsync`: Upload `outputDir` naar online locatie (ftp).
- `./resimg clear-local`: Maak de map `outputDir` leeg. (`inputDir` wordt genegeerd)
- `./resimg clear-remote`: Maak de map `remoteDir` leeg (op ftp-server).
- `./resimg generate-html`: Maak htmlpagina's van afbeeldinglijsten.
