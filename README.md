# Event Planner - Pinia Store Structure

## Data Models

### Event
```json
{
  "id": "string",
  "name": "string",
  "maxAttendees": "number",
  "sessions": [
    {
      "id": "string",
      "start": "datetime",
      "end": "datetime",
      "speakerId": "string",
      "type": "enum('drinks', 'break', 'lecture')",
      "location": "string",
      "title": "string",
      "description": "string"
    }
  ]
}
```

### Ticket
```json
{
  "id": "string",
  "eventId": "string",
  "userId": "string",
  "name": "string",
  "price": "number",
  "createdAt": "datetime"
}
```

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "isAdmin": "boolean"
}
```

### Speaker
```json
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "image": "string"
}
```