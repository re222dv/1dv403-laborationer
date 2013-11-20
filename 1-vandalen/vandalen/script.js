"use strict";

var makePerson = function(persArr){
    if (typeof persArr != 'object') {
        throw new Error('persArr needs to be an array');
    }

    for (var i in persArr) {
        if (typeof persArr[i] != 'object' ||
            typeof persArr[i].name != 'string' ||
            typeof persArr[i].age != 'number') {
            throw new Error('persArr needs to consist of objects with a string value name and int value age');
        }
    }

    var names = [];
    var max_age = 0;
    var min_age = Infinity;
    var total_age = 0;

    persArr.forEach(function(person) {
        names.push(person.name);

        max_age = Math.max(max_age, person.age);
        min_age = Math.min(min_age, person.age);

        total_age += person.age;
    });

    names.sort(function(a, b) {
        return a.localeCompare(b);
    });

    names = names.join(', ');

    var average_age = Math.round(total_age / persArr.length);

    return {minAge: min_age, maxAge: max_age, averageAge: average_age, names: names};
}

