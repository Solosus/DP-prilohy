
# DP-prilohy
## Potrebný software

 - Python 2 (ak je pouzita brida v0.3, novsia pracuje s Python 3) a Python 3 (frida)
 - Pre Python nainstalovat frida-tools, flask, sqlalchemy a Pyro4 (pomocou pip) 
 - Aplikacie predpokladaju pouzitie emulatora s Android 10, toto je vyzadovane, kedze je nakonfigurovana proxy
 - Burp Suite (staci free verzia) a extension Brida (prostrednictvom Extender menu), odporucam v0.3 s ktorou pracovala tato praca, v0.4 obsahuje zmenu GUI a funkcionality. Ak sa pouzije v0.4, je nutne doinstalovat frida-compile a node.js. Tento navod je iba pre verziu 0.3 (https://github.com/federicodotta/Brida/releases)
 - Stiahnut frida-server podla architektury zariadenia (https://github.com/frida/frida/releases), verzia by mala sediet s frida-tools

### Spustenie Frida
frida-server musi na zariadeni bezat neustale. Pre spustenie je nutne byt root.
https://frida.re/docs/android/
 ```bash
	$ adb root # might be required
	$ adb push frida-server /data/local/tmp/
	$ adb shell "chmod 755 /data/local/tmp/frida-server"
	$ adb shell "/data/local/tmp/frida-server &"
```

## RASP
Skripty pre obidenie RASP su v priecinku RASP/. Pre pouzitie napr.:

    frida -U -l sslpinning.js cz.app.test
V pripade skusania RASP na aplikaciach s SSL/TLS, je nutne importovat Burp certifikat do zariadenia. Pre toto je potrebne nastavit proxy pre zariadenie (bud android alebo ineho hosta, napr. firefox) aby komunikacia isla cez Burp Suite. Nasledne sa prejde na adresu http://burp a stiahne sa z nej certifikat, ten je nutne premenovat na priponu .crt, ktora sa da importovat do zariadenia.
## Pokrocile metody obfuskacie
K dispozicii originalne zdrojove kody (bez obfuskacie) v archive obfs.7z

Backend server pre mobilnu aplikaciu je v archive obfs-server.zip. Jeho spustenie prebieha pomocou python3 main.py. Databaza obsahuje 2 platne mena pre prihlasenie, "Pavol" a "Mark".

Jednotlive aplikacie s obfuskaciou su vlozene iba vo forme .apk. Nie je mozne pridat priamo projekty, nakolko obsahuju proprietarne kniznice a licencie, ktore nie je mozne zverejnit.

K dispozicii je verzia apk pre Allatori, DashO (nebude fungovat, vyprsala licencia) a DexProtector. Vsetky verzie maju rovnaky kod, rozdielna je iba obfuskacia.

### Konfig Burp Suite
Pre fungovanie aplikacie je nutne nastavit Burp suite aby mal listener na 0.0.0.0:8080 rozhrani (aby sa emulator vedel napojit). Toto sa nastavi v menu "Proxy" -> Options -> Proxy Listeners (prve okienko) -> kliknut na prvy zaznam -> Edit -> Bind to address: All interfaces.

Nasledne je nutne nastavit presmerovanie IP adries aby emulator vedel komunikovat s backend serverom prostrednictvom proxy. Menu "Project options" -> Hostname Resolution -> Add -> Hostname: 10.0.2.2, IP address: 127.0.0.1.

Pri spusteni burp suite je casto zapnuty Intercept, odporucam vypnut a komunikaciu pozerat v History menu. Taktiez je mozne filtrovat komunikaciu prostrednictvom "Target" menu.

Konfiguracia Brida vyzaduje cestu k python 2 binarke, Pyro server by mal byt nakonfigurovany spravne (localhost a 9999). Nastavit "Frida local", niekedy to vsak nejde a treba "Frida remote". Potom je nutne spustit Pyro server pomocou menu napravo (Start server), potom spustit aplikáciu (jej nazov je "cz.vutbr.pavol.obfuscation.experimental" a je nutne ho mat v konfigu), spustenie prebieha pomocou Spawn application. Pri zmene JS suboru za behu je nutne "Reload JS", pripadne "Spawn application" znova (istejsia varianta).

Subor brida.js je vychodiskovy subor, ktory obsahuje skript pre vygenerovanie podpisu pre Allatori a je ho mozne pouzit. Skript je vlozeny ako metoda contextcustom1 a teda je pouzitelna v Intercept a Repeaterch taboch, odporucam pouzit Repeater, kedze automaticky vie upravit velkost payload (Content-size), v Intercept je nutne to robit manualne. Odporucam postupovat takto:

 - jednotlive HTTP requesty su viditelne v Burp Suite v History tabe
 - odtial je mozne vybrany request presunut do Reapeater (bud pomocou Ctrl + R alebo pravy klik a send to repeater)
 - je mozne modifikovat niektory parameter ako meno alebo suma na prevod
 - nasledne oznacit cele telo poziadavky, prav klik a pouzit metodu contextcustom1
 - tym sa povodne telo nahradi novym, s validnym podpisom

Backend server musi byt spusteny. Pre pripadne problemy odporucam pozriet navod na Brida (bud github wiki, pripadne https://techblog.mediaservice.net/2018/04/brida-a-step-by-step-user-guide/)
