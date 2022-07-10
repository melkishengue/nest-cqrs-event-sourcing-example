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

## Making requests
Testing: use the following curl request to test the app or import the provided post file into postman.

### Create an account:
```
curl --location --request POST 'localhost:3000/accounts/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "balance": {
        "currency": "USD",
        "amount": 400
    }
}'
```

### View all accounts for user:
```
curl --location --request GET 'localhost:3000/queries/users/93133852-faa4-11ec-b939-0242ac120002'
```
Response:

```
{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "accounts": [
        {
            "accountId": "f09221aa-faa4-11ec-b939-0242ac120002",
            "balance": {
                "amount": 400,
                "currency": "USD"
            },
            "creationDate": "2022-07-10T12:32:09.915Z"
        },
    ]
}
```

### Update an account:
Update account to currency EUR:
```
curl --location --request PATCH 'localhost:3000/accounts/f09221aa-faa4-11ec-b939-0242ac120002' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "currency": "EUR"
}'
```

### Transfer from one account to another:
Transfer 100EUR (first create second accound like previously and use id in `receiverAccountId` field):
```
curl --location --request POST 'localhost:3000/accounts/2d49ccb8-ab5e-412a-be81-a51f35677696/debit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002",
    "receiverAccountId": "af5a399b-cbac-4c19-b834-62730c042af7",
    "amount": 100,
    "currency": "EUR"
}'
```

### Delete account:
```
curl --location --request DELETE 'localhost:3000/accounts/2d49ccb8-ab5e-412a-be81-a51f35677696' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "93133852-faa4-11ec-b939-0242ac120002"
}'
```

The postman file `Bank.postman_collection.json` also contains all requests.

The generated events are saved into the events.json file. This is for demonstration purposes only.
A better option suitable for a production environment would be [Eventstore DB](https://www.eventstore.com/).