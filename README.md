Introduction
===
eslogs is a command-line tool for searching system logs stored in elasticsearch. 

It takes a simple search phrase and returns log lines that match that search.

Installation
===
* `npm install -g eslogs`
* Edit `~/.eslogs.json` to match your elasticsearch configuration.
* `eslogs --help`

Usage
===
```
Usage: eslogs index [options]
  
Options:
-q query           A free-text search.
-s n               Return n latest results. Higher sizes take longer. Default 100.
-h name            Only show logs from hosts that match this name.
```

Examples
===
```
eslogs logstash-*
eslogs logstash-* -q error
eslogs logstash-* -q "192.168.1.100"
eslogs logstash-* -q "failed with error"
eslogs logstash-* -q error -h myhost
eslogs logstash-* -q error -h 192.168.1.1
eslogs logstash-* -q error -s 1000 | less -S
watch eslogs logstash-* error -s 30
```

Help
===
File a github issue if you are having trouble.
