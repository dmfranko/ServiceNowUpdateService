[![Code Climate](https://codeclimate.com/github/dmfranko/ServiceNowUpdateService/badges/gpa.svg)](https://codeclimate.com/github/dmfranko/ServiceNowUpdateService)

ServiceNowUpdateService
=======================

This service serves up updates to users for newly assigned tickets in ServiceNow for use in alerting.  It depends on a Mongo database as well.

Sinatra Service
---------------
The Sinatra service serves up two pieces of information.

1. The list of "new" or unreported tickets for a particular requested user.
2. The ServiceNow instance URL, which is used to display the notification link

### Setup

1. Configure the ServiceNow endpoint.
2. Start an instance of mongodb.
2. Start the sinatra service with rackup.

Chrome Extension
----------------

This extension polls the Sinatra service to determine if there are newly assigned tickets to the specified user.  It then allows the user to click on a button in the notification to open it in their browser.

