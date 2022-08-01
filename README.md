[![Nest Logo](http://kamilmysliwiec.com/public/nest-logo.png)](http://kamilmysliwiec.com/)

[Nest](https://github.com/kamilmysliwiec/nest) framework [CQRS module](https://github.com/kamilmysliwiec/nest-cqrs) basic usage example with event sourcing.

## Start
You need docker installed locally to start the application.

```
$ docker compose up
```

## Making requests
Testing: use the following curl request to test the app.

### Create a user:
Replace `EMAIL` and `PASSWORD` with values.

```
curl --location --request POST 'localhost:4000/auth/register/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "<EMAIL>",
    "password": "<PASSWORD>"
}'
```

### Login with new user:
Replace `EMAIL` and `PASSWORD` with the corresponding values.

```
curl --location --request POST 'localhost:4000/auth/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "<EMAIL>",
    "password": "<PASSWORD>"
}'

```
This request includes an jwt token used to query the account microservice.
The token is valid 1 hour.

Response:

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lbGtpc2hlbmd1ZSIsInN1YiI6Ijg1NzExNDM5LTJiYTItNGFlYi1iMDJjLWEwYmE0MjAxZTdkYiIsImlhdCI6MTY1OTM3OTMwMiwiZXhwIjoxNjU5Mzg1MzAyfQ.zeL0DpVdyF8Hadp-KfYYS6VuLiwGRI-CA2ZP35MONV0",
    "userId": "85711439-2ba2-4aeb-b02c-a0ba4201e7db"
}
```

### Create an account:
Replace `YOUR_JWT_TOKEN` and `YOUR_USER_ID` with the corresponding values.

```
curl --location --request POST 'localhost:3000/accounts/' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "<YOUR_USER_ID>",
    "balance": {
        "currency": "USD",
        "amount": 400
    }
}'
```

### View all accounts for user:
Replace `YOUR_JWT_TOKEN` and `YOUR_USER_ID` with the corresponding values.
```
curl --location --request GET 'localhost:3000/queries/users/<YOUR_USER_ID>' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--header 'Content-Type: application/json' \
```
Response:

```
{
    "userId": "<YOUR_USER_ID>",
    "accounts": [
        {
            "accountId": "<YOUR_ACCOUNT_ID>",
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
Update account to currency EUR.
Replace `YOUR_JWT_TOKEN`, `YOUR_ACCOUNT_ID` and `YOUR_USER_ID` with the corresponding values.
```
curl --location --request PATCH 'localhost:3000/accounts/<YOUR_ACCOUNT_ID>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--data-raw '{
    "userId": "<YOUR_USER_ID>",
    "currency": "EUR"
}'
```

### Transfer from one account to another:
Transfer 100EUR (first create second accound like previously and use id in `receiverAccountId` field).
Replace `YOUR_JWT_TOKEN`, `YOUR_ACCOUNT_ID`, `ANOTHER_ACCOUNT_ID` and `YOUR_USER_ID` with the corresponding values.
```
curl --location --request POST 'localhost:3000/accounts/<YOUR_ACCOUNT_ID>/debit' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--data-raw '{
    "userId": "<YOUR_USER_ID>",
    "receiverAccountId": "<ANOTHER_ACCOUNT_ID>",
    "amount": 100,
    "currency": "EUR"
}'
```

### Delete account:
Replace `YOUR_JWT_TOKEN`, `YOUR_ACCOUNT_ID`, `ANOTHER_ACCOUNT_ID` and `YOUR_USER_ID` with the corresponding values.
```
curl --location --request DELETE 'localhost:3000/accounts/<YOUR_ACCOUNT_ID>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "<YOUR_USER_ID>"
}'
```

The generated events are saved into the events.json file for demonstration purposes only. 
A better option suitable for a production environment would be [Eventstore DB](https://www.eventstore.com/).
