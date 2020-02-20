
## Pre-release

### next
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

### 0.1.2-alpha
Bug fixes:
- fixed calendar display bug (white spaces between dates colors).
- fixed calendar days header bug (wrong spacing).
- fixed fast filling statuses (attending slider doesnt change).

### 0.1.1-alpha
- added auto deployment to docker hub.

### 0.1.0-alpha
Initial release contained:
- initial `dashboard screen`.
  * calendar have color-coded status days (here, not here).
  * attending slider set the current selected date.
- initial `operator screen`.
  * view status of current selected date (fixed mador).
- auto deployment to `Heroku`.
