## Guide to run app

-   Client

NodeJS is required (install nvm-windows: https://github.com/coreybutler/nvm-windows)

Follow guide to ensure that you have NodeJS. Once you have NodeJS, open a terminal and run `corepack enable` to enable Yarn.


-   Server

Python is required (Find and install)

Open a terminal, create a virtual environment in the project `server` folder to create a local python interpreter specially for the project: `python -m venv venv`


<hr />

To start the client, open a terminal in the project folder's root path where package.json is and run `yarn` to install dependencies. Then, run `yarn dev`. The app will be running on localhost and you'll be redirected to the app's page.


To start the server, install python dependencies using venv context:
```
// Use venv context, activate file depends on console used (PowerShell in this case)
./venv/Scripts/Activate.ps1

// Pull dependencies
python -m pip install -r requirements.txt
```

Run the main file using venv's interpreter:

```
// <venv interpreter path> <init file path>
./hydrorise-sentinel/server/venv/Scripts/python.exe ./hydrorise-sentinel/server/app.py
```

### For devs:

Install JS packages using `yarn`:
```
yarn add <package>
```

Install python packages using venv context:
```
// Use venv context, activate file depends on console used (PowerShell in this case)
./venv/Scripts/Activate.ps1

python -m pip install <package>
```

When pushing new package changes to GitHub, update the package requirements in requirements.txt:
`python -m pip freeze > requirements`
