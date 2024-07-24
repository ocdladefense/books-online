import { ISODate } from "../lib-date/ISODate.js";
import { HttpMock } from "../lib-http/HttpMock.js";
import { Url } from "../lib-http/Url.js";
import { DateRange } from "../lib-date/DateRange.js";
export { GoogleApisCalendarMock };

let event1 = {
    'summary': '4th of July',
    'location': 'Park',
    'description': 'Fireworks in the park!',
    'start': {
        'date': '2023-07-04'
    },
    'end': {
        'date': '2023-07-04'
    },
    'status': 'confirmed',
    'attendees': [
        { 'email': 'king1@middleearth.com' },
        { 'email': 'king2@middleearth.com' }
    ],
    'reminders': {
        'useDefault': true
    }
};
let event2 = {
    'summary': 'Intern Meeting',
    'location': 'Zoom',
    'description': 'Join in to talk about your internship',
    'start': {
        'dateTime': '2023-06-30T10:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2023-06-30T12:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'attendees': [
        { 'email': 'intern@gmail.com' },
        { 'email': 'intern2@gmail.com' }
    ],
    'reminders': {
        'useDefault': true
    }
};

let event3 = {
    'summary': 'Fun Saturdays',
    'location': 'Grass',
    'description': 'Touching grass with friends',
    'start': {
        'date': '2023-07-01',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'date': '2023-07-01',
        'timeZone': 'America/Los_Angeles'
    },
    'attendees': [
        { 'email': 'intern@gmail.com' },
        { 'email': 'king1@middleearth.com' },
        { 'email': 'intern2@gmail.com' }
    ],
    'reminders': {
        'useDefault': true
    }
};


const events = [event1, event2, event3];

class GoogleApisCalendarMock extends HttpMock {
    //https://www.googleapis.com/calendar/v3/calendars/biere-library@thebierelibrary.com/events?timeMin=2023-07-01&timeMax=2023=07-15&test
    errors = {
        'success': false,
        'error': 'Invalid date range'
    };

    //gotta go through the data with the given timemin and timemax, if event start/end falls within either time then include 
    //event in a new object
    getResponse(req) {
        let url = new Url(req.url);
        let data = [];
        //pretend we have parsed the url
        let query = url.getQuery();
        //find the events or error that corresponds to timeMin and timeMax

        // 30 days hath September, April, June & November.





        try {



            data = this.filterEvents(query.timeMin, query.timeMax);
        } catch (e) {

            data = {
                success: false,
                error: true,
                code: "INVALID_RANGE",
                message: e.message
            };
        }


        return Response.json(data);
    }

    /*
    eventSort(a, b) {
        let aTime = new Date(a.start.date || a.start.dateTime);
        let bTime = new Date(b.start.date || b.start.dateTime);
    
        if (aTime < bTime) {
            return -1;
        } else if (aTime > bTime) {
            return 1;
        }
        return 0;
    }
    */

    // Should be able to take both OR either of timeMin, timeMax.
    filterEvents(timeMin, timeMax) {

        let e = new RangeError("invalid date");
        if (false) {
            throw e;
        }

        let validMin = ISODate.isValid(timeMin);

        let min = new Date(timeMin);
        let max = new Date(timeMax);
        let range = new DateRange(min, max);
        console.log(min, max);

        function fn(event) {
            // these variables should eventually be a separate function to process localization
            // ternary to check if dateTime exists; if exists, get the year-month-day part of the string. if not, get normal date.
            let startString =  event.start.date || event.start.dateTime.split("T")[0];
            let endString = event.end.date || event.end.dateTime.split("T")[0] || event.end.date;

            let eventStart = new Date(startString);
            let eventEnd = new Date(endString);

            //let eventStart = new Date(event.start.dateTime || event.start.date);
            //let eventEnd = new Date(event.end.dateTime || event.end.date);

            return range.isWithinRange(eventStart, eventEnd);
            //return true;
        }

        return events.filter(fn);
    }


}
