# PM2 cheat sheet:

## Installation
```bash
npm install pm2@latest -g
```

## Starting an Application
```bash
pm2 start app.js // specify an app name
// or
pm2 start all
```

## Listing All Applications
```bash
pm2 list
```

## Monitoring Logs
```bash
pm2 logs
```

## Stopping Applications
```bash
pm2 stop all # Stops all applications
pm2 stop app_name # Stops a specific application
```

## Restarting Applications
```bash
pm2 restart all # Restarts all applications
pm2 restart app_name # Restarts a specific application
```

## Reloading Applications
```bash
pm2 reload all # Reloads all applications with 0s downtime
pm2 reload app_name # Reloads a specific application
```

## Deleting Applications
```bash
pm2 delete all # Removes all applications from PM2 list
pm2 delete app_name # Removes a specific application
```

## Saving Current Process List
```bash
pm2 save
```

## Resurrecting Previously Saved Processes
```bash
pm2 resurrect
```

## Updating PM2
```bash
pm2 update
```

## Displaying Process Information
```bash
pm2 describe app_name
```

## Displaying PM2 Version
```bash
pm2 -v
```

## Generating Startup Script
```bash
pm2 startup
```

## Unfreezing All Processes
```bash
pm2 unfreeze all
```

## Freezing a Specific Process
```bash
pm2 freeze app_name
```

## Scaling Applications
```bash
pm2 scale app_name number_of_instances
```

## Setting Environment Variables
```bash
pm2 start app.js --env production
```

## Specifying Log File Paths
```bash
pm2 start app.js --log log_path
```

## Delaying Application Restart
```bash
pm2 start app.js --delay 10000
```

## Specifying Instance Mode
```bash
pm2 start app.js -i max # Starts maximum instances
pm2 start app.js -i 4 # Starts 4 instances
```

## Displaying Detailed Metrics and Monitoring
```bash
pm2 monit
```

## Displaying Help for PM2 Commands
```bash
pm2 help
```