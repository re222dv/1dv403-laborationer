"use strict";

var makePerson = function(persArr){
    var total_age = 0;
    var max_age = 0;
    var min_age = Infinity;
    var names = [];

    persArr.forEach(function(person) {
        names.push(person.name);
        total_age += person.age;
        max_age = max_age > person.age ? max_age : person.age;
        min_age = min_age < person.age ? min_age : person.age;
    });

    var average_age = Math.round(total_age / persArr.length);

    return {minAge: min_age, maxAge: max_age, averageAge: average_age, names: names};
}

