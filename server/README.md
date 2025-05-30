# GLAZMO SNAPSHOT WEBSOCKET GATEWAY

## PROKOTOL

- JSON based
- must contain key `TYPE` that contains well, type of the message, see bellow
- 2 types of messages -- `LOGIN` and `EMIT`

### LOGIN

- authorizes client as reader of the upcomming emits
- must contain key `PASSWORD` which is globaly set as single string
- yes, its unsafe but guys its for 3-day art instalation calm down

### EMIT

- CAUSES UNSTABILITY OF THE GLAZMO REALM
- does crazy stuff on the logged in reader
- mby some additional keys for gyroscope info? idk
