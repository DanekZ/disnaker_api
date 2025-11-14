# Employee API Spec

## Create Employee

Endpoint : POST api/admin/

Request Body :

```json
{
  "username": "admin123",
  "password": "123456",
  "role_code": "PNJMDSKR",
  "id_perusahaan": 1
}
```

Response (Success):

```json
{
  "message": "Admin created successfully"
}
```

Response (Failed):

```json
"error": "Admin is already exist"
```

## GET Employee

Endpoint : Get api/admin/:username

Request Header :

- Authorization = token

Response (Success):

```json
{
  "data": {
    "username": "admin123",
    "role_code": "ADMIN3321",
    "id_perusahaan": 1
  }
}
```

Response (Failed):

```json
"error": "Admin is Not Found"
```

## Update Admin

Endpoint : PUT api/admin/:username

Request Header :

- Authorization = token

Request Body :

```json
{
  "password": "123456",
  "role_code": "ADMIN3321",
  "id_perusahaan": 1
}
```

Response (Success):

```json
{
  "message": "Admin updated successfully"
}
```

Response (Failed):

```json
"error": "Admin is Not Found"
```
