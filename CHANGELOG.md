
## Pre-release

### [0.2.0-beta](https://github.com/TeamTash/one_report/compare/0.1.2-alpha...0.2.0-beta) - 21/02/2020
- `hierarchy screen` - connected to db and released publicly.
  * ability to select viewing mador.
- `commander screen` - connected to db and released publicly.
  * ability to change status of each soldier.
- auth token now expanded to a week.
- new mador routes added.
  * `/api/v1/madors/` - get all available madors.
  * `/api/v1/madors/{mador_name}/hierarchy` - get/set mador hierarchy.
  * `/api/v1/madors/{mador_name}/users` - get users of mador.
- new user routes added.
  * `/api/v1/users/unassigned` - get all unassigned mador users.
- Refresh button added.

### [0.1.2-alpha](https://github.com/TeamTash/one_report/compare/0.1.1-alpha...0.1.2-alpha) - 15/02/2020
Bug fixes:
- fixed calendar display bug (white spaces between dates colors).
- fixed calendar days header bug (wrong spacing).
- fixed fast filling statuses (attending slider doesnt change).

### [0.1.1-alpha](https://github.com/TeamTash/one_report/compare/0.1.0-alpha...0.1.1-alpha) - 15/02/2020
- added auto deployment to docker hub.

### [0.1.0-alpha](https://github.com/TeamTash/one_report/releases/tag/0.1.0-alpha) - 15/02/2020
Initial release contained:
- initial `dashboard screen`.
  * calendar have color-coded status days (here, not here).
  * attending slider set the current selected date.
- initial `operator screen`.
  * view status of current selected date (fixed mador).
- auto deployment to `Heroku`.
