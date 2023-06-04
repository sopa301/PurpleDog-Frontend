// Just a JS file to test stuff


// crypto module
const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 

// Fix initVector so that encryption is consistent
const initVector = Buffer.from('7d3039e7f8a32ff9d12d5802290532df', 'hex');
// const initVector = crypto.randomBytes(16);

// protected data
const message = "This is a secret message";
// console.log(message);

// Fix Securitykey so that encryption is consistent
const Securitykey = Buffer.from('ac0aabe13d0856f66b0dde912faac79b8d3839b00ac28c43dd21127642f5a1d4', 'hex');
// const Securitykey = crypto.randomBytes(32);

// the cipher function
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

// encrypt the message
// input encoding
// output encoding
let encryptedData = cipher.update(message, "utf-8", "hex") + cipher.final("hex");


// console.log("Encrypted message: " + encryptedData);

const luxon = require('luxon');
// import { DateTime, Interval } from "luxon";

class Project {
    constructor(people, tasks) {
        this.people = people;
        this.tasks = tasks;
    }
    toString() {
        return this.people + " " + this.tasks;
    }
}

class Person {
    // name is a string
    // avail is an array of Interval objects from the Luxon library
    constructor(name, avails) {
        this.name = name;
        this.avails = avails;
    }

    toString() {
        var out = this.name + ": ";
        for (var avail of this.avails) {
            out += avail.toLocaleString(luxon.DateTime.DATETIME_MED);
        }
        return out;
    }

    toJSONable() {
        const out = [];
        for (var i = 0; i < this.avails.length; i++) {
            out[i] = this.avails[i].toISO();
        }
        return new PersonJSONable(this.name, out);
    }
}

class PersonJSONable {
    // name is a string
    // avail is an array of ISO strings
    constructor(name, avails) {
        this.name = name;
        this.avails = avails;
    }

    toString() {
        var out = this.name + ": ";
        for (var avail of this.avails) {
            out += avail;
        }
        return out;
    }

    static fromJSONable(object) {
        const out = [];
        for (var i = 0; i < object.avails.length; i++) {
            out[i] = luxon.Interval.fromISO(object.avails[i]);
        }
        return new Person(object.name, out);
    }
}

class Task {
    // name is a String
    // pax is an integer
    // timeframe is an Interval object
    // timeNeeded is a number
    constructor(name, pax, interval, timeNeeded) {
        this.name = name;
        this.pax = pax;
        this.interval = interval;
        this.timeNeeded = timeNeeded;
    }
    toString() {
        var out = this.name + ": ";
        out += this.pax + " people required.";
        out += "Duration is: " + this.interval.toLocaleString(luxon.DateTime.DATETIME_MED);
        out += ". Time needed is: " + this.timeNeeded;
        return out;
    }
    toJSONable() {
        const outInterval = this.interval.toISO();
        return new TaskJSONable(this.name, this.pax, outInterval, this.timeNeeded);
    }
}

class TaskJSONable {
    // name is a String
    // pax is an integer
    // timeframe is an ISO string
    // timeNeeded is a number
    constructor(name, pax, interval, timeNeeded) {
        this.name = name;
        this.pax = pax;
        this.interval = interval;
        this.timeNeeded = timeNeeded;
    }
    toString() {
        var out = this.name + ": ";
        out += this.pax + " people required.";
        out += "Duration is: " + this.interval;
        out += ". Time needed is: " + this.timeNeeded;
        return out;
    }

    static fromJSONable(object) {
        const outInterval = Interval.fromISO(object.interval);
        return new Task(object.name, object.pax, outInterval, object.timeNeeded);
    }
}

const bb = new Person('nikele', []);
console.log(JSON.stringify(bb.toJSONable()));