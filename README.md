# Servus

> At your Servus

  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
  <a href="#badge">
    <img alt="tests" src="https://github.com/COMP4350/Servus/actions/workflows/CI.yml/badge.svg">
  </a>

## Description

Servus is an operation to connect customers with service providers. Customers are greeted with a list or map of services near them. Providers have public profiles with a menu of services offered and photo examples of past work. They also have a schedule for clients to book appointments.

## Core Features

-   Customers can browse services near them by using a list or map
-   Customers can book appointments for services based on the server's availability
-   Servers can provide a menu of the services they offer and their availability
-   Servers can advertise their past work

## Technologies

-   Web ➤ React
-   Backend ➤ NodeJS + Express
-   Database ➤ MongoDB

### Testing Frameworks

React frontend tested with:

-   _Jest_
-   _Cypress_

NodeJS backend tested with:

-   _Mocha_
-   _Chai_

## Run Instructions

Please note, without the proper environment variables you will not be able to run the web application locally. This includes the acceptance tests.
In order to get the proper environment variables, please contact [Arvind](mailto:maana3@myumanitoba.ca).

### Accessing the hosted web app

-   Go to <http://servus.pw>. Your browser may try to cache it as https -- if the link does not work, try using an incognito or private browsing tab.
-   If you'd like to run the website with an existing user, you can login to the website with username and password: _arvind_

### Manually run the web application locally

1. Clone the repository.
2. Installation:
    - This requires node to be installed. https://nodejs.org/en/download/
    - Navigate to `Servus/server/` in a command prompt and install with `npm install`.
    - Navigate to `Servus/web/` in a command prompt and install with `npm install`.
3. Running the application:
    - From `Servus/server/` in a command prompt, run `npm start`.
    - From `Servus/web/` in a command prompt, run `npm start`.
        - This should open the app in your default browser. If not, navigate to `localhost:3000` in your browser.

### Running acceptance tests:

-   Run the backend with the staging database: `npm run acceptance` from `Servus/server/`.
-   Run the frontend: `npm start` from `Servus/web/`.
-   Enter `npm run cypress:open` from `Servus/web/` in a command prompt.
    -   Click "Run 4 integration specs" to run all tests, or click each test to run them individually.

## Documentation

### Coding Style

-   The coding style for the project can be found [here](wiki/coding_style.md).

### Meetings Notes

-   The meeting notes can be found [here](wiki/meeting_log.md).

### Diagrams

-   Project structure diagrams can be found [here](wiki/diagrams.md).

### Testing Plan

-   The testing plan document can be found [here](wiki/SERVUS_Test_Plan_Sprint_2.pdf).

### Group Members & Roles

> Please note, each member acted as the 'Group Leader'

<table>
<tr>
    <td style="text-align: center;">
        <a href="https://github.com/andy-tan7">
            <img src="https://avatars2.githubusercontent.com/u/33612287?s=460&v=4" width="125px;" style="border:solid;"/>
            <br/>
            <sub>
                <b>Andy Tan</b>
            </sub>
        </a>
    </td>
    <td style="text-align: center;">
        <a href="https://github.com/arvind-maan">
            <img src="https://avatars3.githubusercontent.com/u/29124297?s=460&u=a3056b42ea57a516d23f726b109916c1f2dc47e9&v=4" width="125px;" style="border:solid;"/>
            <br/>
            <sub>
                <b>Arvind Maan</b>
            </sub>
        </a>
    </td>
    <td style="text-align: center;">
        <a href="https://github.com/cadenchabot">
            <img src="https://avatars2.githubusercontent.com/u/46728740?s=460&u=f074d2ef6f1a9548be2a5c7ab68e0afe6890269f&v=4" width="125px;" style="border:solid;"/>
            <br/>
            <sub>
                <b>Caden Chabot</b>
            </sub>
        </a>
    </td>
       <td style="text-align: center;">
        <a href="https://github.com/rikizimbakov">
            <img src="https://avatars.githubusercontent.com/u/25595072?s=400&u=3740c532b3206c1aacacdf6481538d7d6d3687ee&v=4" width="125px;" style="border:solid;"/>
            <br/>
            <sub>
                <b>Risto Zimbakov</b>
            </sub>
        </a>
    </td>

</tr>
</table>
