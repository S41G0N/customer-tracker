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
