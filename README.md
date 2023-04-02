# web-rtc-nstb
#web-rtc-nstb
Aplikacja zawiera POC dla prjektu NSTB: WebRTC
## Signaling server
Aplikacja serweru signal dla NSTB: WebRTC. Odpowiada za zestawianie połączeń pomi ędzy użytownikami, korzytsającymi z aplikacji nstb-webrtc
### Wymagania
1. Python3, minimalna wersja 3.11
2. Instalacja modułów pyjwt oraz tornado

## Web-RTC
Klient dla POCa projektu NSTB: WebRTC.
Klient jest napisany w Angularze, do instalacji wymaga nodejs w wersji 16 lub ższej oraz npm w wersji 6 lub wyższej.
### Przygotowanie
Instalacja niezbędnych pakietów
npm install
### Konfiguracja
W pliku
/environments/url.ts_ należy ustawić adres serwera signal do którego ma
się łączyć aplikacja.
const _baseUrl = localhost:8765
### Uruchomienie aplikacji
Domyślne uruchomienie aplikacji

npm ng run serve
### Korszytanie z aplikacji
#### 1.Dodawanie użytkowników
Aby móc korzystać z aplikacji, należy wpierw dodać dodać użytkowników. Można to zrobić w POC poprzez wejście na adres
http://localhosy: 4200/register
Użytkownicy dla uproszenia POCa są przetrzymywani w pliku JSON.
#### 2. Logowanie
Po pozyskaniu użytkoników, należy "zalogować" się do aplikacji. Na potrzeby POCa nie ma potrzeby na wpisywanie hasła wystarczy login podany przy tworzeniu uży tkownika.
http://localhost:4200/login


#### 3. Korzystanie z aplikacji
W lewym górnym aplikcaji POC znajduje się okienko do wyszukiwania innych użytkow ników. Zestawienie komunikacji przebiega według następującego schematu.
1. Znajudujemy użytkownika, z którym chcemy nawiązać połączenie wpisują odpowied nią frazę w monit.
2. Z listy dostępnych użykoników, wybieramy tego który nas interesuje.
3. Możemy rozpocząć komunikację poprzez chat lub rozmowę wideo:)
#### !!!WAŻNE !!!
Podczas testów należy udostępnić przeglądarce dostęp do kamery i mikrofonu. W przypadku deployu aplikacji na zewnętrznej maszynie połączenie musi być po protokole HTTPS.
