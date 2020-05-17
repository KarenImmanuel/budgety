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

//////////////////////////////////////////
var budgetController = (function(){
    //private
    // Function constructors
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // private
    // var add = function(a){
    //     return x+a;
    // };
    var data = {
        allItems : {
            exp : [],
            inc :[]
        },
        total : {
            exp : 0,
            inc : 0
        }
    };

    return {
        //public (because of closures)
        publicTest : function(b){
            console.log(add(b));
            return add(b);
        },

        addItem : function(type, des, val){
            var newItem, ID;

            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            }
            else{
                ID = 0;
            }
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc'){
                newItem = new Income(ID, des , val);
            }
            data.allItems[type].push(newItem);
            // data.total[type] += val;
            return newItem
            
        },
        // updateBudget : function(){

        // }

    }
})();

var uiController = (function(){

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list'
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
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: function(){
            return DOMstrings;
        },

        addListItem : function(obj, type){
            var html, newHtml, element;

            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                console.log(element);
                html = '<div class="item clearfix" id=%id%><div \
                class="item__description">%description%</div><div class="right clearfix"> \
                <div class="item__value">+ %value%</div><div class="item__delete"> \
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                </div></div></div>';
               
            }
            else if (type === 'exp'){
                console.log(element);
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id=%id%> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"> <div class="item__value">- %value%</div> \
                <div class="item__percentage">21%</div>\
                <div class="item__delete">  <button class="item__delete--btn"> \
                <i class="ion-ios-close-outline"></i></button> \
                </div></div> </div>';
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            console.log(newHtml);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        clearInput : function(){
           fields = document.querySelectorAll(DOMstrings.inputDescription +',' + DOMstrings.inputValue);

           // convert list to array
           fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current, index, array){
            current.value = "";
           });

           fieldsArr[0].focus();
        }

        };
})();

var dataController = (function(budgetCtrl, UICtrl){
    var DOM = UICtrl.getDOMstrings();

    var setUpEventListeners = function(){

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            // keycode property identifies the key
            if (event.keyCode === 13 || event.which === 13){
                console.log('ENTER was pressed');
                getInput();
                ctrlAddItem();
            }
        });

    }
    // document.querySelector(DOM.inputButton).addEventListener('click', function(){
    //     // Pattern: Controllers are alling one another and talking
    //     var input = UICtrl.getInput();
    //     console.log(input);
    // });
    
    var ctrlAddItem = function(){
        // 1.Get input values
        var input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNan(input.value) && input.value >0){
            //2 .Add the new item
            var newItem = budgetController.addItem(input.type, input.description, input.value);

            //3. Show item on UI
            UICtrl.addListItem(newItem, input.type);

            //4 clear i/p ui
            UICtrl.clearInput()

            //5 update budget
            // budgetController.updateBudget()
        }
               
    };

    return {
        init : function(){
            console.log(setUpEventListeners);
            setUpEventListeners();
        }
    }

    
})(budgetController, uiController);


dataController.init();