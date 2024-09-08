# NestJS Backend Projekt

## Zadání BE - NestJS

### Technologie
* NodeJS 18+
* Backendový framework NestJS 10 https://nestjs.com/
* Typescript
* Balíčkovací manager pnpm https://pnpm.io/
* Testovací framework Jest https://jestjs.io/
* git
* SQLite (pro ukládání dat)

### Zadání
Cílem je seznámit se se základními koncepty frameworku NestJS a napsat jednoduchý webový server, který simuluje evidenci zákazníků.

Struktura aplikace:
* `AppModule`: hlavní modul, ze kterého se spouští aplikace, importuje `DataModule`
   * `AppController`: HTTP controller, volá `DataService`
* `DataModule`: modul pro správu dat
   * `DataService`: služba, která simuluje práci s databází

Aplikace má 4 HTTP endpointy:
* Výpis všech zákazníků se základními informacemi
* Detail jednoho zákazníka podle jeho ID
* Vytvoření nového zákazníka
* Editace zákazníka podle jeho ID

Controller přijímá požadavky a vrací odpovědi, ale nespravuje data. Data jsou uskladněna v `DataService` s využitím SQLite databáze.

## Poznámky k projektu
1. Nekonzistentní jazyk - Původně jsem psal kód v angličtině, jelikož jsem na to zvyklý. Nevěděl jsem však, kdo bude vypracovaný úkol číst, a tak jsem se v rámci projektu rozhodl změnit komentáře z angličtiny do češtiny.
2. Vypracovaný task by měl splňovat úplně všechny úkoly včetně bonusů
3. K interaktivní dokumentaci byl využit swagger
4. Jako databázi jsem zvolil SQLite kvůli jednoduchosti nacházející se v data/ adresáři (v produkci je samozřejmě lepší použít něco robustnějšího)
5. Přemýšlel jsem, zda nevytvořit dockerfile pro kontejnerizaci aplikace, nakonec jsem se rozhodl držet zadání a docker file jsem nevytvořil
6. Commity se držely v1.0.0 standardů

## Struktura projektu

```
customer-tracker/
│
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   ├── customers/
│   │   ├── customer.entity.ts
│   │   ├── customer.interface.ts
│   │   └── customer_swagger.dto.ts
│   └── data/
│       ├── data.module.ts
│       └── data.service.ts
│
├── test/
│   ├── app.controller.spec.ts
│   └── test_endpoints.sh
│
├── data/
│   └── database.sqlite
│
├── .env
├── README.md
├── package.json
└── tsconfig.json
```

## Instalace a spuštění

1. Naklonujte repozitář:
   ```
   git clone https://github.com/S41G0N/customer-tracker
   cd customer-tracker
   ```

2. Nainstalujte závislosti:
   ```
   pnpm install
   ```

3. Vytvořte soubor `.env` v kořenovém adresáři projektu a nastavte port (není povinné, aplikace by jinak běžela na portu 3000):
   ```
   PORT=4823
   ```

4. Spusťte aplikaci:
   ```
   pnpm run start
   ```

5. Pro spuštění testů:
   ```
   pnpm run test
   ```

## Endpointy a jejich použití

### 1. Výpis všech zákazníků
```
curl http://localhost:<PORT>/customers
```

### 2. Detail zákazníka
```
curl http://localhost:<PORT>/customers/1
```

### 3. Vytvoření zákazníka
```
curl -X POST -H "Content-Type: application/json" -d '{"name":"Jan Novák","email":"jan@example.com","address":"Hlavní 123, Praha"}' http://localhost:<PORT>/customers
```

### 4. Editace zákazníka
```
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Jan Novák Update"}' http://localhost:<PORT>/customers/1
```

## Test endpointů pomocí skriptu

V 'test' adresáři existuje `test_endpoints.sh` skript pro testování endpointů následujícím obsahem:

```bash
#!/bin/bash
# Zakladni URL vaseho API (ZMENTE PODLE VASEHO NASTAVENI)
BASE_URL="http://localhost:4000"
# Barvy pro vystup
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # Bez barvy
# Funkce pro volani API a kontrolu odpovedi
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    echo "Test: $method $endpoint"
    
    if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method $BASE_URL$endpoint)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method $BASE_URL$endpoint -H "Content-Type: application/json" -d "$data")
    fi
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}Uspech: $method $endpoint vratil $response${NC}"
    else
        echo -e "${RED}Chyba: $method $endpoint vratil $response, ocekavano $expected_status${NC}"
    fi
    echo ""
}
# Test GET /
test_endpoint "GET" "/" "" 200
# Test GET /customers
test_endpoint "GET" "/customers" "" 200
# Test POST /customers
test_endpoint "POST" "/customers" '{"id":"123","name":"John Doe","email":"john@example.com","address":"123 Main St"}' 201
# Test GET /customers/:id
test_endpoint "GET" "/customers/1" "" 200
# Test PUT /customers/:id
test_endpoint "PUT" "/customers/1" '{"name":"John Updated"}' 200
# Test DELETE /customers/:id
test_endpoint "DELETE" "/customers/1" "" 200
# Test GET /customers/:id po smazani (mel by vratit 404)
test_endpoint "GET" "/customers/1" "" 404
echo "Vsechny testy dokonceny."
```

Poté můžete spustit tento skript příkazem:

```
bash test_endpoints.sh
```

Tento skript otestuje všechny implementované endpointy. Ujistěte se však, že skript cílí na správný port.

## Bonus funkce

- Aplikace se spouští na portu definovaném v souboru `.env`
- Při startu se načítají ENV proměnné ze souboru `.env`
- Implementovány unit testy pro `AppController` s mockem `DataService`
- Napojení na SQLite databázi pro persistentní ukládání dat

Pro více informací o implementaci a kódu se podívejte do jednotlivých souborů v adresáři `src/`.
