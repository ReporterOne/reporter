# Reporter
![](https://github.com/reporterone/reporter/workflows/Frontend/badge.svg)
![](https://github.com/reporterone/reporter/workflows/Backend/badge.svg)
![](https://github.com/reporterone/reporter/workflows/Integration%20Tests/badge.svg)  
![](https://img.shields.io/github/pipenv/locked/python-version/reporterone/reporter)
![](https://img.shields.io/github/package-json/dependency-version/reporterone/reporter/react)
![](https://img.shields.io/github/package-json/dependency-version/reporterone/reporter/react-redux)  
![](https://img.shields.io/github/last-commit/reporterone/reporter/master)
![](https://img.shields.io/github/contributors/reporterone/reporter)
![](https://img.shields.io/github/v/release/reporterone/reporter?include_prereleases)

Mobile PWA for filling up an attendance report.

![](./docs/concepts/logged_out.png)
![](./docs/concepts/main_screen.png)

You can start application (with separated services) using (it will build all files and run current branch):
```bash
docker-compose up --build
```

Or using one public container:
```bash
docker run reporterone/reporter
```
