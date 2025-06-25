# GLAZMO SNAPSHOT WEBSOCKET GATEWAY

## PROKOTOL

- JSON based
- must contain key `TYPE` that contains well, type of the message, see bellow
- 2 types of messages -- `LOGIN` and `EMIT`

### LOGIN

- authorizes client as reader of the upcomming emits

### EMIT

- CAUSES UNSTABILITY OF THE GLAZMO REALM
- does crazy stuff on the logged in reader
- mby some additional keys for gyroscope info? idk
