
echo off
set ANGULAR="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.3"
set ANGULAR_MATERIAL="http://ajax.googleapis.com/ajax/libs/angular_material/1.0.7"
set ANGULAR_MATERIAL_ICONS="http://cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.7.0"
set PEP="https://code.jquery.com/pep/0.4.1"
set BABYLON="http://cdnjs.cloudflare.com/ajax/libs/babylonjs/2.4.1"
rem set BABYLON="http://cdnjs.cloudflare.com/ajax/libs/babylonjs/2.3.0"

java -jar fs.jar -base ./src -welcome index.html ^
 -proxy /css/angular-material.min.css=%ANGULAR_MATERIAL%/angular-material.min.css ^
 -proxy /js/angular.min.js=%ANGULAR%/angular.min.js ^
 -proxy /js/angular-animate.min.js=%ANGULAR%/angular-animate.min.js ^
 -proxy /js/angular-aria.min.js=%ANGULAR%/angular-aria.min.js ^
 -proxy /js/angular-messages.min.js=%ANGULAR%/angular-messages.min.js ^
 -proxy /js/angular-material.min.js=%ANGULAR_MATERIAL%/angular-material.min.js ^
 -proxy /js/angular-material-icons.min.js=%ANGULAR_MATERIAL_ICONS%/angular-material-icons.min.js ^
 -proxy /js/pep.min.js=%PEP%/pep.min.js ^
 -proxy /js/babylon.max.js=%BABYLON%/babylon.max.js 
    
    