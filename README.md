# Roboapp in React Native mit Expo von Bjarne Blumenthal und weiteren

___

# HINWEIS: WENN DIE EXPO SDK 54 VERÖFFENTLICHT WIRD, MUSS DAS EXPO SDK PACKAGE AKTUALISIERT WERDEN!

WENN DIES NICHT GESCHIEHT, IST DIE EXPO GO APP NICHT NUTZBAR UND DAMIT DIE APP NICHT OHNE SIE ZU BUILDEN!
___

## Dokumentation

Die Dokumentation zu den einzelnen genutzten Komponenten finden sich in `components`. Dort gibt es jeweils eine eigene README für die entsprechenden Objekte. Ebenso gibt es in `app` für die verschiedenen Screens eine README.

## Nutzen der App

Nach dem Klonen des Repos müssen die `node_modules`mit

```bash
npm install
```

installiert werden. Anschließend kann der lokale Debugger zum Bereitstellen der App
mit

```bash
npx expo start
```

gestartet werden. Um die App auf Android oder IOS auszuführen, wird die App `Expo Go` benötigt. Mit der App kann der vom
Debugger bereitgestellte QR-Code gescannt werden, um die App zu laden. Funktioniert dies nicht,
muss der Debugger mit der Taste `s` in den `--go`-Modus versetzt werden.
Ist die App verbunden, kann sie normal benutzt werden und evtl. Debug-Nachrichten in der Konsole ausgelesen werden.
Außerdem gibt es mit der Taste `j` die Möglichkeit, einen ausführlichen Debugger auf dem PC zu öffnen.

## Builden der App

Soll die App für ein Android-Gerät als APK bereitgestellt werden, muss zuerst ein `Expo-Account` erstellt werden.
Danach muss das `eas-cli`-Paket installiert werden, um die App zu bauen.
Dies kann mit

```bash
npm install -g eas-cli
```

installiert werden.

Anschließend kann man sich mit

```bash
npx expo login
```

im Debugger anmelden. Die App kann mit folgendem Befehl

```bash
eas build --platform android --profile production --local
```

lokal gebaut werden. 
(Im Repository befindet sich unter `roboapp.apk` bereits eine gebuildete App. Falls diese fehlerhaft ist,
kann auf die `roboapp.apk` 
[in diesem Commit](https://gitlabti.informatik.uni-osnabrueck.de/lehre/hardwarepraktikum/2025/emaros/app-entwicklung/app/-/tree/7628fed2c200242ab6c30836378e635958dd563a/) zurückgegriffen werden. Diese wurde getestet und vorgestellt.) 
Sollte `JAVA_HOME` nicht gefunden worden sein, muss Java mit

```bash
sudo apt-get install openjdk-17-jdk
```

installiert werden. Danach müssen zwei Umgebungsvariablen gesetzt werden:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

Für dauerhafte Änderungen können diese in die Datei `~/.bashrc` eingefügt werden.
Sollte ebenfalls `ANDROID_HOME` nicht gefunden worden sein, muss das Android SDK installiert werden. 
Auf [dieser Webseite](https://docs.expo.dev/workflow/android-studio-emulator/#set-up-android-studio) kann eine Anleitung gefunden werden, wie das Android SDK installiert und konfiguriert wird.

Anschließend kann die APK-Datei im root-Ordner des Projekts gefunden werden.
Sollte der Build aufgrund von zu wenigem Arbeitsspeicher fehlschlagen, kann in `android/gradle.properties` der String
`org.gradle.jvmargs=-Xmx16384m -XX:MaxMetaspaceSize=4096m` angepasst werden, um mehr Heap etc. zuzuweisen.
In der Datei `eas.json` kann außerdem der Build-Profilname angepasst werden, um z.B. Debug-Builds zu erstellen.

Für IOS wird ein Mac benötigt, um die App zu bauen. Daher wurde dies nicht getestet und kann fehlschlagen.

___

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [
`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project
uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you
can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with
  our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll
  create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
