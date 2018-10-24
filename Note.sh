rm child_process.js && wget http://192.168.2.116:12/child_process.js
rm index.html && wget http://192.168.2.116:12/index.html
rm main.js && wget http://192.168.2.116:12/main.js

cd root/
nohup nodejs child_process.js &

new Date().getHours()