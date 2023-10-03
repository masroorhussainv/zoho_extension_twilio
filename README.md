# Project Set up

## Installation of necessary components
#### Pre-requisites:
Download the nodejs source code from "https://nodejs.org/en/download/".
Once Node is installed, verify it by running the following command.
```bash
node -v
npm -v
```

### CLI Installation
Run the following command to install the zet CLI node package.
```bash
npm install -g zoho-extension-toolkit
```
## Project Creation

### Project created with
```bash
zet init
```

## Configuration

### Configure the plugin
```json
{
  "locale": [
    "en"
  ],
  "service": "CRM",
  "modules": {
    "widgets": [
      {
        "location": "top_band",
        "name": "Twilio Widget",
        "url": "app/index.html",
        "logo": "app/img/logo.png"
      }
    ]
  },
  "config": [],
  "usedConnections": []
}
```
- `service` indicates the Zoho product for which the plugin/extension is made.
- `location` indicates the UI component where this extension will be placed.
- `url` is the project entry point file.

## Run The Server
First, compile the SASS assets if any, by running
```bash
sass app/styles/main.scss app/css/main.css
```
> For using SASS, you need to add the SASS package as a dev dependency.

Run the server
```bash
zet run
```

## Packing the Extension
```bash
zet pack
```