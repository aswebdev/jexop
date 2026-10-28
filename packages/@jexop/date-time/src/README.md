# Date-Time Operators

## Available Operators

### `now`

Returns the current date and time in UTC.

| Property | Description   |
| -------- | ------------- |
| _(none)_ | No parameters |

Example:

```json
{
  "op": "now"
}
```

### `age`

Calculates the duration from a given timestamp to now.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `timestamp` | Date/time value (string, number, or DateTime) |

Example:

```json
{
  "op": "age",
  "timestamp": "2024-01-15T10:30:00"
}
```

### `start-of` & `end-of`

Returns the start or end of the time period that contains `date` (or now, if `date` is not given).
Returns `null` if the `unit` is not supported or `date` is not a valid date/time.

| Property          | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `unit`            | Time unit: `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, or `year` (or plural) |
| `date` (optional) | Date/time value (string, number, or DateTime). Defaults to now                                  |

Examples:

```json
{
  "op": "start-of",
  "unit": "day"
}
```

```json
// returns 2024-03-31T23:59:59.999 (in the zone of the given date)
{
  "op": "end-of",
  "unit": "quarter",
  "date": "2024-02-15T10:30:00"
}
```

### Age Comparison Operators

Compare a timestamp against a relative time offset from now.

#### `before-past`

Check if a timestamp is before a duration in the past.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `timestamp` | Date/time value (string, number, or DateTime) |
| `duration`  | Duration value (string, number, or object)    |

#### `after-past`

Check if a timestamp is after a duration in the past.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `timestamp` | Date/time value (string, number, or DateTime) |
| `duration`  | Duration value (string, number, or object)    |

#### `before-future`

Check if a timestamp is before a duration in the future.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `timestamp` | Date/time value (string, number, or DateTime) |
| `duration`  | Duration value (string, number, or object)    |

#### `after-future`

Check if a timestamp is after a duration in the future.

| Property    | Description                                   |
| ----------- | --------------------------------------------- |
| `timestamp` | Date/time value (string, number, or DateTime) |
| `duration`  | Duration value (string, number, or object)    |

Example:

```json
{
  "op": "before-past",
  "timestamp": "2024-06-15",
  "duration": "30 days"
}
```

### `to-duration`

Converts a value to a Duration object.

| Property  | Description                                     |
| --------- | ----------------------------------------------- |
| _(value)_ | Value to convert to Duration (string or object) |

Example:

```json
{
  "op": "to-duration",
  "value": "2 weeks"
}
```
