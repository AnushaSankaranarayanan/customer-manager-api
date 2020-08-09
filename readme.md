## Introduction
customer-manager-api is a REST based microservice that handles common customer operations. This app is guarded by BASIC Authentication.The app is connected to a MongoDB container for persistence.

## The app exposes the below methods
- Create a customer with given name, surname, email, initials and mobile number.
- Get list of customets. The list can be sorted on any of the above fields. The customers are listed in pages. The list can be delimited with an offset and a limit.
- Get a customer based on Id. 
- Update a customer based on Id. 
- Delete a customer based on Id.

## Design of the Mongo DB Table
******************
Customer:
******************
```shell
id  - Auto Generated Primary Key
name - Name of the customer(mandatory field)
surname - Surname of the customer(mandatory field)
email - Email of the customer(mandatory field)
initials - Initials of the customer
mobile - Mobile number of the customer
lastupdated - Datetime when the customer was created/updated last
```



## List of end points
```shell
GET    -  /api-docs - Swagger end point
POST   - ​/api/v1/customer - Create customer
GET    -  ​/api/v1/customer - List all customers , sorted by the fields, delimited by offset and limit. If query parameters are not specified , results are sorted based on lastupdated in descending order with a maximum of 25 customers.
GET    -  ​/api/v1/customer/{customerId} - Get a customer based on Id
PUT    -  ​/api/v1/customer/{customerId} - Update a customer based on Id
DELETE -  ​/api/v1/customer/{customerId} - Delete a customer based on Id
```


## Folder Structure
```shell
- app - has all the main source code and test
    - controllers
    - models
    - routes 
- config - has auth, db , url and swagger configurations
- .dockerignore - has files/folders that are to be ignored when budiling docker image
- .gitignore - has files/folders that are to be ignored by git
- .sample-env - lists the environment variables needed to run the app
- docker-compose.yml - runs the app and mongo containers
- Dockerfile - has steps to create a docker image
- package*.json - has dependencies
- readme.md - markdown for usage insturctions
- server.js - starting point of the app
- sonar-project.properties - has sonar configuration
- swagger.json/yaml - swagger specification

```

## Requirements

