# Test API Endpoints

## Test dengan PowerShell

### 1. Test Register
```powershell
$body = @{
    name = "Test User"
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### 2. Test Login dan Simpan Token
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

# Simpan token
$token = $response.token
Write-Host "Token: $token"
```

### 3. Test Get Barangs (Public)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/barangs" -Method GET
```

### 4. Test Create Barang (dengan Token)
```powershell
$barangBody = @{
    nama = "Dompet Kulit"
    tipeId = 1
    kategoriId = 1
    statusId = 1
    lokasi = "Perpustakaan"
    deskripsi = "Dompet warna coklat"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/barangs" `
    -Method POST `
    -Headers $headers `
    -Body $barangBody
```

### 5. Test Search Barangs
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/barangs?q=dompet&tipe=hilang" -Method GET
```

---

## One-Liner Test (Copy-Paste Friendly)

### Quick Test Register
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body (@{name="Test User";username="testuser$(Get-Random)";email="test$(Get-Random)@example.com";password="password123"} | ConvertTo-Json)
```

### Quick Test Login
```powershell
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body (@{email="test@example.com";password="password123"} | ConvertTo-Json); $r.token
```

### Quick Test Get Barangs
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/barangs" -Method GET
```

---

## Full Test Flow Script

Salin dan jalankan script berikut untuk test full flow:

```powershell
# 1. Register
Write-Host "1. Testing Register..." -ForegroundColor Cyan
$registerBody = @{
    name = "Test User"
    username = "testuser$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✅ Register Success!" -ForegroundColor Green
    $email = ($registerBody | ConvertFrom-Json).email
} catch {
    Write-Host "❌ Register Failed: $_" -ForegroundColor Red
    exit
}

# 2. Login
Write-Host "`n2. Testing Login..." -ForegroundColor Cyan
$loginBody = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login Success! Token: $($token.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Login Failed: $_" -ForegroundColor Red
    exit
}

# 3. Get All Barangs
Write-Host "`n3. Testing Get All Barangs..." -ForegroundColor Cyan
try {
    $barangs = Invoke-RestMethod -Uri "http://localhost:3000/api/barangs" -Method GET
    Write-Host "✅ Get Barangs Success! Found: $($barangs.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Barangs Failed: $_" -ForegroundColor Red
}

# 4. Create Barang
Write-Host "`n4. Testing Create Barang..." -ForegroundColor Cyan
$barangBody = @{
    nama = "Test Item - Dompet"
    tipeId = 1
    kategoriId = 1
    statusId = 1
    lokasi = "Test Location"
    deskripsi = "Test Description"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/barangs" `
        -Method POST `
        -Headers $headers `
        -Body $barangBody
    Write-Host "✅ Create Barang Success! ID: $($createResponse.data.id)" -ForegroundColor Green
    $barangId = $createResponse.data.id
} catch {
    Write-Host "❌ Create Barang Failed: $_" -ForegroundColor Red
}

# 5. Search Barangs
Write-Host "`n5. Testing Search Barangs..." -ForegroundColor Cyan
try {
    $searchResults = Invoke-RestMethod -Uri "http://localhost:3000/api/barangs?q=dompet" -Method GET
    Write-Host "✅ Search Success! Found: $($searchResults.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Search Failed: $_" -ForegroundColor Red
}

Write-Host "`n🎉 All Tests Completed!" -ForegroundColor Yellow
```

---

## Troubleshooting

### Error: Cannot connect
```powershell
# Check if server is running
Test-NetConnection -ComputerName localhost -Port 3000
```

### Error: 401 Unauthorized
```powershell
# Make sure token is valid
Write-Host "Token: $token"
```

### Error: 422 Validation Error
```powershell
# Check request body format
$body | ConvertFrom-Json | Format-List
```
