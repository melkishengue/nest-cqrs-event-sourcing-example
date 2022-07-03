[![Nest Logo](http://kamilmysliwiec.com/public/nest-logo.png)](http://kamilmysliwiec.com/)

[Nest](https://github.com/kamilmysliwiec/nest) framework [CQRS module](https://github.com/kamilmysliwiec/nest-cqrs) basic usage example with event sourcing.

## Installation

```
$ npm install
```

## Start

```
$ npm run start
```

## Making request
Testing: use the following curl request to test the app or import the provided post file into postman.

### Create an account:
```
curl --location --request POST 'localhost:3000/accounts/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "currency": "USD"
}'
```

### View all accounts for user:
```
curl --location --request GET 'localhost:3000/users/93133852-faa4-11ec-b939-0242ac120002'
```
Response:

```
{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "accounts": [
        {
            "id": "2d49ccb8-ab5e-412a-be81-a51f35677696",
            "userId": "93133852-faa4-11ec-b939-0242ac120002",
            "logger": {
                "context": "Account",
                "options": {}
            },
            "isDeleted": false,
            "INITIAL_SALDO": 1000,
            "money": {
                "amount": 1000,
                "currency": "USD"
            },
            "creationDate": "2022-07-03T08:09:48.741Z",
            "lastUpdatedAt": "2022-07-03T08:09:48.741Z"
        }
    ]
}
```

### Update an account:
Update account to currency EURO:
```
curl --location --request POST 'localhost:3000/accounts/update' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "accountId": "f09221aa-faa4-11ec-b939-0242ac120002",
    "currency": "EUR"
}'
```

### Transfer from one account to another:
Transfer 100EUR (first create second accound like previously and use id in `receiverAccountId` field):
```
curl --location --request POST 'localhost:3000/accounts/debit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "accountId": "2d49ccb8-ab5e-412a-be81-a51f35677696",
    "receiverAccountId": "af5a399b-cbac-4c19-b834-62730c042af7",
    "amount": 100,
    "currency": "EUR"
}'
```

### Delete account:
```
curl --location --request POST 'localhost:3000/accounts/delete' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "accountId": "f09221aa-faa4-11ec-b939-0242ac120002"
}'
```