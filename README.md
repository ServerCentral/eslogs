Introduction
===
eslogs is a command-line tool for searching logs stored in elasticsearch. 

Pass it a query, and it outputs the matching log lines, as if you had run `cat` on the log file.

Installation
===
* Copy eslogs.json to ~/.eslogs.json
* Update values to match your elasticsearch instance and index mappings
* `node src/index.js --help`

Usage
===
```
eslogs index [-q query | ...] [options]
  
  -q query           A free-text search
  
  Options:
  -s n               Return n latest results. Higher sizes take longer. Default 100.
  -h name            Only show logs from hosts that match this name.
  
  Examples:
  eslogs logstash-*
  eslogs logstash-* -q error
  eslogs logstash-* -q "192.168.1.100"
  eslogs logstash-* -q "failed with error"
  eslogs logstash-* -q error -h c14714
  eslogs logstash-* -q error -h 192.168.1.1
  eslogs logstash-* -q error -s 1000 | less -S
  watch eslogs logstash-* error -s 30
```

Help
===
File a github issue if you are having trouble.