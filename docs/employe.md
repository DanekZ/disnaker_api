# Employee API Spec

## Create Employee

Endpoint : POST api/employee/

Request Header :

- Authorization = token

Request Body :

```json
{
  "NIK": "6474023002029938",
  "nama": "anton arulapale",
  "kode_divisi": "D001",
  "kode_jabatan": "J001",
  "id_perusahaan": "P001",
  "status": "baru"
}
```

Response (Success):

```json
{
  "message": "Employee created successfully",

  "data": {
    "NIK": "6474023002029938",
    "nama": "anton arulapale",
    "kode_divisi": "D001",
    "kode_jabatan": "J001",
    "id_perusahaan": "P001",
    "status": "baru"
  }
}
```

Response (Failed):

```json
"error": "NIK must not blank"
```

## GET Employee

Endpoint : Get api/employee/:NIK

Request Header :

- Authorization = token

Response (Success):

```json
{
  "data": {
    "NIK": "6474023002029938",
    "nama": "anton arulapale",
    "kode_divisi": "D001",
    "kode_jabatan": "J001",
    "id_perusahaan": "P001",
    "status": "baru"
  }
}
```

Response (Failed):

```json
"error": "Employee is Not Found"
```

## Update Employee

Endpoint : PUT api/employee/:NIK

Request Header :

- Authorization = token

Request Body :

```json
{
  "NIK": "6474023002029938",
  "nama": "anton arulapale",
  "kode_divisi": "D001",
  "kode_jabatan": "J001",
  "id_perusahaan": "P001",
  "status": "PKWT 1"
}
```

Response (Success):

```json
{
  "message": "Employee updated successfully",
  "data": {
    "NIK": "6474023002029938",
    "nama": "anton arulapale",
    "kode_divisi": "D001",
    "kode_jabatan": "J001",
    "id_perusahaan": "P001",
    "status": "PKWT 1"
  }
}
```

Response (Failed):

```json
"error": "first name must not blank"
```

## Remove Contact

Endpoint : delete api/employee/:NIK

Request Header :

- Authorization = token

Response (Success):

```json
"data": "ok"
```

Response (Failed):

```json
"error": "Employee is not found"
```

## Search Employee

Endpoint : GET api/employee/

Request Header :

- Authorization = token

Query Parameter :

- name : string, employee name, optional
- kode_divisi : string, employee divisi, optional
- kode_jabatan : string, employee jabatan, optional
- id_perusahaan : string, employee perusahaan, optional
- status : string, employee status, optional
- page : number, default 1
- size : number, default 10

Response (Success):

```json
{
  "data": [
    {
      "NIK": "6474023002029938",
      "nama": "anton arulapale",
      "kode_divisi": "D001",
      "kode_jabatan": "J001",
      "id_perusahaan": "P001",
      "status": "PKWT 1"
    },
    {
      "NIK": "6474023002029939",
      "nama": "anton arulapale",
      "kode_divisi": "D001",
      "kode_jabatan": "J001",
      "id_perusahaan": "P001",
      "status": "PKWT 1"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response (Failed):

```json
"error": "Unauthorized..."
```
