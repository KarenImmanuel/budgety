/// explanation for JS Module pattern and their interaction- IIFE & closures
/*
var budgetController = (function(){
    //private
    var x = 23;
    // private
    var add = function(a){
        return x+a;
    }
    return {
        //public (because of closures)
        publicTest : function(b){
            console.log(add(b));
            return add(b);
        }
    }
})();

var uiController = (function(){
    //some code
})();

var dataController = (function(budgetCtrl, UICtrl){
    var z = budgetCtrl.publicTest(2);
    return {
        anotherPublic : function(){
            console.log(z);
        }
    }
})(budgetController, uiController);
*/


//////////////////////
// Add button event listeners
/*
var dataController = (function(budgetCtrl, UICtrl){
    document.querySelector('.add__btn').addEventListener('click', function(){

    });

    document.addEventListener('keypress', function(event){
        // keycode property identifies the key
        console.log(event);
        if (event.keyCode === 13 || event.which === 13){
            console.log('ENTER was pressed');
        }
    });
})(budgetController, uiController);
*/


// insertadjacenthtml, foreach, map, splice, slice

//////////////////////////////////////////
var budgetController = (function () {
    //private
    // Function constructors
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentages = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        }
        else {
            this.percentage = -1;
        }

    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.total[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        //public (because of closures)
        publicTest: function (b) {
            console.log(add(b));
            return add(b);
        },

        addItem: function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);

            return newItem

        },
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                console.log(current.id)
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },
        calculateBudget: function () {
            //calculate total exp and inc
            calculateTotal('inc');
            calculateTotal('exp');
            // calculate budget
            data.budget = data.total.inc - data.total.exp;
            //calculate the percentage of expenses
            if (data.total.exp !== 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calculatePercentages(data.total.inc);
            });
        },
        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPercentages;
        },
        testing: function () {
            return data;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        }

    }
})();

var uiController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentagesLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    var formatNumber = function (num, type) {
        var numSplit, int, decimal;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            // int = int.substr(0, 1) + ',' + int.substr(1, 3);
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        decimal = numSplit[1];

        return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;
    };


    return {
        // BAD PRACTICE to store ui variable names all over the place
        // getInput: function(){
        //     return {
        //         type : document.querySelector('.add__type').value,
        //         description : document.querySelector('.add__description').value,
        //         value : document.querySelector('.add__value').value
        //     };
        // }
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                console.log(element);
                html = '<div class="item clearfix" id=inc-%id%><div \
                class="item__description">%description%</div><div class="right clearfix"> \
                <div class="item__value">%value%</div><div class="item__delete"> \
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                </div></div></div>';

            }
            else if (type === 'exp') {
                console.log(element);
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id=exp-%id%> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"> <div class="item__value">%value%</div> \
                <div class="item__percentage">21%</div>\
                <div class="item__delete">  <button class="item__delete--btn"> \
                <i class="ion-ios-close-outline"></i></button> \
                </div></div> </div>';
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

            console.log(newHtml);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorId) {
            el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },
        clearInput: function () {
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // convert nodelist to array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            income = document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            expense = document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            budget = document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            if (obj.percentage > 0) {
                percentage = document.querySelector(DOMstrings.percentagesLabel).textContent = obj.percentage + '%';
            }
            else {
                percentage = document.querySelector(DOMstrings.percentagesLabel).textContent = '---';
            }
        },
        displayPercentages: function () {
            //node list
            var fields = document.querySelectorAll(DOMstrings.expPercLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function () {
            var now, month, months, year;
            var now = new Date();
            //var christmas = new Date(2019, 11, 25);  dec-->11 (as zero based)
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function () {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            nodeListForEach(fields, function (current, index) {
                // current.classList.add('red-focus');
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },
    };
})();

var dataController = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();

    var setUpEventListeners = function () {

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            // keycode property identifies the key
            if (event.keyCode === 13 || event.which === 13) {
                console.log('ENTER was pressed');
                ctrlAddItem();
            }

        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)

    }

    var updateBudget = function () {
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();
        console.log(budget);

        UICtrl.displayBudget(budget);
    }
    // document.querySelector(DOM.inputButton).addEventListener('click', function(){
    //     // Pattern: Controllers are calling one another and talking
    //     var input = UICtrl.getInput();
    //     console.log(input);
    // });
    var updatePercentages = function () {
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from budget controller
        percentages = budgetCtrl.getPercentages();
        //3.Update UI with new percentages
        console.log(percentage);
        UICtrl.displayPercentages();
    }

    var ctrlAddItem = function () {
        // 1.Get input values
        var input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2 .Add the new item
            var newItem = budgetController.addItem(input.type, input.description, input.value);

            //3. Show item on UI
            UICtrl.addListItem(newItem, input.type);

            //4 clear i/p ui
            UICtrl.clearInput()

            //5 update budget
            updateBudget();

            //6 update percentage
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function (event) {
        var splitID, type, item;
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = splitID[1];
            //1. delete the item from data structure
            budgetController.deleteItem(type, parseInt(id));

            //2. delete the item from the ui
            UICtrl.deleteListItem(itemID);

            //3. update and show new budget
            updateBudget();


        }
    }

    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayMonth();
            console.log(setUpEventListeners);
            setUpEventListeners();

        }
    }


})(budgetController, uiController);


dataController.init();