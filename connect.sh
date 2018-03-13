#!/usr/bin/expect                   // 指定shebang


spawn sudo ssh root@120.27.93.13 
expect "Password"                 
send "cqx09143103\r"                
expect "root@120.27.93.13's password"
send "xxxxxxxx"
send "sudo -s\r" 
send "cd /data/logs\r"             
interact
