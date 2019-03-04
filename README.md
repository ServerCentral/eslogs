Introduction
===
eslogs is a command-line tool for searching system logs stored in elasticsearch. 

It takes a simple search phrase and returns log lines that match that search.

Installation
===
* `npm install -g eslogs`
* Edit `~/.eslogs.json` or `/etc/eslogs.json` to match your elasticsearch configuration.
* `eslogs --help`

Usage
===
```
Usage: eslogs index [options]
  
Options:
-q query           A free-text search.
-s n               Return n latest results. Higher sizes take longer. Default 100.
-h name            Only show logs from hosts that match this name.
-t time            Start searching backwards from this date. Default 'now'.
--version          Show version number.
  
Examples:
eslogs logstash-*
eslogs logstash-* -q error
eslogs logstash-* -q "192.168.1.100"
eslogs logstash-* -q "\"192.168.1.100\" AND error"
eslogs logstash-* -q "failed with error"
eslogs logstash-* -q error -t "24 hours ago"
eslogs logstash-* -q error -t "monday"
eslogs logstash-* -q error -t "12/25/2018 midnight"
eslogs logstash-* -q error -h myhost
eslogs logstash-* -q error -h 192.168.1.1
eslogs logstash-* -q error -s 10000 | less -S
watch eslogs logstash-* -q error -s 30
```

Example config
===
```
{
  "host": "localhost:9200",
  "indices": {
    "logstash-*": {
      "messageKey": "message",
      "timestampKey": "@timestamp",
      "hostnameKey": "host"    
    }
  }
 }
```

Help
===
File a github issue if you are having trouble.