Install [Docker](https://www.docker.com/) on your system.

* [Install instructions](https://docs.docker.com/installation/mac/) for Mac OS X
* [Install instructions](https://docs.docker.com/installation/ubuntulinux/) for Ubuntu Linux
* [Install instructions](https://docs.docker.com/installation/) for other platforms

Install [Docker Compose](http://docs.docker.com/compose/) on your system.

* Python/pip: `sudo pip install -U docker-compose`
* Other: ``curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; chmod +x /usr/local/bin/docker-compose``


## Running the Application locally

- Create a file named `.env` in the project root directory. Alternatively copy over the `.sample-env` file and rename as `.env`

- Set the values for all the environment variables. **Do not forget** to create directory in your host that you had specified in the `MONGO_DB_LOCAL_PERSISTENCE_PATH` in the `above .env` file

- Run `docker-compose up --build` to create and start the containers. The app should then be running on your docker daemon on port 9000 (On OS X you can use `boot2docker ip` to find out the IP address).

- Once the application is up - issue requests to : http://localhost:9000/api/v1. The app is guareded by Basic Authentication - See `/config/auth.config.js` for more information.


## Example request and reponse
***********************
Example JSON Requests
***********************
```shell
Create Customer - Validation Failure - POST - http://localhost:9000/api/v1/customer

{
    "name" : "Adam",
    "surname" :"Baum",
    "email" : "ada,.baum@gmail.com",
    "initials" : "AB",
    "mobile" : "901009998"
}

Response
{
    "code": 400,
    "status": "Bad Request",
    "message": "Customer validation failed: email: Invalid email.",
    "payload": null
}

Create Customer - Success  - POST - http://localhost:9000/api/v1/customer

{
    "name" : "Adam",
    "surname" :"Baum",
    "email" : "ada.baum@gmail.com",
    "initials" : "AB",
    "mobile" : "901009998"
}
Response
{
    "code": 200,
    "status": "OK",
    "message": "Customer created successfully",
    "payload": {
        "_id": "5f305f0a9385f5674e9ccc47",
        "name": "Adam",
        "surname": "Baum",
        "email": "ada.baum@gmail.com",
        "initials": "AB",
        "mobile": "901009998",
        "lastupdated": "2020-08-09T20:39:38.910Z",
        "__v": 0
    }
}

Read Customer - Failure  - GET - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47a

Response
{
    "code": 404,
    "status": "Not Found",
    "message": "Customer not found in Database",
    "payload": null
}

Read Customer - Success  - GET - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47

Response
{
    "code": 200,
    "status": "OK",
    "message": "Customer retrieved successfully",
    "payload": {
        "_id": "5f305f0a9385f5674e9ccc47",
        "name": "Adam",
        "surname": "Baum",
        "email": "ada.baum@gmail.com",
        "initials": "AB",
        "mobile": "901009998",
        "lastupdated": "2020-08-09T20:39:38.910Z",
        "__v": 0
    }
}

Update Customer - Failure  - PUT - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47
{
    "name" : "",
    "surname" :"Baum",
    "email" : "ada.baum@gmail.com",
    "initials" : "AB",
    "mobile" : "9894725174"
}
Response
{
    "code": 400,
    "status": "Bad Request",
    "message": "Validation failed: name: Name is required",
    "payload": null
}

Update Customer - Success  - PUT - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47
{
    "name" : "Adam",
    "surname" :"Baum",
    "email" : "ada.baum@gmail.com",
    "initials" : "AB",
    "mobile" : "9894725174"
}
Response
{
    "code": 200,
    "status": "OK",
    "message": "Customer updated successfully",
    "payload": {
        "_id": "5f305f0a9385f5674e9ccc47",
        "name": "Adam",
        "surname": "Baum",
        "email": "ada.baum@gmail.com",
        "initials": "AB",
        "mobile": "9894725174",
        "lastupdated": "2020-08-09T20:43:31.719Z",
        "__v": 0
    }
}

List Customer - Success  - GET - http://localhost:9000/api/v1/customer?sortkey=name&sortdir=asc&offset=0&limit=2
{
    "code": 200,
    "status": "OK",
    "message": "Customer retrieved successfully",
    "payload": {
        "docs": [
            {
                "_id": "5f305f0a9385f5674e9ccc47",
                "name": "Adam",
                "surname": "Baum",
                "email": "ada.baum@gmail.com",
                "initials": "AB",
                "mobile": "9894725174",
                "lastupdated": "2020-08-09T20:43:31.719Z",
                "__v": 0
            },
            {
                "_id": "5f3060b39385f5f0139ccc48",
                "name": "Brooke",
                "surname": "Trout",
                "email": "brook.trout@hotmail.com",
                "initials": "BT",
                "mobile": "9790912226",
                "lastupdated": "2020-08-09T20:46:43.043Z",
                "__v": 0
            }
        ],
        "totalDocs": 5,
        "offset": 0,
        "limit": 2,
        "totalPages": 3,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": true,
        "prevPage": null,
        "nextPage": 2
    }
}

Delete Customer - Failure  - DELETE - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47a

Response
{
    "code": 404,
    "status": "Not Found",
    "message": "Customer not found in Database",
    "payload": null
}

Delete Customer - Success  - DELETE - http://localhost:9000/api/v1/customer/5f305f0a9385f5674e9ccc47
Response
{
    "code": 200,
    "status": "OK",
    "message": "Customer deleted successfully",
    "payload": {
        "_id": "5f305f0a9385f5674e9ccc47",
        "name": "Adam",
        "surname": "Baum",
        "email": "ada.baum@gmail.com",
        "initials": "AB",
        "mobile": "9894725174",
        "lastupdated": "2020-08-09T20:43:31.719Z",
        "__v": 0
    }
}

```

     
## Known caveats
-  The API is  guarded using Basic Authentication mechanism. This has to be upgrdaded to a more sophisticated mechanism like OAuth/JWT in the future. . This has to be implemenetd in the future

