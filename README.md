
# Codeigniter 4 + Next JS

### Overview

This project integrates CodeIgniter 4 with Next.js, combining a robust backend framework with a modern frontend solution. The application is currently in BETA, and development began on July 12, 2024.


## Tech Stack

**Client:** NextJS 14

**Server:** Codeigniter 4

**Template:** [Frest](https://demos.pixinvent.com/frest-html-admin-template/html/vertical-menu-template/index.html)


## Getting Started
Follow these steps to set up and run the application:

```bash
cp env .env
```

```bash
composer install
```

```bash
npm install
```

```bash
php spark migrate
```

```bash
php spark db:seed RoleSeed
```

run server

```bash
php spark serve
```
open in browser http://localhost:8080

run client

```bash
npm run dev
```
open in browser http://localhost:3000


## Features

- Create Controller
```bash
    php spark generate:controller
```

- Create all model base on database
```bash
    php spark generate:model_bulk
```


## PERMISSIONS

For reuse, duplication, or utilization of this project, please obtain permission from me.

## Authors

- [@sarip](https://www.github.com/octokatherine)


## Acknowledgements

- ALLAH SWT
- To Myself, Sarip Hidayat
- To all individuals who contributed their thoughts and ideas in building this application.


_May this help in building future applications and lead to the creation of useful and high-quality applications_