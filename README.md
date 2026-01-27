event {
    speaker: user() {
        name: string
        rol: enum('deelnemer', 'organisator', 'spreker')
    }
    tickets[]() {
        naam: string
        prijs: number
    }
    breaks[]() {
        name: string
        start: datetime
        end: datetime
        type: enum('break', 'booze')
    }
    available tickets: number
    location: string
    start: datetime
    end: datetime
    type: enum('workshop', 'lezing', 'netwerken')
}

user {
    naam: string
    rol: enum('attendee', 'admin', 'speaker')
}
